import { describe, expect, it } from 'vitest'
import type { Product } from '@/features/products/types/product'
import { priceFilter } from './priceFilter'

const products: Product[] = [
  {
    id: 1,
    title: 'Budget Phone',
    description: 'Affordable phone',
    category: 'smartphones',
    price: 99,
    discountPercentage: 0,
    rating: 4,
    stock: 10,
    tags: [],
    thumbnail: '/phone.jpg',
    images: ['/phone.jpg'],
  },
  {
    id: 2,
    title: 'Premium Laptop',
    description: 'High-end laptop',
    category: 'laptops',
    price: 1299,
    discountPercentage: 0,
    rating: 4.8,
    stock: 5,
    tags: [],
    thumbnail: '/laptop.jpg',
    images: ['/laptop.jpg'],
  },
]

describe('priceFilter', () => {
  it('returns every product when no range is provided', () => {
    expect(priceFilter(products, {})).toEqual(products)
  })

  it('filters products below the minimum price', () => {
    expect(priceFilter(products, { min: 100 })).toEqual([products[1]])
  })

  it('filters products above the maximum price', () => {
    expect(priceFilter(products, { max: 100 })).toEqual([products[0]])
  })

  it('keeps products inside an inclusive range', () => {
    expect(priceFilter(products, { min: 99, max: 1299 })).toEqual(products)
  })

  it('returns an empty list when no products are in range', () => {
    expect(priceFilter(products, { min: 1300 })).toEqual([])
  })
})
