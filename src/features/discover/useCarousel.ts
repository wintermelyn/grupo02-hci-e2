import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useRail } from '../../components'

/** The list goes three times: the middle one is looked at, and the others are the way on. */
const COPIES = 3
/** No scroll for this long means the carousel came to rest. */
const SETTLE_MS = 120

const calm = () => Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)

export interface CarouselPlace {
  /** The index of the book inside the list. */
  bookIndex: number
  /** Where it goes among the three copies, which is what tells two copies of a book apart. */
  place: number
}

/**
 * An endless carousel on a native rail: the finger and the trackpad still belong to the browser. It
 * counts places across the three copies, and at rest it moves one whole lap without showing it,
 * because the covers on both sides are the same. `startAt` is the index of the first book shown.
 */
export function useCarousel(total: number, startAt: number) {
  const { ref, railProps } = useRail<HTMLUListElement>()
  const endless = total > 1
  const firstPlace = (endless ? total : 0) + startAt
  const [place, setPlace] = useState(firstPlace)
  const current = useRef(firstPlace)
  const programmed = useRef(false)
  const touching = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const step = () => ref.current?.children[0]?.getBoundingClientRect().width ?? 0

  function moveTo(next: number) {
    current.current = next
    setPlace(next)
  }

  /** The scroll snap would pull a jump back, so it is off until the next frame. */
  function withoutSnap(rail: HTMLElement, jump: () => void) {
    rail.style.scrollSnapType = 'none'
    jump()
    requestAnimationFrame(() => {
      if (!programmed.current) rail.style.scrollSnapType = ''
    })
  }

  function focusBook(rail: HTMLElement, at: number) {
    rail.children[at]?.querySelector('a')?.focus({ preventScroll: true })
  }

  function jumpLaps(laps: number) {
    const rail = ref.current
    if (!rail || !laps) return
    const hadFocus = rail.contains(document.activeElement)
    withoutSnap(rail, () => {
      rail.scrollLeft += laps * total * step()
    })
    current.current += laps * total
    if (hadFocus) focusBook(rail, current.current)
  }

  function settle() {
    const rail = ref.current
    const width = step()
    if (!rail || !width || touching.current || rail.dataset.dragging) return
    const resting = Math.round(rail.scrollLeft / width)
    current.current = resting
    programmed.current = false
    if (endless) jumpLaps(resting >= 2 * total ? -1 : resting < total ? 1 : 0)
    setPlace(current.current)
  }

  function settleLater() {
    clearTimeout(timer.current)
    timer.current = setTimeout(settle, SETTLE_MS)
  }

  function move(steps: number, focus = false) {
    const rail = ref.current
    const width = step()
    if (!rail || !width || !endless) return
    // In quick clicks the lap goes first, so there is always room ahead.
    const target = current.current + steps
    if (target >= 2 * total) jumpLaps(-1)
    else if (target < total) jumpLaps(1)
    const next = current.current + steps
    programmed.current = true
    moveTo(next)
    rail.scrollTo({ left: next * width, behavior: calm() ? 'auto' : 'smooth' })
    if (focus) focusBook(rail, next)
    settleLater()
  }

  function onScroll() {
    railProps.onScroll()
    const rail = ref.current
    const width = step()
    if (!rail || !width) return
    if (!programmed.current) {
      const shown = Math.round(rail.scrollLeft / width)
      if (shown !== current.current) moveTo(shown)
    }
    settleLater()
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    event.preventDefault()
    move(event.key === 'ArrowRight' ? 1 : -1, true)
  }

  function onTouchEnd() {
    touching.current = false
    settleLater()
  }

  // Layout, so the page never paints the carousel at the start of the rail.
  useLayoutEffect(() => {
    const rail = ref.current
    current.current = firstPlace
    setPlace(firstPlace)
    programmed.current = false
    if (!rail) return
    withoutSnap(rail, () => {
      rail.scrollLeft = firstPlace * step()
    })
    // A lap brings another copy of a cover to the screen, and it cannot show up empty.
    rail.querySelectorAll('img').forEach((image) => {
      image.decoding = 'sync'
      image.loading = 'eager'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstPlace, total])

  useEffect(() => {
    const rail = ref.current
    if (!rail) return
    const realign = new ResizeObserver(() => {
      withoutSnap(rail, () => {
        rail.scrollLeft = current.current * step()
      })
    })
    realign.observe(rail)
    return () => {
      realign.disconnect()
      clearTimeout(timer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const places: CarouselPlace[] = Array.from({ length: endless ? COPIES : 1 }, (_, copy) =>
    Array.from({ length: total }, (_, bookIndex) => ({
      bookIndex,
      place: copy * total + bookIndex,
    })),
  ).flat()

  return {
    ref,
    place,
    bookIndex: total ? ((place % total) + total) % total : 0,
    endless,
    places,
    move,
    railProps: {
      ...railProps,
      onScroll,
      onKeyDown,
      onTouchStart: () => {
        touching.current = true
      },
      onTouchEnd,
      onTouchCancel: onTouchEnd,
    },
  }
}
