import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router'

const page = () => document.documentElement

/**
 * Another page starts at the top, and going back returns to where the list was left. A link that
 * goes back says so with `state.restoreScroll`; the browser's Back button needs nothing.
 */
export function useScrollMemory() {
  const { pathname, search, state } = useLocation()
  const navigationType = useNavigationType()
  const url = pathname + search
  const positions = useRef(new Map<string, number>())
  const shown = useRef({ pathname, url })
  // Read on scroll, because by the time a route changes the new page may have clamped the old value.
  const lastTop = useRef(0)

  useEffect(() => {
    history.scrollRestoration = 'manual'
    const remember = () => {
      lastTop.current = page().scrollTop
    }
    addEventListener('scroll', remember, { passive: true })
    return () => removeEventListener('scroll', remember)
  }, [])

  useLayoutEffect(() => {
    const left = shown.current
    shown.current = { pathname, url }
    positions.current.set(left.url, lastTop.current)
    // A filter or a search changes the URL inside the same page: moving is up to that page.
    if (left.pathname === pathname) return
    const goingBack =
      navigationType === 'POP' || (state as { restoreScroll?: boolean } | null)?.restoreScroll
    const top = goingBack ? (positions.current.get(url) ?? 0) : 0
    page().scrollTop = top
    lastTop.current = top
  }, [pathname, url, navigationType, state])
}
