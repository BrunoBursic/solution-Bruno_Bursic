import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, type RenderOptions } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { MemoryRouter, Routes } from 'react-router-dom'

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[]
}

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 0,
        retry: false,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })
}

export function renderWithProviders(
  ui: ReactElement,
  { initialEntries = ['/'], ...renderOptions }: RenderWithProvidersOptions = {},
) {
  const queryClient = createTestQueryClient()

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter
          initialEntries={initialEntries}
          future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
        >
          {children}
        </MemoryRouter>
      </QueryClientProvider>
    )
  }

  return {
    queryClient,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  }
}

export function renderWithRoutes(
  routes: ReactElement,
  { initialEntries = ['/'], ...renderOptions }: RenderWithProvidersOptions = {},
) {
  return renderWithProviders(<Routes>{routes}</Routes>, {
    initialEntries,
    ...renderOptions,
  })
}
