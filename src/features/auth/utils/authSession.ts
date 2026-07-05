import type { AuthSession, LoginResponse } from '@/features/auth/types/auth'

const AUTH_STORAGE_KEY = 'product-catalog.auth'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isStoredAuthSession(value: unknown): value is AuthSession {
  if (!isRecord(value)) {
    return false
  }

  return (
    isRecord(value.user) &&
    typeof value.accessToken === 'string' &&
    typeof value.refreshToken === 'string' &&
    typeof value.user.id === 'number' &&
    typeof value.user.username === 'string' &&
    typeof value.user.email === 'string' &&
    typeof value.user.firstName === 'string' &&
    typeof value.user.lastName === 'string' &&
    typeof value.user.gender === 'string' &&
    typeof value.user.image === 'string'
  )
}

export function createAuthSession(response: LoginResponse): AuthSession {
  const { accessToken, refreshToken, ...user } = response

  return {
    user,
    accessToken,
    refreshToken,
  }
}

export function getStoredAuthSession(): AuthSession | null {
  const storedValue = localStorage.getItem(AUTH_STORAGE_KEY)

  if (!storedValue) {
    return null
  }

  try {
    const parsedValue: unknown = JSON.parse(storedValue)

    return isStoredAuthSession(parsedValue) ? parsedValue : null
  } catch {
    return null
  }
}

export function storeAuthSession(session: AuthSession): void {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
}

export function clearStoredAuthSession(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

export function getStoredAccessToken(): string | null {
  return getStoredAuthSession()?.accessToken ?? null
}
