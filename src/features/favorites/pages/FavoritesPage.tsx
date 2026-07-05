import { useMemo } from 'react'
import { useQueries } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { productsApi } from '@/features/products/api/productsApi'
import { ProductGrid } from '@/features/products/components/ProductGrid'
import type { Product } from '@/features/products/types/product'
import { getFavoriteProductIds } from '@/features/favorites/utils/favoriteProducts'
import { useAuth } from '@/features/auth/components/useAuth'
import { queryKeys } from '@/shared/lib/queryKeys'

export default function FavoritesPage() {
  const { logout, session } = useAuth()
  const favoriteProductIds = useMemo(() => getFavoriteProductIds(), [])

  const productQueries = useQueries({
    queries: favoriteProductIds.map((id) => ({
      queryKey: queryKeys.products.detail(id),
      queryFn: ({ signal }: { signal: AbortSignal }) => productsApi.detail(id, signal),
    })),
  })

  const isLoading = productQueries.some((query) => query.isLoading)
  const isError = productQueries.some((query) => query.isError)
  const favoriteProducts = productQueries
    .map((query) => query.data)
    .filter((product): product is Product => product !== undefined)

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase text-gray-500 dark:text-gray-400">
            Signed in as {session?.user.firstName ?? 'user'}
          </p>
          <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
            Favorite products
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-300">
            This protected list reads locally saved favorite product IDs and displays the matching catalog items.
          </p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="min-h-10 rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 motion-reduce:transition-none dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800 dark:focus-visible:ring-gray-100 dark:focus-visible:ring-offset-gray-950"
        >
          Logout
        </button>
      </div>

      {favoriteProductIds.length === 0 ? (
        <div
          aria-label="Favorites list"
          className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-900"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            No favorite products yet
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600 dark:text-gray-300">
            Your locally saved favorites will appear here once products have been added.
          </p>
          <Link
            to="/products"
            className="mt-5 inline-flex min-h-10 items-center rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-950 dark:hover:bg-gray-300 dark:focus-visible:ring-gray-100 dark:focus-visible:ring-offset-gray-950"
          >
            Browse products
          </Link>
        </div>
      ) : null}

      {favoriteProductIds.length > 0 && isLoading ? (
        <div role="status" aria-live="polite" className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
          Loading favorite products...
        </div>
      ) : null}

      {favoriteProductIds.length > 0 && isError ? (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-900 dark:border-red-900/70 dark:bg-red-950/50 dark:text-red-100">
          Couldn't load favorite products.
        </div>
      ) : null}

      {favoriteProducts.length > 0 ? (
        <div aria-label="Favorites list">
          <ProductGrid products={favoriteProducts} />
        </div>
      ) : null}
    </section>
  )
}
