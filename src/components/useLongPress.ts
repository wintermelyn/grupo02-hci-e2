import { useEffect, useRef, type MouseEvent as ReactMouseEvent, type PointerEvent } from 'react'

export const LONG_PRESS_MS = 500

// A finger always moves a little; more than this is a scroll, not a press.
const MOVE_TOLERANCE_PX = 10

/**
 * Swallows the click that ends a long press. Listening on window catches it even if the press
 * re-rendered the row (e.g. into selection mode) and the click lands on a different element.
 * Touch browsers may send no click at all, so the listener is also dropped right after pointerup.
 */
function swallowNextClick() {
  const swallow = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    stop()
  }
  const stopSoon = () => setTimeout(stop, 0)
  function stop() {
    window.removeEventListener('click', swallow, true)
    window.removeEventListener('pointerup', stopSoon, true)
  }
  window.addEventListener('click', swallow, true)
  window.addEventListener('pointerup', stopSoon, true)
}

/**
 * Handlers to spread on an element so that holding it for LONG_PRESS_MS calls `onLongPress`
 * instead of clicking. Returns no handlers when `onLongPress` is undefined.
 */
export function useLongPress(onLongPress: (() => void) | undefined) {
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const start = useRef({ x: 0, y: 0 })
  const pressing = useRef(false)

  useEffect(() => () => clearTimeout(timer.current), [])

  if (!onLongPress) return {}

  const cancel = () => {
    clearTimeout(timer.current)
    timer.current = undefined
    pressing.current = false
  }

  return {
    onPointerDown: (event: PointerEvent) => {
      if (event.button !== 0) return
      pressing.current = true
      start.current = { x: event.clientX, y: event.clientY }
      timer.current = setTimeout(() => {
        timer.current = undefined
        swallowNextClick()
        onLongPress()
      }, LONG_PRESS_MS)
    },
    onPointerMove: (event: PointerEvent) => {
      if (!pressing.current) return
      const dx = event.clientX - start.current.x
      const dy = event.clientY - start.current.y
      if (Math.hypot(dx, dy) > MOVE_TOLERANCE_PX) cancel()
    },
    onPointerUp: cancel,
    onPointerLeave: cancel,
    onPointerCancel: cancel,
    // Touch browsers open the link menu on a long press. A right click never starts a press,
    // so the desktop menu (e.g. "open in a new tab") still works.
    onContextMenu: (event: ReactMouseEvent) => {
      if (pressing.current) event.preventDefault()
    },
  }
}
