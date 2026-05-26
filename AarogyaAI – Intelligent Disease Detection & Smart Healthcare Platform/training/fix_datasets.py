"""
fix_datasets.py
===============
Downloads proper, well-known public datasets to replace the synthetic/low-quality CSVs.

Datasets replaced:
  - heart_disease.csv  → UCI Cleveland Heart Disease (303 rows, 14 features, ~85% XGB accuracy)
  - Lung_Cancer_Dataset.csv → Survey Lung Cancer (284 rows, 16 features, ~92% accuracy)
  - diabetes.csv → Pima Indians Diabetes (768 rows, 8 features, ~78% accuracy)
"""

import os
import urllib.request
import pandas as pd
import io

DATASET_DIR = "Dataset"
os.makedirs(DATASET_DIR, exist_ok=True)

# ─── 1. HEART DISEASE — UCI Cleveland ────────────────────────────────────────
print("\n[1/3] Downloading UCI Cleveland Heart Disease dataset...")
try:
    url = "https://archive.ics.uci.edu/ml/machine-learning-databases/heart-disease/processed.cleveland.data"
    with urllib.request.urlopen(url, timeout=15) as r:
        raw = r.read().decode("utf-8")

    cols = ["age","sex","cp","trestbps","chol","fbs","restecg",
            "thalach","exang","oldpeak","slope","ca","thal","target"]
    df = pd.read_csv(io.StringIO(raw), header=None, names=cols, na_values="?")
    df.dropna(inplace=True)
    # target: 0 = no disease, 1-4 = disease — train_model.py already binarises with (y > 0)
    out = os.path.join(DATASET_DIR, "heart_disease.csv")
    df.to_csv(out, index=False)
    print(f"  ✓ Saved {len(df)} rows → {out}")
    print(f"  Classes: {dict(df['target'].value_counts())}")
except Exception as e:
    print(f"  ✗ Failed: {e}")
    print("  → Manually download from: https://archive.ics.uci.edu/dataset/45/heart+disease")

# ─── 2. LUNG CANCER — Survey Lung Cancer ─────────────────────────────────────
print("\n[2/3] Downloading Survey Lung Cancer dataset...")

lung_urls = [
    "https://raw.githubusercontent.com/christianversloot/machine-learning-datasets/main/survey%20lung%20cancer.csv",
    "https://raw.githubusercontent.com/ShivendraSingh-Yadav/Lung_Cancer_Prediction/main/survey%20lung%20cancer.csv",
    "https://raw.githubusercontent.com/dsrscientist/Lung-Cancer-Prediction-using-Machine-Learning/main/survey_lung_cancer.csv",
    "https://raw.githubusercontent.com/SharmaRupali/lung-cancer-prediction/master/survey%20lung%20cancer.csv",
]

lung_saved = False
for url in lung_urls:
    try:
        with urllib.request.urlopen(url, timeout=10) as r:
            raw = r.read().decode("utf-8")
        df = pd.read_csv(io.StringIO(raw))
        df.columns = [c.strip().upper().replace(" ", "_") for c in df.columns]
        if "GENDER" in df.columns:
            df["GENDER"] = df["GENDER"].map({"M": 1, "F": 0, "MALE": 1, "FEMALE": 0}).fillna(0).astype(int)
        if "LUNG_CANCER" in df.columns:
            df["LUNG_CANCER"] = df["LUNG_CANCER"].map({"YES": 1, "NO": 0, 1: 1, 0: 0}).astype(int)
        out = os.path.join(DATASET_DIR, "Lung_Cancer_Dataset.csv")
        df.to_csv(out, index=False)
        print(f"  ✓ Saved {len(df)} rows → {out}")
        if "LUNG_CANCER" in df.columns:
            print(f"  Classes: {dict(df['LUNG_CANCER'].value_counts())}")
        lung_saved = True
        break
    except Exception as e:
        print(f"  ✗ {url.split('/')[-1]}: {e}")

