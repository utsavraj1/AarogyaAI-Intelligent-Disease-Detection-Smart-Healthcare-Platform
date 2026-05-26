# AarogyaAI: AI-Powered Medical Diagnosis System
**Comprehensive Project Report & Documentation**

## 1. Project Overview
AarogyaAI is a state-of-the-art, full-stack medical diagnosis platform designed to assist healthcare professionals in detecting and predicting the risk of six major diseases. By combining a highly responsive, premium React frontend with a robust FastAPI Python backend, the system leverages machine learning models to provide real-time inference, risk assessment, and PDF report generation.

## 2. Technical Stack
* **Frontend:**
  * React 18, TypeScript, Vite
  * Tailwind CSS (with bespoke glassmorphism & clinical UI design)
  * Lucide React (Icons), Recharts (Analytics)
  * React Router DOM (Navigation)
* **Backend:**
  * FastAPI (High-performance API framework)
  * SQLAlchemy & SQLite (Database & User/Prediction storage)
  * ReportLab (Automated PDF Generation)
  * Passlib & JWT (Secure Authentication)
* **Machine Learning & AI:**
  * TensorFlow / Keras (Deep Learning for Image Classification)
  * Scikit-Learn (Traditional ML pipelines, Ensembles, SVMs)
  * XGBoost (Advanced gradient boosting for tabular data)
  * Imbalanced-Learn (SMOTE for class balancing)

## 3. The AI Diagnostic Modules
The system supports six specialized disease modules. Each model is trained on validated medical datasets and exposed via a unified REST API endpoint (`POST /predict/{module}`).

1. **Blood Cell Cancer (ALL - Acute Lymphoblastic Leukemia)**
   * **Model:** Deep Convolutional Neural Network (EfficientNetB0 Transfer Learning)
   * **Input:** Microscopic blood smear image (JPG/PNG)
   * **Output:** 4-class prediction (Benign, Early Pre-B, Pre-B, Pro-B) + Aggregated Malignancy Risk.
2. **Heart Disease**
   * **Model:** XGBoost / Random Forest Ensemble
   * **Input:** 13 clinical features (Age, BP, Cholesterol, ECG results, etc.)
   * **Output:** Binary Risk (No Disease vs Disease)
3. **Lung Cancer**
   * **Model:** Gradient Boosting with SMOTE (Synthetic Minority Over-sampling)
   * **Input:** 15 lifestyle & symptom features (Smoking, Anxiety, Wheezing, etc.)
   * **Output:** Binary Risk (Low Risk vs High Risk)
