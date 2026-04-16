import { Navigate, Outlet } from 'react-router-dom'
import { auth } from '../../store/auth'

export function RequireAdmin() {
  if (!auth.isLoggedIn()) {
    return <Navigate to="/login" replace />
  }
  if (!auth.isAdmin()) {
    return <Navigate to="/home" replace />
  }
  return <Outlet />
}

