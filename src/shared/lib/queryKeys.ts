import type { ProductListParams } from '@/features/products/types/product'

export const queryKeys = {
  products: {
    all: ['products'] as const,
    list: (params: ProductListParams) => ['products', 'list', params] as const,
    detail: (id: number) => ['products', 'detail', id] as const,
  },
  categories: {
    all: ['categories'] as const,
    list: () => ['categories', 'list'] as const,
  },
  auth: {
    me: () => ['auth', 'me'] as const,
  },
} as const
