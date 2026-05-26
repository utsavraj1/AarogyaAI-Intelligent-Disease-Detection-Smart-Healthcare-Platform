# 🧬 AarogyaAI – Intelligent Disease Detection & Smart Healthcare Platform

<div align="center">

![AarogyaAI Banner](https://via.placeholder.com/1200x300/4F46E5/FFFFFF?text=AarogyaAI+–+AI-Powered+Healthcare+Ecosystem)

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19.2+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.12+-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)](https://www.tensorflow.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**An end-to-end AI-powered healthcare ecosystem for early disease detection, patient management, and telemedicine consultations.**

[🚀 Live Demo](#) • [📖 Documentation](#) • [🐛 Report Bug](#) • [💡 Request Feature](#)

</div>

---

## 📋 Table of Contents

- [🎯 Project Overview](#-project-overview)
- [✨ Key Features](#-key-features)
- [🏗️ System Architecture](#️-system-architecture)
- [🔬 AI/ML Models](#-aiml-models)
- [💻 Tech Stack](#-tech-stack)
- [📊 Dashboard Modules](#-dashboard-modules)
- [🔌 Backend APIs](#-backend-apis)
- [🎨 Frontend Features](#-frontend-features)
- [🗄️ Database Design](#️-database-design)
- [🔐 Authentication & Security](#-authentication--security)
- [⚙️ Installation Guide](#️-installation-guide)
- [🐳 Docker Deployment](#-docker-deployment)
- [☁️ AWS/Cloud Deployment](#️-awscloud-deployment)
- [📁 Project Structure](#-project-structure)
- [🧪 Model Training Workflow](#-model-training-workflow)
- [🔮 Future Enhancements](#-future-enhancements)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🎯 Project Overview

**AarogyaAI** is a comprehensive AI-powered healthcare platform that revolutionizes disease detection and patient care through cutting-edge machine learning and deep learning technologies. The platform provides:

- **Early Disease Detection**: AI-powered diagnosis for 6 critical diseases
- **Medical Image Analysis**: CNN-based classification for blood cell cancer detection
- **Patient Management**: Secure health records and digital medical locker
- **Telemedicine**: Real-time video/audio consultations via LiveKit WebRTC
- **Multi-Role Ecosystem**: Dashboards for patients, doctors, and administrators
- **Clinical Decision Support**: AI-generated risk assessments and PDF reports

### 🎖️ Project Highlights

| Metric | Achievement |
|--------|-------------|
| **Disease Modules** | 6 AI-powered diagnostic systems |
| **Prediction Accuracy** | 85-96% across all models |
| **Tech Stack** | 15+ modern technologies |
| **Architecture** | Microservices-ready, Docker-containerized |
| **Security** | JWT authentication, HIPAA-compliant data handling |
| **Real-time Communication** | LiveKit WebRTC integration |

---

## ✨ Key Features

### 🏥 Core Medical Features

<table>
<tr>
<td width="50%">

#### 🔍 AI Disease Detection
- Blood Cell Cancer (ALL) classification
- Heart Disease risk assessment
- Lung Cancer prediction
- Parkinson's Disease detection
- Thyroid Disorder diagnosis
- Diabetes risk scoring

</td>
<td width="50%">

#### 👨‍⚕️ Healthcare Management
- Secure patient health locker
- Digital medical record storage
- Lab report upload & management
- Prescription tracking
- Appointment scheduling
- Doctor directory & ratings

</td>
</tr>
<tr>
<td width="50%">

#### 📹 Telemedicine
- HD video consultations
- Real-time audio calls
- Secure messaging
- Screen sharing for reports
- Multi-participant sessions
- End-to-end encryption

</td>
<td width="50%">

#### 📊 Analytics & Reporting
- AI-generated PDF reports
- Risk score visualization
- Health trend analysis
- Interactive dashboards
- Medical history timeline
- Exportable health data

</td>
</tr>
</table>

### 🎯 Role-Based Features

| Role | Access Level | Key Features |
|------|-------------|--------------|
| **Patient** | Standard User | Disease predictions, health locker, appointments, doctor consultations |
| **Doctor** | Healthcare Provider | Patient management, consultation history, appointment calendar, prescription management |
| **Admin** | System Administrator | User management, system analytics, model monitoring, data verification |

---

## 🏗️ System Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[React 19 + Vite + Tailwind]
        B[LiveKit WebRTC Client]
    end
    
    subgraph "API Gateway"
        C[Nginx Reverse Proxy]
    end
    
    subgraph "Backend Services"
        D[FastAPI REST API]
        E[LiveKit Token Server]
        F[AI Prediction Engine]
    end
    
    subgraph "Data Layer"
        G[(SQLite/PostgreSQL)]
        H[(MongoDB)]
        I[File Storage]
    end
    
    subgraph "AI/ML Layer"
        J[TensorFlow Models]
        K[Scikit-learn Models]
        L[XGBoost Models]
    end
    
    subgraph "Real-time Communication"
        M[LiveKit Media Server]
    end
    
    A --> C
    B --> M
    C --> D
    C --> E
    D --> F
    D --> G
    D --> H
    D --> I
    E --> M
    F --> J
    F --> K
    F --> L
    
    style A fill:#61DAFB
    style D fill:#009688
    style F fill:#FF6F00
    style G fill:#336791
    style H fill:#47A248
    style M fill:#5865F2
```

### Architecture Principles

- **Microservices-Ready**: Modular design with clear service boundaries
- **API-First**: RESTful FastAPI backend with OpenAPI documentation
- **Scalable**: Horizontal scaling support via Docker containers
- **Cloud-Native**: AWS/Azure/GCP deployment ready
- **Real-time Capable**: WebRTC for live consultations
- **Data Privacy**: HIPAA-compliant data handling and encryption

---

## 🔬 AI/ML Models

### 📊 Model Performance Overview

| Disease Module | Model Type | Accuracy | Precision | Recall | F1-Score | Input Type |
|----------------|-----------|----------|-----------|--------|----------|------------|
| 🩸 **Blood Cell Cancer** | EfficientNetB0 CNN | 94% | 0.93 | 0.94 | 0.93 | 224×224 RGB Images |
| ❤️ **Heart Disease** | XGBoost Classifier | 88% | 0.86 | 0.89 | 0.87 | 13 Clinical Features |
| 🫁 **Lung Cancer** | Gradient Boosting | 91% | 0.90 | 0.92 | 0.91 | 15 Risk Factors |
| 🧠 **Parkinson's Disease** | SVM (RBF Kernel) | 89% | 0.88 | 0.90 | 0.89 | 22 Voice Biomarkers |
| 🦋 **Thyroid Disorder** | Random Forest | 96% | 0.95 | 0.96 | 0.95 | 5 Lab Values |
| 📊 **Diabetes** | XGBoost Classifier | 85% | 0.83 | 0.87 | 0.85 | 8 Clinical Features |

### 🩸 Blood Cell Cancer Detection – Deep Learning Pipeline

**Architecture**: EfficientNetB0 (Transfer Learning)

```python
# Model Architecture
Base Model: EfficientNetB0 (ImageNet pretrained)
  ├── Input: 224×224×3 RGB images
  ├── Frozen Layers: First 200 layers
  ├── Custom Head:
  │   ├── GlobalAveragePooling2D
  │   ├── Dense(256, relu)
  │   ├── Dropout(0.3)
  │   ├── BatchNormalization
  │   ├── Dense(4, softmax)
  └── Output: [Benign, Early Pre-B ALL, Pre-B ALL, Pro-B ALL]
```

**Training Strategy**:
- **Phase 1**: Train classification head (30 epochs, lr=1e-3)
- **Phase 2**: Fine-tune top 30 layers (10 epochs, lr=1e-5)
- **Data Augmentation**: Rotation, flip, zoom, brightness, shear
- **Class Balancing**: Weighted loss function
- **Callbacks**: EarlyStopping, ReduceLROnPlateau, ModelCheckpoint

**Key Results**:
```
Classification Report:
                  Precision  Recall  F1-Score  Support
Benign               0.96     0.95     0.95      350
Early Pre-B ALL      0.92     0.93     0.92      280
Pre-B ALL            0.93     0.94     0.93      310
Pro-B ALL            0.94     0.93     0.93      260
```

### ❤️ Heart Disease – Gradient Boosting

**Features**: Age, Sex, Chest Pain Type, Resting BP, Cholesterol, Fasting Blood Sugar, Resting ECG, Max Heart Rate, Exercise Angina, ST Depression, ST Slope, Major Vessels, Thalassemia

**Preprocessing Pipeline**:
```python
StandardScaler → XGBoostClassifier(
    n_estimators=200,
    max_depth=5,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8
)
```

**Feature Importance**:
1. ST Depression (0.18)
2. Major Vessels (0.15)
3. Chest Pain Type (0.13)
4. Max Heart Rate (0.11)
5. Age (0.09)

### 🫁 Lung Cancer – Advanced Ensemble

**Imbalance Handling**: SMOTE (Synthetic Minority Over-sampling Technique)

**Model**: Gradient Boosting Classifier
```python
Pipeline:
  StandardScaler → SMOTE → GradientBoostingClassifier(
    n_estimators=200,
    max_depth=4,
    learning_rate=0.1
)
```

**Risk Factors**: Gender, Age, Smoking, Yellow Fingers, Anxiety, Peer Pressure, Chronic Disease, Fatigue, Allergy, Wheezing, Alcohol, Coughing, Shortness of Breath, Swallowing Difficulty, Chest Pain

### 🧠 Parkinson's Disease – Voice Biomarker Analysis

**Features**: 22 vocal biomarkers including MDVP measures, Jitter, Shimmer, NHR, HNR, RPDE, DFA, Spread1/2, D2, PPE

**Model**: Support Vector Machine (RBF Kernel)
```python
SVC(
    kernel='rbf',
    C=10,
    gamma=0.01,
    probability=True
)
```

**Cross-Validation**: 5-fold CV with stratification

### 🦋 Thyroid Disorder – Multiclass Classification

**Classes**: Normal, Hypothyroid, Hyperthyroid

**Model**: Random Forest Classifier
```python
RandomForestClassifier(
    n_estimators=300,
    max_depth=12,
    min_samples_split=5,
    min_samples_leaf=2
)
```

**Lab Values**: Age, Sex, TSH, T3, TT4, T4U, FTI + Clinical Symptoms

### 📊 Diabetes – Advanced Preprocessing

**Preprocessing**:
- Zero imputation for physiologically impossible values (BP, Glucose, BMI)
- SMOTE oversampling for class balance
- StandardScaler normalization

**Model**: XGBoost with 5-fold cross-validation

---

## 💻 Tech Stack

### Backend Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Python** | 3.10+ | Core programming language |
| **FastAPI** | 0.100+ | High-performance REST API framework |
| **Uvicorn** | Latest | ASGI server |
| **SQLAlchemy** | 2.x | ORM for relational database |
| **PyMongo** | Latest | MongoDB driver |
| **Pydantic** | 2.x | Data validation |
| **python-jose** | Latest | JWT token handling |
| **bcrypt** | Latest | Password hashing |
| **fpdf2** | Latest | PDF report generation |

### AI/ML Stack

| Library | Purpose |
|---------|---------|
| **TensorFlow** 2.12+ | Deep learning framework |
| **Keras** | High-level neural network API |
| **Scikit-learn** | Traditional ML algorithms |
| **XGBoost** | Gradient boosting |
| **imbalanced-learn** | SMOTE oversampling |
| **Pandas** | Data manipulation |
| **NumPy** | Numerical computing |
| **OpenCV** | Image processing |
| **Pillow** | Image handling |

### Frontend Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 19.2+ | UI framework |
| **Vite** | 6.x | Build tool & dev server |
| **TypeScript** | Latest | Type safety |
| **Tailwind CSS** | 4.x | Utility-first CSS |
| **Shadcn UI** | Latest | Component library |
| **Radix UI** | Latest | Headless UI primitives |
| **Lucide React** | Latest | Icon library |
| **Recharts** | Latest | Data visualization |
| **React Router** | 7.x | Client-side routing |

### Real-time Communication

| Technology | Purpose |
|-----------|---------|
| **LiveKit** | WebRTC media server |
| **LiveKit React SDK** | React components for video/audio |
| **Express.js** | Token generation server |

### DevOps & Deployment

| Tool | Purpose |
|------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Multi-container orchestration |
| **Nginx** | Reverse proxy & load balancer |
| **GitHub Actions** | CI/CD pipeline |
| **AWS EC2** | Cloud hosting |
| **AWS S3** | File storage |

---

## 📊 Dashboard Modules

### 1️⃣ Patient Dashboard

**Access Level**: Standard User (JWT Protected)

**Features**:
- 📈 Health overview with AI risk scores
- 🩺 Disease prediction interface
- 📁 Secure health locker (upload/download reports)
- 📅 Appointment management
- 👨‍⚕️ Doctor directory & ratings
- 💬 Chat with healthcare providers
- 📊 Health trend visualization
- 🔔 Notification center

**Key Components**:
```
/dashboard
  ├── HealthOverview (Cards with metrics)
  ├── RecentPredictions (Table with results)
  ├── UpcomingAppointments (Calendar view)
  ├── QuickActions (CTA buttons)
  └── HealthTrends (Recharts visualization)
```

### 2️⃣ Doctor Dashboard

**Access Level**: Healthcare Provider (Role-based access)

**Features**:
- 👥 Patient management system
- 📋 Consultation history
- 📅 Appointment calendar
- 💊 Prescription management
- 📊 Patient analytics
- 🎥 Video consultation interface
- 📝 Medical notes & records
- 🔍 Patient search & filters

**Key Components**:
```
/doctor
  ├── PatientList (DataTable with search)
  ├── ConsultationQueue (Real-time updates)
  ├── AppointmentCalendar (FullCalendar integration)
  ├── PrescriptionManager (CRUD operations)
  └── VideoConsultation (LiveKit integration)
```

### 3️⃣ Admin Dashboard

**Access Level**: System Administrator

**Features**:
- 📊 System analytics & metrics
- 👥 User management (CRUD)
- 🔍 Prediction monitoring
- ⚙️ Model performance tracking
- 🛡️ Security & audit logs
- 📈 Usage statistics
- 🔐 Role & permission management
- 🗄️ Database management

**Key Components**:
```
/admin
  ├── SystemMetrics (Charts & KPIs)
  ├── UserManagement (DataTable with actions)
  ├── ModelMonitoring (Accuracy tracking)
  ├── AuditLogs (Activity timeline)
  └── SystemSettings (Configuration panel)
```

---

## 🔌 Backend APIs

### API Documentation

**Interactive Docs**: `http://localhost:8000/docs` (Swagger UI)  
**ReDoc**: `http://localhost:8000/redoc`

### Core Endpoints

#### 🔐 Authentication API

```http
POST /auth/register
Content-Type: application/json

{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "patient"
}

Response: 201 Created
{
  "id": 1,
  "email": "john@example.com",
  "full_name": "John Doe",
  "role": "patient",
  "created_at": "2024-01-15T10:30:00Z"
}
```

```http
POST /auth/login
Content-Type: application/x-www-form-urlencoded

username=john@example.com&password=SecurePass123!

Response: 200 OK
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 86400
}
```

#### 🩺 Disease Prediction API

```http
POST /predict/heart_disease
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "age": 45,
  "sex": 1,
  "cp": 2,
  "trestbps": 130,
  "chol": 250,
  "fbs": 0,
  "restecg": 1,
  "thalach": 150,
  "exang": 0,
  "oldpeak": 1.5,
  "slope": 1,
  "ca": 0,
  "thal": 2
}

Response: 200 OK
{
  "prediction_id": 42,
  "disease": "heart_disease",
  "result": "positive",
  "risk_score": 0.78,
  "confidence": 0.85,
  "risk_level": "high",
  "recommendations": [
    "Consult a cardiologist immediately",
    "Monitor blood pressure regularly",
    "Follow a heart-healthy diet"
  ],
  "report_url": "/reports/42/download",
  "created_at": "2024-01-15T14:20:00Z"
}
```

```http
POST /predict/blood_cell_cancer
Authorization: Bearer {access_token}
Content-Type: multipart/form-data

image: [Binary image file - 224x224 RGB]

Response: 200 OK
{
  "prediction_id": 43,
  "disease": "blood_cell_cancer",
  "predicted_class": "Pre-B ALL",
  "confidence": 0.93,
  "class_probabilities": {
    "Benign": 0.02,
    "Early Pre-B ALL": 0.05,
    "Pre-B ALL": 0.93,
    "Pro-B ALL": 0.00
  },
  "recommendations": [
    "Urgent consultation with oncologist required",
    "Further confirmatory tests recommended"
  ],
  "report_url": "/reports/43/download"
}
```

#### 📋 Health Records API

```http
GET /records
Authorization: Bearer {access_token}

Response: 200 OK
{
  "records": [
    {
      "id": 1,
      "record_type": "lab_report",
      "title": "Blood Test Results",
      "date": "2024-01-10",
      "data": { "hemoglobin": 13.5, "wbc": 7000 },
      "file_url": "/uploads/lab_report_1.pdf"
    }
  ],
  "total": 5,
  "page": 1,
  "per_page": 10
}
```

```http
POST /records
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "record_type": "medical_history",
  "title": "Surgical History",
  "date": "2023-06-15",
  "data": {
    "procedure": "Appendectomy",
    "hospital": "City Hospital",
    "surgeon": "Dr. Smith"
  }
}
```

#### 👨‍⚕️ Doctor Network API

```http
GET /doctors?specialty=cardiology&rating_min=4.0
Authorization: Bearer {access_token}

Response: 200 OK
{
  "doctors": [
    {
      "id": 10,
      "name": "Dr. Sarah Johnson",
      "specialty": "Cardiology",
      "qualifications": "MD, FACC",
      "experience_years": 15,
      "rating": 4.8,
      "consultation_fee": 100,
      "available_slots": ["2024-01-16 10:00", "2024-01-16 14:00"],
      "hospital": "Apollo Hospital"
    }
  ],
  "total": 12
}
```

#### 📅 Appointments API

```http
POST /appointments
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "doctor_id": 10,
  "appointment_date": "2024-01-16",
  "appointment_time": "10:00",
  "reason": "Heart disease consultation",
  "type": "video_call"
}

Response: 201 Created
{
  "appointment_id": 25,
  "status": "scheduled",
  "livekit_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "room_name": "consultation-25"
}
```

### API Rate Limiting

| Endpoint Category | Rate Limit |
|------------------|------------|
| Authentication | 10 requests/minute |
| Disease Prediction | 20 requests/hour |
| File Upload | 5 uploads/minute |
| General API | 100 requests/minute |

### Error Handling

**Standard Error Response**:
```json
{
  "error": "ValidationError",
  "message": "Invalid input data",
  "details": {
    "age": ["Field required"],
    "cholesterol": ["Value must be between 100-400"]
  },
  "status_code": 422
}
```

---

## 🎨 Frontend Features

### Modern UI/UX Design

- **Design System**: Tailwind CSS + Shadcn UI components
- **Theme**: Dark/Light mode support with next-themes
- **Typography**: Inter font family
- **Icons**: Lucide React (500+ icons)
- **Animations**: Framer Motion for smooth transitions
- **Responsive**: Mobile-first design (320px - 4K)

### Key Pages

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | Landing | Marketing homepage |
| `/auth` | Auth | Login/Register forms |
| `/dashboard` | Dashboard | Patient overview |
| `/diagnosis` | Diagnosis | AI prediction interface |
| `/predictions` | Predictions | Historical results |
| `/locker` | HealthLocker | Document management |
| `/doctors` | DoctorDirectory | Specialist search |
| `/appointments` | Appointments | Booking system |
| `/consultation/:id` | VideoCall | LiveKit integration |
| `/doctor` | DoctorDashboard | Provider workspace |
| `/admin` | AdminDashboard | System management |

### State Management

```typescript
// AuthContext - Global Authentication State
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Usage
const { user, login, logout } = useAuth();
```

### API Integration

```typescript
// API Client with Interceptors
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - Add JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);
```

### Component Architecture

```
src/
├── components/
│   ├── ui/                    # Shadcn UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── DashboardLayout.tsx
│   │   ├── Sidebar.tsx
│   │   └── TopBar.tsx
│   ├── features/
│   │   ├── DiagnosisForm.tsx
│   │   ├── PredictionCard.tsx
│   │   └── HealthChart.tsx
│   └── shared/
│       ├── LoadingSpinner.tsx
│       └── ErrorBoundary.tsx
```

---

## 🗄️ Database Design

### Relational Database (SQLite/PostgreSQL)

#### **Users Table**
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'patient',
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(10),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **Predictions Table**
```sql
CREATE TABLE predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    disease_module VARCHAR(50) NOT NULL,
    input_data JSON NOT NULL,
    prediction_result JSON NOT NULL,
    risk_score FLOAT,
    confidence FLOAT,
    risk_level VARCHAR(20),
    report_path VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### **Health Records Table**
```sql
CREATE TABLE health_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    record_type VARCHAR(50),
    title VARCHAR(255),
    date DATE,
    data JSON,
    file_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### **Doctors Table**
```sql
CREATE TABLE doctors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE,
    specialty VARCHAR(100),
    qualifications VARCHAR(500),
    experience_years INTEGER,
    consultation_fee DECIMAL(10, 2),
    rating DECIMAL(3, 2) DEFAULT 0.0,
    hospital VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### **Appointments Table**
```sql
CREATE TABLE appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(50) DEFAULT 'scheduled',
    type VARCHAR(50) DEFAULT 'video_call',
    reason TEXT,
    livekit_room VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);
```

### Document Database (MongoDB)

**Collection: consultation_notes**
```json
{
  "_id": "64a5f8e9c1234567890abcde",
  "appointment_id": 25,
  "doctor_id": 10,
  "patient_id": 5,
  "diagnosis": "Hypertension Stage 2",
  "symptoms": ["headache", "dizziness", "fatigue"],
  "prescriptions": [
    {
      "medication": "Amlodipine",
      "dosage": "5mg",
      "frequency": "Once daily",
      "duration": "30 days"
    }
  ],
  "lab_orders": ["CBC", "Lipid Profile"],
  "follow_up_date": "2024-02-15",
  "notes": "Patient advised lifestyle modifications",
  "created_at": "2024-01-15T10:30:00Z"
}
```

**Collection: chat_messages**
```json
{
  "_id": "64a5f8e9c1234567890abcdf",
  "room_id": "consultation-25",
  "sender_id": 5,
  "sender_name": "John Doe",
  "message": "I have been experiencing chest pain",
  "timestamp": "2024-01-15T10:35:00Z",
  "is_read": true
}
```

### Database Relationships

```
users (1) ────────── (N) predictions
  │
  ├─────────────────── (N) health_records
  │
  └─────────────────── (1) doctors
                         │
                         └──────── (N) appointments
```

---

## 🔐 Authentication & Security

### JWT-Based Authentication

**Token Structure**:
```json
{
  "sub": "john@example.com",
  "user_id": 5,
  "role": "patient",
  "exp": 1705334400,
  "iat": 1705248000
}
```

**Token Generation**:
```python
from jose import jwt
from datetime import datetime, timedelta

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=24)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
```

### Security Measures

| Layer | Implementation |
|-------|----------------|
| **Password Hashing** | bcrypt with salt rounds=12 |
| **JWT Secret** | 256-bit random key, environment variable |
| **HTTPS** | TLS 1.3 encryption for all API calls |
| **CORS** | Restricted origins in production |
| **Rate Limiting** | Token bucket algorithm |
| **Input Validation** | Pydantic models with strict typing |
| **SQL Injection** | SQLAlchemy ORM parameterized queries |
| **XSS Protection** | Content Security Policy headers |
| **File Upload** | File type validation, virus scanning |

### HIPAA Compliance

- **Data Encryption**: AES-256 encryption at rest
- **Access Logs**: Audit trail for all data access
- **Role-Based Access Control**: Granular permissions
- **Data Retention**: Automatic purge after 7 years
- **Secure Communication**: End-to-end encryption for video calls

### Environment Variables Security

```bash
# NEVER commit .env files to Git
# Use .env.example for templates

# Example .env structure
JWT_SECRET=<generated-with-openssl-rand-base64-32>
DATABASE_URL=postgresql://user:pass@localhost/db
MONGO_URI=mongodb+srv://user:pass@cluster.net/db
AWS_ACCESS_KEY_ID=<aws-key>
AWS_SECRET_ACCESS_KEY=<aws-secret>
```

---

## ⚙️ Installation Guide

### Prerequisites

- **Python**: 3.10 or higher
- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Docker**: 24.x or higher (optional)
- **Git**: Latest version

### System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| RAM | 4 GB | 8 GB |
| Storage | 10 GB | 20 GB |
| CPU | 2 cores | 4 cores |
| OS | Linux, macOS, Windows | Ubuntu 22.04 LTS |

---

## 🖥️ Backend Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/your-username/aarogyaai.git
cd aarogyaai
```

### Step 2: Create Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate on Windows
venv\Scripts\activate

# Activate on macOS/Linux
source venv/bin/activate
```

### Step 3: Install Python Dependencies

```bash
# Install from root requirements.txt
pip install -r requirements.txt

# Or install backend-specific dependencies
cd backend
pip install -r requirements.txt
```

### Step 4: Download Datasets

Place datasets in `training/Dataset/` directory:

| Dataset | Source | Size |
|---------|--------|------|
| Blood Cell Cancer | [Kaggle](https://www.kaggle.com/datasets/mohammadamireshraghi/blood-cell-cancer-all-4class) | ~2 GB |
| Heart Disease | [Kaggle](https://www.kaggle.com/datasets/johnsmith88/heart-disease-dataset) | 15 MB |
| Lung Cancer | [Kaggle](https://www.kaggle.com/datasets/akashnath29/lung-cancer-dataset) | 5 MB |
| Parkinson's | [Kaggle](https://www.kaggle.com/datasets/debasisdotcom/parkinson-disease-detection) | 2 MB |
| Thyroid | [Kaggle](https://www.kaggle.com/datasets/yasserhessein/thyroid-disease-data-set) | 8 MB |
| Diabetes | [Kaggle](https://www.kaggle.com/datasets/imtkaggleteam/diabetes) | 3 MB |

### Step 5: Configure Environment Variables

Create `backend/.env`:

```env
# Database
DATABASE_URL=sqlite:///./aarogyaai_v2.db
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/aarogyaai_db

# JWT Security
JWT_SECRET=your-super-secret-key-change-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# Admin Credentials
ADMIN_EMAIL=admin@aarogyaai.com
ADMIN_PASSWORD=SecureAdminPass123!

# Email Configuration (Optional)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

# AWS S3 (Optional)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_BUCKET_NAME=aarogyaai-storage
AWS_REGION=us-east-1

# LiveKit
LIVEKIT_API_KEY=your-livekit-key
LIVEKIT_API_SECRET=your-livekit-secret
LIVEKIT_URL=wss://your-livekit-server.com
```

### Step 6: Train Models (Optional)

```bash
# Train all models
cd training
python train_model.py

# Train specific model
python train_model.py --disease heart

# With custom dataset paths
python train_model.py \
  --heart-csv path/to/heart.csv \
  --lung-csv path/to/lung.csv
```

**Training Output**:
- Trained models → `models/`
- Evaluation reports → `reports/`
- Metrics JSON → `models/*_metrics.json`

### Step 7: Initialize Database

```bash
cd backend
python -c "from database.db import init_db; init_db()"
```

### Step 8: Run Backend Server

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend available at: **http://localhost:8000**  
Swagger Docs: **http://localhost:8000/docs**

---

## 🎨 Frontend Setup

### Step 1: Install Node Dependencies

```bash
cd frontend
npm install
```

### Step 2: Configure Environment Variables

Create `frontend/.env.local`:

```env
# Backend API
VITE_API_BASE=http://localhost:8000

# LiveKit
VITE_LIVEKIT_URL=ws://localhost:7880
VITE_TOKEN_SERVER_URL=http://localhost:3001

# App Configuration
VITE_APP_NAME=AarogyaAI
VITE_APP_VERSION=2.0.0
```

### Step 3: Run Development Server

```bash
npm run dev
```

Frontend available at: **http://localhost:5173**

### Step 4: Build for Production

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview
```

Build output → `frontend/dist/`

---

## 🌐 Environment Variables

### Backend (.env)

```bash
# Database Configuration
DATABASE_URL=sqlite:///./aarogyaai_v2.db
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/aarogyaai

# Security
JWT_SECRET=<64-char-random-string>
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# Admin Account
ADMIN_EMAIL=admin@aarogyaai.com
ADMIN_PASSWORD=<strong-password>

# Email Service (SMTP)
EMAIL_USER=noreply@aarogyaai.com
EMAIL_PASSWORD=<app-password>
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

# AWS S3 Storage
AWS_ACCESS_KEY_ID=<aws-key>
AWS_SECRET_ACCESS_KEY=<aws-secret>
AWS_BUCKET_NAME=aarogyaai-files
AWS_REGION=us-east-1

# LiveKit Configuration
LIVEKIT_API_KEY=<livekit-key>
LIVEKIT_API_SECRET=<livekit-secret>
LIVEKIT_URL=wss://livekit.aarogyaai.com

# AI Model Paths
MODELS_DIR=./models
REPORTS_DIR=./reports
```

### Frontend (.env.local)

```bash
# API Configuration
VITE_API_BASE=http://localhost:8000
VITE_API_TIMEOUT=30000

# LiveKit
VITE_LIVEKIT_URL=ws://localhost:7880
VITE_TOKEN_SERVER_URL=http://localhost:3001

# Feature Flags
VITE_ENABLE_CHAT=true
VITE_ENABLE_VIDEO_CALLS=true
VITE_ENABLE_ANALYTICS=true

# App Metadata
VITE_APP_NAME=AarogyaAI
VITE_APP_VERSION=2.0.0
VITE_APP_DESCRIPTION=AI-Powered Healthcare Platform
```

### LiveKit Backend (.env)

```bash
LIVEKIT_API_KEY=devkey
LIVEKIT_API_SECRET=secret
LIVEKIT_URL=ws://localhost:7880
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

---

## 🐳 Docker Deployment

### Docker Compose Architecture

```yaml
version: '3.8'

services:
  # Backend API
  backend:
    build: ./backend
    container_name: aarogyaai-backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=sqlite:///./aarogyaai_v2.db
      - JWT_SECRET=${JWT_SECRET}
    volumes:
      - ./models:/app/models
      - ./reports:/app/reports
    networks:
      - aarogyaai-net

  # Frontend
  frontend:
    build: ./frontend
    container_name: aarogyaai-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - aarogyaai-net

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: aarogyaai-nginx
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - backend
      - frontend
    networks:
      - aarogyaai-net

  # LiveKit Server
  livekit:
    image: livekit/livekit-server:latest
    container_name: aarogyaai-livekit
    ports:
      - "7880:7880"
      - "7881:7881"
    volumes:
      - ./Livekit/livekit.yaml:/etc/livekit.yaml
    networks:
      - aarogyaai-net

  # LiveKit Token Server
  livekit-backend:
    build: ./Livekit/Livekit_BE
    container_name: aarogyaai-livekit-backend
    ports:
      - "3001:3001"
    depends_on:
      - livekit
    networks:
      - aarogyaai-net

networks:
  aarogyaai-net:
    driver: bridge
```

### Build & Run

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f backend
```

### Individual Docker Images

**Backend Dockerfile**:
```dockerfile
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    libhdf5-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Expose port
EXPOSE 8000

# Run application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Frontend Dockerfile**:
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy build files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

---

## ☁️ AWS/Cloud Deployment

### AWS Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     AWS Cloud                            │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Route 53 (DNS)                       │  │
│  │        aarogyaai.com → CloudFront                 │  │
│  └──────────────────────────────────────────────────┘  │
│                           │                              │
│  ┌──────────────────────────────────────────────────┐  │
│  │         CloudFront (CDN + SSL)                    │  │
│  │    - Global content delivery                      │  │
│  │    - SSL/TLS termination                          │  │
│  └──────────────────────────────────────────────────┘  │
│                           │                              │
│  ┌──────────────────────────────────────────────────┐  │
│  │      Application Load Balancer (ALB)             │  │
│  │    - Health checks                                │  │
│  │    - Auto-scaling integration                     │  │
│  └──────────────────────────────────────────────────┘  │
│                     │          │                         │
│         ┌───────────┴──────┐   └──────────┐             │
│  ┌──────────────┐   ┌──────────────┐   ┌─────────────┐ │
│  │   EC2 Auto   │   │   EC2 Auto   │   │     S3      │ │
│  │   Scaling    │   │   Scaling    │   │   Storage   │ │
│  │   (Backend)  │   │  (Frontend)  │   │   (Files)   │ │
│  └──────────────┘   └──────────────┘   └─────────────┘ │
│         │                    │                           │
│  ┌──────────────┐   ┌──────────────┐                   │
│  │   RDS (DB)   │   │  ElastiCache │                   │
│  │  PostgreSQL  │   │    (Redis)   │                   │
│  └──────────────┘   └──────────────┘                   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Step-by-Step AWS Deployment

#### 1. EC2 Instance Setup

```bash
# Launch Ubuntu 22.04 LTS instance
# Instance type: t3.medium (2 vCPU, 4 GB RAM)

# Connect via SSH
ssh -i your-key.pem ubuntu@ec2-xx-xx-xx-xx.compute.amazonaws.com

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### 2. Deploy Application

```bash
# Clone repository
git clone https://github.com/your-username/aarogyaai.git
cd aarogyaai

# Create .env files
nano backend/.env
nano frontend/.env.production

# Build and run
docker-compose -f docker-compose.prod.yml up -d
```

#### 3. RDS Database Setup

```bash
# Create PostgreSQL RDS instance
# Instance class: db.t3.micro
# Storage: 20 GB SSD

# Update backend/.env
DATABASE_URL=postgresql://admin:password@aarogyaai-db.xxxxx.rds.amazonaws.com:5432/aarogyaai
```

#### 4. S3 Bucket Configuration

```bash
# Create S3 bucket
aws s3 mb s3://aarogyaai-storage --region us-east-1

# Configure CORS
aws s3api put-bucket-cors --bucket aarogyaai-storage --cors-configuration file://cors.json

# Update backend/.env
AWS_BUCKET_NAME=aarogyaai-storage
```

#### 5. CloudFront CDN

```bash
# Create CloudFront distribution
# Origin: ALB DNS name
# SSL Certificate: AWS Certificate Manager

# Update frontend/.env.production
VITE_API_BASE=https://api.aarogyaai.com
VITE_CDN_URL=https://cdn.aarogyaai.com
```

#### 6. Route 53 DNS

```bash
# Create hosted zone: aarogyaai.com
# Add A record: aarogyaai.com → CloudFront
# Add CNAME: api.aarogyaai.com → ALB
```

### Production docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    restart: always
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
      - AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
      - AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
    volumes:
      - ./models:/app/models:ro
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '1.0'
          memory: 2G

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    restart: always
    deploy:
      replicas: 2

  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "443:443"
      - "80:80"
    volumes:
      - ./nginx.prod.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - backend
      - frontend
```

### CI/CD with GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to AWS

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v2
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-1
    
    - name: Login to Amazon ECR
      id: login-ecr
      uses: aws-actions/amazon-ecr-login@v1
    
    - name: Build and push Docker images
      env:
        ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        ECR_REPOSITORY: aarogyaai
        IMAGE_TAG: ${{ github.sha }}
      run: |
        docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG ./backend
        docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
    
    - name: Deploy to EC2
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.EC2_HOST }}
        username: ubuntu
        key: ${{ secrets.EC2_SSH_KEY }}
        script: |
          cd /home/ubuntu/aarogyaai
          git pull origin main
          docker-compose -f docker-compose.prod.yml up -d --build
```

---

## 📁 Project Structure

```
AarogyaAI/
│
├── 📂 backend/                         # FastAPI Backend
│   ├── main.py                         # FastAPI app & routes
│   ├── requirements.txt                # Python dependencies
│   ├── Dockerfile                      # Backend Docker image
│   ├── database/
│   │   ├── db.py                       # SQLAlchemy setup
│   │   ├── models.py                   # ORM models
│   │   └── mongodb.py                  # MongoDB integration
│   ├── report_generator.py             # PDF report generator
│   └── tests/                          # Unit tests
│       ├── test_auth.py
│       ├── test_predictions.py
│       └── test_api.py
│
├── 📂 frontend/                        # React Frontend
│   ├── public/                         # Static assets
│   ├── src/
│   │   ├── pages/                      # Route components
│   │   │   ├── Auth.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Diagnosis.tsx
│   │   │   ├── Predictions.tsx
│   │   │   ├── Locker.tsx
│   │   │   ├── Doctors.tsx
│   │   │   ├── Appointments.tsx
│   │   │   ├── Admin.tsx
│   │   │   └── DoctorDashboard.tsx
│   │   ├── components/
│   │   │   ├── ui/                     # Shadcn components
│   │   │   ├── layout/                 # Layout components
│   │   │   ├── features/               # Feature components
│   │   │   └── shared/                 # Shared utilities
│   │   ├── context/
│   │   │   └── AuthContext.tsx         # Global state
│   │   ├── lib/
│   │   │   ├── api.ts                  # API client
│   │   │   └── utils.ts                # Helper functions
│   │   ├── App.tsx                     # Main component
│   │   └── main.tsx                    # Entry point
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── Dockerfile                      # Frontend Docker image
│
├── 📂 models/                          # Trained ML Models
│   ├── blood_cell_cancer_model.keras   # EfficientNetB0
│   ├── heart_disease_model.pkl         # XGBoost
│   ├── lung_cancer_model.pkl           # GradientBoosting
│   ├── parkinsons_model.pkl            # SVM
│   ├── thyroid_model.pkl               # RandomForest
│   ├── diabetes_model.pkl              # XGBoost
│   ├── *_features.json                 # Scaler parameters
│   └── *_metrics.json                  # Model performance
│
├── 📂 training/                        # Model Training
│   ├── Dataset/                        # Raw datasets
│   │   ├── heart_disease.csv
│   │   ├── Lung_Cancer_Dataset.csv
│   │   ├── diabetes.csv
│   │   ├── Thyroid_Disease_Dataset.csv
│   │   ├── Parkinsson disease.csv
│   │   └── Blood cell Cancer [ALL]/
│   ├── train_model.py                  # Training pipeline
│   ├── blood_cell_training.ipynb       # Jupyter notebooks
│   ├── heart_disease_training.ipynb
│   └── ...
│
├── 📂 Livekit/                         # Real-time Communication
│   ├── livekit.yaml                    # LiveKit config
│   ├── docker-compose.yml              # LiveKit deployment
│   ├── Livekit_BE/                     # Token server
│   │   ├── server.js
│   │   ├── package.json
│   │   └── Dockerfile
│   └── Livekit_FE/                     # React client
│       ├── src/
│       │   ├── components/
│       │   ├── hooks/
│       │   └── App.jsx
│       └── package.json
│
├── 📂 reports/                         # Generated Reports
│   ├── confusion_matrices/
│   ├── roc_curves/
│   └── pdf_reports/
│
├── 📂 docs/                            # Documentation
│   ├── API.md                          # API documentation
│   ├── DEPLOYMENT.md                   # Deployment guide
│   └── CONTRIBUTING.md                 # Contribution guide
│
├── 📂 .github/                         # GitHub Actions
│   └── workflows/
│       ├── deploy.yml                  # CI/CD pipeline
│       └── tests.yml                   # Automated testing
│
├── docker-compose.yml                  # Development compose
├── docker-compose.prod.yml             # Production compose
├── nginx.conf                          # Nginx configuration
├── requirements.txt                    # Root Python deps
├── .env.example                        # Environment template
├── .gitignore                          # Git ignore rules
├── LICENSE                             # MIT License
└── README.md                           # This file
```

---

## 🧪 Model Training Workflow

### Training Pipeline Architecture

```
┌─────────────────────────────────────────────────────────┐
│                 Data Preparation                         │
│  ┌─────────┐   ┌──────────┐   ┌────────────┐           │
│  │  Load   │──>│ Clean    │──>│ Feature    │           │
│  │  Data   │   │ Data     │   │ Engineer   │           │
│  └─────────┘   └──────────┘   └────────────┘           │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│              Data Preprocessing                          │
│  ┌─────────┐   ┌──────────┐   ┌────────────┐           │
│  │  Handle │──>│   Scale  │──>│   Split    │           │
│  │ Missing │   │ Features │   │   Data     │           │
│  └─────────┘   └──────────┘   └────────────┘           │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                Model Training                            │
│  ┌─────────┐   ┌──────────┐   ┌────────────┐           │
│  │  Build  │──>│  Train   │──>│  Validate  │           │
│  │  Model  │   │  Model   │   │   Model    │           │
│  └─────────┘   └──────────┘   └────────────┘           │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│              Model Evaluation                            │
│  ┌─────────┐   ┌──────────┐   ┌────────────┐           │
│  │  Test   │──>│ Generate │──>│    Save    │           │
│  │  Model  │   │ Metrics  │   │   Model    │           │
│  └─────────┘   └──────────┘   └────────────┘           │
└─────────────────────────────────────────────────────────┘
```

### Training Commands

```bash
# Navigate to training directory
cd training

# Train all models sequentially
python train_model.py

# Train specific model
python train_model.py --disease blood_cell
python train_model.py --disease heart
python train_model.py --disease lung
python train_model.py --disease parkinsons
python train_model.py --disease thyroid
python train_model.py --disease diabetes

# Custom dataset paths
python train_model.py \
  --blood-dir "path/to/blood/images" \
  --heart-csv "path/to/heart.csv" \
  --lung-csv "path/to/lung.csv" \
  --park-csv "path/to/parkinsons.csv" \
  --thy-csv "path/to/thyroid.csv" \
  --diab-csv "path/to/diabetes.csv"

# Advanced options
python train_model.py \
  --disease heart \
  --epochs 50 \
  --batch-size 64 \
  --learning-rate 0.001 \
  --validation-split 0.2
```

### Model Training Output

```
training/
├── models/                      # Saved models
│   ├── blood_cell_cancer_model.keras
│   ├── heart_disease_model.pkl
│   └── ...
├── reports/                     # Evaluation reports
│   ├── blood_cell_confusion.png
│   ├── heart_roc.png
│   └── ...
└── logs/                        # Training logs
    ├── training_2024_01_15.log
    └── tensorboard/
```

### Evaluation Metrics

Each trained model generates:
- **Confusion Matrix**: Classification performance visualization
- **ROC Curve**: True Positive Rate vs False Positive Rate
- **Classification Report**: Precision, Recall, F1-Score per class
- **Feature Importance**: Top contributing features (for tree-based models)
- **Training History**: Loss and accuracy curves (for neural networks)

### Example Training Log

```
[2024-01-15 10:30:00] Starting Heart Disease model training
[2024-01-15 10:30:05] Dataset loaded: 1025 samples
[2024-01-15 10:30:06] Data preprocessing complete
[2024-01-15 10:30:08] Train-Test split: 820 / 205
[2024-01-15 10:30:15] Model training complete
[2024-01-15 10:30:16] Test Accuracy: 88.29%
[2024-01-15 10:30:17] Precision: 0.86 | Recall: 0.89 | F1: 0.87
[2024-01-15 10:30:18] Model saved: models/heart_disease_model.pkl
[2024-01-15 10:30:19] Reports generated: reports/heart_confusion.png
```

---

## 🔮 Future Enhancements

### 🤖 Generative AI & LLM Integration

#### 1. Medical Chatbot (Conversational AI)

**Technology**: OpenAI GPT-4, LangChain, Pinecone Vector DB

```python
# Planned Architecture
from langchain.chat_models import ChatOpenAI
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Pinecone
from langchain.chains import ConversationalRetrievalChain

# Medical knowledge base RAG system
embeddings = OpenAIEmbeddings()
vectorstore = Pinecone.from_documents(medical_docs, embeddings)

# Conversational chain with memory
qa_chain = ConversationalRetrievalChain.from_llm(
    llm=ChatOpenAI(model="gpt-4", temperature=0.2),
    retriever=vectorstore.as_retriever(search_kwargs={"k": 5}),
    return_source_documents=True
)

# Example interaction
response = qa_chain({
    "question": "What are the early symptoms of diabetes?",
    "chat_history": chat_history
})
```

**Features**:
- 24/7 AI health assistant
- Symptom checker with medical knowledge retrieval
- Medication interaction warnings
- Health tips and preventive care advice
- Multi-language support

#### 2. Agentic AI for Clinical Decision Support

**Technology**: LangGraph, AutoGPT, CrewAI

```python
# Multi-agent system for diagnosis assistance
from langgraph.graph import StateGraph, END

# Define agents
class DiagnosisAgent:
    def analyze_symptoms(self, symptoms):
        # LLM-based symptom analysis
        pass
    
    def suggest_tests(self, analysis):
        # Recommend appropriate diagnostic tests
        pass
    
    def generate_differential_diagnosis(self, data):
        # Create list of possible diagnoses
        pass

# Build workflow graph
workflow = StateGraph()
workflow.add_node("symptom_analyzer", analyze_symptoms)
workflow.add_node("test_recommender", suggest_tests)
workflow.add_node("diagnosis_generator", generate_differential_diagnosis)

# Define edges
workflow.add_edge("symptom_analyzer", "test_recommender")
workflow.add_edge("test_recommender", "diagnosis_generator")
workflow.set_entry_point("symptom_analyzer")

# Compile and run
app = workflow.compile()
result = app.invoke(patient_data)
```

**Capabilities**:
- Autonomous diagnostic reasoning
- Treatment plan suggestions
- Drug interaction checking
- Follow-up care recommendations

#### 3. Retrieval-Augmented Generation (RAG) for Medical Research

**Technology**: LlamaIndex, ChromaDB, Hugging Face Embeddings

```python
# Medical research assistant with RAG
from llama_index import VectorStoreIndex, ServiceContext
from llama_index.llms import OpenAI
from llama_index.embeddings import HuggingFaceEmbedding

# Index medical literature
embed_model = HuggingFaceEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")
service_context = ServiceContext.from_defaults(embed_model=embed_model)

index = VectorStoreIndex.from_documents(
    medical_papers,
    service_context=service_context
)

# Query with citations
query_engine = index.as_query_engine(
    response_mode="tree_summarize",
    similarity_top_k=10
)

response = query_engine.query("Latest treatments for Type 2 Diabetes")
print(response.response)
print(response.source_nodes)  # Citations
```

**Use Cases**:
- Evidence-based medicine lookup
- Clinical guideline recommendations
- Drug efficacy comparisons
- Treatment protocol suggestions

### 🚀 Advanced AI Features (Planned)

| Feature | Technology | Status | ETA |
|---------|-----------|--------|-----|
| **AI Symptom Checker** | GPT-4 + RAG | 🟡 In Progress | Q2 2024 |
| **Medical Image Captioning** | CLIP, BLIP-2 | 🔴 Planned | Q3 2024 |
| **Prescription OCR & Understanding** | GPT-4 Vision | 🟡 In Progress | Q2 2024 |
| **Personalized Health Insights** | LLM Fine-tuning | 🔴 Planned | Q4 2024 |
| **Multi-modal Diagnosis** | Gemini Pro Vision | 🔴 Planned | Q3 2024 |
| **Voice-based Health Assistant** | Whisper + GPT-4 | 🔴 Planned | Q4 2024 |

### 🌟 Other Planned Features

- **Genomic Data Analysis**: Integration with DNA testing services
- **Wearable Device Integration**: Apple Health, Fitbit, Google Fit
- **Blockchain Health Records**: Decentralized patient data storage
- **IoT Medical Devices**: Real-time vitals monitoring
- **Federated Learning**: Privacy-preserving model training
- **Edge AI**: On-device predictions for privacy
- **3D Medical Imaging**: CT/MRI scan analysis
- **Drug Discovery AI**: Molecular property prediction
- **Clinical Trial Matching**: AI-powered patient-trial pairing
- **Mental Health AI**: Sentiment analysis and therapy chatbot

---

## 🎯 Challenges Faced & Solutions

| Challenge | Solution Implemented |
|-----------|---------------------|
| **Imbalanced Datasets** | Applied SMOTE oversampling + class weights in loss function |
| **Overfitting in CNN** | Used dropout (0.3), batch normalization, data augmentation |
| **Real-time Video Latency** | Implemented LiveKit with WebRTC + TURN server |
| **Large Model Size** | Quantization + TensorFlow Lite for mobile deployment |
| **JWT Token Expiry** | Added refresh token mechanism + auto-renewal |
| **CORS Issues** | Configured FastAPI CORS middleware with allowed origins |
| **Database Migrations** | Implemented Alembic for versioned schema changes |
| **File Upload Security** | Added file type validation + virus scanning |
| **Scalability** | Docker containerization + horizontal scaling |
| **Medical Data Privacy** | AES-256 encryption + HIPAA compliance measures |

---

## 📸 Screenshots

### Landing Page
![Landing Page](https://via.placeholder.com/1200x600/4F46E5/FFFFFF?text=AarogyaAI+Landing+Page)

### Patient Dashboard
![Patient Dashboard](https://via.placeholder.com/1200x600/10B981/FFFFFF?text=Patient+Dashboard)

### Disease Prediction Interface
![Diagnosis Interface](https://via.placeholder.com/1200x600/F59E0B/FFFFFF?text=AI+Diagnosis+Interface)

### Video Consultation
![Video Call](https://via.placeholder.com/1200x600/EF4444/FFFFFF?text=LiveKit+Video+Consultation)

### Admin Dashboard
![Admin Dashboard](https://via.placeholder.com/1200x600/8B5CF6/FFFFFF?text=Admin+Analytics+Dashboard)

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. **Fork the repository**
```bash
git clone https://github.com/your-username/aarogyaai.git
cd aarogyaai
```

2. **Create a feature branch**
```bash
git checkout -b feature/amazing-feature
```

3. **Make your changes**
- Follow PEP 8 for Python code
- Use ESLint/Prettier for TypeScript/React
- Write unit tests for new features
- Update documentation

4. **Commit your changes**
```bash
git commit -m "feat: add amazing feature"
```

Commit message format:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `test:` Adding tests
- `chore:` Maintenance

5. **Push to your fork**
```bash
git push origin feature/amazing-feature
```

6. **Open a Pull Request**

### Code Review Process

- All PRs require at least 1 approval
- CI/CD tests must pass
- Code coverage must not decrease
- Documentation must be updated

### Testing

```bash
# Backend tests
cd backend
pytest tests/ --cov=.

# Frontend tests
cd frontend
npm run test

# E2E tests
npm run test:e2e
```

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2024 AarogyaAI Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## ⚠️ Medical Disclaimer

> **IMPORTANT**: This project is for **educational and research purposes only**. 
> 
> Predictions made by these AI models **must NEVER** be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical concerns.
> 
> The developers of AarogyaAI assume no liability for any medical decisions made based on this software.

---

## 📞 Contact & Support

### Project Team

- **Lead Developer**: [Your Name](https://github.com/your-username)
- **Email**: contact@aarogyaai.com
- **LinkedIn**: [Your LinkedIn](https://linkedin.com/in/your-profile)

### Support Channels

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/your-username/aarogyaai/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/your-username/aarogyaai/discussions)
- 📧 **Email**: support@aarogyaai.com
- 💬 **Discord**: [Join our community](#)
- 📚 **Documentation**: [Read the docs](https://docs.aarogyaai.com)

### Stay Connected

[![GitHub](https://img.shields.io/badge/GitHub-AarogyaAI-181717?style=for-the-badge&logo=github)](https://github.com/your-username/aarogyaai)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin)](https://linkedin.com/company/aarogyaai)
[![Twitter](https://img.shields.io/badge/Twitter-Follow-1DA1F2?style=for-the-badge&logo=twitter)](https://twitter.com/aarogyaai)
[![YouTube](https://img.shields.io/badge/YouTube-Subscribe-FF0000?style=for-the-badge&logo=youtube)](https://youtube.com/@aarogyaai)

---

## 🌟 Acknowledgments

- **Kaggle** for providing medical datasets
- **FastAPI** team for the excellent framework
- **TensorFlow** community for deep learning tools
- **LiveKit** for WebRTC infrastructure
- **Shadcn** for beautiful UI components
- **Open-source community** for inspiration and support

---

<div align="center">

**Built with ❤️ by the AarogyaAI Team**

**⭐ Star this repository if you find it helpful!**

[🔝 Back to Top](#-aarogyaai--intelligent-disease-detection--smart-healthcare-platform)

</div>
