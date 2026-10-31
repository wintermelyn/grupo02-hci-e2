import { CircleAlert } from 'lucide-react'
import { useEffect, useId, useRef, type KeyboardEvent } from 'react'

export interface TextFieldProps {
  /** Names the field for screen readers: the place it sits in already names it on screen. */
  label: string
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  onCancel: () => void
  /** Why the value cannot be saved. */
  problem?: string
  maxLength?: number
}

/**
 * A short text written where it is read, with the type of what it replaces. It starts focused with
 * its text selected. Whoever shows it puts Guardar and Cancelar next to it.
 */
export function TextField({
  label,
  value,
  onChange,
  onSubmit,
  onCancel,
  problem,
  maxLength,
}: TextFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const hintId = useId()

  useEffect(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [])

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      // Saving can give the focus back to a button, which would take this same key as a click.
      event.preventDefault()
      onSubmit()
    }
    if (event.key === 'Escape') onCancel()
  }

  return (
    <>
      <input
        ref={inputRef}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        aria-label={label}
        aria-describedby={hintId}
        aria-invalid={Boolean(problem)}
        maxLength={maxLength}
        autoComplete="off"
        enterKeyHint="done"
        // The focus outline already draws the field, so its edge steps aside.
        className="block min-h-11 w-full min-w-0 rounded-control border border-edge bg-white px-3 font-semibold focus-visible:border-transparent"
      />
      {/* Spans, so it also fits inside a heading. Mounted for screen readers. */}
      <span
        id={hintId}
        role="status"
        className="block font-sans text-sm font-normal tracking-normal"
      >
        {problem && (
          <span className="mt-1 flex items-center gap-1.5">
            <CircleAlert aria-hidden size={16} className="shrink-0 text-muted" />
            {problem}
          </span>
        )}
      </span>
    </>
  )
}
