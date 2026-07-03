import { Route } from 'react-router-dom'
import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ProductDetailPage from '@/features/products/pages/ProductDetailPage'
import { renderWithRoutes } from '@/test/testUtils'

function renderProductDetail(initialEntry: string) {
  return renderWithRoutes(
    <Route path="/products/:id" element={<ProductDetailPage />} />,
    { initialEntries: [initialEntry] },
  )
}

describe('ProductDetailPage', () => {
  it('renders product details on the happy path', async () => {
    renderProductDetail('/products/1')

    expect(screen.getByRole('status')).toHaveTextContent('Loading product...')
    expect(await screen.findByRole('heading', {
      name: 'Essence Mascara Lash Princess',
    })).toBeInTheDocument()
    expect(screen.getByRole('region', {
      name: 'Essence Mascara Lash Princess image gallery',
    })).toBeInTheDocument()
    expect(screen.getByText('A volumizing mascara with a dramatic finish.')).toBeInTheDocument()
    expect(screen.getByText('4.94')).toBeInTheDocument()
    expect(screen.getAllByText('beauty')).not.toHaveLength(0)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('renders not found state for missing products', async () => {
    renderProductDetail('/products/999')

    expect(await screen.findByRole('heading', { name: 'Product not found' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Back to products' })).toBeInTheDocument()
  })
})
