import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  parseProductListParams,
  serializeProductListParams,
  type ProductListUrlPatch,
} from '@/shared/lib/urlParams'

export function useProductListUrlState() {
  const [searchParams, setSearchParams] = useSearchParams()
  const state = useMemo(() => parseProductListParams(searchParams), [searchParams])

  const update = (patch: ProductListUrlPatch, options: { replace?: boolean } = {}) => {
    setSearchParams(serializeProductListParams(state, patch), {
      replace: options.replace ?? true,
    })
  }

  return { state, update }
}
