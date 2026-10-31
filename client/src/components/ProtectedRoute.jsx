import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) return <p role="status">Vérification de la session…</p>

  if (!isAuthenticated) {
    return <Navigate to="/connexion" replace state={{ from: location.pathname }} />
  }

  return children
}

export default ProtectedRoute
