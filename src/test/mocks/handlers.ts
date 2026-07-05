import { http, HttpResponse } from 'msw'
import type { LoginResponse } from '@/features/auth/types/auth'
import type { Category, Product, ProductsResponse } from '@/features/products/types/product'

export const apiBaseUrl = 'https://dummyjson.com'

export const mascaraFixture: Product = {
  id: 1,
  title: 'Essence Mascara Lash Princess',
  description: 'A volumizing mascara with a dramatic finish.',
  category: 'beauty',
  price: 9.99,
  discountPercentage: 7.17,
  rating: 4.94,
  stock: 5,
  tags: ['beauty', 'mascara'],
  thumbnail: 'https://example.com/mascara.jpg',
  images: ['https://example.com/mascara.jpg', 'https://example.com/mascara-side.jpg'],
}

export const iphoneFixture: Product = {
  id: 2,
  title: 'iPhone 9',
  description: 'An Apple smartphone with a bright display.',
  category: 'smartphones',
  price: 549,
  discountPercentage: 12.96,
  rating: 4.69,
  stock: 94,
  tags: ['smartphones'],
  brand: 'Apple',
  thumbnail: 'https://example.com/iphone.jpg',
  images: ['https://example.com/iphone.jpg'],
}

const baseProductFixtures: Product[] = [mascaraFixture, iphoneFixture]

const generatedProductFixtures: Product[] = Array.from({ length: 28 }, (_, index) => {
  const id = index + 3

  return {
    id,
    title: `Catalog Item ${id}`,
    description: `Catalog item ${id} description for testing the product grid.`,
    category: id % 2 === 0 ? 'beauty' : 'smartphones',
    price: id * 10,
    discountPercentage: 0,
    rating: 4,
    stock: 20 + id,
    tags: ['catalog'],
    thumbnail: `https://example.com/product-${id}.jpg`,
    images: [`https://example.com/product-${id}.jpg`],
  }
})

export const productFixtures: Product[] = [
  ...baseProductFixtures,
  ...generatedProductFixtures,
]

const categoryFixtures: Category[] = [
  {
    slug: 'beauty',
    name: 'Beauty',
    url: `${apiBaseUrl}/products/category/beauty`,
  },
  {
    slug: 'smartphones',
    name: 'Smartphones',
    url: `${apiBaseUrl}/products/category/smartphones`,
  },
]

export const loginFixture: LoginResponse = {
  id: 1,
  username: 'emilys',
  email: 'emily@example.com',
  firstName: 'Emily',
  lastName: 'Johnson',
  gender: 'female',
  image: 'https://example.com/emily.jpg',
  accessToken: 'test-access-token',
  refreshToken: 'test-refresh-token',
}

function isLoginRequestBody(value: unknown): value is { username: string; password: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'username' in value &&
    'password' in value &&
    typeof value.username === 'string' &&
    typeof value.password === 'string'
  )
}

function paginateProducts(products: Product[], url: URL): ProductsResponse {
  const limit = Number(url.searchParams.get('limit') ?? products.length)
  const skip = Number(url.searchParams.get('skip') ?? 0)

  return {
    products: products.slice(skip, skip + limit),
    total: products.length,
    skip,
    limit,
  }
}

export const handlers = [
  http.post(`${apiBaseUrl}/auth/login`, async ({ request }) => {
    const body: unknown = await request.json()

    if (
      !isLoginRequestBody(body) ||
      body.username !== 'emilys' ||
      body.password !== 'emilyspass'
    ) {
      return HttpResponse.json({ message: 'Invalid credentials' }, { status: 400 })
    }

    return HttpResponse.json(loginFixture)
  }),

  http.get(`${apiBaseUrl}/products/search`, ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('q')?.toLowerCase() ?? ''
    const products = productFixtures.filter((product) =>
      product.title.toLowerCase().includes(query),
    )

    return HttpResponse.json(paginateProducts(products, url))
  }),

  http.get(`${apiBaseUrl}/products/categories`, () => {
    return HttpResponse.json(categoryFixtures)
  }),

  http.get(`${apiBaseUrl}/products/category/:slug`, ({ params, request }) => {
    const url = new URL(request.url)
    const slug = String(params.slug)
    const products = productFixtures.filter((product) => product.category === slug)

    return HttpResponse.json(paginateProducts(products, url))
  }),

  http.get(`${apiBaseUrl}/products/:id`, ({ params }) => {
    const id = Number(params.id)
    const product = productFixtures.find((item) => item.id === id)

    if (!product) {
      return new HttpResponse(null, { status: 404, statusText: 'Not Found' })
    }

    return HttpResponse.json(product)
  }),

  http.get(`${apiBaseUrl}/products`, ({ request }) => {
    return HttpResponse.json(paginateProducts(productFixtures, new URL(request.url)))
  }),
]
