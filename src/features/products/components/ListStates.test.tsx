import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ListEmpty, ListError, ListLoading } from '@/features/products/components/ListStates'
import { renderWithProviders } from '@/test/testUtils'

describe('ListStates', () => {
  it('renders the loading state as a status', () => {
    renderWithProviders(<ListLoading />)

    const status = screen.getByRole('status')

    expect(status).toHaveTextContent('Loading products...')
    expect(screen.getAllByTestId('product-card-skeleton')).toHaveLength(8)
    expect(status.querySelectorAll('[data-skeleton="true"]').length).toBeGreaterThan(0)
  })

  it('renders empty state and calls clear filters', async () => {
    const user = userEvent.setup()
    const onClearFilters = vi.fn()

    renderWithProviders(<ListEmpty onClearFilters={onClearFilters} />)

    await user.click(screen.getByRole('button', { name: 'Clear filters' }))

    expect(screen.getByText('No products found')).toBeInTheDocument()
    expect(onClearFilters).toHaveBeenCalledTimes(1)
  })

  it('renders error state and calls retry', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()

    renderWithProviders(<ListError onRetry={onRetry} />)

    await user.click(screen.getByRole('button', { name: 'Retry' }))

    expect(screen.getByRole('alert')).toHaveTextContent("Couldn't load products")
    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})
