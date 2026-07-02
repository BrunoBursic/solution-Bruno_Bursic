import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { productsApi, type ProductListArgs } from '@/features/products/api/productsApi'
import { queryKeys } from '@/shared/lib/queryKeys'
import type { ProductsResponse } from '@/features/products/types/product'

export function useProductsQuery(args: ProductListArgs) {
  return useQuery<ProductsResponse, Error>({
    queryKey: queryKeys.products.list(args),
    queryFn: ({ signal }) => productsApi.list({ ...args, signal }),
    placeholderData: keepPreviousData,
  })
}
