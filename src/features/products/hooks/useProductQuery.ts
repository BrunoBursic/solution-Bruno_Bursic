import { useQuery } from '@tanstack/react-query'
import { productsApi } from '@/features/products/api/productsApi'
import type { Product } from '@/features/products/types/product'
import { queryKeys } from '@/shared/lib/queryKeys'

export function useProductQuery(id: number | null) {
  return useQuery<Product, Error>({
    queryKey: id === null ? queryKeys.products.detail(0) : queryKeys.products.detail(id),
    queryFn: ({ signal }) => {
      if (id === null) {
        throw new Error('Product id is required')
      }

      return productsApi.detail(id, signal)
    },
    enabled: id !== null,
  })
}
