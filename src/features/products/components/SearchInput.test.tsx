import { act, fireEvent, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SearchInput } from '@/features/products/components/SearchInput'
import { renderWithProviders } from '@/test/testUtils'

describe('SearchInput', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('emits one final value after the debounce delay', async () => {
    vi.useFakeTimers()
    const onDebouncedChange = vi.fn()

    renderWithProviders(
      <SearchInput value="" delayMs={350} onDebouncedChange={onDebouncedChange} />,
    )

    fireEvent.change(screen.getByLabelText('Search products'), {
      target: { value: 'phone' },
    })

    act(() => {
      vi.advanceTimersByTime(349)
    })
    expect(onDebouncedChange).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(onDebouncedChange).toHaveBeenCalledTimes(1)
    expect(onDebouncedChange).toHaveBeenCalledWith('phone')
  })
})
