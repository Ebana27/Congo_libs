import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children }) {
  const { isAuthenticated, authLoading } = useAuth()
  const location = useLocation()

  if (authLoading) {
    return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>Chargement...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/connexion" replace state={{ from: location.pathname }} />
  }

  return children
}

export default ProtectedRoute
