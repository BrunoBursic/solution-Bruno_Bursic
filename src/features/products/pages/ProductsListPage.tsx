import { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CategoryFilter } from '@/features/products/components/CategoryFilter'
import { ListEmpty, ListError, ListLoading } from '@/features/products/components/ListStates'
import { Pagination } from '@/features/products/components/Pagination'
import { PriceRangeFilter } from '@/features/products/components/PriceRangeFilter'
import { ProductGrid } from '@/features/products/components/ProductGrid'
import { useCategoriesQuery } from '@/features/products/hooks/useCategoriesQuery'
import { useProductsQuery } from '@/features/products/hooks/useProductsQuery'
import { priceFilter, type PriceRange } from '@/features/products/utils/priceFilter'
import { env } from '@/shared/utils/env'

function parsePageParam(value: string | null): number {
  const parsed = Number(value)

  if (!Number.isInteger(parsed) || parsed < 1) {
    return 1
  }

  return parsed
}

function parseOptionalPrice(value: string | null): number | undefined {
  if (!value) {
    return undefined
  }

  const parsed = Number(value)

  if (!Number.isFinite(parsed)) {
    return undefined
  }

  return parsed
}

function getPriceRangeError(minValue: string, maxValue: string): string | null {
  const min = parseOptionalPrice(minValue)
  const max = parseOptionalPrice(maxValue)

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
  const [searchParams, setSearchParams] = useSearchParams()
  const currentPage = parsePageParam(searchParams.get('page'))
  const selectedCategory = searchParams.get('category') ?? ''
  const minPriceValue = searchParams.get('minPrice') ?? ''
  const maxPriceValue = searchParams.get('maxPrice') ?? ''
  const priceRangeError = getPriceRangeError(minPriceValue, maxPriceValue)
  const pageSize = env.VITE_DEFAULT_PAGE_SIZE
  const productQueryParams = selectedCategory
    ? { category: selectedCategory, page: currentPage, limit: pageSize }
    : { page: currentPage, limit: pageSize }
  const productsQuery = useProductsQuery(productQueryParams)
  const categoriesQuery = useCategoriesQuery()
  const products = useMemo(() => {
    const rawProducts = productsQuery.data?.products ?? []

    if (priceRangeError) {
      return rawProducts
    }

    const min = parseOptionalPrice(minPriceValue)
    const max = parseOptionalPrice(maxPriceValue)
    const range: PriceRange = {
      ...(min !== undefined ? { min } : {}),
      ...(max !== undefined ? { max } : {}),
    }

    return priceFilter(rawProducts, range)
  }, [maxPriceValue, minPriceValue, priceRangeError, productsQuery.data?.products])
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

  const handleCategoryChange = (category: string) => {
    const nextParams = new URLSearchParams(searchParams)

    if (category) {
      nextParams.set('category', category)
    } else {
      nextParams.delete('category')
    }

    nextParams.delete('page')
    setSearchParams(nextParams, { replace: true })
  }

  const handlePriceRangeChange = (nextRange: { min: string; max: string }) => {
    const nextParams = new URLSearchParams(searchParams)
    const nextError = getPriceRangeError(nextRange.min, nextRange.max)

    if (nextRange.min) {
      nextParams.set('minPrice', nextRange.min)
    } else {
      nextParams.delete('minPrice')
    }

    if (nextRange.max) {
      nextParams.set('maxPrice', nextRange.max)
    } else {
      nextParams.delete('maxPrice')
    }

    if (!nextError) {
      nextParams.delete('page')
    }

    setSearchParams(nextParams, { replace: true })
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
        <CategoryFilter
          categories={categoriesQuery.data ?? []}
          value={selectedCategory}
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
