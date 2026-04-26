import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function ProtectedByRole({ roles }) {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) return <Navigate to="/" replace />

  if (!roles.includes(user?.role)) {
    // Redirect to their home based on role instead of showing a 403
    if (user?.role === 'admin') return <Navigate to="/admin" replace />
    if (user?.role === 'staff') return <Navigate to="/staff" replace />
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
