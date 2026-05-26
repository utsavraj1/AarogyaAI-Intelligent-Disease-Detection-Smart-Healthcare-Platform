import { Route, Routes, Navigate } from 'react-router-dom'
import AuthPage from './pages/Auth'
import { DashboardPage as Dashboard } from './pages/Dashboard'
import { DiagnosisPage as Diagnosis } from './pages/Diagnosis'
import { PredictionsPage as Predictions } from './pages/Predictions'
import { LockerPage as Locker } from './pages/Locker'
import { ProfilePage as Profile } from './pages/Profile'
import { DoctorsPage } from './pages/Doctors'
import { AdminLoginPage as AdminLogin } from './pages/AdminLogin'
import { AdminPage as Admin } from './pages/Admin'
import { DoctorRegistration } from './pages/DoctorRegistration'
import { DoctorDetailPage as DoctorDetail } from './pages/DoctorDetail'
import { AppointmentsPage as Appointments } from './pages/Appointments'
import { DoctorDashboard } from './pages/DoctorDashboard'
import { AboutPage as About } from './pages/About'
import { RequireAuth } from './components/RequireAuth'
import { RequireAdminAuth } from './components/RequireAdminAuth'
import { RequireDoctorAuth } from './components/RequireDoctorAuth'
import { DashboardLayout } from './components/DashboardLayout'

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<AuthPage />} />
      <Route path="/auth" element={<Navigate to="/" replace />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/doctor-registration" element={<DoctorRegistration />} />

      {/* Protected Patient/User Routes */}
      <Route path="/dashboard" element={
        <RequireAuth>
          <DashboardLayout title="Clinical Overview">
            <Dashboard />
          </DashboardLayout>
        </RequireAuth>
      } />
      <Route path="/diagnosis" element={
        <RequireAuth>
          <DashboardLayout title="Diagnostic Center">
            <Diagnosis />
          </DashboardLayout>
        </RequireAuth>
      } />
      <Route path="/predictions" element={
        <RequireAuth>
          <DashboardLayout title="Inference Archives">
            <Predictions />
          </DashboardLayout>
        </RequireAuth>
      } />
      <Route path="/locker" element={
        <RequireAuth>
          <DashboardLayout title="Health Locker">
            <Locker />
          </DashboardLayout>
        </RequireAuth>
      } />
      <Route path="/profile" element={
        <RequireAuth>
          <DashboardLayout title="Account Security">
            <Profile />
          </DashboardLayout>
        </RequireAuth>
      } />
      <Route path="/doctors" element={
        <RequireAuth>
          <DashboardLayout title="Specialist Network">
            <DoctorsPage />
          </DashboardLayout>
        </RequireAuth>
      } />
      <Route path="/doctors/:id" element={
        <RequireAuth>
          <DashboardLayout title="Specialist Dossier">
            <DoctorDetail />
          </DashboardLayout>
        </RequireAuth>
      } />
      <Route path="/appointments" element={
        <RequireAuth>
          <DashboardLayout title="Clinical Scheduler">
            <Appointments />
          </DashboardLayout>
        </RequireAuth>
      } />
      <Route path="/about" element={
        <RequireAuth>
          <DashboardLayout title="System Insight">
            <About />
          </DashboardLayout>
        </RequireAuth>
      } />

      {/* Doctor Routes */}
      <Route path="/doctor" element={
        <RequireDoctorAuth>
          <DashboardLayout title="Doctor Workspace" role="doctor">
            <DoctorDashboard />
          </DashboardLayout>
        </RequireDoctorAuth>
      } />
      <Route path="/doctor/appointments" element={
        <RequireDoctorAuth>
          <DashboardLayout title="Clinical Queue" role="doctor">
            <DoctorDashboard />
          </DashboardLayout>
        </RequireDoctorAuth>
      } />

      {/* Admin Routes */}
      <Route path="/admin/*" element={
        <RequireAdminAuth>
          <DashboardLayout title="Admin Control Center" role="admin">
            <Admin />
          </DashboardLayout>
        </RequireAdminAuth>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
