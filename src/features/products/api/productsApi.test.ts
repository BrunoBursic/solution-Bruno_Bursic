import { describe, expect, it } from 'vitest'
import { buildListUrl } from './productsApi'

describe('buildListUrl', () => {
  it('selects the default /products endpoint when no filters are given', () => {
    const url = buildListUrl({})
    expect(url).toBe('/products?limit=24&skip=0')
  })

  it('selects /products/search when q is provided', () => {
    const url = buildListUrl({ q: 'phone' })
    expect(url).toBe('/products/search?limit=24&skip=0&q=phone')
  })

  it('selects /products/category/:slug when category is provided', () => {
    const url = buildListUrl({ category: 'smartphones' })
    expect(url).toBe('/products/category/smartphones?limit=24&skip=0')
  })

  it('prioritizes search over category when both are provided', () => {
    const url = buildListUrl({ q: 'phone', category: 'smartphones' })
    expect(url).toContain('/products/search')
    expect(url).toContain('q=phone')
  })

  it('computes skip from page and limit', () => {
    const url = buildListUrl({ page: 3, limit: 10 })
    expect(url).toContain('limit=10')
    expect(url).toContain('skip=20')
  })

  it('encodes category slug', () => {
    const url = buildListUrl({ category: 'beauty & personal care' })
    expect(url).toBe('/products/category/beauty%20%26%20personal%20care?limit=24&skip=0')
  })
})
