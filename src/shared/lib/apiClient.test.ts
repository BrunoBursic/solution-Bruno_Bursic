import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { apiGet } from '@/shared/lib/apiClient'
import { server } from '@/test/mocks/server'
import { apiBaseUrl, mascaraFixture } from '@/test/mocks/handlers'
import { ApiError, NetworkError, NotFoundError } from '@/shared/types/api'
import { storeAuthSession } from '@/features/auth/utils/authSession'

describe('apiGet', () => {
  it('returns typed JSON data for successful responses', async () => {
    await expect(apiGet('/products/1')).resolves.toEqual(mascaraFixture)
  })

  it('maps 404 responses to NotFoundError', async () => {
    await expect(apiGet('/products/999')).rejects.toBeInstanceOf(NotFoundError)
  })

  it('maps 500 responses to ApiError', async () => {
    server.use(
      http.get(`${apiBaseUrl}/server-error`, () => {
        return new HttpResponse(null, {
          status: 500,
          statusText: 'Internal Server Error',
        })
      }),
    )

    await expect(apiGet('/server-error')).rejects.toMatchObject({
      name: 'ApiError',
      status: 500,
      statusText: 'Internal Server Error',
    } satisfies Partial<ApiError>)
  })

  it('maps failed fetches to NetworkError', async () => {
    server.use(
      http.get(`${apiBaseUrl}/network-error`, () => {
        return HttpResponse.error()
      }),
    )

    await expect(apiGet('/network-error')).rejects.toBeInstanceOf(NetworkError)
  })

  it('adds a stored access token to requests', async () => {
    storeAuthSession({
      user: {
        id: 1,
        username: 'emilys',
        email: 'emily@example.com',
        firstName: 'Emily',
        lastName: 'Johnson',
        gender: 'female',
        image: 'https://example.com/emily.jpg',
      },
      accessToken: 'test-access-token',
      refreshToken: 'test-refresh-token',
    })

    server.use(
      http.get(`${apiBaseUrl}/auth-check`, ({ request }) => {
        return HttpResponse.json({
          authorization: request.headers.get('Authorization'),
        })
      }),
    )

    await expect(apiGet<{ authorization: string }>('/auth-check')).resolves.toEqual({
      authorization: 'Bearer test-access-token',
    })
  })
})
