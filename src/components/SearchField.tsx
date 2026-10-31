import { Search, X } from 'lucide-react'
import { useRef, type KeyboardEvent } from 'react'
import { cx } from './cx'

export interface SearchFieldProps {
  /** Names the field for screen readers, e.g. "Buscar personas". */
  label: string
  value: string
  onChange: (value: string) => void
  /** Says what can be searched. It disappears on typing, so it never replaces the label. */
  placeholder?: string
  /**
   * For a field that a phone opens on request. Its way out empties and closes it, and on a phone it
   * takes the place of Borrar: with both, at 320 px, there are 56 px left to type in. Escape does the
   * same, at every width.
   */
  onClose?: () => void
  /** `lg` is for a screen whose first job is searching, like Buscar. */
  size?: 'md' | 'lg'
  className?: string
}

// -my-px: 44 px to touch, reaching over the border, so the field also measures 44 px.
const TEXT_BUTTON =
  '-my-px inline-flex min-h-11 shrink-0 items-center gap-1 rounded-full px-3 font-semibold text-ink -outline-offset-2 transition-colors duration-100 hover:bg-sand active:bg-sand-deep'

/** Filters as the person types, so it has no submit button. */
export function SearchField({
  label,
  value,
  onChange,
  placeholder,
  onClose,
  size = 'md',
  className,
}: SearchFieldProps) {
  const isLarge = size === 'lg'
  const inputRef = useRef<HTMLInputElement>(null)

  function clear() {
    onChange('')
    inputRef.current?.focus()
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') onClose?.()
  }

  return (
    <div
      className={cx(
        'flex items-center rounded-full border border-edge bg-white transition-[border-color,box-shadow] duration-150',
        isLarge ? 'min-h-14 gap-3 pr-1.5 pl-5' : 'min-h-11 gap-2 pl-4',
        // The whole pill answers, not just its text: the edge turns to ink and doubles.
        'has-[input:focus]:border-ink has-[input:focus]:ring-1 has-[input:focus]:ring-ink',
        className,
      )}
    >
      <Search aria-hidden size={isLarge ? 22 : 20} className="shrink-0 text-muted" />
      <input
        ref={inputRef}
        type="search"
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        enterKeyHint="search"
        className={cx(
          '-my-px min-h-11 w-full min-w-0 appearance-none bg-transparent py-2 outline-none placeholder:text-muted placeholder-shown:text-ellipsis [&::-webkit-search-cancel-button]:appearance-none',
          isLarge && 'text-lg',
        )}
      />
      {value && (
        <button
          type="button"
          aria-label="Borrar búsqueda"
          onClick={clear}
          className={cx(TEXT_BUTTON, onClose && 'max-md:hidden')}
        >
          <X aria-hidden size={18} />
          Borrar
        </button>
      )}
      {onClose && (
        <button
          type="button"
          aria-label="Cerrar búsqueda"
          onClick={onClose}
          className={cx(TEXT_BUTTON, 'md:hidden')}
        >
          <X aria-hidden size={18} />
          Cerrar
        </button>
      )}
    </div>
  )
}
