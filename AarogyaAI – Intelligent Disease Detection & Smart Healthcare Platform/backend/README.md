# AarogyaAI – Backend API

FastAPI backend for the AarogyaAI – Intelligent Disease Detection & Smart Healthcare Platform.

## 🚀 Quick Start

```bash
# From project root
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API available at: **http://localhost:8000**
Interactive Docs: **http://localhost:8000/docs**

---

## 📋 Core Features

✅ **User Authentication** — JWT-based login/register/verify OTP  
✅ **Health Records** — Store clinical data & medical history  
✅ **AI Predictions** — Run 6 disease models with risk scoring  
✅ **PDF Reports** — Generate professional diagnosis reports  
✅ **File Management** — Upload & store lab reports/documents  
✅ **Doctor Network** — Directory of specialists with ratings  
✅ **Admin Dashboard** — System management & verification  

---

## 🔌 Main Endpoints

### Authentication
- `POST /auth/register` — Create new user account
- `POST /auth/login` — JWT login (returns access_token)
- `GET /auth/me` — Current user profile
- `PUT /auth/me` — Update profile
- `POST /auth/send-otp` — Send OTP for verification
- `POST /auth/verify-otp` — Verify OTP code

### Health Records
- `GET /records` — List user's health records
- `POST /records` — Add new health record
- `PUT /records/{id}` — Update record
- `DELETE /records/{id}` — Delete record

### AI Predictions
- `POST /predict/{module}` — Run diagnosis (blood_cell_cancer, heart_disease, lung_cancer, parkinsons, thyroid, diabetes)
- `GET /predictions` — List all predictions
- `GET /predictions/{id}` — Prediction details
- `GET /reports/{pred_id}` — Download PDF report

### File Management
- `POST /uploads` — Upload lab report/document
- `GET /uploads` — List uploads
- `DELETE /uploads/{id}` — Delete upload

### Doctor Network
- `GET /doctors` — List doctors (filter by specialty)
- `GET /doctors/{id}` — Doctor details
- `POST /doctor/register` — Doctor registration
- `POST /appointments` — Book appointment

### Admin
- `POST /admin/login` — Admin authentication
- `GET /admin/stats` — System statistics
- `GET /admin/users` — All users
- `GET /admin/predictions` — All predictions

---

## 🗂️ Project Structure

```
backend/
├── main.py                    ← FastAPI application & routes
├── requirements.txt           ← Python dependencies
├── database/
│   ├── db.py                  ← SQLAlchemy setup
│   ├── models.py              ← User, Record, Prediction schemas
│   ├── mongodb.py             ← MongoDB integration
│   └── __init__.py
├── report_generator.py        ← PDF generation (fpdf2)
└── __init__.py
```

---

## 🔐 Environment Variables

Create `.env` file in backend directory:

```env
# Database
DATABASE_URL=sqlite:///./aarogyaai_v2.db
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/aarogyaai_db

# JWT & Security
JWT_SECRET=aarogyaai-super-secret-change-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# Admin
ADMIN_EMAIL=admin@aarogyaai.com
ADMIN_PASSWORD=admin123

# Email (Optional)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

---

## 🏥 Disease Modules

| Module | Input | Model | Output |
|--------|-------|-------|--------|
| **Blood Cell Cancer** | Microscopy Image | EfficientNetB0 CNN | Benign / Malignant (3 types) |
| **Heart Disease** | 13 Clinical Features | XGBoost | Risk Score (0-1) |
| **Lung Cancer** | 15 Risk Factors | Gradient Boosting | Risk Score (0-1) |
| **Parkinson's** | 22 Voice Biomarkers | SVM | Presence Detection |
| **Thyroid** | 5 Lab Values | Random Forest | 3-class (Normal/Hypo/Hyper) |
| **Diabetes** | 8 Clinical Features | XGBoost | Risk Score (0-1) |

---

## 📊 Database Schema

### Users Table
- `id` (PK)
- `email` (unique)
- `password_hash` (bcrypt)
- `full_name`
- `role` (patient, doctor, admin)
- `created_at`

### Predictions Table
- `id` (PK)
- `user_id` (FK)
- `disease_module` (enum)
- `input_data` (JSON)
- `prediction_result` (JSON with scores & risk level)
- `confidence` (0-1)
- `report_path` (PDF file path)
- `created_at`

### Health Records Table
- `id` (PK)
- `user_id` (FK)
- `record_type` (lab_report, medical_history, etc)
- `data` (JSON)
- `created_at`

---

## 🧪 Testing

```bash
# Test registration
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"test1234"}'

# Test login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@example.com&password=test1234"

# Test prediction
curl -X POST http://localhost:8000/predict/heart_disease \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"age":45,"cholesterol":200,...}'
```

---

## 📦 Dependencies

Key packages:
- `fastapi` — Web framework
- `uvicorn` — ASGI server
- `sqlalchemy` — ORM
- `pydantic` — Data validation
- `tensorflow` — Deep learning
- `scikit-learn` — ML algorithms
- `xgboost` — Gradient boosting
- `fpdf2` — PDF generation
- `pymongo` — MongoDB driver
- `python-jose` — JWT handling

---

## ⚠️ Medical Disclaimer

This is an **educational tool** for research purposes only. AI predictions **must never** replace professional medical consultation. Always consult qualified healthcare providers.

Use the returned `access_token` to call protected routes:

```
curl -X GET http://localhost:8000/auth/me \
  -H "Authorization: Bearer <access_token>"
```

## Requirements
- Python 3.10+
- Install dependencies from the project root:
  ```
  pip install -r requirements.txt
  ```

## Notes
- Make sure the `models/` directory contains all trained model files.
- The backend is designed to work with the Streamlit frontend (`app.py`).
