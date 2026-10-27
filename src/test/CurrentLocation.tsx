import { useLocation } from 'react-router'

export const CURRENT_LOCATION_TEST_ID = 'current-location'

/** Prints the router's URL so tests can assert navigation. Read it with `currentLocation()`. */
export function CurrentLocation() {
  const { pathname, search } = useLocation()
  return <output data-testid={CURRENT_LOCATION_TEST_ID}>{pathname + search}</output>
}
