"""
train_model.py
==============
Unified trainer for all SIX disease modules in the AI-Powered Medical Diagnosis System.

Usage
-----
    python train_model.py                    # Train all models
    python train_model.py --disease blood_cell
    python train_model.py --disease heart
    python train_model.py --disease lung
    python train_model.py --disease parkinsons
    python train_model.py --disease thyroid
    python train_model.py --disease diabetes

Requirements
------------
    pip install tensorflow scikit-learn xgboost imbalanced-learn pandas numpy matplotlib seaborn pillow

Dataset Setup
-------------
    Dataset/
    ├── Blood cell Cancer [ALL]/
    │   ├── Benign/
    │   ├── [Malignant] early Pre-B/
    │   ├── [Malignant] Pre-B/
    │   └── [Malignant] Pro-B/
    ├── heart_disease.csv
    ├── Lung_Cancer_Dataset.csv
    ├── Parkinsson disease.csv
    ├── Thyroid_Disease_Dataset.csv
    └── diabetes.csv

Kaggle Dataset Links
--------------------
    Blood Cell Cancer : kaggle.com/datasets/mohammadamireshraghi/blood-cell-cancer-all-4class
    Thyroid           : kaggle.com/datasets/yasserhessein/thyroid-disease-data-set
    Lung Cancer       : kaggle.com/datasets/akashnath29/lung-cancer-dataset
    Parkinson's       : kaggle.com/datasets/debasisdotcom/parkinson-disease-detection
    Diabetes          : kaggle.com/datasets/imtkaggleteam/diabetes
    Heart Disease     : kaggle.com/datasets/johnsmith88/heart-disease-dataset
"""

import argparse
import json
import os
import pickle
import sys
import warnings
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    roc_auc_score,
    roc_curve,
)
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.svm import SVC

try:
    import xgboost as xgb
    HAS_XGB = True
except ImportError:
    HAS_XGB = False
    print("[WARN] XGBoost not installed — using GradientBoosting as fallback.")

try:
    from imblearn.over_sampling import SMOTE
    HAS_SMOTE = True
except ImportError:
    HAS_SMOTE = False
    print("[WARN] imbalanced-learn not installed — skipping SMOTE resampling.")

try:
    import tensorflow as tf
    from tensorflow import keras
    from tensorflow.keras import layers
    from tensorflow.keras.applications import EfficientNetB0
    from tensorflow.keras.callbacks import (
        EarlyStopping,
        ModelCheckpoint,
        ReduceLROnPlateau,
    )
    from tensorflow.keras.preprocessing.image import ImageDataGenerator
    HAS_TF = True
except Exception as exc:
    HAS_TF = False
    print("[WARN] TensorFlow import failed — Blood Cell Cancer training will be skipped.")
    print(f"[WARN] Python executable: {sys.executable}")
    print(f"[WARN] TensorFlow error: {exc}")

BASE_DIR = Path(__file__).resolve().parent
warnings.filterwarnings("ignore")
(BASE_DIR / "models").mkdir(exist_ok=True)
(BASE_DIR / "reports").mkdir(exist_ok=True)


# ─── Helpers ────────────────────────────────────────────────────────────────────

def _resolve_path(path: str | Path) -> Path:
    p = Path(path)
    if not p.is_absolute():
        p = BASE_DIR / p
    return p


def save_pkl(obj, path: str):
    p = _resolve_path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    with open(p, "wb") as f:
        pickle.dump(obj, f)
    print(f"  ✓ Saved  →  {p}")


def save_json(obj, path: str):
    p = _resolve_path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    with open(p, "w") as f:
        json.dump(obj, f, indent=2)
    print(f"  ✓ Saved  →  {p}")


