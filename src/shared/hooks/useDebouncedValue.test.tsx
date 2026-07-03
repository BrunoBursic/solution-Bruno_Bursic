import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'

describe('useDebouncedValue', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns the latest value only after the delay', () => {
    vi.useFakeTimers()

    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 350),
      { initialProps: { value: 'p' } },
    )

    expect(result.current).toBe('p')

    rerender({ value: 'phone' })
    expect(result.current).toBe('p')

    act(() => {
      vi.advanceTimersByTime(349)
    })
    expect(result.current).toBe('p')

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toBe('phone')
  })

  it('cancels pending updates when the value changes rapidly', () => {
    vi.useFakeTimers()

    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 350),
      { initialProps: { value: '' } },
    )

    rerender({ value: 'pho' })
    act(() => {
      vi.advanceTimersByTime(200)
    })

    rerender({ value: 'phone' })
    act(() => {
      vi.advanceTimersByTime(349)
    })
    expect(result.current).toBe('')

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toBe('phone')
  })
})
