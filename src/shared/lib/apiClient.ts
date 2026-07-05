import { env } from '@/shared/utils/env'
import { ApiError, NotFoundError, NetworkError } from '@/shared/types/api'
import { getStoredAccessToken } from '@/features/auth/utils/authSession'

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${env.VITE_API_BASE_URL}${path}`
  const accessToken = getStoredAccessToken()

  let response: Response
  try {
    response = await fetch(url, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...init?.headers,
      },
    })
  } catch {
    throw new NetworkError()
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw new NotFoundError()
    }
    throw new ApiError(
      `Request failed: ${response.statusText}`,
      response.status,
      response.statusText,
    )
  }

  return (await response.json()) as T
}

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  return apiRequest<T>(path, init)
}

export async function apiPost<T>(path: string, body: unknown, init?: RequestInit): Promise<T> {
  return apiRequest<T>(path, {
    ...init,
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })
}
