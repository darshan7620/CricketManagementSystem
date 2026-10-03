import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'

export default function ProtectedRoute({ children }) {
  const { player } = useAuth()
  if (!player) {
    return <Navigate to="/login" replace />
  }
  return children
}
