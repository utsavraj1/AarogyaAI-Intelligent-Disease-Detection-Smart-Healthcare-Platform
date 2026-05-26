"""
backend/main.py
===============
AarogyaAI FastAPI backend — Production REST API

Endpoints:
  POST /auth/register       — create account
  POST /auth/login          — JWT login
  GET  /auth/me             — current user profile
  PUT  /auth/me             — update profile

  GET  /records             — list user's health records
  POST /records             — add health record
  PUT  /records/{id}        — update record
  DELETE /records/{id}      — delete record

  POST /predict/{module}    — run AI model, save result
  GET  /predictions         — list user's predictions
  GET  /predictions/{id}    — single prediction detail

  POST /uploads             — upload lab report / document
  GET  /uploads             — list user's uploads
  DELETE /uploads/{id}      — delete upload

  GET  /reports/{pred_id}   — download generated PDF report

  GET  /doctors             — list doctors (filter by specialty)
  GET  /doctors/{id}        — single doctor detail

Run:
  uvicorn backend.main:app --reload --port 8000
"""

import base64
import json
import os
import smtplib
import time
import uuid
from datetime import datetime, timedelta
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from io import BytesIO
from pathlib import Path
from typing import Optional, cast
from dotenv import load_dotenv

import sys
# Resolve paths
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(BACKEND_DIR)

# Load .env file with absolute path
load_dotenv(os.path.join(BACKEND_DIR, ".env"))

# Add both to sys.path for absolute and relative import support
if ROOT_DIR not in sys.path: sys.path.insert(0, ROOT_DIR)
if BACKEND_DIR not in sys.path: sys.path.insert(0, BACKEND_DIR)

import bcrypt
import numpy as np
import pickle
from PIL import Image
try:
    import tensorflow as tf
    try:
        from tensorflow import keras
    except ImportError:
        import keras
    HAS_TF = True
except Exception as e:
    import traceback
    with open("tf_error.txt", "w") as f:
        f.write(f"Failed to import tensorflow: {e}\n")
        f.write(traceback.format_exc())
    print(f"Failed to import tensorflow: {e}")
    HAS_TF = False
from fastapi import (
    Depends, FastAPI, File, Form, HTTPException,
    Query, UploadFile, status,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

# Now we can import database safely
from database.db import get_db, init_db
from database.models import (
    Doctor, DiseaseModule, MedicalRecord,
    Prediction, RiskLevel, Specialty, UploadedReport, User,
    VerificationStatus, OTPVerification, VerificationLog
)

# ── Config ────────────────────────────────────────────────────────────────────
SECRET_KEY      = os.getenv("JWT_SECRET", "aarogyaai-super-secret-change-in-production")
ALGORITHM       = "HS256"
TOKEN_EXPIRE_H  = 24
ADMIN_EMAIL     = os.getenv("ADMIN_EMAIL", "admin@aarogya.ai")
ADMIN_PASSWORD  = os.getenv("ADMIN_PASSWORD", "admin123")

EMAIL_USER      = os.getenv("EMAIL_USER")
EMAIL_PASS      = os.getenv("EMAIL_PASS")

BASE_DIR         = Path(__file__).resolve().parents[1]
MODEL_DIR        = BASE_DIR / "models"
UPLOADS_DIR      = BASE_DIR / "uploaded_reports"
REPORTS_DIR      = BASE_DIR / "reports_output"
UPLOADS_DIR.mkdir(exist_ok=True)
REPORTS_DIR.mkdir(exist_ok=True)

ALLOWED_UPLOAD_TYPES = {
    "application/pdf", "image/jpeg", "image/png",
    "image/jpg", "application/octet-stream",
}
MAX_UPLOAD_MB = 10

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

app = FastAPI(
    title="AarogyaAI API",
    description="Intelligent Disease Detection & Smart Healthcare Platform — REST API",
    version="2.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://127.0.0.1:5173", 
        "http://localhost:3000", 
        "http://127.0.0.1:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.staticfiles import StaticFiles
app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")


# ── Startup ───────────────────────────────────────────────────────────────────

@app.on_event("startup")
async def startup():
    init_db()
    test_email_config()
    print("[AarogyaAI API] Ready")

@app.on_event("shutdown")
async def shutdown():
    pass


# ═══════════════════════════════════════════════════════════════════════════════
#  AUTH HELPERS
# ═══════════════════════════════════════════════════════════════════════════════

def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt()).decode()


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())


def send_email(subject: str, body: str, to_email: str):
    """Helper to send emails via Gmail SMTP."""
    if not EMAIL_USER or not EMAIL_PASS:
        print(f"[Email Skip] No credentials. Would have sent '{subject}' to {to_email}")
        return False
    
    try:
        print(f"[Email] Attempting to send '{subject}' to {to_email}...")
        msg = MIMEMultipart()
        msg['From'] = f"AarogyaAI Support <{EMAIL_USER}>"
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))

        # Using a timeout to prevent hanging
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=10) as server:
            server.login(EMAIL_USER, EMAIL_PASS)
            server.send_message(msg)
        
        print(f"[Email Success] Sent to {to_email}")
        return True
    except Exception as e:
        print(f"[Email Error] Failed to send to {to_email}: {e}")
        return False
        
def test_email_config():
    """Diagnostic tool to verify email setup on startup."""
    if not EMAIL_USER or not EMAIL_PASS:
        print("[Email Diagnostic] WARNING: EMAIL_USER or EMAIL_PASS missing in .env")
    else:
        print(f"[Email Diagnostic] Configured with user: {EMAIL_USER}")


