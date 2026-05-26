# AarogyaAI – Frontend

Modern React + Vite + Tailwind CSS UI for the AarogyaAI – Intelligent Disease Detection & Smart Healthcare Platform.

## 🚀 Quick Start

```bash
# From project root
cd frontend
npm install
npm run dev
```

Frontend available at: **http://localhost:5173**

---

## 📋 Features

✅ **Patient Dashboard** — Health overview, predictions, medical history  
✅ **Diagnosis Interface** — Upload data for 6 disease predictions  
✅ **Health Locker** — Secure storage for reports & documents  
✅ **Doctor Network** — Browse & connect with specialists  
✅ **Appointments** — Book consultations  
✅ **Admin Panel** — System management & analytics  
✅ **Doctor Portal** — Manage patient consultations  
✅ **Real-time Chat** — LiveKit integration for video/audio  

---

## 🏗️ Project Structure

```
frontend/
├── public/                      ← Static assets (favicon, images)
│
├── src/
│   ├── pages/                   ← Route components
│   │   ├── Auth.tsx             ← Login/Register
│   │   ├── Dashboard.tsx        ← Patient dashboard
│   │   ├── Diagnosis.tsx        ← Disease prediction form
│   │   ├── Predictions.tsx      ← Past predictions
│   │   ├── Locker.tsx           ← Health records
│   │   ├── Doctors.tsx          ← Doctor directory
│   │   ├── Admin.tsx            ← Admin dashboard
│   │   └── ...
│   │
│   ├── components/              ← Reusable components
│   │   ├── BrandLogo.tsx
│   │   ├── DashboardLayout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── TopBar.tsx
│   │   ├── RequireAuth.tsx      ← Route protection
│   │   ├── RequireAdminAuth.tsx
│   │   ├── RequireDoctorAuth.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── ui/                  ← Shadcn UI components
│   │
│   ├── context/
│   │   └── AuthContext.tsx      ← Global auth state
│   │
│   ├── layouts/
│   │   ├── AppShell.tsx         ← Main layout
│   │   └── AdminLayout.tsx      ← Admin layout
│   │
│   ├── lib/                     ← Utilities
│   │   ├── api.ts              ← API client
│   │   └── utils.ts            ← Helper functions
│   │
│   ├── App.tsx                  ← Main component with routing
│   ├── main.tsx                 ← Entry point
│   └── index.css                ← Global styles
│
├── package.json                 ← Dependencies
├── tsconfig.json                ← TypeScript config
├── vite.config.ts               ← Vite config
├── tailwind.config.js           ← Tailwind CSS config
└── README.md                    ← This file
```

---

## 🛠️ Setup & Configuration

### Install Dependencies
```bash
npm install
```

### Environment Variables
Create `.env.local` or `.env.production`:

```env
# Backend API URL
VITE_API_BASE=http://localhost:8000
# or for production
VITE_API_BASE=https://api.aarogyaai.com
```

### NPM Scripts

```bash
# Development with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint
npm run lint
```

---

## 📱 Key Pages

| Page | Route | Description |
|------|-------|-------------|
| **Auth** | `/auth` | Login/Register form |
| **Dashboard** | `/dashboard` | Patient overview & metrics |
| **Diagnosis** | `/diagnosis` | Disease prediction interface |
| **Predictions** | `/predictions` | Historical results |
| **Health Locker** | `/locker` | Document storage |
| **Doctors** | `/doctors` | Specialist directory |
| **Appointments** | `/appointments` | Booking system |
| **Admin** | `/admin` | System dashboard |
| **Doctor Portal** | `/doctor` | Doctor workspace |

---

## 🔐 Authentication Flow

1. User registers/logs in → JWT token stored in localStorage
2. `AuthContext` manages global auth state
3. Protected routes use `RequireAuth`, `RequireAdminAuth`, `RequireDoctorAuth`
4. API calls include JWT in Authorization header
5. Token expiry → auto redirect to login

---

## 🎨 Design System

**UI Library:** Shadcn UI + Radix UI  
**Styling:** Tailwind CSS  
**Icons:** Lucide React  
**Charts:** Recharts  
**Theming:** Dark/Light mode support with next-themes  

---

## 📦 Key Dependencies

```json
{
  "react": "^19.2.5",
  "react-router-dom": "^7.15.0",
  "vite": "^6.x",
  "@radix-ui/*": "UI components",
  "tailwindcss": "^4.x",
  "lucide-react": "Icons",
  "recharts": "Charts",
  "sonner": "Notifications",
  "@livekit/components-react": "Video/Audio",
  "livekit-client": "WebRTC"
}
```

---

## 🚀 Production Build

```bash
# Build optimized version
npm run build

# Output goes to dist/
# Deploy dist/ folder to your server
```

---

## 🐳 Docker Build

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 80
CMD ["npm", "run", "preview"]
```

---

## ⚠️ Important Notes

- Never commit `.env.local` (add to `.gitignore`)
- API must be running on port 8000 for local development
- JWT tokens expire after 24 hours
- All predictions require user authentication
- Medical data is sensitive — use HTTPS in production

---

## 📞 Support

See [backend README](../backend/README.md) for API documentation.  
See [main README](../README.md) for project overview.
