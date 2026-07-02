import { useNavigate, useSearchParams } from 'react-router-dom'
import { ListEmpty, ListError, ListLoading } from '@/features/products/components/ListStates'
import { Pagination } from '@/features/products/components/Pagination'
import { ProductGrid } from '@/features/products/components/ProductGrid'
import { useProductsQuery } from '@/features/products/hooks/useProductsQuery'
import { env } from '@/shared/utils/env'

function parsePageParam(value: string | null): number {
  const parsed = Number(value)

  if (!Number.isInteger(parsed) || parsed < 1) {
    return 1
  }

  return parsed
}

export default function ProductsListPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const currentPage = parsePageParam(searchParams.get('page'))
  const pageSize = env.VITE_DEFAULT_PAGE_SIZE
  const productsQuery = useProductsQuery({ page: currentPage, limit: pageSize })
  const products = productsQuery.data?.products ?? []
  const totalItems = productsQuery.data?.total ?? 0
  const hasProducts = products.length > 0

  const handleRetry = () => {
    void productsQuery.refetch()
  }

  const handleClearFilters = () => {
    navigate('/products', { replace: true })
  }

  const handlePageChange = (page: number) => {
    const nextParams = new URLSearchParams(searchParams)

    if (page <= 1) {
      nextParams.delete('page')
    } else {
      nextParams.set('page', String(page))
    }

    setSearchParams(nextParams)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
          Browse products from the catalog.
        </p>
      </div>

      {productsQuery.isLoading ? <ListLoading /> : null}

      {productsQuery.isError ? <ListError onRetry={handleRetry} /> : null}

      {!productsQuery.isLoading && !productsQuery.isError && !hasProducts ? (
        <ListEmpty onClearFilters={handleClearFilters} />
      ) : null}

      {!productsQuery.isLoading && !productsQuery.isError && hasProducts ? (
        <div className="space-y-6">
          <ProductGrid products={products} />
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />
        </div>
      ) : null}
    </section>
  )
}
