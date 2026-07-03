import { useParams } from 'react-router-dom'
import { BackToListLink } from '@/features/products/components/BackToListLink'
import { useProductQuery } from '@/features/products/hooks/useProductQuery'
import { NotFoundError } from '@/shared/types/api'

function parseProductId(value: string | undefined): number | null {
  if (!value) {
    return null
  }

  const parsed = Number(value)

  if (!Number.isInteger(parsed) || parsed < 1) {
    return null
  }

  return parsed
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const productId = parseProductId(id)
  const productQuery = useProductQuery(productId)

  if (productId === null || productQuery.error instanceof NotFoundError) {
    return (
      <section className="space-y-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            The product you requested does not exist.
          </p>
          <div className="mt-4">
            <BackToListLink />
          </div>
        </div>
      </section>
    )
  }

  if (productQuery.isLoading) {
    return (
      <section
        role="status"
        aria-live="polite"
        className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-700"
      >
        Loading product...
      </section>
    )
  }

  if (productQuery.isError) {
    return (
      <section
        role="alert"
        className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-900"
      >
        <h1 className="text-xl font-semibold">Error: Couldn't load product.</h1>
        <p className="mt-2 leading-6">Try again to reload this product.</p>
        <button
          type="button"
          onClick={() => void productQuery.refetch()}
          className="mt-4 rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2"
        >
          Retry
        </button>
      </section>
    )
  }

  const product = productQuery.data

  if (!product) {
    return null
  }

  return (
    <section className="space-y-6">
      <BackToListLink />

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
                {product.category}
              </p>
              <h1 className="mt-2 text-2xl font-bold text-gray-900">{product.title}</h1>
            </div>

            <p className="text-2xl font-bold text-gray-950">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(product.price)}
            </p>

            <p className="text-sm leading-6 text-gray-700">{product.description}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
