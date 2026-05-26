"""
database/db.py
==============
Database engine setup, session factory, and seed data.
Uses SQLite for local dev; swap DATABASE_URL for PostgreSQL in production.
"""

import os
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker
try:
     from backend.database.models import Base, Doctor, Specialty, VerificationStatus
except ModuleNotFoundError:
     from database.models import Base, Doctor, Specialty, VerificationStatus

import bcrypt
def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt()).decode()

# ── Engine ────────────────────────────────────────────────────────────────────
DATABASE_URL = "sqlite:///./aarogyaai_v2.db"

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args, echo=False)

# WAL mode for SQLite (concurrent reads)
if DATABASE_URL.startswith("sqlite"):
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_conn, _):
        cursor = dbapi_conn.cursor()
        cursor.execute("PRAGMA journal_mode=WAL")
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# ── Dependency ────────────────────────────────────────────────────────────────

def get_db():
    """FastAPI dependency — yields a DB session and always closes it."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ── Init + seed ───────────────────────────────────────────────────────────────

DOCTORS_SEED = [
    # Oncologists (Blood Cell Cancer)
    dict(full_name="Dr. Anjali Sharma",     specialty=Specialty.ONCOLOGIST,
         qualification="MBBS, MD Oncology, AIIMS Delhi",
         hospital="All India Institute of Medical Sciences",
         city="New Delhi", experience_yrs=18, rating=4.9,
         phone="+91-11-2658-8500", available_days="Mon-Sat", fee_inr=1500),
    dict(full_name="Dr. Rajesh Khanna",     specialty=Specialty.ONCOLOGIST,
         qualification="MBBS, DNB Oncology",
         hospital="Tata Memorial Hospital",
         city="Mumbai", experience_yrs=22, rating=4.8,
         phone="+91-22-2417-7000", available_days="Mon-Fri", fee_inr=2000),
    dict(full_name="Dr. Priya Nair",        specialty=Specialty.ONCOLOGIST,
         qualification="MBBS, MD, DM Medical Oncology",
         hospital="Amrita Institute of Medical Sciences",
         city="Kochi", experience_yrs=14, rating=4.7,
         phone="+91-484-280-1234", available_days="Tue-Sun", fee_inr=1200),

    # Cardiologists (Heart Disease)
    dict(full_name="Dr. Sanjay Mehta",      specialty=Specialty.CARDIOLOGIST,
         qualification="MBBS, MD Cardiology, DM",
         hospital="Fortis Heart Institute",
         city="Gurugram", experience_yrs=20, rating=4.9,
         phone="+91-124-496-2200", available_days="Mon-Sat", fee_inr=2500),
    dict(full_name="Dr. Kavitha Reddy",     specialty=Specialty.CARDIOLOGIST,
         qualification="MBBS, DNB Cardiology",
         hospital="Apollo Hospitals",
         city="Hyderabad", experience_yrs=16, rating=4.8,
         phone="+91-40-2360-7777", available_days="Mon-Fri", fee_inr=1800),
    dict(full_name="Dr. Arun Prakash",      specialty=Specialty.CARDIOLOGIST,
         qualification="MBBS, MD, FACC",
         hospital="Medanta — The Medicity",
         city="Gurugram", experience_yrs=25, rating=4.9,
         phone="+91-124-441-1441", available_days="Mon-Sun", fee_inr=3000),

    # Pulmonologists (Lung Cancer)
    dict(full_name="Dr. Shalini Gupta",     specialty=Specialty.PULMONOLOGIST,
         qualification="MBBS, MD Pulmonology",
         hospital="PGI Chandigarh",
         city="Chandigarh", experience_yrs=15, rating=4.7,
         phone="+91-172-274-7585", available_days="Mon-Sat", fee_inr=1000),
    dict(full_name="Dr. Mohan Rao",         specialty=Specialty.PULMONOLOGIST,
         qualification="MBBS, DNB Respiratory Medicine",
         hospital="NIMHANS",
         city="Bengaluru", experience_yrs=12, rating=4.6,
         phone="+91-80-2699-5000", available_days="Tue-Sun", fee_inr=900),
    dict(full_name="Dr. Fatima Sheikh",     specialty=Specialty.PULMONOLOGIST,
         qualification="MBBS, MD, FCCP",
         hospital="Kokilaben Dhirubhai Ambani Hospital",
         city="Mumbai", experience_yrs=18, rating=4.8,
         phone="+91-22-3069-6969", available_days="Mon-Fri", fee_inr=2200),

    # Neurologists (Parkinson's)
    dict(full_name="Dr. Vijay Krishnamurthy", specialty=Specialty.NEUROLOGIST,
         qualification="MBBS, MD Neurology, DM",
         hospital="NIMHANS",
         city="Bengaluru", experience_yrs=20, rating=4.9,
         phone="+91-80-2699-5000", available_days="Mon-Fri", fee_inr=2000),
    dict(full_name="Dr. Sunita Arora",      specialty=Specialty.NEUROLOGIST,
         qualification="MBBS, MD, DNB Neurology",
         hospital="Max Super Speciality Hospital",
         city="New Delhi", experience_yrs=17, rating=4.8,
         phone="+91-11-2651-5050", available_days="Mon-Sat", fee_inr=1800),
    dict(full_name="Dr. Ramesh Iyer",       specialty=Specialty.NEUROLOGIST,
         qualification="MBBS, DM Neurology",
         hospital="Sri Ramachandra University",
         city="Chennai", experience_yrs=13, rating=4.7,
         phone="+91-44-4592-8000", available_days="Tue-Sun", fee_inr=1500),

    # Endocrinologists (Thyroid + Diabetes)
    dict(full_name="Dr. Deepa Menon",       specialty=Specialty.ENDOCRINOLOGIST,
         qualification="MBBS, MD Endocrinology, DM",
         hospital="Christian Medical College",
         city="Vellore", experience_yrs=19, rating=4.9,
         phone="+91-416-228-2010", available_days="Mon-Sat", fee_inr=1200),
    dict(full_name="Dr. Ajay Sinha",        specialty=Specialty.ENDOCRINOLOGIST,
         qualification="MBBS, DNB, FRCP Endocrinology",
         hospital="Narayana Health",
         city="Kolkata", experience_yrs=21, rating=4.8,
         phone="+91-33-6626-3333", available_days="Mon-Fri", fee_inr=1600),
    dict(full_name="Dr. Meera Pillai",      specialty=Specialty.ENDOCRINOLOGIST,
         qualification="MBBS, MD, FACE",
         hospital="Amrita Hospital",
         city="Faridabad", experience_yrs=14, rating=4.7,
         phone="+91-129-709-0209", available_days="Mon-Sat", fee_inr=1400),

    # General Physicians
    dict(full_name="Dr. Suresh Patel",      specialty=Specialty.GENERAL,
         qualification="MBBS, MD Internal Medicine",
         hospital="AIIMS Jodhpur",
         city="Jodhpur", experience_yrs=10, rating=4.6,
         phone="+91-291-263-0008", available_days="Mon-Sun", fee_inr=500),
    dict(full_name="Dr. Ananya Das",        specialty=Specialty.GENERAL,
         qualification="MBBS, MRCP",
         hospital="Apollo Gleneagles",
         city="Kolkata", experience_yrs=8, rating=4.5,
         phone="+91-33-2320-3040", available_days="Mon-Sat", fee_inr=600),

    # Test Doctor 1
    dict(
        full_name="Dr. Test One",
        email=os.getenv("DOCTOR1_EMAIL", "doctor1@aarogya.ai"),
        password_hash=hash_password(os.getenv("DOCTOR1_PASSWORD", "doctor123")),
        specialty=Specialty.GENERAL,
        qualification="MBBS, MD (Test)",
        hospital="AarogyaAI Test Clinic",
        verification_status=VerificationStatus.VERIFIED,
        is_email_verified=True,
        experience_yrs=10,
        city="Mumbai"
    ),
    # Test Doctor 2
    dict(
        full_name="Dr. Test Two",
        email=os.getenv("DOCTOR2_EMAIL", "doctor2@aarogya.ai"),
        password_hash=hash_password(os.getenv("DOCTOR2_PASSWORD", "doctor223")),
        specialty=Specialty.CARDIOLOGIST,
        qualification="MBBS, DM Cardiology",
        hospital="AarogyaAI Heart Center",
        verification_status=VerificationStatus.VERIFIED,
        is_email_verified=True,
        experience_yrs=15,
        city="Delhi"
    ),
]


def init_db():
    """Create all tables and seed doctor directory if empty."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(Doctor).count() == 0:
            for d in DOCTORS_SEED:
                db.add(Doctor(**d))
            db.commit()
            print(f"[DB] Seeded {len(DOCTORS_SEED)} doctors.")
        else:
            print("[DB] Doctor table already populated — skipping seed.")
    finally:
        db.close()