if not lung_saved:
    print("  → All URLs failed. Generating realistic synthetic dataset...")
    import numpy as np
    np.random.seed(42)
    n = 1000

    # Realistic features with proper correlations to lung cancer
    smoking        = np.random.binomial(1, 0.45, n)
    age            = np.random.randint(30, 80, n)
    gender         = np.random.binomial(1, 0.5, n)
    yellow_fingers = np.random.binomial(1, 0.3 + 0.4 * smoking, n).clip(0, 1)
    anxiety        = np.random.binomial(1, 0.25, n)
    peer_pressure  = np.random.binomial(1, 0.3, n)
    chronic_dis    = np.random.binomial(1, 0.35, n)
    fatigue        = np.random.binomial(1, 0.4, n)
    allergy        = np.random.binomial(1, 0.3, n)
    wheezing       = np.random.binomial(1, 0.2 + 0.35 * smoking, n).clip(0, 1)
    alcohol        = np.random.binomial(1, 0.35, n)
    coughing       = np.random.binomial(1, 0.2 + 0.4 * smoking, n).clip(0, 1)
    shortness      = np.random.binomial(1, 0.25 + 0.3 * smoking, n).clip(0, 1)
    swallowing     = np.random.binomial(1, 0.15, n)
    chest_pain     = np.random.binomial(1, 0.2 + 0.25 * smoking, n).clip(0, 1)

    # Probability of lung cancer based on risk factors
    risk = (0.05 + 0.30 * smoking + 0.05 * (age > 55).astype(int)
            + 0.10 * coughing + 0.08 * shortness + 0.07 * wheezing
            + 0.06 * chest_pain + 0.05 * chronic_dis + 0.04 * yellow_fingers)
    risk = risk.clip(0, 0.97)
    lung_cancer = np.random.binomial(1, risk, n)

    df_lung = pd.DataFrame({
        "GENDER": gender, "AGE": age, "SMOKING": smoking,
        "YELLOW_FINGERS": yellow_fingers, "ANXIETY": anxiety,
        "PEER_PRESSURE": peer_pressure, "CHRONIC_DISEASE": chronic_dis,
        "FATIGUE": fatigue, "ALLERGY": allergy, "WHEEZING": wheezing,
        "ALCOHOL_CONSUMING": alcohol, "COUGHING": coughing,
        "SHORTNESS_OF_BREATH": shortness, "SWALLOWING_DIFFICULTY": swallowing,
        "CHEST_PAIN": chest_pain, "LUNG_CANCER": lung_cancer
    })
    out = os.path.join(DATASET_DIR, "Lung_Cancer_Dataset.csv")
    df_lung.to_csv(out, index=False)
    print(f"  ✓ Generated {n} realistic samples → {out}")
    print(f"  Classes: {dict(pd.Series(lung_cancer).value_counts())}")

# ─── 3. DIABETES — Pima Indians ──────────────────────────────────────────────
print("\n[3/3] Downloading Pima Indians Diabetes dataset...")
try:
    url = "https://raw.githubusercontent.com/jbrownlee/Datasets/master/pima-indians-diabetes.data.csv"
    with urllib.request.urlopen(url, timeout=15) as r:
        raw = r.read().decode("utf-8")

    cols = ["Pregnancies","Glucose","BloodPressure","SkinThickness",
            "Insulin","BMI","DiabetesPedigreeFunction","Age","Outcome"]
    df = pd.read_csv(io.StringIO(raw), header=None, names=cols)
    out = os.path.join(DATASET_DIR, "diabetes.csv")
    df.to_csv(out, index=False)
    print(f"  ✓ Saved {len(df)} rows → {out}")
    print(f"  Classes: {dict(df['Outcome'].value_counts())}")
    print("    0 = Non-Diabetic, 1 = Diabetic")
except Exception as e:
    print(f"  ✗ Failed: {e}")
    print("  → Manually download from: https://www.kaggle.com/datasets/uciml/pima-indians-diabetes-database")

print("\n✅ Done! Now re-run training:")
print("   python train_model.py --disease heart")
print("   python train_model.py --disease lung")
print("   python train_model.py --disease diabetes")
