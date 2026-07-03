import { describe, expect, it } from 'vitest'
import { parseProductListParams, serializeProductListParams } from './urlParams'

describe('urlParams', () => {
  it('parses product list URL params into typed state', () => {
    const state = parseProductListParams(
      new URLSearchParams('q=phone&category=smartphones&minPrice=10&maxPrice=99.5&page=2'),
    )

    expect(state).toEqual({
      q: 'phone',
      category: 'smartphones',
      minPrice: 10,
      maxPrice: 99.5,
      page: 2,
    })
  })

  it('defaults invalid and missing params', () => {
    const state = parseProductListParams(new URLSearchParams('page=-1&minPrice=nope'))

    expect(state).toEqual({
      q: '',
      category: '',
      page: 1,
    })
  })

  it('serializes patches and removes empty values', () => {
    const current = parseProductListParams(
      new URLSearchParams('q=phone&category=smartphones&minPrice=10&page=3'),
    )
    const params = serializeProductListParams(current, {
      q: '',
      category: '',
      minPrice: null,
      maxPrice: 200,
      page: null,
    })

    expect(params.toString()).toBe('maxPrice=200')
  })
})
