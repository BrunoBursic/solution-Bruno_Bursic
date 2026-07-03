import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { useProductsQuery } from '@/features/products/hooks/useProductsQuery'
import {
  apiBaseUrl,
  mascaraFixture,
  productFixtures,
} from '@/test/mocks/handlers'
import { server } from '@/test/mocks/server'

function createCachingQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 5 * 60_000,
        retry: false,
        staleTime: 60_000,
      },
      mutations: {
        retry: false,
      },
    },
  })
}

function ProductsProbe() {
  const query = useProductsQuery({ limit: 24, page: 1 })

  if (query.isLoading) {
    return <div>Loading products</div>
  }

  if (query.isError) {
    return <div>Products failed</div>
  }

  if (!query.data) {
    return <div>No products loaded</div>
  }

  return <div>{query.data.products[0]?.title}</div>
}

function QueryClientWrapper({
  children,
  queryClient,
}: {
  children: ReactNode
  queryClient: QueryClient
}) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

describe('useProductsQuery caching', () => {
  it('reuses fresh cached data for the same query key', async () => {
    const queryClient = createCachingQueryClient()
    let requestCount = 0

    server.use(
      http.get(`${apiBaseUrl}/products`, ({ request }) => {
        const url = new URL(request.url)
        requestCount += 1

        return HttpResponse.json({
          products: productFixtures.slice(0, 24),
          total: productFixtures.length,
          skip: Number(url.searchParams.get('skip') ?? 0),
          limit: Number(url.searchParams.get('limit') ?? 24),
        })
      }),
    )

    const firstRender = render(
      <QueryClientWrapper queryClient={queryClient}>
        <ProductsProbe />
      </QueryClientWrapper>,
    )

    await screen.findByText(mascaraFixture.title)
    expect(requestCount).toBe(1)

    firstRender.unmount()

    render(
      <QueryClientWrapper queryClient={queryClient}>
        <ProductsProbe />
      </QueryClientWrapper>,
    )

    expect(screen.getByText(mascaraFixture.title)).toBeInTheDocument()
    await new Promise((resolve) => {
      setTimeout(resolve, 25)
    })
    expect(requestCount).toBe(1)
  })
})
