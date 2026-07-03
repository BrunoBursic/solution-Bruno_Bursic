import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PriceRangeFilter } from '@/features/products/components/PriceRangeFilter'
import { renderWithProviders } from '@/test/testUtils'

describe('PriceRangeFilter', () => {
  it('emits valid min and max values', async () => {
    const onChange = vi.fn()

    renderWithProviders(
      <PriceRangeFilter minValue="" maxValue="" error={null} onChange={onChange} />,
    )

    fireEvent.change(screen.getByLabelText('Min price'), {
      target: { value: '10' },
    })
    fireEvent.change(screen.getByLabelText('Max price'), {
      target: { value: '99' },
    })

    expect(onChange).toHaveBeenCalledWith({ min: '10', max: '' })
    expect(onChange).toHaveBeenLastCalledWith({ min: '', max: '99' })
  })

  it('renders inline validation messages', () => {
    renderWithProviders(
      <PriceRangeFilter
        minValue="100"
        maxValue="10"
        error="Minimum price cannot be greater than maximum price."
        onChange={() => undefined}
      />,
    )

    expect(screen.getByText('Error: Minimum price cannot be greater than maximum price.')).toBeInTheDocument()
    expect(screen.getByLabelText('Min price')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText('Max price')).toHaveAttribute('aria-describedby', 'price-range-error')
  })
})
