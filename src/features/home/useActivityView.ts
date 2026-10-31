import { useEffect, useLayoutEffect, useRef } from 'react'
import { useSearchParams } from 'react-router'

/** routes.tsx does not change, so the view lives in the URL of Inicio, with how far it was read. */
const ACTIVITY_PARAM = 'actividad'

export const activityPath = (batches: number) => `/?${ACTIVITY_PARAM}=${batches}`

export const ACTIVITY_PATH = activityPath(1)

function parseBatches(value: string): number {
  const batches = Number.parseInt(value, 10)
  return batches > 0 ? batches : 1
}

/** Which view of Inicio the URL asks for: `batches` is undefined on Inicio itself. */
export function useActivityView() {
  const [params, setParams] = useSearchParams()
  const value = params.get(ACTIVITY_PARAM)
  const batches = value === null ? undefined : parseBatches(value)

  function showMore() {
    // Replaced, so Back leaves the view instead of walking through each batch.
    setParams({ [ACTIVITY_PARAM]: String((batches ?? 0) + 1) }, { replace: true })
  }

  return { batches, showMore }
}

const page = () => document.documentElement

// Outside the component: opening a book from the view unmounts Inicio, and it has to come back to
// the same place afterwards.
let homeTop = 0

/**
 * useScrollMemory leaves the page alone when only the search of the URL changes, which is right for
 * a filter but not here: these are two views. The view starts at the top and Inicio returns to where
 * it was. Layout effects, because the shorter view clamps the position before a later effect runs.
 */
export function useActivityViewScroll(viewOpen: boolean) {
  const wasOpen = useRef(viewOpen)

  useLayoutEffect(() => {
    if (viewOpen) return
    const remember = () => {
      homeTop = page().scrollTop
    }
    addEventListener('scroll', remember, { passive: true })
    return () => removeEventListener('scroll', remember)
  }, [viewOpen])

  useLayoutEffect(() => {
    if (wasOpen.current === viewOpen) return
    wasOpen.current = viewOpen
    page().scrollTop = viewOpen ? 0 : homeTop
  }, [viewOpen])
}

/**
 * Inicio stays mounted when the view opens, so nothing else tells a keyboard or a screen reader that
 * the page changed. Opening goes to the title, and leaving goes back to the link it was opened from.
 * Opening the URL directly moves nothing: there the page starts as any other.
 */
export function useActivityViewFocus(viewOpen: boolean) {
  const viewTitle = useRef<HTMLSpanElement>(null)
  const viewLink = useRef<HTMLAnchorElement>(null)
  const wasOpen = useRef(viewOpen)

  useEffect(() => {
    if (wasOpen.current === viewOpen) return
    wasOpen.current = viewOpen
    const target = viewOpen ? viewTitle : viewLink
    target.current?.focus({ preventScroll: true })
  }, [viewOpen])

  return { viewTitle, viewLink }
}

/** Moves the focus to the first new row after "Ver más", which otherwise stays below all of them. */
export function useFocusNewRow(rowCount: number) {
  const list = useRef<HTMLDivElement>(null)
  const pending = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (pending.current === undefined) return
    const row = list.current?.querySelectorAll<HTMLElement>('[data-activity-link]')[pending.current]
    pending.current = undefined
    row?.focus({ preventScroll: true })
  }, [rowCount])

  return {
    list,
    focusRowAfterUpdate: () => {
      pending.current = rowCount
    },
  }
}
