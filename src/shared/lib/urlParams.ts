export interface ProductListUrlState {
  q: string
  category: string
  minPrice?: number
  maxPrice?: number
  page: number
}

export interface ProductListUrlPatch {
  q?: string
  category?: string
  minPrice?: string | number | null
  maxPrice?: string | number | null
  page?: number | null
}

function parseOptionalNumber(value: string | null): number | undefined {
  if (!value) {
    return undefined
  }

  const parsed = Number(value)

  return Number.isFinite(parsed) ? parsed : undefined
}

function parsePage(value: string | null): number {
  const parsed = Number(value)

  if (!Number.isInteger(parsed) || parsed < 1) {
    return 1
  }

  return parsed
}

function setStringParam(params: URLSearchParams, key: string, value: string): void {
  const trimmedValue = value.trim()

  if (trimmedValue) {
    params.set(key, trimmedValue)
  } else {
    params.delete(key)
  }
}

function setOptionalNumberParam(
  params: URLSearchParams,
  key: string,
  value: string | number | null,
): void {
  if (value === null || value === '') {
    params.delete(key)
    return
  }

  params.set(key, String(value))
}

export function parseProductListParams(params: URLSearchParams): ProductListUrlState {
  const minPrice = parseOptionalNumber(params.get('minPrice'))
  const maxPrice = parseOptionalNumber(params.get('maxPrice'))

  return {
    q: params.get('q') ?? '',
    category: params.get('category') ?? '',
    ...(minPrice !== undefined ? { minPrice } : {}),
    ...(maxPrice !== undefined ? { maxPrice } : {}),
    page: parsePage(params.get('page')),
  }
}

export function serializeProductListParams(
  state: ProductListUrlState,
  patch: ProductListUrlPatch,
): URLSearchParams {
  const params = new URLSearchParams()

  setStringParam(params, 'q', state.q)
  setStringParam(params, 'category', state.category)

  if (state.minPrice !== undefined) {
    params.set('minPrice', String(state.minPrice))
  }

  if (state.maxPrice !== undefined) {
    params.set('maxPrice', String(state.maxPrice))
  }

  if (state.page > 1) {
    params.set('page', String(state.page))
  }

  if (patch.q !== undefined) {
    setStringParam(params, 'q', patch.q)
  }

  if (patch.category !== undefined) {
    setStringParam(params, 'category', patch.category)
  }

  if (patch.minPrice !== undefined) {
    setOptionalNumberParam(params, 'minPrice', patch.minPrice)
  }

  if (patch.maxPrice !== undefined) {
    setOptionalNumberParam(params, 'maxPrice', patch.maxPrice)
  }

  if (patch.page !== undefined) {
    if (patch.page === null || patch.page <= 1) {
      params.delete('page')
    } else {
      params.set('page', String(patch.page))
    }
  }

  return params
}
