import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/components/useAuth'

export default function ProtectedRoutePage() {
  const { logout, session } = useAuth()

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Protected route</h1>
      <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
        Signed in as {session?.user.firstName} {session?.user.lastName}. This route is only available while a DummyJSON token is stored.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={logout}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-950 dark:hover:bg-gray-300 dark:focus-visible:ring-gray-100 dark:focus-visible:ring-offset-gray-950"
        >
          Logout
        </button>
        <Link
          to="/products"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 motion-reduce:transition-none dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800 dark:focus-visible:ring-gray-100 dark:focus-visible:ring-offset-gray-950"
        >
          Back to products
        </Link>
      </div>
    </section>
  )
}
