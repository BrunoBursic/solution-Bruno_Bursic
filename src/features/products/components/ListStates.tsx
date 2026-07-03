interface ListEmptyProps {
  onClearFilters: () => void
}

interface ListErrorProps {
  onRetry: () => void
}

export function ListLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="h-4 w-4 rounded-full border-2 border-gray-300 border-t-gray-900 motion-safe:animate-spin dark:border-gray-700 dark:border-t-gray-100"
        />
        <span className="sr-only">Loading products...</span>
        <span aria-hidden="true">Loading products...</span>
      </div>
    </div>
  )
}

export function ListEmpty({ onClearFilters }: ListEmptyProps) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-900">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">No products found</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600 dark:text-gray-300">
        No products match your filters. Clear the current filters and try the full catalog again.
      </p>
      <button
        type="button"
        onClick={onClearFilters}
        className="mt-5 min-h-10 rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-950 dark:hover:bg-gray-300 dark:focus-visible:ring-gray-100 dark:focus-visible:ring-offset-gray-950"
      >
        Clear filters
      </button>
    </div>
  )
}

export function ListError({ onRetry }: ListErrorProps) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-900 dark:border-red-900/70 dark:bg-red-950/50 dark:text-red-100"
    >
      <h2 className="text-base font-semibold">Error: Couldn't load products.</h2>
      <p className="mt-2 leading-6">
        The catalog request failed. Try again to reload the product list.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 min-h-10 rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2 motion-reduce:transition-none dark:bg-red-300 dark:text-red-950 dark:hover:bg-red-200 dark:focus-visible:ring-red-200 dark:focus-visible:ring-offset-gray-950"
      >
        Retry
      </button>
    </div>
  )
}
