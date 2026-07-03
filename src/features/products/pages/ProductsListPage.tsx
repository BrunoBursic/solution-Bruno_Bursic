import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { CategoryFilter } from '@/features/products/components/CategoryFilter'
import { ListEmpty, ListError, ListLoading } from '@/features/products/components/ListStates'
import { Pagination } from '@/features/products/components/Pagination'
import { PriceRangeFilter } from '@/features/products/components/PriceRangeFilter'
import { ProductGrid } from '@/features/products/components/ProductGrid'
import { SearchInput } from '@/features/products/components/SearchInput'
import { useCategoriesQuery } from '@/features/products/hooks/useCategoriesQuery'
import { useProductListUrlState } from '@/features/products/hooks/useProductListUrlState'
import { useProductsQuery } from '@/features/products/hooks/useProductsQuery'
import { priceFilter, type PriceRange } from '@/features/products/utils/priceFilter'
import { env } from '@/shared/utils/env'

function formatOptionalNumber(value: number | undefined): string {
  return value === undefined ? '' : String(value)
}

function getPriceRangeError(min: number | undefined, max: number | undefined): string | null {
  if ((min !== undefined && min < 0) || (max !== undefined && max < 0)) {
    return 'Prices cannot be negative.'
  }

  if (min !== undefined && max !== undefined && min > max) {
    return 'Minimum price cannot be greater than maximum price.'
  }

  return null
}

export default function ProductsListPage() {
  const navigate = useNavigate()
  const { state: urlState, update: updateUrlState } = useProductListUrlState()
  const minPriceValue = formatOptionalNumber(urlState.minPrice)
  const maxPriceValue = formatOptionalNumber(urlState.maxPrice)
  const priceRangeError = getPriceRangeError(urlState.minPrice, urlState.maxPrice)
  const pageSize = env.VITE_DEFAULT_PAGE_SIZE
  const productQueryParams = {
    ...(urlState.q ? { q: urlState.q } : {}),
    ...(urlState.category ? { category: urlState.category } : {}),
    page: urlState.page,
    limit: pageSize,
  }
  const productsQuery = useProductsQuery(productQueryParams)
  const categoriesQuery = useCategoriesQuery()
  const products = useMemo(() => {
    const rawProducts = productsQuery.data?.products ?? []

    if (priceRangeError) {
      return rawProducts
    }

    const range: PriceRange = {
      ...(urlState.minPrice !== undefined ? { min: urlState.minPrice } : {}),
      ...(urlState.maxPrice !== undefined ? { max: urlState.maxPrice } : {}),
    }

    return priceFilter(rawProducts, range)
  }, [priceRangeError, productsQuery.data?.products, urlState.maxPrice, urlState.minPrice])
  const totalItems = productsQuery.data?.total ?? 0
  const hasProducts = products.length > 0

  const handleRetry = () => {
    void productsQuery.refetch()
  }

  const handleClearFilters = () => {
    navigate('/products', { replace: true })
  }

  const handlePageChange = (page: number) => {
    updateUrlState({ page }, { replace: false })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCategoryChange = (category: string) => {
    updateUrlState({ category, page: null })
  }

  const handleSearchChange = (query: string) => {
    updateUrlState({ q: query, page: null })
  }

  const handlePriceRangeChange = (nextRange: { min: string; max: string }) => {
    const nextMin = nextRange.min ? Number(nextRange.min) : undefined
    const nextMax = nextRange.max ? Number(nextRange.max) : undefined
    const nextError = getPriceRangeError(nextMin, nextMax)

    updateUrlState({
      minPrice: nextRange.min || null,
      maxPrice: nextRange.max || null,
      ...(!nextError ? { page: null } : {}),
    })
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
          Browse products from the catalog.
        </p>
      </div>

      <div className="grid gap-4 rounded-lg border border-gray-200 bg-white p-4 md:grid-cols-2">
        <SearchInput
          key={urlState.q}
          value={urlState.q}
          onDebouncedChange={handleSearchChange}
        />
        <CategoryFilter
          categories={categoriesQuery.data ?? []}
          value={urlState.category}
          isLoading={categoriesQuery.isLoading}
          isError={categoriesQuery.isError}
          onChange={handleCategoryChange}
        />
        <PriceRangeFilter
          minValue={minPriceValue}
          maxValue={maxPriceValue}
          error={priceRangeError}
          onChange={handlePriceRangeChange}
        />
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
            currentPage={urlState.page}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />
        </div>
      ) : null}
    </section>
  )
}
