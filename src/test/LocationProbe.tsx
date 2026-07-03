import { useLocation } from 'react-router-dom'

export function LocationProbe() {
  const location = useLocation()

  return <div aria-label="Current location">{`${location.pathname}${location.search}`}</div>
}
