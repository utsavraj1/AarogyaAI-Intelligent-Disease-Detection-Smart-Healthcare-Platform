"""
database/models.py
==================
SQLAlchemy ORM models for AarogyaAI.

Tables:
  users             – auth accounts
  medical_records   – patient profile + vitals per user
  predictions       – every AI model run result
  uploaded_reports  – lab PDFs / images stored per user
  doctors           – curated doctor / specialist directory
"""

from datetime import datetime
from sqlalchemy import (
    Boolean, Column, DateTime, Float, ForeignKey,
    Integer, String, Text, Enum as SAEnum,
)
from sqlalchemy.orm import declarative_base, relationship
import enum

Base = declarative_base()


# ── Enums ─────────────────────────────────────────────────────────────────────

class RiskLevel(str, enum.Enum):
    LOW      = "low"
    MODERATE = "moderate"
    HIGH     = "high"


class DiseaseModule(str, enum.Enum):
    BLOOD_CELL  = "blood_cell_cancer"
    HEART       = "heart_disease"
    LUNG        = "lung_cancer"
    PARKINSONS  = "parkinsons"
    THYROID     = "thyroid"
    DIABETES    = "diabetes"


class Specialty(str, enum.Enum):
    ONCOLOGIST       = "Oncologist"
    CARDIOLOGIST     = "Cardiologist"
    PULMONOLOGIST    = "Pulmonologist"
    NEUROLOGIST      = "Neurologist"
    ENDOCRINOLOGIST  = "Endocrinologist"
    GENERAL          = "General Physician"
    DERMATOLOGIST    = "Dermatologist"
    ORTHOPEDIC       = "Orthopedic"
    PEDIATRICIAN     = "Pediatrician"
    GYNECOLOGIST     = "Gynecologist"
    PSYCHIATRIST     = "Psychiatrist"
    ENT_SPECIALIST   = "ENT Specialist"
    OPHTHALMOLOGIST  = "Ophthalmologist"
    UROLOGIST        = "Urologist"
    DENTIST          = "Dentist"
    RADIOLOGIST      = "Radiologist"
    PATHOLOGIST      = "Pathologist"


class VerificationStatus(str, enum.Enum):
    PENDING   = "Pending"
    VERIFIED  = "Verified"
    REJECTED  = "Rejected"
    SUSPENDED = "Suspended"


# ── Users ─────────────────────────────────────────────────────────────────────

class User(Base):
    __tablename__ = "users"

    id            = Column(Integer, primary_key=True, index=True)
    full_name     = Column(String(120), nullable=False)
    email         = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    age           = Column(Integer, nullable=True)
    gender        = Column(String(20), nullable=True)
    blood_group   = Column(String(5), nullable=True)
    phone         = Column(String(20), nullable=True)
    role          = Column(String(20), default="patient")
    is_active     = Column(Boolean, default=True)
    created_at    = Column(DateTime, default=datetime.utcnow)
    last_login    = Column(DateTime, nullable=True)

    # relationships
    records          = relationship("MedicalRecord",   back_populates="user", cascade="all, delete")
    predictions      = relationship("Prediction",      back_populates="user", cascade="all, delete")
    uploaded_reports = relationship("UploadedReport",  back_populates="user", cascade="all, delete")

    def __repr__(self):
        return f"<User id={self.id} email={self.email}>"


# ── Medical Records (health locker) ───────────────────────────────────────────

class MedicalRecord(Base):
    """One row per measurement / visit entry for a user."""
    __tablename__ = "medical_records"

    id          = Column(Integer, primary_key=True, index=True)
    user_id     = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    title       = Column(String(200), nullable=False)       # e.g. "Annual checkup 2024"
    notes       = Column(Text, nullable=True)
    # Core vitals
    weight_kg   = Column(Float, nullable=True)
    height_cm   = Column(Float, nullable=True)
    bmi         = Column(Float, nullable=True)
    bp_systolic = Column(Integer, nullable=True)
    bp_diastolic= Column(Integer, nullable=True)
    glucose     = Column(Float, nullable=True)
    cholesterol = Column(Float, nullable=True)
    heart_rate  = Column(Integer, nullable=True)
    temperature = Column(Float, nullable=True)
    recorded_at = Column(DateTime, default=datetime.utcnow)
    created_at  = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="records")

    def __repr__(self):
        return f"<MedicalRecord id={self.id} user={self.user_id} '{self.title}'>"


# ── Predictions ────────────────────────────────────────────────────────────────

class Prediction(Base):
    """Stores every AI model run with full input features and result."""
    __tablename__ = "predictions"

    id              = Column(Integer, primary_key=True, index=True)
    user_id         = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    disease_module  = Column(SAEnum(DiseaseModule), nullable=False)
    result_label    = Column(String(100), nullable=False)
    confidence      = Column(Float, nullable=False)           # 0.0 – 100.0
    risk_level      = Column(SAEnum(RiskLevel), nullable=False)
    input_features  = Column(Text, nullable=True)             # JSON string of input values
    probabilities   = Column(Text, nullable=True)             # JSON: {class: prob}
    inference_ms    = Column(Float, nullable=True)
    report_path     = Column(String(500), nullable=True)      # path to generated PDF
    model_version   = Column(String(20), default="2.2.0")
    created_at      = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="predictions")

    def __repr__(self):
        return (f"<Prediction id={self.id} module={self.disease_module.value} "
                f"result={self.result_label} conf={self.confidence:.1f}%>")


