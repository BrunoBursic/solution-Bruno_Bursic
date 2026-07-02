import { env } from '@/shared/utils/env'
import { ApiError, NotFoundError, NetworkError } from '@/shared/types/api'

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${env.VITE_API_BASE_URL}${path}`

  let response: Response
  try {
    response = await fetch(url, {
      ...init,
      headers: {
        Accept: 'application/json',
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
