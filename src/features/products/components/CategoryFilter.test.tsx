import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CategoryFilter } from '@/features/products/components/CategoryFilter'
import { renderWithProviders } from '@/test/testUtils'

const categories = [
  {
    slug: 'beauty',
    name: 'Beauty',
    url: 'https://dummyjson.com/products/category/beauty',
  },
  {
    slug: 'smartphones',
    name: 'Smartphones',
    url: 'https://dummyjson.com/products/category/smartphones',
  },
]

describe('CategoryFilter', () => {
  it('renders categories and emits the selected slug', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    renderWithProviders(
      <CategoryFilter
        categories={categories}
        value=""
        isLoading={false}
        isError={false}
        onChange={onChange}
      />,
    )

    await user.selectOptions(screen.getByLabelText('Category'), 'smartphones')

    expect(screen.getByRole('option', { name: 'All categories' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Beauty' })).toBeInTheDocument()
    expect(onChange).toHaveBeenCalledWith('smartphones')
  })

  it('shows an error and disables the select when categories fail', () => {
    renderWithProviders(
      <CategoryFilter
        categories={[]}
        value=""
        isLoading={false}
        isError
        onChange={() => undefined}
      />,
    )

    expect(screen.getByLabelText('Category')).toBeDisabled()
    expect(screen.getByText('Categories could not be loaded.')).toBeInTheDocument()
  })
})
