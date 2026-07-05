import { useMemo, useState } from 'react'
import { authApi } from '@/features/auth/api/authApi'
import { AuthContext, type AuthContextValue } from '@/features/auth/components/authContext'
import type { AuthSession, LoginCredentials } from '@/features/auth/types/auth'
import {
  clearStoredAuthSession,
  createAuthSession,
  getStoredAuthSession,
  storeAuthSession,
} from '@/features/auth/utils/authSession'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<AuthSession | null>(() => getStoredAuthSession())

  const value = useMemo<AuthContextValue>(() => {
    async function login(credentials: LoginCredentials) {
      const response = await authApi.login(credentials)
      const nextSession = createAuthSession(response)

      storeAuthSession(nextSession)
      setSession(nextSession)
    }

    function logout() {
      clearStoredAuthSession()
      setSession(null)
    }

    return {
      session,
      isAuthenticated: session !== null,
      login,
      logout,
    }
  }, [session])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
