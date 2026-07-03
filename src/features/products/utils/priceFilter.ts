import type { Product } from '@/features/products/types/product'

export interface PriceRange {
  min?: number
  max?: number
}

export function priceFilter(products: Product[], range: PriceRange): Product[] {
  return products.filter((product) => {
    if (range.min !== undefined && product.price < range.min) {
      return false
    }

    if (range.max !== undefined && product.price > range.max) {
      return false
    }

    return true
  })
}
