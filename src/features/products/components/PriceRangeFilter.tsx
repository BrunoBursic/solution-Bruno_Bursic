interface PriceRangeFilterProps {
  minValue: string
  maxValue: string
  error: string | null
  onChange: (nextRange: { min: string; max: string }) => void
}

export function PriceRangeFilter({
  minValue,
  maxValue,
  error,
  onChange,
}: PriceRangeFilterProps) {
  return (
    <fieldset className="flex w-full flex-col gap-3 sm:max-w-md">
      <legend className="text-sm font-medium text-gray-900">Price range</legend>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="min-price" className="text-sm text-gray-700">
            Min price
          </label>
          <input
            id="min-price"
            type="number"
            min="0"
            inputMode="decimal"
            value={minValue}
            onChange={(event) => onChange({ min: event.target.value, max: maxValue })}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'price-range-error' : undefined}
            className="min-h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="max-price" className="text-sm text-gray-700">
            Max price
          </label>
          <input
            id="max-price"
            type="number"
            min="0"
            inputMode="decimal"
            value={maxValue}
            onChange={(event) => onChange({ min: minValue, max: event.target.value })}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'price-range-error' : undefined}
            className="min-h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
          />
        </div>
      </div>

      {error ? (
        <p id="price-range-error" aria-live="polite" className="text-sm text-red-700">
          Error: {error}
        </p>
      ) : null}
    </fieldset>
  )
}
