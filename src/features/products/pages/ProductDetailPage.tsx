import { useParams } from 'react-router-dom'
import { BackToListLink } from '@/features/products/components/BackToListLink'
import { ProductDetailView } from '@/features/products/components/ProductDetailView'
import { ProductGallery } from '@/features/products/components/ProductGallery'
import { useProductQuery } from '@/features/products/hooks/useProductQuery'
import { Skeleton } from '@/shared/components/Skeleton'
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

const thumbnailSkeletons = Array.from({ length: 5 }, (_, index) => index)
const metricSkeletons = Array.from({ length: 3 }, (_, index) => index)

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const productId = parseProductId(id)
  const productQuery = useProductQuery(productId)

  if (productId === null || productQuery.error instanceof NotFoundError) {
    return (
      <section className="space-y-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Product not found</h1>
          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
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
        className="space-y-6"
      >
        <span className="sr-only">Loading product...</span>
        <Skeleton className="h-10 w-36" />

        <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
            <div className="space-y-3">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-4 lg:grid-cols-5">
                {thumbnailSkeletons.map((index) => (
                  <Skeleton key={index} className="aspect-square w-full" />
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-3/4" />
              </div>

              <Skeleton className="h-8 w-28" />

              <div className="grid gap-3 sm:grid-cols-3">
                {metricSkeletons.map((index) => (
                  <div
                    key={index}
                    className="min-w-0 rounded-lg border border-gray-200 p-3 dark:border-gray-800"
                  >
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="mt-2 h-5 w-20" />
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (productQuery.isError) {
    return (
      <section
        role="alert"
        className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-900 dark:border-red-900/70 dark:bg-red-950/50 dark:text-red-100"
      >
        <h1 className="text-xl font-semibold">Error: Couldn't load product.</h1>
        <p className="mt-2 leading-6">Try again to reload this product.</p>
        <button
          type="button"
          onClick={() => void productQuery.refetch()}
          className="mt-4 min-h-10 rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2 motion-reduce:transition-none dark:bg-red-300 dark:text-red-950 dark:hover:bg-red-200 dark:focus-visible:ring-red-200 dark:focus-visible:ring-offset-gray-950"
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

      <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <ProductGallery
            title={product.title}
            thumbnail={product.thumbnail}
            images={product.images}
          />
          <ProductDetailView product={product} />
        </div>
      </div>
    </section>
  )
}
