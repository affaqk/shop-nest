import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../context/auth'
import { Spinner } from './Skeletons'

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, isAdmin, checkingRole } = useAuth()
  const location = useLocation()

  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (adminOnly) {
    // Wait for the server to confirm the role before deciding
    if (checkingRole) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <Spinner />
        </div>
      )
    }
    if (!isAdmin) return <Navigate to="/" replace />
  }
  return <Outlet />
}

export default ProtectedRoute
