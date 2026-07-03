import { useEffect, useState } from 'react'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'

interface SearchInputProps {
  value: string
  onDebouncedChange: (value: string) => void
  delayMs?: number
}

export function SearchInput({ value, onDebouncedChange, delayMs = 1000 }: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value)
  const debouncedValue = useDebouncedValue(localValue, delayMs)

  useEffect(() => {
    if (debouncedValue !== value) {
      onDebouncedChange(debouncedValue)
    }
  }, [debouncedValue, onDebouncedChange, value])

  return (
    <div className="flex w-full flex-col gap-2 md:col-span-2">
      <label htmlFor="product-search" className="text-sm font-medium text-gray-900 dark:text-gray-100">
        Search products
      </label>
      <input
        id="product-search"
        type="search"
        value={localValue}
        onChange={(event) => setLocalValue(event.target.value)}
        placeholder="Search by product name"
        className="min-h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-gray-100 dark:focus-visible:ring-offset-gray-950"
      />
    </div>
  )
}
