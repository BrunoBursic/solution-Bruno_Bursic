import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { apiBaseUrl } from '@/test/mocks/handlers'
import { renderWithProviders } from '@/test/testUtils'

describe('test setup', () => {
  it('renders with shared providers and intercepts API requests with MSW', async () => {
    renderWithProviders(<p>Test runner ready</p>)

    await expect(
      fetch(`${apiBaseUrl}/products?limit=1&skip=0`).then((response) => response.json()),
    ).resolves.toMatchObject({
      products: [{ title: 'Essence Mascara Lash Princess' }],
      total: 30,
    })
    expect(screen.getByText('Test runner ready')).toBeInTheDocument()
  })
})
