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
        <p className="text-sm font-medium uppercase text-gray-500">
          {product.category}
        </p>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">{product.title}</h1>
      </div>

      <p className="text-2xl font-bold text-gray-950">
        {currencyFormatter.format(product.price)}
      </p>

      <dl className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 p-3">
          <dt className="text-xs font-medium uppercase text-gray-500">Rating</dt>
          <dd className="mt-1 text-base font-semibold text-gray-900">{product.rating}</dd>
        </div>
        <div className="rounded-lg border border-gray-200 p-3">
          <dt className="text-xs font-medium uppercase text-gray-500">Category</dt>
          <dd className="mt-1 text-base font-semibold text-gray-900">{product.category}</dd>
        </div>
        <div className="rounded-lg border border-gray-200 p-3">
          <dt className="text-xs font-medium uppercase text-gray-500">Stock</dt>
          <dd className="mt-1 text-base font-semibold text-gray-900">{product.stock}</dd>
        </div>
      </dl>

      <p className="text-sm leading-6 text-gray-700">{product.description}</p>
    </div>
  )
}