def plot_cm(cm, labels, title: str, save_path: str):
    save_path = _resolve_path(save_path)
    fig, ax = plt.subplots(figsize=(max(5, len(labels) * 1.8), max(4, len(labels) * 1.5)))
    sns.heatmap(
        cm, annot=True, fmt="d", cmap="Blues",
        xticklabels=labels, yticklabels=labels, ax=ax
    )
    ax.set_title(title, fontsize=13, pad=10)
    ax.set_ylabel("Actual")
    ax.set_xlabel("Predicted")
    plt.tight_layout()
    plt.savefig(save_path, dpi=120)
    plt.close()
    print(f"  ✓ Confusion matrix → {save_path}")


def plot_roc(y_true, y_proba, title: str, save_path: str):
    save_path = _resolve_path(save_path)
    fpr, tpr, _ = roc_curve(y_true, y_proba)
    auc = roc_auc_score(y_true, y_proba)
    fig, ax = plt.subplots(figsize=(6, 5))
    ax.plot(fpr, tpr, lw=2, color="#1d9e75", label=f"AUC = {auc:.3f}")
    ax.plot([0, 1], [0, 1], "k--", lw=1, alpha=0.4)
    ax.set_xlabel("False Positive Rate")
    ax.set_ylabel("True Positive Rate")
    ax.set_title(title, fontsize=13, pad=10)
    ax.legend()
    plt.tight_layout()
    plt.savefig(save_path, dpi=120)
    plt.close()
    print(f"  ✓ ROC curve       → {save_path}")


def check_file(path: str, name: str, url: str) -> bool:
    p = _resolve_path(path)
    if not os.path.isfile(p):
        print(f"\n  [ERROR] {name} not found: {p}")
        print(f"  Download from: {url}")
        return False
    return True


def check_dir(path: str, name: str, url: str) -> bool:
    p = _resolve_path(path)
    if not os.path.isdir(p):
        print(f"\n  [ERROR] {name} directory not found: {p}")
        print(f"  Download from: {url}")
        return False
    return True


# ═══════════════════════════════════════════════════════════════════════════════
#  1. BLOOD CELL CANCER — CNN (EfficientNetB0 Transfer Learning)
# ═══════════════════════════════════════════════════════════════════════════════

