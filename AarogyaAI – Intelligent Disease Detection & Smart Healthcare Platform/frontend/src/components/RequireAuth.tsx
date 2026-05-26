import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { token, status } = useAuth()

  if (status === 'idle') return null
  if (!token) return <Navigate to="/auth" replace />

  return <>{children}</>
}
