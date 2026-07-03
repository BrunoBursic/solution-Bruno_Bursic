import type { Product } from '@/features/products/types/product'

interface ProductDetailViewProps {
  product: Product
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export function ProductDetailView({ product }: ProductDetailViewProps) {
  return (
    <div className="space-y-5">
      <div>
        <p className="break-words text-sm font-medium uppercase text-gray-500 dark:text-gray-400">
          {product.category}
        </p>
        <h1 className="mt-2 break-words text-2xl font-bold text-gray-900 dark:text-gray-100">
          {product.title}
        </h1>
      </div>

      <p className="text-2xl font-bold text-gray-950 dark:text-white">
        {currencyFormatter.format(product.price)}
      </p>

      <dl className="grid gap-3 sm:grid-cols-3">
        <div className="min-w-0 rounded-lg border border-gray-200 p-3 dark:border-gray-800">
          <dt className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Rating</dt>
          <dd className="mt-1 text-base font-semibold text-gray-900 dark:text-gray-100">{product.rating}</dd>
        </div>
        <div className="min-w-0 rounded-lg border border-gray-200 p-3 dark:border-gray-800">
          <dt className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Category</dt>
          <dd className="mt-1 break-words text-base font-semibold text-gray-900 dark:text-gray-100">
            {product.category}
          </dd>
        </div>
        <div className="min-w-0 rounded-lg border border-gray-200 p-3 dark:border-gray-800">
          <dt className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Stock</dt>
          <dd className="mt-1 text-base font-semibold text-gray-900 dark:text-gray-100">{product.stock}</dd>
        </div>
      </dl>

      <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">{product.description}</p>
    </div>
  )
}
