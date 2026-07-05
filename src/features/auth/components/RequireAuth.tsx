import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/components/useAuth'

interface RequireAuthProps {
  children: React.ReactElement
}

export function RequireAuth({ children }: RequireAuthProps) {
  const location = useLocation()
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
