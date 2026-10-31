import { Search, X } from 'lucide-react'
import { useRef } from 'react'
import { cx } from './cx'

export interface SearchFieldProps {
  /** Names the field for screen readers, e.g. "Buscar personas". */
  label: string
  value: string
  onChange: (value: string) => void
  /** Says what can be searched. It disappears on typing, so it never replaces the label. */
  placeholder?: string
  className?: string
}

/** Filters as the person types, so it has no submit button. */
export function SearchField({ label, value, onChange, placeholder, className }: SearchFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  function clear() {
    onChange('')
    inputRef.current?.focus()
  }

  return (
    <div
      className={cx(
        'flex min-h-11 items-center gap-2 rounded-control bg-white pl-3 shadow-card',
        // The same focus style as everywhere, around the whole field and not just its text.
        'has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-ink',
        className,
      )}
    >
      <Search aria-hidden size={20} className="shrink-0 text-muted" />
      <input
        ref={inputRef}
        type="search"
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        enterKeyHint="search"
        className="min-h-11 w-full min-w-0 appearance-none bg-transparent py-2 outline-none placeholder:text-muted [&::-webkit-search-cancel-button]:appearance-none"
      />
      {value && (
        <button
          type="button"
          aria-label="Borrar búsqueda"
          onClick={clear}
          className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-control px-2.5 font-medium text-muted -outline-offset-2 hover:text-ink active:bg-shell"
        >
          <X aria-hidden size={18} />
          Borrar
        </button>
      )}
    </div>
  )
}
