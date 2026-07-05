import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/components/useAuth'
import { ThemeToggle } from '@/shared/components/ThemeToggle'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { isAuthenticated, logout } = useAuth()

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-gray-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 dark:focus:bg-gray-100 dark:focus:text-gray-950 dark:focus-visible:ring-gray-100 dark:focus-visible:ring-offset-gray-950"
      >
        Skip to main content
      </a>

      <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Product Catalog
          </span>
          <nav className="flex flex-wrap items-center gap-2 text-sm font-medium" aria-label="Primary navigation">
            <Link
              to="/products"
              className="rounded-md px-3 py-2 text-gray-700 transition hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 motion-reduce:transition-none dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-gray-100 dark:focus-visible:ring-offset-gray-950"
            >
              Products
            </Link>
            <Link
              to="/favorites"
              className="rounded-md px-3 py-2 text-gray-700 transition hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 motion-reduce:transition-none dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-gray-100 dark:focus-visible:ring-offset-gray-950"
            >
              Favorites
            </Link>
            {isAuthenticated ? (
              <button
                type="button"
                onClick={logout}
                className="rounded-md px-3 py-2 text-gray-700 transition hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 motion-reduce:transition-none dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-gray-100 dark:focus-visible:ring-offset-gray-950"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="rounded-md px-3 py-2 text-gray-700 transition hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 motion-reduce:transition-none dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-gray-100 dark:focus-visible:ring-offset-gray-950"
              >
                Login
              </Link>
            )}
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 outline-none sm:px-6 lg:px-8"
      >
        {children}
      </main>

      <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-4 text-center text-sm text-gray-500 sm:px-6 lg:px-8 dark:text-gray-400">
          Product Catalog SPA
        </div>
      </footer>
    </div>
  )
}
