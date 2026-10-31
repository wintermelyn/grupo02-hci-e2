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
  /**
   * From md, the title and the text share a line, for a place as tall as a row of buttons. The title
   * is what gets cut, so it needs the name it repeats to be in view.
   */
  oneLine?: boolean
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
  oneLine = false,
  className,
}: InlineConfirmProps) {
  const titleId = useId()
  const cancelRef = useRef<HTMLButtonElement>(null)
  const buttonSize = oneLine ? 'md:px-2.5' : undefined

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
        'rounded-tile bg-shell p-5 md:flex md:items-center md:justify-between',
        oneLine ? 'md:gap-4 md:px-4 md:py-1.5' : 'md:gap-6',
        className,
      )}
    >
      {/* From md it has one line per text, so a place of fixed height can hold it. */}
      <div className={cx('min-w-0', oneLine && 'md:flex md:items-baseline md:gap-2')}>
        <h2
          id={titleId}
          className={cx(
            'font-serif text-lg font-semibold md:truncate',
            oneLine && 'md:min-w-0 md:text-base',
          )}
        >
          {title}
        </h2>
        <p className={cx('mt-0.5', oneLine && 'md:mt-0 md:shrink-0 md:text-sm')}>{children}</p>
      </div>
      <div className="mt-3 flex shrink-0 flex-wrap gap-2 md:mt-0">
        <Button variant="danger" onClick={onConfirm} className={buttonSize}>
          {confirmLabel}
        </Button>
        <Button ref={cancelRef} onClick={onCancel} className={buttonSize}>
          Cancelar
        </Button>
      </div>
    </section>
  )
}
