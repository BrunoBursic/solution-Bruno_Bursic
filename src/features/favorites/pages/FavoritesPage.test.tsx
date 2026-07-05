import { Route } from 'react-router-dom'
import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { RequireAuth } from '@/features/auth/components/RequireAuth'
import { storeAuthSession } from '@/features/auth/utils/authSession'
import FavoritesPage from '@/features/favorites/pages/FavoritesPage'
import { storeFavoriteProductIds } from '@/features/favorites/utils/favoriteProducts'
import { loginFixture } from '@/test/mocks/handlers'
import { renderWithRoutes } from '@/test/testUtils'

function renderFavoritesRoute() {
  return renderWithRoutes(
    <Route
      path="/favorites"
      element={(
        <RequireAuth>
          <FavoritesPage />
        </RequireAuth>
      )}
    />,
    { initialEntries: ['/favorites'] },
  )
}

describe('FavoritesPage', () => {
  it('redirects anonymous users to login', () => {
    renderWithRoutes(
      <>
        <Route path="/login" element={<h1>Sign in</h1>} />
        <Route
          path="/favorites"
          element={(
            <RequireAuth>
              <FavoritesPage />
            </RequireAuth>
          )}
        />
      </>,
      { initialEntries: ['/favorites'] },
    )

    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument()
  })

  it('shows an empty favorites list for authenticated users without saved favorites', () => {
    storeAuthSession({
      user: {
        id: loginFixture.id,
        username: loginFixture.username,
        email: loginFixture.email,
        firstName: loginFixture.firstName,
        lastName: loginFixture.lastName,
        gender: loginFixture.gender,
        image: loginFixture.image,
      },
      accessToken: loginFixture.accessToken,
      refreshToken: loginFixture.refreshToken,
    })

    renderFavoritesRoute()

    expect(screen.getByRole('heading', { name: 'Favorite products' })).toBeInTheDocument()
    expect(screen.getByLabelText('Favorites list')).toHaveTextContent('No favorite products yet')
  })

  it('shows locally saved favorite products for authenticated users', async () => {
    storeAuthSession({
      user: {
        id: loginFixture.id,
        username: loginFixture.username,
        email: loginFixture.email,
        firstName: loginFixture.firstName,
        lastName: loginFixture.lastName,
        gender: loginFixture.gender,
        image: loginFixture.image,
      },
      accessToken: loginFixture.accessToken,
      refreshToken: loginFixture.refreshToken,
    })
    storeFavoriteProductIds([1, 2])

    renderFavoritesRoute()

    expect(await screen.findByRole('link', {
      name: 'View details for Essence Mascara Lash Princess',
    })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'View details for iPhone 9' })).toBeInTheDocument()
  })
})
