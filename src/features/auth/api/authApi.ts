import { apiPost } from '@/shared/lib/apiClient'
import type { LoginCredentials, LoginResponse } from '@/features/auth/types/auth'

export const authApi = {
  login(credentials: LoginCredentials): Promise<LoginResponse> {
    return apiPost<LoginResponse>('/auth/login', {
      username: credentials.username,
      password: credentials.password,
      expiresInMins: credentials.expiresInMins ?? 30,
    })
  },
}
