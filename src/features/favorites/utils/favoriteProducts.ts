const FAVORITES_STORAGE_KEY = 'product-catalog.favorites'

function isNumberArray(value: unknown): value is number[] {
  return Array.isArray(value) && value.every((item) => Number.isInteger(item) && item > 0)
}

export function getFavoriteProductIds(): number[] {
  const storedValue = localStorage.getItem(FAVORITES_STORAGE_KEY)

  if (!storedValue) {
    return []
  }

  try {
    const parsedValue: unknown = JSON.parse(storedValue)

    return isNumberArray(parsedValue) ? parsedValue : []
  } catch {
    return []
  }
}

export function storeFavoriteProductIds(productIds: number[]): void {
  const uniqueIds = Array.from(new Set(productIds)).filter((id) => Number.isInteger(id) && id > 0)

  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(uniqueIds))
}

export function isFavoriteProduct(productId: number): boolean {
  return getFavoriteProductIds().includes(productId)
}

export function toggleFavoriteProduct(productId: number): boolean {
  const currentIds = getFavoriteProductIds()
  const isFavorite = currentIds.includes(productId)
  const nextIds = isFavorite
    ? currentIds.filter((id) => id !== productId)
    : [...currentIds, productId]

  storeFavoriteProductIds(nextIds)

  return !isFavorite
}
