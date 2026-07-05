import { createContext } from 'react'
import type { AuthSession, LoginCredentials } from '@/features/auth/types/auth'

export interface AuthContextValue {
  session: AuthSession | null
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
