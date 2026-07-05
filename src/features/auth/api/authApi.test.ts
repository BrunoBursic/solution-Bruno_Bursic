import { describe, expect, it } from 'vitest'
import { authApi } from '@/features/auth/api/authApi'
import { loginFixture } from '@/test/mocks/handlers'

describe('authApi', () => {
  it('posts credentials to DummyJSON login', async () => {
    await expect(authApi.login({
      username: 'emilys',
      password: 'emilyspass',
    })).resolves.toEqual(loginFixture)
  })
})
