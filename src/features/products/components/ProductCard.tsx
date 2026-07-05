import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  isFavoriteProduct,
  toggleFavoriteProduct,
} from '@/features/favorites/utils/favoriteProducts'
import type { Product } from '@/features/products/types/product'
import { truncateDescription } from '@/features/products/utils/truncate'

interface ProductCardProps {
  product: Product
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export function ProductCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(() => isFavoriteProduct(product.id))

  function handleFavoriteClick() {
    setIsFavorite(toggleFavoriteProduct(product.id))
  }

  return (
    <article
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:border-gray-800 dark:bg-gray-900 dark:shadow-none dark:hover:border-gray-700 dark:focus-visible:ring-gray-100 dark:focus-visible:ring-offset-gray-950"
    >
      <Link
        to={`/products/${product.id}`}
        state={{ from: 'list' }}
        aria-label={`View details for ${product.title}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 dark:focus-visible:ring-gray-100 dark:focus-visible:ring-offset-gray-950"
      >
        <div className="aspect-square w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition duration-200 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-2">
          <Link
            to={`/products/${product.id}`}
            state={{ from: 'list' }}
            className="block rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 dark:focus-visible:ring-gray-100 dark:focus-visible:ring-offset-gray-950"
          >
            <h2 className="min-h-14 break-words text-base font-semibold leading-7 text-gray-900 dark:text-gray-100">
              {product.title}
            </h2>
          </Link>
          <div className="flex items-center justify-between gap-3">
            <p className="text-lg font-bold text-gray-950 dark:text-white">
              {currencyFormatter.format(product.price)}
            </p>
            <button
              type="button"
              aria-pressed={isFavorite}
              aria-label={isFavorite ? `Remove ${product.title} from favorites` : `Add ${product.title} to favorites`}
              onClick={handleFavoriteClick}
              className={
                isFavorite
                  ? 'min-h-10 rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-950 dark:hover:bg-gray-300 dark:focus-visible:ring-gray-100 dark:focus-visible:ring-offset-gray-950'
                  : 'min-h-10 rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-900 transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 motion-reduce:transition-none dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800 dark:focus-visible:ring-gray-100 dark:focus-visible:ring-offset-gray-950'
              }
            >
              {isFavorite ? 'Saved' : 'Favorite'}
            </button>
          </div>
        </div>

        <p className="mt-auto text-sm leading-6 text-gray-600 dark:text-gray-300">
          {truncateDescription(product.description, 100)}
        </p>
      </div>
    </article>
  )
}
