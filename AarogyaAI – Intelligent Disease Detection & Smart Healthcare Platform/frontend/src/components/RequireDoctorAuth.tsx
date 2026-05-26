import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface RequireDoctorAuthProps {
  children: React.ReactNode
}

export function RequireDoctorAuth({ children }: RequireDoctorAuthProps) {
  const { user, status } = useAuth()
  const loading = status === 'loading'

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!user || user.role !== 'doctor') {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
