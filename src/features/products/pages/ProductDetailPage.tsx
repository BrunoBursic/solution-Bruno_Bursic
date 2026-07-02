import { useParams } from 'react-router-dom'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <section>
      <h1 className="text-2xl font-bold text-gray-900">Product Detail</h1>
      <p className="mt-2 text-gray-600">Product {id} detail coming soon.</p>
    </section>
  )
}
