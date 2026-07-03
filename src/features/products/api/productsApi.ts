import { apiGet } from '@/shared/lib/apiClient'
import { env } from '@/shared/utils/env'
import type { Product, ProductListParams, ProductsResponse } from '@/features/products/types/product'

export interface ProductListArgs extends ProductListParams {
  signal?: AbortSignal
}

export function buildListUrl(args: ProductListArgs): string {
  const limit = args.limit ?? env.VITE_DEFAULT_PAGE_SIZE
  const page = args.page ?? 1
  const skip = (page - 1) * limit

  const params = new URLSearchParams()
  params.set('limit', String(limit))
  params.set('skip', String(skip))

  if (args.q) {
    params.set('q', args.q)
    return `/products/search?${params.toString()}`
  }

  if (args.category) {
    return `/products/category/${encodeURIComponent(args.category)}?${params.toString()}`
  }

  return `/products?${params.toString()}`
}

export const productsApi = {
  list: async (args: ProductListArgs): Promise<ProductsResponse> => {
    const url = buildListUrl(args)
    const response = await apiGet<ProductsResponse>(url, {
      signal: args.signal ?? null,
    })

    if (args.q && args.category) {
      response.products = response.products.filter(
        (product: Product) => product.category === args.category,
      )
    }

    return response
  },
  detail: async (id: number, signal?: AbortSignal): Promise<Product> => {
    return apiGet<Product>(`/products/${id}`, {
      signal: signal ?? null,
    })
  },
}
