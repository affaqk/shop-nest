import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../context/auth'

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, isAdmin } = useAuth()
  const location = useLocation()

  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />
  return <Outlet />
}

export default ProtectedRoute
