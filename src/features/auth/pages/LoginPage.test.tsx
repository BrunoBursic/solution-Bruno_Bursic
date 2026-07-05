import { Route } from 'react-router-dom'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { RequireAuth } from '@/features/auth/components/RequireAuth'
import LoginPage from '@/features/auth/pages/LoginPage'
import FavoritesPage from '@/features/favorites/pages/FavoritesPage'
import { renderWithRoutes } from '@/test/testUtils'

function renderAuthRoutes(initialEntry: string) {
  return renderWithRoutes(
    <>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/favorites"
        element={(
          <RequireAuth>
            <FavoritesPage />
          </RequireAuth>
        )}
      />
    </>,
    { initialEntries: [initialEntry] },
  )
}

describe('LoginPage', () => {
  it('redirects protected routes to login for anonymous users', () => {
    renderAuthRoutes('/favorites')

    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument()
  })

  it('stores the token and reaches the protected route after login', async () => {
    const user = userEvent.setup()

    renderAuthRoutes('/favorites')

    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(await screen.findByRole('heading', { name: 'Favorite products' })).toBeInTheDocument()
    expect(localStorage.getItem('product-catalog.auth')).toContain('test-access-token')
  })

  it('clears the token on logout', async () => {
    const user = userEvent.setup()

    renderAuthRoutes('/favorites')

    await user.click(screen.getByRole('button', { name: 'Sign in' }))
    await user.click(await screen.findByRole('button', { name: 'Logout' }))

    expect(localStorage.getItem('product-catalog.auth')).toBeNull()
  })
})
