# 🧬 AarogyaAI – Intelligent Disease Detection & Smart Healthcare Platform

An end-to-end machine learning web application for early detection of **6 critical diseases** using clinical data and medical imaging. Built with Python, FastAPI, React, TensorFlow, and Machine Learning.

![Python](https://img.shields.io/badge/Python-3.10+-blue?style=flat-square&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green?style=flat-square&logo=fastapi)
![React](https://img.shields.io/badge/React-19.2+-blue?style=flat-square&logo=react)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.12+-orange?style=flat-square&logo=tensorflow)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## ⚠️ Medical Disclaimer

> This project is for **educational and research purposes only**. Predictions made by these models must **never** be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.

---

## 🩺 Disease Modules

| # | Disease | Model | Input Type | Key Technique |
|---|---------|-------|------------|---------------|
| 1 | 🩸 Blood Cell Cancer (ALL) | EfficientNetB0 CNN | Microscopy Image | Transfer Learning + Fine-tuning |
| 2 | ❤️ Heart Disease | XGBoost / Random Forest | Clinical CSV | StandardScaler + Binary classification |
| 3 | 🫁 Lung Cancer | Gradient Boosting | Risk Factors CSV | SMOTE oversampling |
| 4 | 🧠 Parkinson's Disease | SVM (RBF) | Voice Biomarkers | 22-feature biomarker analysis |
| 5 | 🦋 Thyroid Disorder | Random Forest | Lab Values | Multiclass (Normal / Hypo / Hyper) |
| 6 | 📊 Diabetes | XGBoost / Random Forest | Clinical CSV | SMOTE + Zero imputation |

---

## 📁 Project Structure

```
AarogyaAI – Intelligent Disease Detection & Smart Healthcare Platform/
│
├── backend/                        ← FastAPI REST API server
│   ├── main.py                     ← FastAPI application (8000)
│   ├── database/                   ← SQLAlchemy ORM models & MongoDB
│   │   ├── models.py               ← User, Prediction, Doctor, Record schemas
│   │   ├── db.py                   ← Database initialization
│   │   └── mongodb.py              ← MongoDB connection
│   └── report_generator.py         ← PDF report generation (fpdf2)
│
├── frontend/                       ← React + Vite + Tailwind UI (port 80)
│   ├── src/
│   │   ├── pages/                  ← Patient/Doctor/Admin dashboards
│   │   ├── components/             ← Reusable React components
│   │   ├── context/                ← AuthContext for user state
│   │   └── hooks/                  ← Custom React hooks
│   ├── vite.config.ts              ← Vite build config
│   └── tailwind.config.js          ← Tailwind CSS config
│
├── models/                         ← Trained ML models (.h5, .pkl, .json)
│   ├── blood_cell_cancer_model.keras
│   ├── heart_disease_model.pkl
│   ├── lung_cancer_model.pkl
│   ├── parkinsons_model.pkl
│   ├── thyroid_model.pkl
│   ├── diabetes_model.pkl
│   ├── *_features.json             ← Feature scaling parameters
│   └── *_metrics.json              ← Model performance metrics
│
├── training/                       ← Jupyter notebooks & training scripts
│   ├── Dataset/                    ← Raw datasets (CSV + Blood Cell Images)
│   │   ├── heart_disease.csv
│   │   ├── Lung_Cancer_Dataset.csv
│   │   ├── diabetes.csv
│   │   ├── Thyroid_Disease_Dataset.csv
│   │   ├── Parkinsson disease.csv
│   │   └── Blood cell Cancer [ALL]/
│   ├── train_model.py              ← Model training pipeline
│   └── *.ipynb                     ← Individual disease model notebooks
│
├── Livekit/                        ← Real-time communication (video/audio/chat)
│   ├── Livekit_BE/                 ← Token server (Express.js)
│   └── Livekit_FE/                 ← LiveKit React frontend (Vite)
│
├── legacy/                         ← Old Streamlit version (deprecated)
│
├── docker-compose.yml              ← Multi-container deployment (nginx + backend + frontend)
├── nginx.conf                      ← Nginx reverse proxy config
├── requirements.txt                ← Root Python dependencies
└── README.md                       ← This file
```

---

## 🔧 Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Backend API** | FastAPI (Python) | REST endpoints, AI predictions, user auth |
| **Frontend** | React 19 + Vite | Modern responsive UI with Tailwind CSS |
| **Database** | SQLite + MongoDB | User data & health records |
| **ML Models** | TensorFlow, XGBoost, scikit-learn | Disease predictions |
| **Deployment** | Docker + docker-compose | Containerized multi-service architecture |
| **Real-time Communication** | LiveKit | Video/audio calls & chat |

---

## 🐳 Docker Deployment

### Build & Run

```bash
docker-compose up --build
```

### Services
- **Frontend** (port 80): Nginx + React app
- **Backend** (port 8000): FastAPI with Uvicorn
- **Network** (aarogyaai-net): Internal Docker bridge network

---

## 📖 Documentation

- [Backend README](./backend/README.md) — API endpoints & setup
- [Frontend README](./frontend/README.md) — UI setup & configuration
- [LiveKit Setup](./Livekit/readme.md) — Video/audio communication

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/utsavraj1/AI-Powered-Medical-Diagnosis-System.git
cd AI-Powered-Medical-Diagnosis-System
```

### 2. Create a Virtual Environment (Recommended)

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Download Datasets

Place each dataset in the `Dataset/` folder as shown in the structure above.

| Disease | Kaggle Dataset Link |
|---------|-------------------|
| Blood Cell Cancer | [mohammadamireshraghi/blood-cell-cancer-all-4class](https://www.kaggle.com/datasets/mohammadamireshraghi/blood-cell-cancer-all-4class) |
| Heart Disease | [johnsmith88/heart-disease-dataset](https://www.kaggle.com/datasets/johnsmith88/heart-disease-dataset) |
| Lung Cancer | [akashnath29/lung-cancer-dataset](https://www.kaggle.com/datasets/akashnath29/lung-cancer-dataset) |
| Parkinson's | [debasisdotcom/parkinson-disease-detection](https://www.kaggle.com/datasets/debasisdotcom/parkinson-disease-detection) |
| Thyroid | [yasserhessein/thyroid-disease-data-set](https://www.kaggle.com/datasets/yasserhessein/thyroid-disease-data-set) |
| Diabetes | [imtkaggleteam/diabetes](https://www.kaggle.com/datasets/imtkaggleteam/diabetes) |

### 5. Train the Models

```bash
# Train all 6 models
python train_model.py

# Train a specific model
python train_model.py --disease blood_cell
python train_model.py --disease heart
python train_model.py --disease lung
python train_model.py --disease parkinsons
python train_model.py --disease thyroid
python train_model.py --disease diabetes
```

Trained models will be saved to `models/` and evaluation reports (confusion matrices, ROC curves) to `reports/`.

### 6. Launch the Web App

```bash
streamlit run app.py
```

Open your browser at `http://localhost:8501`.

---

## 🏗️ Model Architecture Details

### 🩸 Blood Cell Cancer — EfficientNetB0 (CNN)

- **Architecture**: EfficientNetB0 pretrained on ImageNet, custom classification head
- **Input**: 224×224 RGB images
- **Classes**: Benign · Early Pre-B ALL · Pre-B ALL · Pro-B ALL
- **Training strategy**:
  - Phase 1: Freeze base, train head (lr=1e-3, up to 30 epochs)
  - Phase 2: Unfreeze top 30 layers, fine-tune (lr=1e-5, up to 10 epochs)
- **Augmentation**: rotation, shift, flip, zoom, brightness, shear
- **Callbacks**: EarlyStopping, ReduceLROnPlateau, ModelCheckpoint

### ❤️ Heart Disease — XGBoost / Random Forest

- **Features**: age, sex, chest pain type, resting BP, cholesterol, fasting blood sugar, resting ECG, max heart rate, exercise angina, ST depression, ST slope, major vessels, thalassemia (13 total)
- **Target**: Binary (0 = No disease, 1 = Disease) — values >0 normalised to 1
- **Pipeline**: StandardScaler → XGBoost (200 trees, max_depth=5, lr=0.05)

### 🫁 Lung Cancer — Gradient Boosting

- **Features**: 15 risk factors (gender, age, smoking, symptoms)
- **Imbalance handling**: SMOTE oversampling on training set
- **Pipeline**: StandardScaler → GradientBoostingClassifier (200 trees, max_depth=4)

### 🧠 Parkinson's Disease — SVM (RBF Kernel)

- **Features**: 22 vocal biomarkers (MDVP measures, jitter, shimmer, NHR, HNR, RPDE, DFA, spread1/2, D2, PPE)
- **Hyperparameters**: C=10, gamma=0.01, probability=True
- **Evaluation**: 5-fold cross-validation + held-out test set
- **Pipeline**: StandardScaler → SVC

### 🦋 Thyroid Disorder — Random Forest (Multiclass)

- **Features**: age, sex, thyroxine status, TSH, T3, TT4, T4U, FTI, goitre, tumor, hypopituitary, psychological symptoms
- **Classes**: Normal · Hypothyroid · Hyperthyroid (0-indexed)
- **Pipeline**: StandardScaler → RandomForestClassifier (300 trees, max_depth=12)

### 📊 Diabetes — XGBoost / Random Forest

- **Features**: Pregnancies, Glucose, BloodPressure, SkinThickness, Insulin, BMI, DiabetesPedigreeFunction, Age
- **Preprocessing**: Replace physiologically impossible zeros with column median
- **Imbalance handling**: SMOTE oversampling
- **Evaluation**: 5-fold cross-validation + ROC-AUC

---

## 📊 Evaluation Reports

After training, the following files are generated in `reports/`:

| File | Description |
|------|-------------|
| `blood_cell_confusion.png` | 4×4 confusion matrix for CNN |
| `heart_confusion.png` | Binary confusion matrix |
| `heart_roc.png` | ROC curve with AUC score |
| `lung_confusion.png` | Binary confusion matrix |
| `lung_roc.png` | ROC curve with AUC score |
| `parkinsons_confusion.png` | Binary confusion matrix |
| `parkinsons_roc.png` | ROC curve with AUC score |
| `thyroid_confusion.png` | Multiclass confusion matrix |
| `diabetes_confusion.png` | Binary confusion matrix |
| `diabetes_roc.png` | ROC curve with AUC score |

---

## 🔧 Advanced Usage

### Custom Dataset Paths

```bash
python train_model.py \
  --blood-dir  "path/to/blood/images" \
  --heart-csv  "path/to/heart.csv" \
  --lung-csv   "path/to/lung.csv" \
  --park-csv   "path/to/parkinsons.csv" \
  --thy-csv    "path/to/thyroid.csv" \
  --diab-csv   "path/to/diabetes.csv"
```

### Using Pre-trained Models

If you already have trained models, place the `.pkl` and `.h5` files in the `models/` directory and launch the app directly — training is not required to use the web interface.

---

## 🧰 Tech Stack

| Category | Libraries |
|----------|-----------|
| Web App | Streamlit |
| Deep Learning | TensorFlow 2.x, Keras, EfficientNetB0 |
| Machine Learning | Scikit-Learn, XGBoost |
| Data Balancing | imbalanced-learn (SMOTE) |
| Data Processing | Pandas, NumPy |
| Visualisation | Matplotlib, Seaborn |
| Image Processing | Pillow |

---

## 🐛 Known Issues & Fixes Applied

| Issue | Fix |
|-------|-----|
| `use_label_encoder` XGBoost deprecation warning | Removed deprecated param; warnings suppressed |
| Heart disease target not binary (0–4 range) | Added `y = (y > 0).astype(int)` normalisation |
| Thyroid class indices not 0-based | Added `class_to_idx` re-mapping before training |
| Blood cell class order mismatch at inference | Saved `blood_cell_classes.json` metadata; app reads it |
| TF import crash when not installed | Wrapped all TF imports in try/except; `HAS_TF` flag used |
| `id` column not dropped in Parkinson's | Extended drop list to include both `name` and `id` |
| Missing Diabetes page in sidebar | Added full Diabetes module to both `app.py` and sidebar |
| Model path mismatch (`Model/` vs `models/`) | Standardised all paths to `models/` |

---

## 📄 License

This project is released under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

- Kaggle datasets and their respective creators
- [EfficientNet paper](https://arxiv.org/abs/1905.11946) — Tan & Le, 2019
- UCI Machine Learning Repository
- Streamlit for the rapid prototyping framework