def train_blood_cell(data_dir: str = "Dataset/Blood cell Cancer [ALL]"):
    print("\n" + "═" * 62)
    print("  BLOOD CELL CANCER — EfficientNetB0 Transfer Learning")
    print("═" * 62)

    data_dir = str(_resolve_path(data_dir))

    if not HAS_TF:
        print("  [SKIP] TensorFlow not available.")
        return

    if not check_dir(
        data_dir, "Blood Cell Cancer dataset",
        "https://www.kaggle.com/datasets/mohammadamireshraghi/blood-cell-cancer-all-4class"
    ):
        return

    # Discover class folders and sort them so the order is deterministic
    class_folders = sorted(
        [d for d in os.listdir(data_dir) if os.path.isdir(os.path.join(data_dir, d))]
    )
    print(f"\n  Detected class folders (alphabetical order used by Keras):")
    for i, c in enumerate(class_folders):
        print(f"    [{i}] {c}")

    # Human-readable display names
    display_map = {
        "Benign": "Benign",
        "[Malignant] Pre-B": "Pre-B ALL",
        "[Malignant] Pro-B": "Pro-B ALL",
        "[Malignant] early Pre-B": "Early Pre-B ALL",
    }
    class_display = [display_map.get(f, f) for f in class_folders]

    # Save class metadata so app.py can read the right order at inference time
    class_meta = {
        "folders": class_folders,
        "display": class_display,
        "index_map": {str(i): display_map.get(f, f) for i, f in enumerate(class_folders)},
    }
    save_json(class_meta, "models/blood_cell_classes.json")

    IMG_SIZE = 224
    BATCH    = 32
    EPOCHS   = 30

    # EfficientNetB0 has BUILT-IN preprocessing: expects raw [0, 255] pixel values
    # Do NOT rescale — the model handles it internally via preprocess_input
    train_gen = ImageDataGenerator(
        validation_split=0.2,
        rotation_range=20,
        width_shift_range=0.15,
        height_shift_range=0.15,
        horizontal_flip=True,
        zoom_range=0.15,
        brightness_range=[0.85, 1.15],
        shear_range=8,
    )
    val_gen = ImageDataGenerator(validation_split=0.2)

    train_data = train_gen.flow_from_directory(
        data_dir, target_size=(IMG_SIZE, IMG_SIZE), batch_size=BATCH,
        class_mode="categorical", subset="training", shuffle=True, seed=42
    )
    val_data = val_gen.flow_from_directory(
        data_dir, target_size=(IMG_SIZE, IMG_SIZE), batch_size=BATCH,
        class_mode="categorical", subset="validation", shuffle=False, seed=42
    )

    num_classes = len(class_folders)
    print(f"\n  {train_data.samples} training | {val_data.samples} validation images | {num_classes} classes")

    # ── Compute class weights to handle imbalance ─────────────────────────────
    from sklearn.utils.class_weight import compute_class_weight
    class_indices = list(train_data.class_indices.values())  # [0,1,2,3]
    y_train_labels = train_data.classes
    class_weights_array = compute_class_weight(
        class_weight="balanced",
        classes=np.array(sorted(set(y_train_labels))),
        y=y_train_labels
    )
    class_weight_dict = dict(enumerate(class_weights_array))
    print(f"  Class weights: { {i: f'{w:.2f}' for i, w in class_weight_dict.items()} }")

    # ── Build model ──────────────────────────────────────────────────────────
    from tensorflow.keras.applications.efficientnet import preprocess_input
    base = EfficientNetB0(weights="imagenet", include_top=False,
                          input_shape=(IMG_SIZE, IMG_SIZE, 3))
    base.trainable = False

    inputs = keras.Input(shape=(IMG_SIZE, IMG_SIZE, 3))
    x = layers.Lambda(lambda img: preprocess_input(img))(inputs)  # [0,255] → EfficientNet scale
    x = base(x, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.BatchNormalization()(x)
    x = layers.Dense(256, activation="relu")(x)
    x = layers.Dropout(0.3)(x)
    x = layers.Dense(128, activation="relu")(x)
    x = layers.Dropout(0.2)(x)
    outputs = layers.Dense(num_classes, activation="softmax")(x)
    model = keras.Model(inputs, outputs)

    model.compile(
        optimizer=keras.optimizers.Adam(1e-3),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )

    os.makedirs(_resolve_path("models"), exist_ok=True)
    model_keras_path = str(_resolve_path("models/blood_cell_cancer_model.keras"))
    callbacks = [
        EarlyStopping(monitor="val_accuracy", patience=8, restore_best_weights=True, verbose=1),
        ReduceLROnPlateau(monitor="val_loss", factor=0.5, patience=4, min_lr=1e-7, verbose=1),
        ModelCheckpoint(model_keras_path,
                save_best_only=True, monitor="val_accuracy", verbose=1),
    ]

    print("\n  Phase 1: Training classification head (base frozen)…")
    model.fit(train_data, validation_data=val_data,
              epochs=EPOCHS, callbacks=callbacks, verbose=1,
              class_weight=class_weight_dict)

    # Fine-tune top layers
    print("\n  Phase 2: Fine-tuning top 30 layers…")
    base.trainable = True
    for layer in base.layers[:-30]:
        layer.trainable = False
    # Keep BatchNorm layers frozen during fine-tuning to avoid instability
    for layer in base.layers:
        if isinstance(layer, keras.layers.BatchNormalization):
            layer.trainable = False
    model.compile(optimizer=keras.optimizers.Adam(1e-5),
                  loss="categorical_crossentropy", metrics=["accuracy"])
    model.fit(train_data, validation_data=val_data,
              epochs=15, callbacks=callbacks, verbose=1,
              class_weight=class_weight_dict)

    val_loss, val_acc = model.evaluate(val_data, verbose=0)
    print(f"\n  Validation Accuracy: {val_acc:.4f}  |  Loss: {val_loss:.4f}")

    preds  = model.predict(val_data)
    y_pred = np.argmax(preds, axis=1)
    y_true = val_data.classes
    cm = confusion_matrix(y_true, y_pred)
    plot_cm(cm, class_display, "Blood Cell Cancer — Confusion Matrix",
            "reports/blood_cell_confusion.png")
    print("\n" + classification_report(y_true, y_pred, target_names=class_display))

    # Save training metrics
    save_json({"val_accuracy": float(val_acc), "val_loss": float(val_loss)},
              "models/blood_cell_metrics.json")
    # Save an H5 copy for compatibility
    model.save(str(_resolve_path("models/blood_cell_cancer_model.h5")))


# ═══════════════════════════════════════════════════════════════════════════════
#  2. HEART DISEASE
# ═══════════════════════════════════════════════════════════════════════════════

def train_heart(csv_path: str = "Dataset/heart_disease.csv"):
    print("\n" + "═" * 62)
    print("  HEART DISEASE — XGBoost / RandomForest")
    print("═" * 62)

    csv_path = str(_resolve_path(csv_path))

    if not check_file(csv_path, "Heart Disease CSV",
                      "https://www.kaggle.com/datasets/johnsmith88/heart-disease-dataset"):
        return

    df = pd.read_csv(csv_path)
    print(f"  Loaded: {df.shape[0]} rows × {df.shape[1]} cols")
    print(f"  Columns: {list(df.columns)}")
    df.dropna(inplace=True)

    # Auto-detect target column
    target_candidates = ["target", "condition", "HeartDisease", "heart_disease", "output"]
    target = next((c for c in target_candidates if c in df.columns), df.columns[-1])
    print(f"  Target column: '{target}'")

    X = df.drop(columns=[target])

    # Handle string labels like 'Yes'/'No', 'Positive'/'Negative', etc.
    yes_no_map = {"yes": 1, "no": 0, "true": 1, "false": 0,
                  "positive": 1, "negative": 0, "1": 1, "0": 0}
    raw_target = df[target].astype(str).str.strip().str.lower()
    if raw_target.isin(yes_no_map.keys()).all():
        y = raw_target.map(yes_no_map).astype(int)
    else:
        y = df[target].astype(int)

    # Drop non-numeric columns
    X = X.select_dtypes(include=[np.number])

    # FIX: Ensure binary target (some datasets use 0-4 scale)
    y = (y > 0).astype(int)
    print(f"  Class balance: {dict(y.value_counts())}")

    X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    if HAS_XGB:
        # scale_pos_weight handles class imbalance: ratio of negatives/positives
        neg, pos = (y == 0).sum(), (y == 1).sum()
        clf = xgb.XGBClassifier(
            n_estimators=200, max_depth=5, learning_rate=0.05,
            subsample=0.8, colsample_bytree=0.8,
            scale_pos_weight=float(neg) / float(pos),
            eval_metric="logloss", random_state=42
        )
        print(f"  scale_pos_weight = {neg/pos:.2f} (class imbalance correction)")
    else:
        clf = RandomForestClassifier(n_estimators=200, max_depth=10,
                                     random_state=42, n_jobs=-1)

    pipe = Pipeline([("scaler", StandardScaler()), ("clf", clf)])
    pipe.fit(X_tr, y_tr)

    y_pred  = pipe.predict(X_te)
    y_proba = pipe.predict_proba(X_te)[:, 1]
    acc = accuracy_score(y_te, y_pred)
    auc = roc_auc_score(y_te, y_proba)
    print(f"  Accuracy: {acc:.4f}  |  ROC-AUC: {auc:.4f}")
    print(classification_report(y_te, y_pred, target_names=["No Disease", "Disease"]))

    cm = confusion_matrix(y_te, y_pred)
    plot_cm(cm, ["No Disease", "Disease"], "Heart Disease — Confusion Matrix",
            "reports/heart_confusion.png")
    plot_roc(y_te, y_proba, "Heart Disease — ROC Curve", "reports/heart_roc.png")
    save_pkl(pipe, "models/heart_disease_model.pkl")

    # Save feature names for app.py validation
    save_json({"features": list(X.columns), "accuracy": float(acc), "auc": float(auc)},
              "models/heart_features.json")


# ═══════════════════════════════════════════════════════════════════════════════
#  3. LUNG CANCER
# ═══════════════════════════════════════════════════════════════════════════════

def train_lung(csv_path: str = "Dataset/Lung_Cancer_Dataset.csv"):
    print("\n" + "═" * 62)
    print("  LUNG CANCER — Gradient Boosting + SMOTE")
    print("═" * 62)

    csv_path = str(_resolve_path(csv_path))

    if not check_file(csv_path, "Lung Cancer CSV",
                      "https://www.kaggle.com/datasets/akashnath29/lung-cancer-dataset"):
        return

    df = pd.read_csv(csv_path)
    print(f"  Loaded: {df.shape[0]} rows × {df.shape[1]} cols")
    df.columns = [c.strip().upper().replace(" ", "_") for c in df.columns]

    # Encode GENDER / LUNG_CANCER columns — handle both string (YES/NO) and numeric (0/1) CSVs
    if "GENDER" in df.columns:
        if df["GENDER"].dtype == object:
            df["GENDER"] = df["GENDER"].str.upper().map({"M": 1, "F": 0, "MALE": 1, "FEMALE": 0}).fillna(0)
        # already numeric → keep as-is
    if "LUNG_CANCER" in df.columns:
        if df["LUNG_CANCER"].dtype == object:
            df["LUNG_CANCER"] = df["LUNG_CANCER"].str.upper().str.strip().map(
                {"YES": 1, "NO": 0, "1": 1, "0": 0}
            )
        else:
            # Already numeric int/float: just ensure 0 or 1
            df["LUNG_CANCER"] = df["LUNG_CANCER"].astype(int)

    # Drop any remaining non-numeric
    for col in df.select_dtypes(include="object").columns:
        df[col] = LabelEncoder().fit_transform(df[col].astype(str))

    df.dropna(inplace=True)
    target = "LUNG_CANCER" if "LUNG_CANCER" in df.columns else df.columns[-1]
    print(f"  Target column: '{target}'")

    X = df.drop(columns=[target]).select_dtypes(include=[np.number])
    y = df[target].astype(int)
    print(f"  Class balance: {dict(y.value_counts())}")

    X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    if HAS_SMOTE:
        sm = SMOTE(random_state=42)
        X_tr, y_tr = sm.fit_resample(X_tr, y_tr)
        print(f"  After SMOTE: {len(X_tr)} training samples")

    clf = GradientBoostingClassifier(n_estimators=200, max_depth=4,
                                      learning_rate=0.05, random_state=42)
    pipe = Pipeline([("scaler", StandardScaler()), ("clf", clf)])
    pipe.fit(X_tr, y_tr)

    y_pred  = pipe.predict(X_te)
    y_proba = pipe.predict_proba(X_te)[:, 1]
    acc = accuracy_score(y_te, y_pred)
    auc = roc_auc_score(y_te, y_proba)
    print(f"  Accuracy: {acc:.4f}  |  ROC-AUC: {auc:.4f}")
    print(classification_report(y_te, y_pred, target_names=["Low Risk", "High Risk"]))

    cm = confusion_matrix(y_te, y_pred)
    plot_cm(cm, ["Low Risk", "High Risk"], "Lung Cancer — Confusion Matrix",
            "reports/lung_confusion.png")
    plot_roc(y_te, y_proba, "Lung Cancer — ROC Curve", "reports/lung_roc.png")
    save_pkl(pipe, "models/lung_cancer_model.pkl")
    save_json({"features": list(X.columns), "accuracy": float(acc), "auc": float(auc)},
              "models/lung_features.json")


# ═══════════════════════════════════════════════════════════════════════════════
#  4. PARKINSON'S DISEASE
# ═══════════════════════════════════════════════════════════════════════════════

def train_parkinsons(csv_path: str = "Dataset/Parkinsson disease.csv"):
    print("\n" + "═" * 62)
    print("  PARKINSON'S DISEASE — SVM (RBF Kernel)")
    print("═" * 62)

    csv_path = str(_resolve_path(csv_path))

    if not check_file(csv_path, "Parkinson's CSV",
                      "https://www.kaggle.com/datasets/debasisdotcom/parkinson-disease-detection"):
        return

    df = pd.read_csv(csv_path)
    print(f"  Loaded: {df.shape[0]} rows × {df.shape[1]} cols")
    df.dropna(inplace=True)

    # Drop 'name' column if present (UCI dataset)
    drop_cols = [c for c in df.columns if c.lower() in ("name", "id")]
    df.drop(columns=drop_cols, inplace=True, errors="ignore")

    # Auto-detect target
    target_candidates = ["status", "class", "target", "Diagnosis"]
    target = next((c for c in target_candidates if c in df.columns), df.columns[-1])
    print(f"  Target column: '{target}'")
    print(f"  Class balance: {dict(df[target].value_counts())}")

    X = df.drop(columns=[target]).select_dtypes(include=[np.number])
    y = df[target].astype(int)

    X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    pipe = Pipeline([
        ("scaler", StandardScaler()),
        ("clf", SVC(kernel="rbf", C=10, gamma=0.01, probability=True, random_state=42))
    ])
    pipe.fit(X_tr, y_tr)

    # Cross-validation
    cv_scores = cross_val_score(pipe, X, y, cv=5, scoring="accuracy")
    print(f"  5-Fold CV Accuracy: {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")

    y_pred  = pipe.predict(X_te)
    y_proba = pipe.predict_proba(X_te)[:, 1]
    acc = accuracy_score(y_te, y_pred)
    auc = roc_auc_score(y_te, y_proba)
    print(f"  Test Accuracy: {acc:.4f}  |  ROC-AUC: {auc:.4f}")
    print(classification_report(y_te, y_pred, target_names=["Healthy", "Parkinson's"]))

    cm = confusion_matrix(y_te, y_pred)
    plot_cm(cm, ["Healthy", "Parkinson's"], "Parkinson's — Confusion Matrix",
            "reports/parkinsons_confusion.png")
    plot_roc(y_te, y_proba, "Parkinson's — ROC Curve", "reports/parkinsons_roc.png")
    save_pkl(pipe, "models/parkinsons_model.pkl")
    save_json({"features": list(X.columns), "accuracy": float(acc), "auc": float(auc),
               "cv_mean": float(cv_scores.mean()), "cv_std": float(cv_scores.std())},
              "models/parkinsons_features.json")


# ═══════════════════════════════════════════════════════════════════════════════
#  5. THYROID DISORDER
# ═══════════════════════════════════════════════════════════════════════════════

def train_thyroid(csv_path: str = "Dataset/Thyroid_Disease_Dataset.csv"):
    print("\n" + "═" * 62)
    print("  THYROID DISORDER — Random Forest (Multiclass)")
    print("═" * 62)

    csv_path = str(_resolve_path(csv_path))

    if not check_file(csv_path, "Thyroid CSV",
                      "https://www.kaggle.com/datasets/yasserhessein/thyroid-disease-data-set"):
        return

    df = pd.read_csv(csv_path)
    print(f"  Loaded: {df.shape[0]} rows × {df.shape[1]} cols")
    df.dropna(inplace=True)

    # Encode all object columns
    le = LabelEncoder()
    for col in df.select_dtypes(include="object").columns:
        df[col] = le.fit_transform(df[col].astype(str))

    # Auto-detect target
    target_candidates = ["target", "class", "ThryroidClass", "diagnosis", "Diagnosis"]
    target = next((c for c in target_candidates if c in df.columns), df.columns[-1])
    print(f"  Target column: '{target}'")

    X = df.drop(columns=[target]).select_dtypes(include=[np.number])
    y = df[target].astype(int)

    # Re-encode target to be 0-indexed
    unique_classes = sorted(y.unique())
    class_to_idx = {c: i for i, c in enumerate(unique_classes)}
    y = y.map(class_to_idx)
    num_classes = len(unique_classes)
    print(f"  Classes found: {unique_classes} ({num_classes} total)")

    X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    pipe = Pipeline([
        ("scaler", StandardScaler()),
        ("clf", RandomForestClassifier(n_estimators=300, max_depth=12,
                                        min_samples_leaf=2, random_state=42, n_jobs=-1))
    ])
    pipe.fit(X_tr, y_tr)

    y_pred = pipe.predict(X_te)
    acc = accuracy_score(y_te, y_pred)
    print(f"  Accuracy: {acc:.4f}")
    print(classification_report(y_te, y_pred))

    cm = confusion_matrix(y_te, y_pred)
    class_labels = [f"Class {c}" for c in range(num_classes)]
    plot_cm(cm, class_labels, "Thyroid — Confusion Matrix", "reports/thyroid_confusion.png")
    save_pkl(pipe, "models/thyroid_model.pkl")
    # Convert np.int64 keys to int so JSON serialization works
    class_map_serializable = {int(k): int(v) for k, v in class_to_idx.items()}
    save_json({"features": list(X.columns), "n_classes": num_classes,
               "class_map": class_map_serializable, "accuracy": float(acc)},
              "models/thyroid_features.json")


# ═══════════════════════════════════════════════════════════════════════════════
#  6. DIABETES
# ═══════════════════════════════════════════════════════════════════════════════

def train_diabetes(csv_path: str = "Dataset/diabetes.csv"):
    print("\n" + "═" * 62)
    print("  DIABETES — XGBoost / RandomForest + SMOTE")
    print("═" * 62)

    csv_path = str(_resolve_path(csv_path))

    if not check_file(csv_path, "Diabetes CSV",
                      "https://www.kaggle.com/datasets/imtkaggleteam/diabetes"):
        return

    df = pd.read_csv(csv_path)
    print(f"  Loaded: {df.shape[0]} rows × {df.shape[1]} cols")
    print(f"  Columns: {list(df.columns)}")

    # Replace physiologically impossible zeros with NaN
    zero_not_valid = ["Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI"]
    for col in zero_not_valid:
        if col in df.columns:
            df[col] = df[col].replace(0, np.nan)

    # Fill missing values with median
    df.fillna(df.median(numeric_only=True), inplace=True)

    # Auto-detect target — prefer standard binary columns
    target_candidates = ["Outcome", "outcome", "target", "Diabetes", "diabetes"]
    target = next((c for c in target_candidates if c in df.columns), None)

    if target is None:
        # Fallback: derive binary diabetes label from glycated hemoglobin (glyhb >= 7.0)
        if "glyhb" in df.columns:
            print("  [INFO] No standard target found — deriving binary label from glyhb >= 7.0")
            df["Outcome"] = (df["glyhb"] >= 7.0).astype(int)
            target = "Outcome"
            df.drop(columns=["glyhb"], inplace=True)  # avoid data leakage
        else:
            # Last resort: use last column but warn
            target = df.columns[-1]
            print(f"  [WARN] No known target column found — using last column: '{target}'")
            # Binarize if it has too many unique values
            if df[target].nunique() > 10:
                print(f"  [WARN] '{target}' has {df[target].nunique()} unique values — cannot use as classification target.")
                print("  [SKIP] Please provide a CSV with a binary diabetes outcome column (0/1).")
                return

    # Drop non-predictive ID columns
    drop_cols = [c for c in df.columns if c.lower() in ("id", "patientid")]
    df.drop(columns=drop_cols, inplace=True, errors="ignore")

    print(f"  Target column: '{target}'  |  Class balance: {dict(df[target].value_counts())}")

    X = df.drop(columns=[target]).select_dtypes(include=[np.number])
    y = df[target].astype(int)

    X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    if HAS_SMOTE:
        sm = SMOTE(random_state=42)
        X_tr, y_tr = sm.fit_resample(X_tr, y_tr)
        print(f"  After SMOTE: {len(X_tr)} training samples")

    if HAS_XGB:
        clf = xgb.XGBClassifier(
            n_estimators=200, max_depth=5, learning_rate=0.05,
            subsample=0.8, colsample_bytree=0.8,
            eval_metric="logloss", random_state=42
        )
    else:
        clf = RandomForestClassifier(n_estimators=300, max_depth=10,
                                     random_state=42, n_jobs=-1)

    pipe = Pipeline([("scaler", StandardScaler()), ("clf", clf)])
    pipe.fit(X_tr, y_tr)

    cv_scores = cross_val_score(pipe, X, y, cv=5, scoring="accuracy")
    print(f"  5-Fold CV Accuracy: {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")

    y_pred  = pipe.predict(X_te)
    y_proba = pipe.predict_proba(X_te)[:, 1]
    acc = accuracy_score(y_te, y_pred)
    auc = roc_auc_score(y_te, y_proba)
    print(f"  Test Accuracy: {acc:.4f}  |  ROC-AUC: {auc:.4f}")
    print(classification_report(y_te, y_pred, target_names=["Non-Diabetic", "Diabetic"]))

    cm = confusion_matrix(y_te, y_pred)
    plot_cm(cm, ["Non-Diabetic", "Diabetic"], "Diabetes — Confusion Matrix",
            "reports/diabetes_confusion.png")
    plot_roc(y_te, y_proba, "Diabetes — ROC Curve", "reports/diabetes_roc.png")
    save_pkl(pipe, "models/diabetes_model.pkl")
    save_json({"features": list(X.columns), "accuracy": float(acc), "auc": float(auc),
               "cv_mean": float(cv_scores.mean()), "cv_std": float(cv_scores.std())},
              "models/diabetes_features.json")


# ─── Entry Point ─────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Train AI Medical Diagnosis models")
    parser.add_argument(
        "--disease",
        choices=["all", "blood_cell", "heart", "lung", "parkinsons", "thyroid", "diabetes"],
        default="all",
        help="Which model to train (default: all)",
    )
    parser.add_argument("--blood-dir",  default="Dataset/Blood cell Cancer [ALL]")
    parser.add_argument("--heart-csv",  default="Dataset/heart_disease.csv")
    parser.add_argument("--lung-csv",   default="Dataset/Lung_Cancer_Dataset.csv")
    parser.add_argument("--park-csv",   default="Dataset/Parkinsson disease.csv")
    parser.add_argument("--thy-csv",    default="Dataset/Thyroid_Disease_Dataset.csv")
    parser.add_argument("--diab-csv",   default="Dataset/diabetes.csv")
    args = parser.parse_args()

    d = args.disease
    print("\n🧬  AI Medical Diagnosis System — Model Trainer")
    print(f"    Training: {d.upper()}\n")

    if d in ("all", "blood_cell"):  train_blood_cell(args.blood_dir)
    if d in ("all", "heart"):       train_heart(args.heart_csv)
    if d in ("all", "lung"):        train_lung(args.lung_csv)
    if d in ("all", "parkinsons"):  train_parkinsons(args.park_csv)
    if d in ("all", "thyroid"):     train_thyroid(args.thy_csv)
    if d in ("all", "diabetes"):    train_diabetes(args.diab_csv)

    print("\n✅  Training complete!")
    print("    Models  → models/")
    print("    Reports → reports/")
    print("    Run app: streamlit run app.py\n")


if __name__ == "__main__":
    main()