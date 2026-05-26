/**
 * RequireAdminAuth.tsx — Guards /admin route; redirects to /admin-login if not authenticated as admin
 */
import { Navigate } from 'react-router-dom'

const ADMIN_KEY = 'aarogyaai_admin_auth'

export function RequireAdminAuth({ children }: { children: React.ReactNode }) {
  const stored = localStorage.getItem(ADMIN_KEY)
  if (!stored) return <Navigate to="/admin-login" replace />
  try {
    const { ts } = JSON.parse(stored)
    // Session expires after 8 hours
    if (Date.now() - ts > 8 * 60 * 60 * 1000) {
      localStorage.removeItem(ADMIN_KEY)
      return <Navigate to="/admin-login" replace />
    }
  } catch {
    return <Navigate to="/admin-login" replace />
  }
  return <>{children}</>
}
