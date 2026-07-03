import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="flex flex-col items-center justify-center py-16 text-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">404</h1>
      <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">Page not found</p>
      <Link
        to="/products"
        className="mt-6 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-300 dark:text-blue-950 dark:hover:bg-blue-200 dark:focus:ring-blue-200 dark:focus:ring-offset-gray-950"
      >
        Go to Products
      </Link>
    </section>
  )
}
