import { describe, expect, it } from 'vitest'
import { normalizeCategories } from './categoriesApi'

describe('normalizeCategories', () => {
  it('keeps modern DummyJSON category objects intact', () => {
    const categories = normalizeCategories([
      {
        slug: 'smartphones',
        name: 'Smartphones',
        url: 'https://dummyjson.com/products/category/smartphones',
      },
    ])

    expect(categories).toEqual([
      {
        slug: 'smartphones',
        name: 'Smartphones',
        url: 'https://dummyjson.com/products/category/smartphones',
      },
    ])
  })

  it('normalizes legacy string categories', () => {
    const categories = normalizeCategories(['mens-shirts', 'womens-shoes'])

    expect(categories).toEqual([
      {
        slug: 'mens-shirts',
        name: 'Mens Shirts',
        url: '/products/category/mens-shirts',
      },
      {
        slug: 'womens-shoes',
        name: 'Womens Shoes',
        url: '/products/category/womens-shoes',
      },
    ])
  })

  it('ignores empty slug segments when building names', () => {
    const categories = normalizeCategories(['home--decoration'])

    expect(categories[0]).toEqual({
      slug: 'home--decoration',
      name: 'Home Decoration',
      url: '/products/category/home--decoration',
    })
  })
})
