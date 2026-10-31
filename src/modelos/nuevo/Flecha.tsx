import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cx } from '../../components/cx'

/**
 * El control de un riel en computador. En tacto no se muestra: ahí manda el gesto. Sale del orden
 * de tabulación porque el teclado recorre los libros con Tab y las flechas.
 */
export function Flecha({
  direccion,
  etiqueta,
  onClick,
  visible,
  className,
}: {
  direccion: 'atras' | 'adelante'
  etiqueta: string
  onClick: () => void
  visible: boolean
  className?: string
}) {
  const Icono = direccion === 'atras' ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      aria-label={etiqueta}
      tabIndex={-1}
      onClick={onClick}
      className={cx(
        'absolute z-20 flex size-12 items-center justify-center rounded-full bg-white text-ink shadow-float transition-[opacity,scale,background-color] duration-150 pointer-coarse:hidden hover:scale-105 active:scale-95',
        visible ? 'opacity-100' : 'pointer-events-none opacity-0',
        className,
      )}
    >
      <Icono aria-hidden size={24} strokeWidth={2.25} />
    </button>
  )
}
