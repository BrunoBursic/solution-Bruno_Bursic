import { http, HttpResponse } from 'msw'
import { Route } from 'react-router-dom'
import { act, fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ProductsListPage from '@/features/products/pages/ProductsListPage'
import ProductDetailPage from '@/features/products/pages/ProductDetailPage'
import { apiBaseUrl, iphoneFixture, productFixtures } from '@/test/mocks/handlers'
import { server } from '@/test/mocks/server'
import { LocationProbe } from '@/test/LocationProbe'
import { renderWithRoutes } from '@/test/testUtils'

function renderProductsRoutes(initialEntry = '/products') {
  return renderWithRoutes(
    <>
      <Route path="/products" element={<><ProductsListPage /><LocationProbe /></>} />
      <Route path="/products/:id" element={<><ProductDetailPage /><LocationProbe /></>} />
    </>,
    { initialEntries: [initialEntry] },
  )
}

describe('ProductsListPage', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the happy path with loading and a paginated product grid', async () => {
    renderProductsRoutes()

    expect(screen.getByRole('status')).toHaveTextContent('Loading products...')

    expect(await screen.findByRole('link', {
      name: 'View details for Essence Mascara Lash Princess',
    })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /View details for/ })).toHaveLength(24)
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument()
  })

  it('renders empty state and clears filters', async () => {
    server.use(
      http.get(`${apiBaseUrl}/products/search`, () => {
        return HttpResponse.json({ products: [], total: 0, skip: 0, limit: 24 })
      }),
    )
    const user = userEvent.setup()

    renderProductsRoutes('/products?q=missing')

    expect(await screen.findByText('No products found')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Clear filters' }))

    await waitFor(() => {
      expect(screen.getByLabelText('Current location')).toHaveTextContent('/products')
    })
  })

  it('renders error state and retries the request', async () => {
    let requestCount = 0
    server.use(
      http.get(`${apiBaseUrl}/products`, () => {
        requestCount += 1

        if (requestCount === 1) {
          return new HttpResponse(null, {
            status: 500,
            statusText: 'Internal Server Error',
          })
        }

        return HttpResponse.json({
          products: productFixtures.slice(0, 24),
          total: productFixtures.length,
          skip: 0,
          limit: 24,
        })
      }),
    )
    const user = userEvent.setup()

    renderProductsRoutes()

    expect(await screen.findByRole('alert')).toHaveTextContent("Couldn't load products")

    await user.click(screen.getByRole('button', { name: 'Retry' }))

    expect(await screen.findByRole('link', {
      name: 'View details for Essence Mascara Lash Princess',
    })).toBeInTheDocument()
    expect(requestCount).toBe(2)
  })

  it('uses URL params to drive requests and filter controls', async () => {
    let requestedUrl = ''
    server.use(
      http.get(`${apiBaseUrl}/products/search`, ({ request }) => {
        requestedUrl = request.url

        return HttpResponse.json({
          products: [iphoneFixture],
          total: 1,
          skip: 0,
          limit: 24,
        })
      }),
    )

    renderProductsRoutes('/products?q=iphone&category=smartphones&minPrice=500&maxPrice=600')

    expect(await screen.findByRole('link', { name: 'View details for iPhone 9' })).toBeInTheDocument()
    expect(screen.getByLabelText('Search products')).toHaveValue('iphone')
    expect(screen.getByLabelText('Category')).toHaveValue('smartphones')
    expect(screen.getByLabelText('Min price')).toHaveValue(500)
    expect(screen.getByLabelText('Max price')).toHaveValue(600)
    expect(requestedUrl).toContain('/products/search')
    expect(requestedUrl).toContain('q=iphone')
  })

  it('updates the URL after debounced search input', async () => {
    renderProductsRoutes()

    await screen.findByRole('link', {
      name: 'View details for Essence Mascara Lash Princess',
    })

    vi.useFakeTimers()
    fireEvent.change(screen.getByLabelText('Search products'), {
      target: { value: 'phone' },
    })

    act(() => {
      vi.advanceTimersByTime(999)
    })
    expect(screen.getByLabelText('Current location')).toHaveTextContent('/products')

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(screen.getByLabelText('Current location')).toHaveTextContent('/products?q=phone')
  })

  it('preserves URL params when navigating list to detail and back', async () => {
    const user = userEvent.setup()

    renderProductsRoutes('/products?q=iphone&category=smartphones')

    const productLink = await screen.findByRole('link', { name: 'View details for iPhone 9' })
    await user.click(productLink)

    expect(await screen.findByRole('heading', { name: 'iPhone 9' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Back to products' }))

    await waitFor(() => {
      expect(screen.getByLabelText('Current location')).toHaveTextContent(
        '/products?q=iphone&category=smartphones',
      )
    })
    expect(screen.getByRole('link', {
      name: 'View details for iPhone 9',
    })).toBeInTheDocument()
  })
})
