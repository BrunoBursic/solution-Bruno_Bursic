import { createBrowserRouter, Navigate, Outlet, ScrollRestoration } from 'react-router-dom'
import { Layout } from '@/shared/components/Layout'
import { ErrorBoundary } from '@/shared/components/ErrorBoundary'
import { RequireAuth } from '@/features/auth/components/RequireAuth'
import LoginPage from '@/features/auth/pages/LoginPage'
import FavoritesPage from '@/features/favorites/pages/FavoritesPage'
import ProductsListPage from '@/features/products/pages/ProductsListPage'
import ProductDetailPage from '@/features/products/pages/ProductDetailPage'
import NotFoundPage from '@/app/NotFoundPage'

export const router = createBrowserRouter([
  {
    element: (
      <ErrorBoundary>
        <Layout>
          <Outlet />
        </Layout>
        <ScrollRestoration />
      </ErrorBoundary>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/products" replace />,
      },
      {
        path: 'products',
        element: <ProductsListPage />,
      },
      {
        path: 'products/:id',
        element: <ProductDetailPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'favorites',
        element: (
          <RequireAuth>
            <FavoritesPage />
          </RequireAuth>
        ),
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
