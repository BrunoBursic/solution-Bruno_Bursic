import { useQuery } from '@tanstack/react-query'
import { categoriesApi } from '@/features/products/api/categoriesApi'
import type { Category } from '@/features/products/types/product'
import { queryKeys } from '@/shared/lib/queryKeys'

export function useCategoriesQuery() {
  return useQuery<Category[], Error>({
    queryKey: queryKeys.categories.list(),
    queryFn: categoriesApi.list,
  })
}
