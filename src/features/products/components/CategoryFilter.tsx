import type { Category } from '@/features/products/types/product'

interface CategoryFilterProps {
  categories: Category[]
  value: string
  isLoading: boolean
  isError: boolean
  onChange: (category: string) => void
}

export function CategoryFilter({
  categories,
  value,
  isLoading,
  isError,
  onChange,
}: CategoryFilterProps) {
  return (
    <div className="flex w-full flex-col gap-2 sm:max-w-xs">
      <label htmlFor="category-filter" className="text-sm font-medium text-gray-900 dark:text-gray-100">
        Category
      </label>
      <select
        id="category-filter"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={isLoading || isError}
        className="min-h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-gray-100 dark:focus-visible:ring-offset-gray-950 dark:disabled:bg-gray-800 dark:disabled:text-gray-500"
      >
        <option value="">All categories</option>
        {categories.map((category) => (
          <option key={category.slug} value={category.slug}>
            {category.name}
          </option>
        ))}
      </select>
      {isError ? (
        <p className="text-sm text-red-700 dark:text-red-300">Categories could not be loaded.</p>
      ) : null}
    </div>
  )
}
