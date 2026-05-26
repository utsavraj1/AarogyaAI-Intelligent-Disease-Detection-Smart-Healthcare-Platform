# 🧪 Manual Test Data — AarogyaAI Diagnosis System

Use these sample inputs to manually test each model in the Streamlit app (`streamlit run app.py`).  
Each model has **two test cases**: one expected **Positive / Abnormal** result and one expected **Negative / Normal** result.

---

## 🩸 Blood Cell Cancer (CNN — Image Upload)

> This module requires uploading a microscopy image. No numeric input.

| Test Case | What to Upload | Expected Result |
|-----------|---------------|-----------------|
| **Case 1 — Malignant** | Any image from `Dataset/Blood cell Cancer [ALL]/[Malignant] Pre-B/` | Pre-B ALL (Cancer Detected) |
| **Case 2 — Benign** | Any image from `Dataset/Blood cell Cancer [ALL]/Benign/` | Benign (No Cancer) |

> **Tip:** If you don't have the dataset, use any blood cell microscopy image found online.

---

## ❤️ Heart Disease Prediction

### ✅ Case 1 — Expected: **Heart Disease LIKELY** (High-Risk Patient)

| Field | Value |
|-------|-------|
| Age | `63` |
| Sex | `Male` |
| Chest Pain Type | `Asymptomatic (3)` |
| Resting BP (mmHg) | `145` |
| Cholesterol (mg/dl) | `233` |
| Fasting Blood Sugar > 120? | `Yes (1)` |
| Resting ECG | `LV Hypertrophy (2)` |
| Max Heart Rate | `150` |
| Exercise Induced Angina | `No (0)` |
| ST Depression (oldpeak) | `2.3` |
| Slope of ST | `Downsloping (2)` |
| Major Vessels (0–3) | `0` |
| Thalassemia | `Fixed Defect (2)` |

### ✅ Case 2 — Expected: **No Heart Disease** (Low-Risk Patient)

| Field | Value |
|-------|-------|
| Age | `41` |
| Sex | `Female` |
| Chest Pain Type | `Atypical Angina (1)` |
| Resting BP (mmHg) | `120` |
| Cholesterol (mg/dl) | `157` |
| Fasting Blood Sugar > 120? | `No (0)` |
| Resting ECG | `Normal (0)` |
| Max Heart Rate | `182` |
| Exercise Induced Angina | `No (0)` |
| ST Depression (oldpeak) | `0.0` |
| Slope of ST | `Upsloping (0)` |
| Major Vessels (0–3) | `0` |
| Thalassemia | `Normal (1)` |

---

## 🫁 Lung Cancer Prediction

### ✅ Case 1 — Expected: **High Lung Cancer Risk**

| Field | Value |
|-------|-------|
| Gender | `Male` |
| Age | `68` |
| Smoking | `Yes` |
| Yellow Fingers | `Yes` |
| Anxiety | `Yes` |
| Peer Pressure | `No` |
| Chronic Disease | `Yes` |
| Fatigue | `Yes` |
| Allergy | `No` |
| Wheezing | `Yes` |
| Alcohol Consuming | `Yes` |
| Coughing | `Yes` |
| Shortness of Breath | `Yes` |
| Swallowing Difficulty | `Yes` |
| Chest Pain | `Yes` |

### ✅ Case 2 — Expected: **Low Lung Cancer Risk**

| Field | Value |
|-------|-------|
| Gender | `Female` |
| Age | `30` |
| Smoking | `No` |
| Yellow Fingers | `No` |
| Anxiety | `No` |
| Peer Pressure | `No` |
| Chronic Disease | `No` |
| Fatigue | `No` |
| Allergy | `No` |
| Wheezing | `No` |
| Alcohol Consuming | `No` |
| Coughing | `No` |
| Shortness of Breath | `No` |
| Swallowing Difficulty | `No` |
| Chest Pain | `No` |

---

## 🧠 Parkinson's Disease Detection (Voice Biomarkers)

### ✅ Case 1 — Expected: **Parkinson's Disease LIKELY**

| Feature | Value |
|---------|-------|
| MDVP:Fo (Hz) | `119.992` |
| MDVP:Fhi (Hz) | `157.302` |
| MDVP:Flo (Hz) | `74.997` |
| MDVP:Jitter(%) | `0.00784` |
| MDVP:Jitter(Abs) | `0.0000700` |
| MDVP:RAP | `0.00370` |
| MDVP:PPQ | `0.00554` |
| Jitter:DDP | `0.01109` |
| MDVP:Shimmer | `0.04374` |
| MDVP:Shimmer(dB) | `0.426` |
| Shimmer:APQ3 | `0.02182` |
| Shimmer:APQ5 | `0.03130` |
| MDVP:APQ | `0.02971` |
| Shimmer:DDA | `0.06545` |
| NHR | `0.02211` |
| HNR | `21.033` |
| RPDE | `0.41888` |
| DFA | `0.54842` |
| spread1 | `-4.81320` |
| spread2 | `0.19597` |
| D2 | `2.30100` |
| PPE | `0.25017` |

