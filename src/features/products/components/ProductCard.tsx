import { Link } from 'react-router-dom'
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
  const imageAlt = `${product.title} product image`

  return (
    <Link
      to={`/products/${product.id}`}
      state={{ from: 'list' }}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
    >
      <div className="aspect-square w-full overflow-hidden bg-gray-100">
        <img
          src={product.thumbnail}
          alt={imageAlt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition duration-200 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-2">
          <h2 className="min-h-14 text-base font-semibold leading-7 text-gray-900">
            {product.title}
          </h2>
          <p className="text-lg font-bold text-gray-950">
            {currencyFormatter.format(product.price)}
          </p>
        </div>

        <p className="mt-auto text-sm leading-6 text-gray-600">
          {truncateDescription(product.description, 100)}
        </p>
      </div>
    </Link>
  )
}
