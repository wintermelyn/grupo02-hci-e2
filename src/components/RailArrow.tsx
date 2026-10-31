import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cx } from './cx'

export interface RailArrowProps {
  direction: 'back' | 'forward'
  /** Its accessible name, e.g. "Ver más libros". On screen, the position already says it. */
  label: string
  onClick: () => void
  /** False at the end of the rail, where there is nothing more that way. */
  visible: boolean
  /** Where it sits, e.g. `top-20 left-0`, inside a `relative` parent. */
  className?: string
}

/**
 * The control of a rail with a mouse. On touch it is not there, because the gesture is what rules.
 * It leaves the tab order because the keyboard goes through the books with Tab and the arrow keys.
 */
export function RailArrow({ direction, label, onClick, visible, className }: RailArrowProps) {
  const Icon = direction === 'back' ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      aria-label={label}
      tabIndex={-1}
      disabled={!visible}
      onClick={onClick}
      className={cx(
        'absolute z-20 flex size-12 items-center justify-center rounded-full bg-white text-ink shadow-float transition-[opacity,scale,background-color] duration-150 pointer-coarse:hidden hover:scale-105 active:scale-95',
        visible ? 'opacity-100' : 'pointer-events-none opacity-0',
        className,
      )}
    >
      <Icon aria-hidden size={24} strokeWidth={2.25} />
    </button>
  )
}
