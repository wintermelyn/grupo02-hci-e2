import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Button, SearchField } from '../../components'
import { cx } from '../../components/cx'
import { ignoreSecondClick } from '../../components/ignoreSecondClick'

export interface BandSearchProps {
  /** Names the field and the button that opens it, e.g. "Buscar en mi biblioteca". */
  label: string
  /** Says where it searches, because on a phone the field covers the title. */
  placeholder: string
  value: string
  onChange: (value: string) => void
  /** What shares the row with the search. A phone hides it while the field is open. */
  children?: ReactNode
}

/**
 * The search of a list, for the title row of PageHeader. A computer has room for the field. A phone
 * covers the row with it, so it opens under the finger and nothing below moves.
 */
export function BandSearch({ label, placeholder, value, onChange, children }: BandSearchProps) {
  const [opened, setOpened] = useState(false)
  // A search that came back from the URL needs the field open too.
  const open = opened || value !== ''
  const fieldRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const giveFocusBack = useRef(false)

  // The field is mounted from the start, for computers, so autoFocus would not run on opening it.
  useEffect(() => {
    if (opened) fieldRef.current?.querySelector('input')?.focus()
  }, [opened])

  // The button only exists again once the field has closed. On a computer it stays hidden, so the
  // focus stays in the field.
  useEffect(() => {
    if (open || !giveFocusBack.current) return
    giveFocusBack.current = false
    buttonRef.current?.focus()
  }, [open])

  function close() {
    // What shares the row takes the place of Cerrar, under the second tap of a double tap.
    ignoreSecondClick()
    giveFocusBack.current = true
    onChange('')
    setOpened(false)
  }

  return (
    <div className="flex items-center gap-2">
      <div
        ref={fieldRef}
        className={cx(
          'md:w-72',
          open
            ? 'max-md:absolute max-md:inset-0 max-md:flex max-md:items-center max-md:bg-shell'
            : 'max-md:hidden',
        )}
      >
        <SearchField
          label={label}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onClose={close}
          className="w-full"
        />
      </div>
      {!open && (
        <Button
          ref={buttonRef}
          compact
          aria-label={label}
          onClick={() => setOpened(true)}
          className="md:hidden"
        >
          Buscar
        </Button>
      )}
      {children && <div className={cx(open && 'max-md:hidden')}>{children}</div>}
    </div>
  )
}