### ✅ Case 2 — Expected: **No Parkinson's Detected** (Healthy Voice)

| Feature | Value |
|---------|-------|
| MDVP:Fo (Hz) | `197.076` |
| MDVP:Fhi (Hz) | `206.896` |
| MDVP:Flo (Hz) | `192.055` |
| MDVP:Jitter(%) | `0.00289` |
| MDVP:Jitter(Abs) | `0.0000150` |
| MDVP:RAP | `0.00166` |
| MDVP:PPQ | `0.00168` |
| Jitter:DDP | `0.00498` |
| MDVP:Shimmer | `0.01098` |
| MDVP:Shimmer(dB) | `0.097` |
| Shimmer:APQ3 | `0.00563` |
| Shimmer:APQ5 | `0.00680` |
| MDVP:APQ | `0.00802` |
| Shimmer:DDA | `0.01689` |
| NHR | `0.00339` |
| HNR | `26.775` |
| RPDE | `0.42229` |
| DFA | `0.74179` |
| spread1 | `-7.34889` |
| spread2 | `0.17026` |
| D2 | `1.74356` |
| PPE | `0.08590` |

---

## 🦋 Thyroid Disorder Classification

### ✅ Case 1 — Expected: **Hypothyroid**

| Field | Value |
|-------|-------|
| Age | `52` |
| Sex | `Female (F)` |
| On Thyroxine | `No` |
| TSH Level | `75.00` |
| T3 Level | `0.60` |
| TT4 Level | `50.0` |
| T4U Level | `0.85` |
| FTI | `58.0` |
| Goitre | `Yes` |
| Tumor | `No` |
| Hypopituitary | `No` |
| Psychological Symptoms | `Yes` |

### ✅ Case 2 — Expected: **Normal** (Healthy Thyroid)

| Field | Value |
|-------|-------|
| Age | `35` |
| Sex | `Male (M)` |
| On Thyroxine | `No` |
| TSH Level | `1.30` |
| T3 Level | `2.50` |
| TT4 Level | `107.0` |
| T4U Level | `1.02` |
| FTI | `105.0` |
| Goitre | `No` |
| Tumor | `No` |
| Hypopituitary | `No` |
| Psychological Symptoms | `No` |

### ✅ Case 3 — Expected: **Hyperthyroid**

| Field | Value |
|-------|-------|
| Age | `28` |
| Sex | `Female (F)` |
| On Thyroxine | `No` |
| TSH Level | `0.01` |
| T3 Level | `9.00` |
| TT4 Level | `220.0` |
| T4U Level | `1.40` |
| FTI | `160.0` |
| Goitre | `Yes` |
| Tumor | `No` |
| Hypopituitary | `No` |
| Psychological Symptoms | `Yes` |

---

## 📊 Diabetes Prediction (Pima Indians Dataset)

### ✅ Case 1 — Expected: **Diabetic**

| Field | Value |
|-------|-------|
| Pregnancies | `8` |
| Glucose (mg/dL) | `183` |
| Blood Pressure (mmHg) | `64` |
| Skin Thickness (mm) | `0` |
| Insulin (μU/mL) | `0` |
| BMI | `23.3` |
| Diabetes Pedigree Function | `0.672` |
| Age | `32` |

### ✅ Case 2 — Expected: **Non-Diabetic**

| Field | Value |
|-------|-------|
| Pregnancies | `1` |
| Glucose (mg/dL) | `89` |
| Blood Pressure (mmHg) | `66` |
| Skin Thickness (mm) | `23` |
| Insulin (μU/mL) | `94` |
| BMI | `28.1` |
| Diabetes Pedigree Function | `0.167` |
| Age | `21` |

---

## 📝 Notes

- **Blood Cell Cancer** uses image upload — numeric inputs are not applicable.
- All values above are sourced from real dataset rows (UCI, Pima, Oxford Parkinson's).
- Actual model prediction may vary slightly depending on training run and random seed.
- If a model is missing, run: `python train_model.py --disease <name>` (e.g., `heart`, `lung`, `diabetes`, `parkinsons`, `thyroid`, `blood_cell`).
- For Parkinson's, you can also run `python train_model.py --disease parkinsons` to train the SVM model.
