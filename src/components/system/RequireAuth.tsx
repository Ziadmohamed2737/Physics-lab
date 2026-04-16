import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { auth } from '../../store/auth'

export function RequireAuth() {
  const location = useLocation()
  if (!auth.isLoggedIn()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return <Outlet />
}

