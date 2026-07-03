import { useLocation, useNavigate } from 'react-router-dom'

function cameFromList(state: unknown): boolean {
  return (
    typeof state === 'object' &&
    state !== null &&
    'from' in state &&
    state.from === 'list'
  )
}

export function BackToListLink() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleBack = () => {
    if (cameFromList(location.state)) {
      navigate(-1)
      return
    }

    navigate('/products')
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      className="inline-flex min-h-10 items-center rounded-md border border-gray-300 px-4 text-sm font-semibold text-gray-800 transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
    >
      Back to products
    </button>
  )
}
