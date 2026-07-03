import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ThemeProvider } from '@/shared/components/ThemeProvider'
import { ThemeToggle } from '@/shared/components/ThemeToggle'

function mockColorScheme(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

function renderThemeToggle() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>,
  )
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.classList.remove('dark')
    document.documentElement.removeAttribute('data-theme')
  })

  afterEach(() => {
    window.localStorage.clear()
    document.documentElement.classList.remove('dark')
    document.documentElement.removeAttribute('data-theme')
    vi.restoreAllMocks()
  })

  it('defaults to the system dark preference on first visit', async () => {
    mockColorScheme(true)

    renderThemeToggle()

    expect(await screen.findByRole('button', { name: /switch to light theme/i })).toBeInTheDocument()
    expect(document.documentElement).toHaveClass('dark')
    expect(window.localStorage.getItem('product-catalog-theme')).toBe('dark')
  })

  it('toggles theme and persists the selected preference', async () => {
    mockColorScheme(false)
    const user = userEvent.setup()

    renderThemeToggle()

    const toggle = await screen.findByRole('button', { name: /switch to dark theme/i })
    expect(document.documentElement).not.toHaveClass('dark')

    await user.click(toggle)

    expect(document.documentElement).toHaveClass('dark')
    expect(window.localStorage.getItem('product-catalog-theme')).toBe('dark')
    expect(screen.getByRole('button', { name: /switch to light theme/i })).toBePressed()
  })
})
