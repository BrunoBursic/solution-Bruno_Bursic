import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ProductCard } from '@/features/products/components/ProductCard'
import { mascaraFixture } from '@/test/mocks/handlers'
import { renderWithProviders } from '@/test/testUtils'

describe('ProductCard', () => {
  it('renders product content inside a detail link', () => {
    const product = mascaraFixture

    renderWithProviders(<ProductCard product={product} />)

    const link = screen.getByRole('link', {
      name: `View details for ${product.title}`,
    })
    const image = screen.getByRole('img', { name: product.title })

    expect(link).toHaveAttribute('href', `/products/${product.id}`)
    expect(image).toHaveAttribute('src', product.thumbnail)
    expect(screen.getByText(product.title)).toBeInTheDocument()
    expect(screen.getByText('$9.99')).toBeInTheDocument()
    expect(screen.getByText(/A volumizing mascara/)).toBeInTheDocument()
  })
})