def create_token(user_id: int) -> str:
    payload = {
        "sub": str(user_id),
        "exp": datetime.utcnow() + timedelta(hours=TOKEN_EXPIRE_H),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    cred_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub", 0))
    except (JWTError, ValueError):
        raise cred_exc
    user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
    if not user:
        raise cred_exc
    return user


def get_current_doctor(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> Doctor:
    cred_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub", 0))
    except (JWTError, ValueError):
        raise cred_exc
    
    # We use the same token system, but check the doctors table
    doc = db.query(Doctor).filter(Doctor.id == user_id).first()
    if not doc:
        # Check if it's a regular user with role doctor (unlikely but possible if shared table)
        user = db.query(User).filter(User.id == user_id, User.role == "doctor").first()
        if not user:
            raise cred_exc
        # Convert user to a doctor-like object or handle accordingly
        raise HTTPException(403, "Not authorized as a doctor")
        
    return doc


# ═══════════════════════════════════════════════════════════════════════════════
#  PYDANTIC SCHEMAS
# ═══════════════════════════════════════════════════════════════════════════════

class RegisterIn(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    age: Optional[int] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[str] = "patient"


class LoginOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    full_name: str
    email: str
    role: str


class UserOut(BaseModel):
    id: int
    full_name: str
    email: str
    age: Optional[int]
    gender: Optional[str]
    blood_group: Optional[str]
    phone: Optional[str]
    role: str
    created_at: datetime

    class Config:
        from_attributes = True


class AdminLoginIn(BaseModel):
    email: EmailStr
    password: str


class RecordIn(BaseModel):
    title: str
    notes: Optional[str] = None
    weight_kg: Optional[float] = None
    height_cm: Optional[float] = None
    bmi: Optional[float] = None
    bp_systolic: Optional[int] = None
    bp_diastolic: Optional[int] = None
    glucose: Optional[float] = None
    cholesterol: Optional[float] = None
    heart_rate: Optional[int] = None
    temperature: Optional[float] = None


class RecordOut(RecordIn):
    id: int
    user_id: int
    recorded_at: datetime

    class Config:
        from_attributes = True


class PredictIn(BaseModel):
    features: dict          # raw input values keyed by feature name
    image_b64: Optional[str] = None  # base64 image for blood cell module


class PredictionOut(BaseModel):
    id: int
    disease_module: str
    result_label: str
    confidence: float
    risk_level: str
    probabilities: Optional[dict]
    inference_ms: Optional[float]
    report_path: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class UploadOut(BaseModel):
    id: int
    filename: str
    file_size_kb: Optional[float]
    description: Optional[str]
    category: Optional[str]
    uploaded_at: datetime

    class Config:
        from_attributes = True


class DoctorOut(BaseModel):
    id: int
    name: Optional[str] = None
    full_name: Optional[str] = None
    specialty: str
    qualification: Optional[str] = None
    hospital: Optional[str] = None
    city: Optional[str] = None
    experience_yrs: Optional[int] = None
    rating: Optional[float] = None
    phone: Optional[str] = None
    available_days: Optional[str] = None
    fee_inr: Optional[int] = None
    profile_photo_url: Optional[str] = None

    class Config:
        from_attributes = True


class AppointmentIn(BaseModel):
    doctor_id: int
    date: str
    time: str
    type: str = "In-Person"
    notes: Optional[str] = None


class AppointmentOut(BaseModel):
    id: int
    user_id: int
    doctor_id: int
    date: str
    time: str
    type: str
    status: str
    notes: Optional[str] = None
    created_at: datetime
    
    doctor_name: Optional[str] = None
    user_name: Optional[str] = None

    class Config:
        from_attributes = True


class DoctorRegisterIn(BaseModel):
    full_name: str
    email: EmailStr
    mobile: str
    password: str
    registration_number: str
    medical_council: str
    qualification: str
    specialty: str
    experience_yrs: int
    hospital: str

class SendOTPIn(BaseModel):
    email: Optional[EmailStr] = None
    mobile: Optional[str] = None

class VerifyOTPIn(BaseModel):
    email: Optional[EmailStr] = None
    mobile: Optional[str] = None
    otp_code: str

class GoogleAuthIn(BaseModel):
    token: str
    email: EmailStr
    full_name: str
    image_url: Optional[str] = None

class RejectDoctorIn(BaseModel):
    rejection_reason: str

class DoctorVerificationOut(BaseModel):
    id: int
    full_name: str
    email: Optional[str] = None
    mobile: Optional[str] = None
    registration_number: Optional[str] = None
    medical_council: Optional[str] = None
    qualification: Optional[str] = None
    specialty: str
    experience_yrs: Optional[int] = None
    hospital: Optional[str] = None
    verification_status: str
    rejection_reason: Optional[str] = None
    degree_certificate_url: Optional[str] = None
    medical_license_url: Optional[str] = None
    govt_id_url: Optional[str] = None
    profile_photo_url: Optional[str] = None

    class Config:
        from_attributes = True


# ═══════════════════════════════════════════════════════════════════════════════
#  AUTH ROUTES
# ═══════════════════════════════════════════════════════════════════════════════

@app.post("/auth/register", response_model=LoginOut, status_code=201, tags=["Auth"])
def register(data: RegisterIn, db: Session = Depends(get_db)):
    print(f"[AarogyaAI] Register Attempt: {data.email}")
    if db.query(User).filter(User.email == data.email).first():
        print(f"[AarogyaAI] Registration Failed: Email {data.email} already exists.")
        raise HTTPException(400, "Email already registered")
    
    try:
        user = User(
            full_name=data.full_name,
            email=data.email,
            password_hash=hash_password(data.password),
            age=data.age, gender=data.gender,
            blood_group=data.blood_group, phone=data.phone,
            role=data.role,
        )
        db.add(user); db.commit(); db.refresh(user)
        print(f"[AarogyaAI] Registration Success: ID {user.id}")
        return LoginOut(
            access_token=create_token(int(cast(int, user.id))),
            user_id=int(cast(int, user.id)), full_name=cast(str, user.full_name), 
            email=cast(str, user.email), role=cast(str, user.role),
        )
    except Exception as e:
        db.rollback()
        print(f"[AarogyaAI] Database Error during registration: {e}")
        raise HTTPException(500, f"Database failure: {e}")


@app.post("/auth/google-verify", response_model=LoginOut, tags=["Auth"])
def google_verify(data: GoogleAuthIn, db: Session = Depends(get_db)):
    # In a production environment, you would verify the 'token' using google-auth library
    # Here we simulate a successful verification for the Ayurvedic AI experience
    user = db.query(User).filter(User.email == data.email).first()
    
    if not user:
        # Auto-register Google users as patients
        user = User(
            full_name=data.full_name,
            email=data.email,
            password_hash=hash_password("GOOGLE_AUTH_STUB"), # No password for Google users
            role="patient"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    user_id = int(cast(int, user.id))
    return LoginOut(
        access_token=create_token(user_id),
        user_id=user_id, 
        full_name=user.full_name, 
        email=user.email, 
        role=user.role or "patient",
    )


@app.post("/auth/login", response_model=LoginOut, tags=["Auth"])
def login(
    form: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == form.username).first()
    if user and verify_password(form.password, cast(str, user.password_hash)):
        user.last_login = datetime.utcnow()  # type: ignore[assignment]
        db.commit()
        return LoginOut(
            access_token=create_token(int(cast(int, user.id))),
            user_id=int(cast(int, user.id)), 
            full_name=cast(str, user.full_name), 
            email=cast(str, user.email), 
            role=cast(str, user.role),
        )

    # Check if doctor
    doc = db.query(Doctor).filter(Doctor.email == form.username).first()
    if doc and doc.password_hash and verify_password(form.password, doc.password_hash):
        if doc.verification_status != VerificationStatus.VERIFIED:
            raise HTTPException(403, f"Account restricted. Verification Status: {doc.verification_status.value}")
            
        return LoginOut(
            access_token=create_token(doc.id),
            user_id=doc.id, 
            full_name=doc.full_name or doc.name, 
            email=doc.email, 
            role="doctor",
        )

    raise HTTPException(401, "Invalid email or password")


@app.post("/admin/login", response_model=LoginOut, tags=["Auth"])
def admin_login(data: AdminLoginIn):
    if data.email == ADMIN_EMAIL and data.password == ADMIN_PASSWORD:
        return LoginOut(
            access_token=create_token(0), # 0 id for super admin
            user_id=0,
            full_name="AarogyaAI Admin",
            email=ADMIN_EMAIL,
            role="admin"
        )
    raise HTTPException(401, "Invalid admin credentials")


@app.get("/auth/me", response_model=UserOut, tags=["Auth"])
def me(current: User = Depends(get_current_user)):
    return current

@app.post("/auth/send-otp", tags=["Auth"])
def send_otp_auth(data: SendOTPIn, db: Session = Depends(get_db)):
    if not data.email:
        raise HTTPException(400, "Provide email")
        
    import random
    otp_code = str(random.randint(100000, 999999))
    expires = datetime.utcnow() + timedelta(minutes=10)
    
    otp = OTPVerification(
        email=data.email,
        otp_code=otp_code,
        expires_at=expires
    )
    db.add(otp)
    db.commit()

    subject = "AarogyaAI Verification OTP"
    body = f"Hello,\n\nYour AarogyaAI verification code is: {otp_code}\n\nThis code expires in 10 minutes."
    email_sent = send_email(subject, body, data.email)

    return {
        "message": "OTP sent successfully" if email_sent else "OTP generated (Email delivery bypassed/failed)", 
        "otp": otp_code, 
        "email_status": "sent" if email_sent else "failed"
    }

@app.post("/auth/verify-otp", tags=["Auth"])
def verify_otp_auth(data: VerifyOTPIn, db: Session = Depends(get_db)):
    if not data.email or not data.otp_code:
        raise HTTPException(400, "Provide email and OTP code")

    otp = db.query(OTPVerification).filter(
        OTPVerification.email == data.email,
        OTPVerification.otp_code == data.otp_code,
        OTPVerification.is_verified == False
    ).order_by(OTPVerification.created_at.desc()).first()
    
    if not otp:
        raise HTTPException(400, "Invalid or already used OTP")
    if otp.expires_at < datetime.utcnow():
        raise HTTPException(400, "OTP expired")
        
    otp.is_verified = True
    db.commit()
    return {"message": "OTP verified successfully"}


@app.put("/auth/me", response_model=UserOut, tags=["Auth"])
def update_profile(
    data: RegisterIn,
    current: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    current.full_name  = data.full_name  # type: ignore[assignment]
    current.age        = data.age  # type: ignore[assignment]
    current.gender     = data.gender  # type: ignore[assignment]
    current.blood_group= data.blood_group  # type: ignore[assignment]
    current.phone      = data.phone  # type: ignore[assignment]
    if data.password:
        current.password_hash = hash_password(data.password)  # type: ignore[assignment]
    db.commit(); db.refresh(current)
    return current


# ═══════════════════════════════════════════════════════════════════════════════
#  HEALTH RECORDS
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/records", response_model=list[RecordOut], tags=["Records"])
def list_records(
    current: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return db.query(MedicalRecord).filter(MedicalRecord.user_id == current.id).all()


@app.post("/records", response_model=RecordOut, status_code=201, tags=["Records"])
def add_record(
    data: RecordIn,
    current: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # auto-compute BMI if height + weight given
    bmi = data.bmi
    if data.weight_kg and data.height_cm and not bmi:
        h = data.height_cm / 100
        bmi = round(data.weight_kg / (h * h), 1)
    rec = MedicalRecord(**data.dict(), bmi=bmi, user_id=current.id)
    db.add(rec); db.commit(); db.refresh(rec)
    return rec


@app.put("/records/{record_id}", response_model=RecordOut, tags=["Records"])
def update_record(
    record_id: int, data: RecordIn,
    current: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    rec = db.query(MedicalRecord).filter(
        MedicalRecord.id == record_id, MedicalRecord.user_id == current.id
    ).first()
    if not rec:
        raise HTTPException(404, "Record not found")
    for k, v in data.dict(exclude_unset=True).items():
        setattr(rec, k, v)
    db.commit(); db.refresh(rec)
    return rec


@app.delete("/records/{record_id}", status_code=204, tags=["Records"])
def delete_record(
    record_id: int,
    current: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    rec = db.query(MedicalRecord).filter(
        MedicalRecord.id == record_id, MedicalRecord.user_id == current.id
    ).first()
    if not rec:
        raise HTTPException(404, "Record not found")
    db.delete(rec); db.commit()


# ═══════════════════════════════════════════════════════════════════════════════
#  AI PREDICTIONS
# ═══════════════════════════════════════════════════════════════════════════════

def _load_pkl(name: str):
    p = MODEL_DIR / name
    if not p.exists():
        return None
    with open(p, "rb") as f:
        return pickle.load(f)


BLOOD_MODEL = None
BLOOD_LABELS = None


def _coerce_blood_model(model):
    """Replace Lambda preprocessing layers with Rescaling layers.
    Falls back to the original model if cloning fails (Keras 3.x compat)."""
    if not any(isinstance(layer, tf.keras.layers.Lambda) for layer in model.layers):
        return model

    def clone_layer(layer):
        if isinstance(layer, keras.layers.Lambda):
            return keras.layers.Rescaling(1.0 / 127.5, offset=-1.0, name=layer.name)
        return layer.__class__.from_config(layer.get_config())

    try:
        cloned = keras.models.clone_model(model, clone_function=clone_layer)
        cloned.set_weights(model.get_weights())
        print("[Blood] Lambda layers replaced with Rescaling layers.")
        return cloned
    except Exception as exc:
        # clone_model can fail on Keras 3.x due to mask kwarg incompatibilities.
        # The model loaded with PreprocessLambda already works correctly for
        # inference, so we just keep it as-is.
        print(f"[Blood] clone_model skipped ({exc}); using model as loaded.")
        return model


def _load_blood_assets():
    global BLOOD_MODEL, BLOOD_LABELS
    if not HAS_TF:
        raise HTTPException(503, "TensorFlow not installed. Cannot load blood cell model.")

    if BLOOD_MODEL is None:
        # Enable global unsafe flag for Lambda deserialization
        try:
            keras.config.enable_unsafe_deserialization()
        except AttributeError:
            pass

        # The model's Lambda layer has no `output_shape` arg, so Keras raises
        # NotImplementedError from compute_output_shape during deserialization.
        # We inject a custom subclass that always returns input_shape (correct
        # for any element-wise preprocessing Lambda like x/127.5 - 1).
        class PreprocessLambda(keras.layers.Lambda):
            """Replaces the model's deserialized Lambda preprocessing layer.
            The original Lambda's function deserializes as a string (uncallable).
            We override call() to directly apply EfficientNet preprocessing."""
            def call(self, inputs, mask=None, training=False):
                # EfficientNet's preprocess_input scales [0, 255] → model's expected range.
                # This matches what the original Lambda(lambda img: preprocess_input(img)) did.
                from tensorflow.keras.applications.efficientnet import preprocess_input as eff_preprocess
                return eff_preprocess(tf.cast(inputs, tf.float32))

            def compute_output_shape(self, input_shape):
                return input_shape

        custom_objs = {"Lambda": PreprocessLambda}

        candidates = [
            MODEL_DIR / "blood_cell_cancer_model.keras",
            MODEL_DIR / "blood_cell_cancer_model.h5",
        ]
        # Each candidate is tried with multiple kwarg combos for Keras-version compat
        kwarg_variants = [
            {"safe_mode": False, "compile": False, "custom_objects": custom_objs},
            {"compile": False, "custom_objects": custom_objs},
            {"safe_mode": False, "compile": False},
            {"compile": False},
        ]
        last_error: Exception | None = None
        for model_path in candidates:
            if not model_path.exists():
                continue
            for load_kwargs in kwarg_variants:
                try:
                    BLOOD_MODEL = keras.models.load_model(model_path, **load_kwargs)
                    print(f"[Blood] Loaded {model_path.name} OK")
                    break
                except TypeError:
                    BLOOD_MODEL = None
                    continue          # kwarg not supported — try next variant
                except Exception as exc:
                    print(f"[Blood] {model_path.name} failed: {exc}")
                    last_error = exc
                    BLOOD_MODEL = None
                    break             # genuine load error — try next file
            if BLOOD_MODEL is not None:
                break

        if BLOOD_MODEL is None:
            raise HTTPException(
                503,
                f"Blood cell model failed to load: {last_error}"
                if last_error else
                "Blood cell model files not found. Train the model first.",
            )

        BLOOD_MODEL = _coerce_blood_model(BLOOD_MODEL)


    if BLOOD_LABELS is None:
        meta_path = MODEL_DIR / "blood_cell_classes.json"
        if not meta_path.exists():
            raise HTTPException(503, "Blood cell class metadata not found. Train it first.")
        with open(meta_path, "r") as f:
            meta = json.load(f)
        if isinstance(meta.get("display"), list):
            BLOOD_LABELS = meta["display"]
        elif isinstance(meta.get("index_map"), dict):
            idx_map = meta["index_map"]
            BLOOD_LABELS = [idx_map[str(i)] for i in range(len(idx_map))]
        else:
            raise HTTPException(503, "Blood cell class metadata is invalid.")

    return BLOOD_MODEL, BLOOD_LABELS


def _risk_from_confidence(is_positive: bool, confidence: float) -> RiskLevel:
    if not is_positive:
        return RiskLevel.LOW
    if confidence >= 80:
        return RiskLevel.HIGH
    return RiskLevel.MODERATE


MODULE_CONFIGS = {
    "blood_cell": {
        "model_file": "blood_cell_cancer_model.keras",
        "labels": [],
        "feature_order": [],
    },
    "heart_disease": {
        "model_file": "heart_disease_model.pkl",
        "labels": ["No Heart Disease", "Heart Disease Likely"],
        "feature_order": [
            "age","sex","cp","trestbps","chol","fbs",
            "restecg","thalach","exang","oldpeak","slope","ca","thal"
        ],
    },
    "lung_cancer": {
        "model_file": "lung_cancer_model.pkl",
        "labels": ["Low Risk", "High Risk"],
        "feature_order": [
            "gender","age","smoking","yellow_fingers","anxiety","peer_pressure",
            "chronic_disease","fatigue","allergy","wheezing",
            "alcohol_consuming","coughing","shortness_of_breath",
            "swallowing_difficulty","chest_pain"
        ],
    },
    "parkinsons": {
        "model_file": "parkinsons_model.pkl",
        "labels": ["Healthy", "Parkinson's Likely"],
        # Feature order is loaded dynamically from the saved JSON to always
        # match the actual trained model (dataset may have had more columns).
        "feature_order": json.load(open(MODEL_DIR / "parkinsons_features.json"))["features"]
        if (MODEL_DIR / "parkinsons_features.json").exists() else [
            "MDVP:Fo(Hz)","MDVP:Fhi(Hz)","MDVP:Flo(Hz)","MDVP:Jitter(%)","MDVP:Jitter(Abs)",
            "MDVP:RAP","MDVP:PPQ","Jitter:DDP","MDVP:Shimmer","MDVP:Shimmer(dB)",
            "Shimmer:APQ3","Shimmer:APQ5","MDVP:APQ","Shimmer:DDA","NHR","HNR",
            "RPDE","DFA","spread1","spread2","D2","PPE"
        ],
    },
    "thyroid": {
        "model_file": "thyroid_model.pkl",
        "labels": ["Normal", "Hypothyroid", "Hyperthyroid"],
        # Feature order loaded from JSON to always match the trained model
        "feature_order": json.load(open(MODEL_DIR / "thyroid_features.json"))["features"]
        if (MODEL_DIR / "thyroid_features.json").exists() else [
            "age","sex","on thyroxine","query on thyroxine","on antithyroid medication",
            "sick","pregnant","thyroid surgery","I131 treatment",
            "query hypothyroid","query hyperthyroid","lithium",
            "goitre","tumor","hypopituitary","psych",
            "TSH measured","TSH","T3 measured","TT4 measured","TT4",
            "T4U measured","T4U","FTI measured","FTI"
        ],
    },
    "diabetes": {
        "model_file": "diabetes_model.pkl",
        "labels": ["Non-Diabetic", "Diabetic"],
        "feature_order": [
            "Pregnancies","Glucose","BloodPressure","SkinThickness",
            "Insulin","BMI","DiabetesPedigreeFunction","Age"
        ],
    },
}


@app.post("/predict/{module}", response_model=PredictionOut, tags=["Predictions"])
def predict(
    module: str,
    data: PredictIn,
    current: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if module == "blood_cell":
        if not data.image_b64:
            raise HTTPException(422, "image_b64 is required for blood cell prediction.")
        model, labels = _load_blood_assets()

        try:
            image_bytes = base64.b64decode(data.image_b64)
            image = Image.open(BytesIO(image_bytes)).convert("RGB")
        except Exception:
            raise HTTPException(422, "Invalid image data. Upload a valid JPG/PNG file.")

        image = image.resize((224, 224))
        arr = np.expand_dims(np.array(image, dtype=np.float32), axis=0)

        t0 = time.time()
        proba = model.predict(arr)[0].tolist()
        ms = (time.time() - t0) * 1000

        pred = int(np.argmax(proba))
        label = labels[pred]
        conf = round(float(proba[pred]) * 100, 2)
        is_pos = label.lower() != "benign"
        risk = _risk_from_confidence(is_pos, conf)
        proba_dict = {labels[i]: round(float(p) * 100, 2) for i, p in enumerate(proba)}

        pred_row = Prediction(
            user_id=current.id,
            disease_module=DiseaseModule.BLOOD_CELL,
            result_label=label,
            confidence=conf,
            risk_level=risk,
            input_features=json.dumps({"image": "uploaded"}),
            probabilities=json.dumps(proba_dict),
            inference_ms=round(ms, 1),
        )
        db.add(pred_row); db.commit(); db.refresh(pred_row)

        if risk == RiskLevel.HIGH:
            try:
                from backend.report_generator import generate_pdf_report
                pdf_path = generate_pdf_report(pred_row, current, {"image": "uploaded"})
                pred_row.report_path = str(pdf_path)  # type: ignore[assignment]
                db.commit()
            except Exception as e:
                print(f"[Report] PDF generation failed: {e}")

        return PredictionOut(
            id=int(cast(int, pred_row.id)),
            disease_module=pred_row.disease_module.value,
            result_label=cast(str, pred_row.result_label),
            confidence=float(cast(float, pred_row.confidence)),
            risk_level=pred_row.risk_level.value,
            probabilities=proba_dict,
            inference_ms=cast(Optional[float], pred_row.inference_ms),
            report_path=cast(Optional[str], pred_row.report_path),
            created_at=cast(datetime, pred_row.created_at),
        )

    if module not in MODULE_CONFIGS:
        raise HTTPException(400, f"Unknown module '{module}'. "
                            f"Valid: {list(MODULE_CONFIGS.keys())}")

    cfg = MODULE_CONFIGS[module]
    mdl = _load_pkl(cfg["model_file"])
    if mdl is None:
        raise HTTPException(503, f"Model '{cfg['model_file']}' not loaded. Train first.")

    # Build feature vector
    try:
        feats = np.array([[data.features[k] for k in cfg["feature_order"]]])
    except KeyError as e:
        raise HTTPException(422, f"Missing feature: {e}")

    t0    = time.time()
    pred  = int(mdl.predict(feats)[0])
    proba = mdl.predict_proba(feats)[0].tolist()
    ms    = (time.time() - t0) * 1000

    label      = cfg["labels"][pred]
    conf       = round(proba[pred] * 100, 2)
    risk       = _risk_from_confidence(pred > 0, conf)
    proba_dict = {cfg["labels"][i]: round(proba[i] * 100, 2) for i in range(len(proba))}

    # Map module string → DiseaseModule enum
    module_enum_map = {
        "blood_cell":    DiseaseModule.BLOOD_CELL,
        "heart_disease": DiseaseModule.HEART,
        "lung_cancer":   DiseaseModule.LUNG,
        "parkinsons":    DiseaseModule.PARKINSONS,
        "thyroid":       DiseaseModule.THYROID,
        "diabetes":      DiseaseModule.DIABETES,
    }

    pred_row = Prediction(
        user_id        = current.id,
        disease_module = module_enum_map[module],
        result_label   = label,
        confidence     = conf,
        risk_level     = risk,
        input_features = json.dumps(data.features),
        probabilities  = json.dumps(proba_dict),
        inference_ms   = round(ms, 1),
    )
    db.add(pred_row); db.commit(); db.refresh(pred_row)

    # Auto-generate PDF report for high-risk results
    if risk == RiskLevel.HIGH:
        try:
            from backend.report_generator import generate_pdf_report
            pdf_path = generate_pdf_report(pred_row, current, data.features)
            pred_row.report_path = str(pdf_path)  # type: ignore[assignment]
            db.commit()
        except Exception as e:
            print(f"[Report] PDF generation failed: {e}")

    return PredictionOut(
        id=int(cast(int, pred_row.id)),
        disease_module=pred_row.disease_module.value,
        result_label=cast(str, pred_row.result_label),
        confidence=float(cast(float, pred_row.confidence)),
        risk_level=pred_row.risk_level.value,
        probabilities=proba_dict,
        inference_ms=cast(Optional[float], pred_row.inference_ms),
        report_path=cast(Optional[str], pred_row.report_path),
        created_at=cast(datetime, pred_row.created_at),
    )


@app.get("/predictions", response_model=list[PredictionOut], tags=["Predictions"])
def list_predictions(
    current: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = Query(50, ge=1, le=200),
):
    rows = (
        db.query(Prediction)
        .filter(Prediction.user_id == current.id)
        .order_by(Prediction.created_at.desc())
        .limit(limit)
        .all()
    )
    result = []
    for r in rows:
        result.append(PredictionOut(
            id=int(cast(int, r.id)), disease_module=r.disease_module.value,
            result_label=cast(str, r.result_label), confidence=float(cast(float, r.confidence)),
            risk_level=r.risk_level.value,
            probabilities=(
                json.loads(cast(str, r.probabilities))
                if r.probabilities is not None else None
            ),
            inference_ms=cast(Optional[float], r.inference_ms), report_path=cast(Optional[str], r.report_path),
            created_at=cast(datetime, r.created_at),
        ))
    return result


@app.get("/predictions/{pred_id}", response_model=PredictionOut, tags=["Predictions"])
def get_prediction(
    pred_id: int,
    current: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    row = db.query(Prediction).filter(
        Prediction.id == pred_id, Prediction.user_id == current.id
    ).first()
    if not row:
        raise HTTPException(404, "Prediction not found")
    return PredictionOut(
        id=int(cast(int, row.id)), disease_module=row.disease_module.value,
        result_label=cast(str, row.result_label), confidence=float(cast(float, row.confidence)),
        risk_level=row.risk_level.value,
        probabilities=(
            json.loads(cast(str, row.probabilities))
            if row.probabilities is not None else None
        ),
        inference_ms=cast(Optional[float], row.inference_ms), report_path=cast(Optional[str], row.report_path),
        created_at=cast(datetime, row.created_at),
    )


# ═══════════════════════════════════════════════════════════════════════════════
#  FILE UPLOADS (Health Locker)
# ═══════════════════════════════════════════════════════════════════════════════

@app.post("/uploads", response_model=UploadOut, status_code=201, tags=["Locker"])
async def upload_report(
    file: UploadFile = File(...),
    description: Optional[str] = Form(None),
    category: Optional[str] = Form(None),
    current: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    content = await file.read()
    size_kb = len(content) / 1024

    if size_kb > MAX_UPLOAD_MB * 1024:
        raise HTTPException(413, f"File exceeds {MAX_UPLOAD_MB} MB limit")

    ext = Path(file.filename).suffix
    stored = f"{uuid.uuid4().hex}{ext}"
    user_dir = UPLOADS_DIR / str(current.id)
    user_dir.mkdir(parents=True, exist_ok=True)
    dest = user_dir / stored
    dest.write_bytes(content)

    row = UploadedReport(
        user_id=current.id,
        filename=file.filename,
        stored_name=stored,
        file_path=str(dest),
        file_size_kb=round(size_kb, 2),
        mime_type=file.content_type,
        description=description,
        category=category,
    )
    db.add(row); db.commit(); db.refresh(row)
    return row


@app.get("/uploads", response_model=list[UploadOut], tags=["Locker"])
def list_uploads(
    current: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return db.query(UploadedReport).filter(UploadedReport.user_id == current.id).all()


@app.get("/uploads/{upload_id}/download", tags=["Locker"])
def download_upload(
    upload_id: int,
    current: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    row = db.query(UploadedReport).filter(
        UploadedReport.id == upload_id, UploadedReport.user_id == current.id
    ).first()
    if not row:
        raise HTTPException(404, "File not found")
    return FileResponse(row.file_path, filename=row.filename, media_type=row.mime_type)


@app.delete("/uploads/{upload_id}", status_code=204, tags=["Locker"])
def delete_upload(
    upload_id: int,
    current: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    row = db.query(UploadedReport).filter(
        UploadedReport.id == upload_id, UploadedReport.user_id == current.id
    ).first()
    if not row:
        raise HTTPException(404, "File not found")
    try:
        Path(row.file_path).unlink(missing_ok=True)
    except Exception:
        pass
    db.delete(row); db.commit()


# ═══════════════════════════════════════════════════════════════════════════════
#  PDF REPORT DOWNLOAD
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/reports/{pred_id}", tags=["Reports"])
def download_report(
    pred_id: int,
    current: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    row = db.query(Prediction).filter(
        Prediction.id == pred_id, Prediction.user_id == current.id
    ).first()
    if not row:
        raise HTTPException(404, "Prediction not found")
    if not row.report_path or not Path(row.report_path).exists():
        raise HTTPException(404, "Report PDF not yet generated for this prediction")
    fname = f"AarogyaAI_Report_{row.disease_module.value}_{row.id}.pdf"
    return FileResponse(row.report_path, filename=fname, media_type="application/pdf")


# ═══════════════════════════════════════════════════════════════════════════════
#  DOCTORS
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/doctors", response_model=list[DoctorOut], tags=["Doctors"])
def list_doctors(
    specialty: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    disease_module: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    q = db.query(Doctor).filter(Doctor.is_active == True)

    # Map disease module → specialty
    if disease_module and not specialty:
        mapping = {
            "blood_cell_cancer": Specialty.ONCOLOGIST,
            "heart_disease":     Specialty.CARDIOLOGIST,
            "lung_cancer":       Specialty.PULMONOLOGIST,
            "parkinsons":        Specialty.NEUROLOGIST,
            "thyroid":           Specialty.ENDOCRINOLOGIST,
            "diabetes":          Specialty.ENDOCRINOLOGIST,
        }
        spec = mapping.get(disease_module)
        if spec:
            q = q.filter(Doctor.specialty == spec)

    if specialty:
        q = q.filter(Doctor.specialty == specialty)
    if city:
        q = q.filter(Doctor.city.ilike(f"%{city}%"))

    return q.order_by(Doctor.rating.desc()).all()


@app.get("/doctors/{doctor_id}", response_model=DoctorOut, tags=["Doctors"])
def get_doctor(
    doctor_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    doc = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doc:
        raise HTTPException(404, "Doctor not found")
    return doc


# ═══════════════════════════════════════════════════════════════════════════════
#  APPOINTMENTS
# ═══════════════════════════════════════════════════════════════════════════════

@app.post("/appointments", response_model=AppointmentOut, tags=["Appointments"])
def book_appointment(
    data: AppointmentIn,
    current: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    doc = db.query(Doctor).filter(Doctor.id == data.doctor_id).first()
    if not doc:
        raise HTTPException(404, "Doctor not found")
        
    apt = Appointment(
        user_id=current.id,
        doctor_id=data.doctor_id,
        date=data.date,
        time=data.time,
        type=data.type,
        notes=data.notes,
        status="Pending"
    )
    db.add(apt)
    db.commit()
    db.refresh(apt)
    
    return AppointmentOut(
        **apt.__dict__,
        doctor_name=doc.full_name or doc.name,
        user_name=current.full_name
    )

@app.get("/appointments", response_model=list[AppointmentOut], tags=["Appointments"])
def list_appointments(
    current: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    results = db.query(Appointment).filter(Appointment.user_id == current.id).all()
    out = []
    for r in results:
        doc = db.query(Doctor).filter(Doctor.id == r.doctor_id).first()
        out.append(AppointmentOut(
            **r.__dict__,
            doctor_name=doc.full_name or doc.name if doc else "Unknown",
            user_name=current.full_name
        ))
    return out

@app.get("/doctor/appointments", response_model=list[AppointmentOut], tags=["Doctor Portal"])
def list_doctor_appointments(
    current: Doctor = Depends(get_current_doctor),
    db: Session = Depends(get_db),
):
    results = db.query(Appointment).filter(Appointment.doctor_id == current.id).all()
    out = []
    for r in results:
        user = db.query(User).filter(User.id == r.user_id).first()
        out.append(AppointmentOut(
            **r.__dict__,
            doctor_name=current.full_name or current.name,
            user_name=user.full_name if user else "Unknown"
        ))
    return out

@app.put("/appointments/{id}", response_model=AppointmentOut, tags=["Doctor Portal"])
def update_appointment_status(
    id: int,
    status: str = Query(...),
    current: Doctor = Depends(get_current_doctor),
    db: Session = Depends(get_db),
):
    apt = db.query(Appointment).filter(Appointment.id == id, Appointment.doctor_id == current.id).first()
    if not apt:
        raise HTTPException(404, "Appointment not found")
    
    apt.status = status
    db.commit()
    db.refresh(apt)
    
    user = db.query(User).filter(User.id == apt.user_id).first()
    return AppointmentOut(
        **apt.__dict__,
        doctor_name=current.full_name or current.name,
        user_name=user.full_name if user else "Unknown"
    )


# ═══════════════════════════════════════════════════════════════════════════════
#  DOCTOR VERIFICATION SYSTEM
# ═══════════════════════════════════════════════════════════════════════════════

@app.post("/doctor/register", response_model=DoctorVerificationOut, tags=["Doctor Verification"])
def doctor_register(data: DoctorRegisterIn, db: Session = Depends(get_db)):
    if db.query(Doctor).filter(Doctor.email == data.email).first():
        raise HTTPException(400, "Email already registered")
    
    doc = Doctor(
        full_name=data.full_name,
        email=data.email,
        mobile=data.mobile,
        password_hash=hash_password(data.password),
        registration_number=data.registration_number,
        medical_council=data.medical_council,
        qualification=data.qualification,
        specialty=Specialty(data.specialty),
        experience_yrs=data.experience_yrs,
        hospital=data.hospital,
        verification_status=VerificationStatus.PENDING
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc

@app.post("/doctor/upload-documents", tags=["Doctor Verification"])
async def upload_doctor_documents(
    doctor_id: int = Form(...),
    degree_certificate: UploadFile = File(None),
    medical_license: UploadFile = File(None),
    govt_id: UploadFile = File(None),
    profile_photo: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    doc = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doc:
        raise HTTPException(404, "Doctor not found")
        
    doc_dir = UPLOADS_DIR / f"doctor_{doctor_id}"
    doc_dir.mkdir(parents=True, exist_ok=True)
    
    async def save_file(file: UploadFile):
        if not file: return None
        content = await file.read()
        ext = Path(file.filename).suffix
        stored = f"{uuid.uuid4().hex}{ext}"
        dest = doc_dir / stored
        dest.write_bytes(content)
        return f"/uploads/doctor_{doctor_id}/{stored}"

    if degree_certificate: doc.degree_certificate_url = await save_file(degree_certificate)
    if medical_license: doc.medical_license_url = await save_file(medical_license)
    if govt_id: doc.govt_id_url = await save_file(govt_id)
    if profile_photo: doc.profile_photo_url = await save_file(profile_photo)
    
    db.commit()
    db.refresh(doc)
    return {"message": "Documents uploaded successfully"}

@app.post("/doctor/send-otp", tags=["Doctor Verification"])
def send_otp(data: SendOTPIn, db: Session = Depends(get_db)):
    if not data.email and not data.mobile:
        raise HTTPException(400, "Provide email or mobile")
        
    import random
    otp_code = str(random.randint(100000, 999999))
    expires = datetime.utcnow() + timedelta(minutes=10)
    
    otp = OTPVerification(
        email=data.email,
        mobile=data.mobile,
        otp_code=otp_code,
        expires_at=expires
    )
    db.add(otp)
    db.commit()

    # Send Email if requested
    email_sent = False
    if data.email:
        subject = "AarogyaAI Verification OTP"
        body = f"Hello,\n\nYour AarogyaAI verification code is: {otp_code}\n\nThis code expires in 10 minutes."
        email_sent = send_email(subject, body, data.email)

    return {
        "message": "OTP sent successfully" if email_sent else "OTP generated (Email failed/skipped)", 
        "otp": otp_code if not email_sent else "SENT_TO_EMAIL",
        "email_status": "sent" if email_sent else "failed"
    }

@app.post("/doctor/verify-otp", tags=["Doctor Verification"])
def verify_otp(data: VerifyOTPIn, db: Session = Depends(get_db)):
    query = db.query(OTPVerification).filter(OTPVerification.otp_code == data.otp_code)
    if data.email: query = query.filter(OTPVerification.email == data.email)
    if data.mobile: query = query.filter(OTPVerification.mobile == data.mobile)
    
    otp = query.order_by(OTPVerification.created_at.desc()).first()
    
    if not otp:
        raise HTTPException(400, "Invalid OTP")
    if otp.expires_at < datetime.utcnow():
        raise HTTPException(400, "OTP expired")
    if otp.is_verified:
        raise HTTPException(400, "OTP already used")
        
    otp.is_verified = True
    db.commit()
    
    if data.email:
        doc = db.query(Doctor).filter(Doctor.email == data.email).first()
        if doc: 
            doc.is_email_verified = True
            db.commit()
            
    if data.mobile:
        doc = db.query(Doctor).filter(Doctor.mobile == data.mobile).first()
        if doc:
            doc.is_mobile_verified = True
            db.commit()

    return {"message": "OTP verified successfully"}

@app.get("/admin/patients", response_model=list[UserOut], tags=["Doctor Verification"])
def get_all_patients(db: Session = Depends(get_db)):
    return db.query(User).filter(User.role == "patient").all()

@app.get("/admin/pending-doctors", response_model=list[DoctorVerificationOut], tags=["Doctor Verification"])
def get_pending_doctors(db: Session = Depends(get_db)):
    return db.query(Doctor).filter(Doctor.verification_status == VerificationStatus.PENDING).all()

@app.post("/admin/approve-doctor/{id}", tags=["Doctor Verification"])
async def approve_doctor(id: int, db: Session = Depends(get_db)):
    doc = db.query(Doctor).filter(Doctor.id == id).first()
    if not doc: raise HTTPException(404, "Doctor not found")
    
    doc.verification_status = VerificationStatus.VERIFIED
    doc.verified_by_admin = True
    doc.verified_at = datetime.utcnow()
    doc.rejection_reason = None
    
    log = VerificationLog(doctor_id=doc.id, action="APPROVED")
    db.add(log)
    db.commit()

    return {"message": "Doctor approved successfully"}

@app.post("/admin/reject-doctor/{id}", tags=["Doctor Verification"])
async def reject_doctor(id: int, data: RejectDoctorIn, db: Session = Depends(get_db)):
    doc = db.query(Doctor).filter(Doctor.id == id).first()
    if not doc: raise HTTPException(404, "Doctor not found")
    
    doc.verification_status = VerificationStatus.REJECTED
    doc.rejection_reason = data.rejection_reason
    
    log = VerificationLog(doctor_id=doc.id, action="REJECTED", notes=data.rejection_reason)
    db.add(log)
    db.commit()

    return {"message": "Doctor rejected successfully"}

@app.post("/admin/suspend-doctor/{id}", tags=["Doctor Verification"])
async def suspend_doctor(id: int, data: RejectDoctorIn, db: Session = Depends(get_db)):
    doc = db.query(Doctor).filter(Doctor.id == id).first()
    if not doc: raise HTTPException(404, "Doctor not found")
    
    doc.verification_status = VerificationStatus.SUSPENDED
    doc.rejection_reason = data.rejection_reason
    
    log = VerificationLog(doctor_id=doc.id, action="SUSPENDED", notes=data.rejection_reason)
    db.add(log)
    db.commit()

    return {"message": "Doctor suspended successfully"}

# ── Health check ──────────────────────────────────────────────────────────────

@app.get("/health", tags=["System"])
def health():
    return {"status": "ok", "version": "2.2.0", "timestamp": datetime.utcnow().isoformat()}