4. **Parkinson's Disease**
   * **Model:** Support Vector Machine (SVM) with RBF Kernel
   * **Input:** 22 vocal frequency and nonlinear dynamic features (Jitter, Shimmer, NHR, etc.)
   * **Output:** Binary Risk (Healthy vs Parkinson's Likely)
5. **Thyroid Disorder**
   * **Model:** Multi-class Random Forest
   * **Input:** 25 clinical/lab features (TSH, TT4, T3, pregnancy status, medications)
   * **Output:** 3-class prediction (Normal, Hypothyroid, Hyperthyroid)
6. **Diabetes**
   * **Model:** XGBoost Classifier
   * **Input:** 8 metabolic indicators (Glucose, BMI, Insulin, Pedigree function, etc.)
   * **Output:** Binary Risk (Non-Diabetic vs Diabetic)

## 4. Key Features & Capabilities

## 4. Key Features & Capabilities

### User Authentication & Role Management
* **Role-Based Accounts:** Users can register specifically as either a `Patient` or a `Doctor`.
* **Isolated Admin Portal:** The Admin dashboard is strictly separated from the main user application (accessed via `/admin`). It is not visible in standard user navigation sidebars to maintain operational security.
* **JWT Security:** Secure Login and Registration system with fast, stateless token validation.

### Dynamic Clinical Diagnosis UI
* **Real-time Inference:** Asynchronous fetching from the FastAPI backend.
* **Premium UI/UX:** Dark/Light mode, "Midnight Emerald" clinical theme, responsive sidebars, and glassmorphic card designs.
* **Intelligent Results Panel:** 
  * Animated confidence bars mapping severity colors.
  * "Cancer vs Not Cancer" aggregated risk visualization for image models.
  * Auto-generated "AI Clinical Recommendations" (advising immediate consultation for High Risk, precautionary monitoring for Moderate Risk, or standard care for Low Risk).

### Medical Record Keeping
* **PDF Report Generation:** The backend automatically generates downloadable, professional PDF reports for High-Risk diagnoses.
* **Prediction History:** User dashboard displays a historical table of all past predictions, including the inference time (ms) and generated reports.

## 5. Recent System Stabilizations & Architecture Fixes
To achieve production readiness, several deep architectural bugs were resolved:

1. **TensorFlow Keras Loading Pipeline:** Overhauled the `.keras` model loading strategy. Injected a custom `PreprocessLambda` class to bypass `NotImplementedError` shape inference bugs, allowing the Blood Cell CNN to deserialize safely.
2. **Dynamic Feature Alignment:** Resolved `KeyError` crashes in the Parkinson's and Thyroid modules by forcing the backend to load expected `feature_order` directly from the training `features.json` metadata, ensuring the frontend payload perfectly matches the trained model matrix.
3. **Frontend Payload Mapping:** Updated the `diagnosisConfig.ts` to include all 25 specific clinical parameters required by the Thyroid model (e.g., specific boolean flags for lab measurements), preventing `422 Unprocessable Content` errors.
4. **Role Isolation:** Removed the Admin portal shortcut from the primary patient-facing sidebar, and implemented a distinct `Patient` vs `Doctor` role selector in the authentication UI, backed by SQLAlchemy model updates.

## 6. Comprehensive Project Structure Overview
```text
Medical_AI_Diagnosis/
├── backend/
│   ├── main.py                  # Core FastAPI application, Routes, Auth, and Inference logic
│   ├── report_generator.py      # ReportLab logic for dynamic PDF Medical Report creation
│   ├── .env                     # Secrets, Admin credentials, and JWT keys
│   └── database/
│       ├── db.py                # SQLAlchemy engine initialization and session management
│       └── models.py            # Database tables: Users, MedicalRecord, Prediction, Doctor, etc.
├── frontend/
│   ├── index.html               # React entry HTML
│   ├── package.json             # Node dependencies and build scripts
│   └── src/
│       ├── main.tsx             # React root renderer
│       ├── index.css            # Tailwind directives and CSS variables for the glassmorphism theme
│       ├── lib/
│       │   ├── api.ts           # Axios instance and API wrappers for backend communication
│       │   └── utils.ts         # Utility functions (Tailwind class merging, base64 encoding)
│       ├── context/
│       │   └── AuthContext.tsx  # Global JWT state, Login/Register methods, and Role management
│       ├── layouts/
│       │   ├── AppShell.tsx     # Standard Patient/Doctor Sidebar Layout
│       │   └── AdminLayout.tsx  # Isolated Administrative Interface Layout
│       ├── components/
│       │   ├── ui/              # shadcn/ui generic components (Buttons, Inputs, Dialogs)
│       │   ├── BrandLogo.tsx    # Centralized AarogyaAI logo component
│       │   └── ErrorBoundary.tsx# Fallback UI for React runtime crashes
│       └── pages/
│           ├── Auth.tsx         # Unified Registration/Login screen with Role selection
│           ├── Admin.tsx        # Superuser dashboard for system metrics and user management
│           ├── AdminLogin.tsx   # Dedicated login portal for Administrators
│           ├── Dashboard.tsx    # Primary landing overview for logged-in users
│           ├── Diagnosis.tsx    # The core AI Prediction interface and Risk Visualizer
│           ├── diagnosisConfig.ts # Configuration mapping for all 6 AI models and input fields
│           ├── Locker.tsx       # Secure document storage and vital tracking interface
│           ├── Predictions.tsx  # Historical log of past AI runs and PDF downloads
│           ├── Doctors.tsx      # Specialist directory interface
│           ├── Appointments.tsx # Interface for booking consultations
│           └── Profile.tsx      # User account settings
├── models/                      # Stored AI Model binaries
│   ├── blood_cell_cancer_model.keras  # EfficientNet CNN model
│   ├── diabetes_model.pkl             # XGBoost model
│   ├── heart_disease_model.pkl        # Random Forest model
│   ├── lung_cancer_model.pkl          # SMOTE Gradient Boosting model
│   ├── parkinsons_model.pkl           # SVM model
│   ├── thyroid_model.pkl              # Random Forest model
│   └── *_features.json                # Expected input vector configurations for strict alignment
└── training/
    └── train_model.py           # Master script for retraining and serializing models
```

## 7. How to Run Locally

**1. Start the Backend (FastAPI)**
```bash
# In the project root folder
.venv\Scripts\activate
uvicorn backend.main:app --reload --port 8000
```

**2. Start the Frontend (React/Vite)**
```bash
cd frontend
npm install
npm run dev
```

*Access the platform at: `http://localhost:5173`*
