import { useLayoutEffect, useRef, useState } from 'react'

/**
 * How many whole lines of text fit in a box whose height the layout decides. A one-line title leaves
 * room for another line of description, which is where that space belongs, and the box never shows a
 * line cut in half. `content` is what changes the room left, like the book on screen.
 */
export function useFittingLines(content: unknown) {
  const box = useRef<HTMLDivElement>(null)
  const [lines, setLines] = useState(2)

  useLayoutEffect(() => {
    const element = box.current
    if (!element) return
    const measure = () => {
      const lineHeight = Number.parseFloat(getComputedStyle(element).lineHeight)
      if (lineHeight > 0) setLines(Math.max(1, Math.floor(element.clientHeight / lineHeight)))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [content])

  return { box, lines }
}
