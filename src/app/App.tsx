import { ErrorBoundary } from '@/shared/components/ErrorBoundary'
import { Layout } from '@/shared/components/Layout'
import { Providers } from '@/app/providers'

export default function App() {
  return (
    <ErrorBoundary>
      <Providers>
        <Layout>
          <p>Hello</p>
        </Layout>
      </Providers>
    </ErrorBoundary>
  )
}
