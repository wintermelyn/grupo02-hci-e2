import { useEffect, useId, useRef, type KeyboardEvent, type ReactNode } from 'react'
import { Button } from './Button'
import { cx } from './cx'

export interface InlineConfirmProps {
  title: string
  /** What will happen, in the words of the person. */
  children: ReactNode
  /** Names the action, e.g. "Eliminar carpeta". */
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
  className?: string
}

/**
 * Asks in the page, next to what it is about, so the person keeps seeing it. Only for what the app
 * cannot take back: anything else is applied at once and offers Deshacer. The focus starts on
 * Cancelar, so an extra Enter does not confirm. Whoever shows it gives the focus back on cancel.
 */
export function InlineConfirm({
  title,
  children,
  confirmLabel,
  onConfirm,
  onCancel,
  className,
}: InlineConfirmProps) {
  const titleId = useId()
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    cancelRef.current?.focus()
  }, [])

  function onKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Escape') return
    event.preventDefault()
    onCancel()
  }

  return (
    <section
      aria-labelledby={titleId}
      onKeyDown={onKeyDown}
      className={cx(
        'rounded-tile bg-shell p-5 md:flex md:items-center md:justify-between md:gap-6',
        className,
      )}
    >
      {/* From md it has one line per text, so a place of fixed height can hold it. */}
      <div className="min-w-0">
        <h2 id={titleId} className="font-serif text-lg font-semibold md:truncate">
          {title}
        </h2>
        <p className="mt-0.5">{children}</p>
      </div>
      <div className="mt-3 flex shrink-0 flex-wrap gap-2 md:mt-0">
        <Button variant="danger" onClick={onConfirm}>
          {confirmLabel}
        </Button>
        <Button ref={cancelRef} onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </section>
  )
}
