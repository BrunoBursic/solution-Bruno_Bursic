import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { ProductCard } from '@/features/products/components/ProductCard'
import { SearchInput } from '@/features/products/components/SearchInput'
import type { Product } from '@/features/products/types/product'

const productFixture: Product = {
  id: 1,
  title: 'Essence Mascara Lash Princess',
  description: 'A volumizing mascara with a dramatic finish.',
  category: 'beauty',
  price: 9.99,
  discountPercentage: 7.17,
  rating: 4.94,
  stock: 5,
  tags: ['beauty', 'mascara'],
  thumbnail: 'https://example.com/mascara.jpg',
  images: ['https://example.com/mascara.jpg'],
}

describe('product accessibility markup', () => {
  it('associates the search input with a label', () => {
    const html = renderToStaticMarkup(
      <SearchInput value="" onDebouncedChange={() => undefined} />,
    )

    expect(html).toContain('<label for="product-search"')
    expect(html).toContain('id="product-search"')
  })

  it('renders product cards as descriptive links with meaningful image alt text', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <ProductCard product={productFixture} />
      </MemoryRouter>,
    )

    expect(html).toContain('aria-label="View details for Essence Mascara Lash Princess"')
    expect(html).toContain('alt="Essence Mascara Lash Princess"')
  })
})
