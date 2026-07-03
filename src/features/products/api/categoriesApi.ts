import { apiGet } from '@/shared/lib/apiClient'
import type { Category } from '@/features/products/types/product'

type CategoryApiResponse = Category[] | string[]

function slugToName(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => `${part[0]?.toUpperCase() ?? ''}${part.slice(1)}`)
    .join(' ')
}

function isCategory(value: Category | string): value is Category {
  return typeof value !== 'string'
}

export function normalizeCategories(response: CategoryApiResponse): Category[] {
  return response.map((category) => {
    if (isCategory(category)) {
      return category
    }

    return {
      slug: category,
      name: slugToName(category),
      url: `/products/category/${encodeURIComponent(category)}`,
    }
  })
}

export const categoriesApi = {
  list: async (): Promise<Category[]> => {
    const response = await apiGet<CategoryApiResponse>('/products/categories')

    return normalizeCategories(response)
  },
}
