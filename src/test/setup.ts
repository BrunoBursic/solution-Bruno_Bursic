import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll, vi } from 'vitest'
import { server } from '@/test/mocks/server'
import { apiBaseUrl } from '@/test/mocks/handlers'

vi.stubEnv('VITE_API_BASE_URL', apiBaseUrl)
vi.stubEnv('VITE_DEFAULT_PAGE_SIZE', '24')
vi.stubEnv('VITE_ENABLE_DEVTOOLS', 'false')
window.scrollTo = vi.fn()

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  cleanup()
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})
