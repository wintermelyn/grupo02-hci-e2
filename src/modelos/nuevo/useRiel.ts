import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react'

const calma = () => matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Un riel horizontal nativo: el dedo y el trackpad son del navegador. Esto agrega lo que el
 * navegador no da: avanzar por páginas, arrastrar con el mouse y moverse con las flechas del teclado.
 */
export function useRiel<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [puedeAtras, setAtras] = useState(false)
  const [puedeAdelante, setAdelante] = useState(false)
  const arrastre = useRef<{ x: number; left: number; movido: boolean; id: number } | null>(null)
  const recienArrastrado = useRef(false)

  const medir = useCallback(() => {
    const el = ref.current
    if (!el) return
    setAtras(el.scrollLeft > 4)
    setAdelante(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    medir()
    const el = ref.current
    if (!el) return
    const observador = new ResizeObserver(medir)
    observador.observe(el)
    return () => observador.disconnect()
  }, [medir])

  /** Como Apple Music y Netflix: una página de portadas por clic, no una a la vez. */
  function avanzar(direccion: 1 | -1) {
    const el = ref.current
    if (!el) return
    el.scrollBy({
      left: direccion * Math.max(el.clientWidth * 0.8, 200),
      behavior: calma() ? 'auto' : 'smooth',
    })
  }

  function onPointerDown(event: PointerEvent<T>) {
    if (event.pointerType !== 'mouse' || event.button !== 0 || !ref.current) return
    arrastre.current = { x: event.clientX, left: ref.current.scrollLeft, movido: false, id: event.pointerId }
  }

  function onPointerMove(event: PointerEvent<T>) {
    const actual = arrastre.current
    const el = ref.current
    if (!actual || !el) return
    const delta = event.clientX - actual.x
    if (!actual.movido && Math.abs(delta) > 6) {
      actual.movido = true
      el.setPointerCapture(actual.id)
      el.classList.add('arrastrando')
    }
    if (actual.movido) el.scrollLeft = actual.left - delta
  }

  function onPointerUp() {
    const actual = arrastre.current
    arrastre.current = null
    if (actual?.movido) {
      recienArrastrado.current = true
      ref.current?.classList.remove('arrastrando')
      setTimeout(() => (recienArrastrado.current = false))
    }
  }

  /** Soltar después de arrastrar no abre el libro que quedó bajo el cursor. */
  function onClickCapture(event: MouseEvent<T>) {
    if (recienArrastrado.current) {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  /** Las flechas pasan al libro vecino dentro del riel; Tab sale de él. */
  function onKeyDown(event: KeyboardEvent<T>) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    const enlaces = [...(ref.current?.querySelectorAll<HTMLElement>('a[href]') ?? [])]
    const actual = enlaces.indexOf(document.activeElement as HTMLElement)
    if (actual < 0) return
    const siguiente = enlaces[actual + (event.key === 'ArrowRight' ? 1 : -1)]
    if (!siguiente) return
    event.preventDefault()
    siguiente.focus()
  }

  return {
    ref,
    puedeAtras,
    puedeAdelante,
    avanzar,
    rielProps: {
      onScroll: medir,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onClickCapture,
      onKeyDown,
      onDragStart: (event: { preventDefault: () => void }) => event.preventDefault(),
    },
  }
}