# ── Uploaded Reports (health locker files) ────────────────────────────────────

class UploadedReport(Base):
    """Lab reports / prescriptions / images uploaded by the user."""
    __tablename__ = "uploaded_reports"

    id            = Column(Integer, primary_key=True, index=True)
    user_id       = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    filename      = Column(String(300), nullable=False)       # original name
    stored_name   = Column(String(300), nullable=False)       # UUID-based disk name
    file_path     = Column(String(600), nullable=False)       # absolute path on server
    file_size_kb  = Column(Float, nullable=True)
    mime_type     = Column(String(100), nullable=True)
    description   = Column(String(300), nullable=True)        # user-supplied label
    category      = Column(String(100), nullable=True)        # e.g. "Blood Test", "X-Ray"
    uploaded_at   = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="uploaded_reports")

    def __repr__(self):
        return f"<UploadedReport id={self.id} user={self.user_id} '{self.filename}'>"


# ── Doctors directory ─────────────────────────────────────────────────────────

class Doctor(Base):
    """Curated specialist directory — seeded at startup."""
    __tablename__ = "doctors"

    id             = Column(Integer, primary_key=True, index=True)
    full_name      = Column(String(150), nullable=False)
    email          = Column(String(150), unique=True, nullable=True)
    mobile         = Column(String(30), nullable=True)
    password_hash  = Column(String(255), nullable=True)
    
    registration_number = Column(String(100), nullable=True)
    medical_council     = Column(String(200), nullable=True)
    qualification       = Column(String(200), nullable=True)        # e.g. "MBBS, MD Cardiology"
    specialty           = Column(SAEnum(Specialty), nullable=False)
    experience_yrs      = Column(Integer, nullable=True)
    hospital            = Column(String(200), nullable=True)
    
    degree_certificate_url = Column(String(600), nullable=True)
    medical_license_url    = Column(String(600), nullable=True)
    govt_id_url            = Column(String(600), nullable=True)
    profile_photo_url      = Column(String(600), nullable=True)
    
    verification_status = Column(SAEnum(VerificationStatus), default=VerificationStatus.PENDING)
    rejection_reason    = Column(Text, nullable=True)
    is_email_verified   = Column(Boolean, default=False)
    is_mobile_verified  = Column(Boolean, default=False)
    verified_by_admin   = Column(Boolean, default=False)
    verified_at         = Column(DateTime, nullable=True)
    created_at          = Column(DateTime, default=datetime.utcnow)

    # Legacy fields
    name           = Column(String(150), nullable=True)
    city           = Column(String(100), nullable=True)
    country        = Column(String(100), default="India")
    rating         = Column(Float, nullable=True)              # 0.0 – 5.0
    phone          = Column(String(30), nullable=True)
    available_days = Column(String(100), nullable=True)        # e.g. "Mon-Fri"
    fee_inr        = Column(Integer, nullable=True)
    profile_img    = Column(String(300), nullable=True)
    is_active      = Column(Boolean, default=True)

    # map relevant diseases → specialty
    DISEASE_MAP = {
        DiseaseModule.BLOOD_CELL : Specialty.ONCOLOGIST,
        DiseaseModule.HEART      : Specialty.CARDIOLOGIST,
        DiseaseModule.LUNG       : Specialty.PULMONOLOGIST,
        DiseaseModule.PARKINSONS : Specialty.NEUROLOGIST,
        DiseaseModule.THYROID    : Specialty.ENDOCRINOLOGIST,
        DiseaseModule.DIABETES   : Specialty.ENDOCRINOLOGIST,
    }

    def __repr__(self):
        return f"<Doctor id={self.id} '{self.full_name}' {self.specialty.value}>"


class OTPVerification(Base):
    __tablename__ = "otp_verifications"

    id          = Column(Integer, primary_key=True, index=True)
    email       = Column(String(255), index=True, nullable=True)
    mobile      = Column(String(30), index=True, nullable=True)
    otp_code    = Column(String(10), nullable=False)
    expires_at  = Column(DateTime, nullable=False)
    is_verified = Column(Boolean, default=False)
    created_at  = Column(DateTime, default=datetime.utcnow)


class AdminUser(Base):
    __tablename__ = "admin_users"

    id            = Column(Integer, primary_key=True, index=True)
    full_name     = Column(String(150), nullable=False)
    email         = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at    = Column(DateTime, default=datetime.utcnow)


class VerificationLog(Base):
    __tablename__ = "verification_logs"

    id          = Column(Integer, primary_key=True, index=True)
    doctor_id   = Column(Integer, ForeignKey("doctors.id"), nullable=False)
    admin_id    = Column(Integer, nullable=True)
    action      = Column(String(100), nullable=False)
    notes       = Column(Text, nullable=True)
    created_at  = Column(DateTime, default=datetime.utcnow)


class Appointment(Base):
    __tablename__ = "appointments"

    id          = Column(Integer, primary_key=True, index=True)
    user_id     = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    doctor_id   = Column(Integer, ForeignKey("doctors.id"), nullable=False, index=True)
    date        = Column(String(20), nullable=False)       # YYYY-MM-DD
    time        = Column(String(20), nullable=False)       # HH:MM AM/PM
    type        = Column(String(50), default="In-Person") # Virtual / In-Person
    status      = Column(String(50), default="Pending")   # Pending / Confirmed / Completed / Cancelled
    notes       = Column(Text, nullable=True)
    created_at  = Column(DateTime, default=datetime.utcnow)

    user   = relationship("User")
    doctor = relationship("Doctor")