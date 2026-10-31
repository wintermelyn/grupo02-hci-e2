import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type DragEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from 'react'

/** Under this distance a press on a book is a click, not a drag. */
const DRAG_THRESHOLD = 6
/** Room left by a rounding of scrollLeft, so the end of the rail counts as the end. */
const END_TOLERANCE = 4
/** One click moves nearly a page of covers, leaving a neighbour in sight. */
const PAGE_SHARE = 0.8
const MIN_PAGE = 200

const LINK_SELECTOR = 'a[href]'

const calm = () => Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)

/**
 * A native horizontal rail: the finger and the trackpad belong to the browser. This adds what the
 * browser does not give: moving by pages, dragging with the mouse and the arrow keys between books.
 * Spread `railProps` on the element with the `rail` class, and give it `ref`.
 */
export function useRail<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [canGoBack, setCanGoBack] = useState(false)
  const [canGoForward, setCanGoForward] = useState(false)
  const drag = useRef<{ x: number; left: number; moved: boolean; pointer: number } | null>(null)
  const justDragged = useRef(false)

  const measure = useCallback(() => {
    const rail = ref.current
    if (!rail) return
    setCanGoBack(rail.scrollLeft > END_TOLERANCE)
    setCanGoForward(rail.scrollLeft + rail.clientWidth < rail.scrollWidth - END_TOLERANCE)
  }, [])

  useEffect(() => {
    const rail = ref.current
    if (!rail) return
    const observer = new ResizeObserver(measure)
    observer.observe(rail)
    return () => observer.disconnect()
  }, [measure])

  // A book that comes or goes changes the rail without resizing it.
  useEffect(measure)

  function advance(direction: 1 | -1) {
    const rail = ref.current
    if (!rail) return
    rail.scrollBy({
      left: direction * Math.max(rail.clientWidth * PAGE_SHARE, MIN_PAGE),
      behavior: calm() ? 'auto' : 'smooth',
    })
  }

  function onPointerDown(event: PointerEvent<T>) {
    if (event.pointerType !== 'mouse' || event.button !== 0 || !ref.current) return
    drag.current = {
      x: event.clientX,
      left: ref.current.scrollLeft,
      moved: false,
      pointer: event.pointerId,
    }
  }

  function onPointerMove(event: PointerEvent<T>) {
    const current = drag.current
    const rail = ref.current
    if (!current || !rail) return
    const distance = event.clientX - current.x
    if (!current.moved && Math.abs(distance) > DRAG_THRESHOLD) {
      current.moved = true
      rail.setPointerCapture(current.pointer)
      rail.dataset.dragging = 'true'
    }
    if (current.moved) rail.scrollLeft = current.left - distance
  }

  function onPointerUp() {
    const current = drag.current
    drag.current = null
    if (!current?.moved) return
    justDragged.current = true
    delete ref.current?.dataset.dragging
    setTimeout(() => (justDragged.current = false))
  }

  /** Letting go after a drag does not open the book left under the cursor. */
  function onClickCapture(event: MouseEvent<T>) {
    if (!justDragged.current) return
    event.preventDefault()
    event.stopPropagation()
  }

  /** The arrow keys go to the next book inside the rail, and Tab leaves it. */
  function onKeyDown(event: KeyboardEvent<T>) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    const links = [...(ref.current?.querySelectorAll<HTMLElement>(LINK_SELECTOR) ?? [])]
    const current = links.indexOf(document.activeElement as HTMLElement)
    if (current < 0) return
    const next = links[current + (event.key === 'ArrowRight' ? 1 : -1)]
    if (!next) return
    event.preventDefault()
    next.focus()
  }

  return {
    ref,
    canGoBack,
    canGoForward,
    advance,
    railProps: {
      onScroll: measure,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onClickCapture,
      onKeyDown,
      onDragStart: (event: DragEvent<T>) => event.preventDefault(),
    },
  }
}
