import { useNavigate } from 'react-router-dom'
import { ListEmpty, ListError, ListLoading } from '@/features/products/components/ListStates'
import { ProductGrid } from '@/features/products/components/ProductGrid'
import { useProductsQuery } from '@/features/products/hooks/useProductsQuery'

export default function ProductsListPage() {
  const navigate = useNavigate()
  const productsQuery = useProductsQuery({})
  const products = productsQuery.data?.products ?? []
  const hasProducts = products.length > 0

  const handleRetry = () => {
    void productsQuery.refetch()
  }

  const handleClearFilters = () => {
    navigate('/products', { replace: true })
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
        <ProductGrid products={products} />
      ) : null}
    </section>
  )
}
