import { CircleAlert } from 'lucide-react'
import { useEffect, useId, useRef, type KeyboardEvent } from 'react'
import type { Folder } from '../../types'

const MAX_NAME_LENGTH = 40

export interface FolderNameFieldProps {
  folder: Folder
  value: string
  onChange: (value: string) => void
  onSave: () => void
  onCancel: () => void
  /** Why the name cannot be saved. */
  problem?: string
}

/** Takes the place of the title with the same type, so the name changes where it is read. */
export function FolderNameField({
  folder,
  value,
  onChange,
  onSave,
  onCancel,
  problem,
}: FolderNameFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const hintId = useId()

  useEffect(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [])

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') onSave()
    if (event.key === 'Escape') onCancel()
  }

  return (
    <>
      <input
        ref={inputRef}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        aria-label={`Nombre de «${folder.name}»`}
        aria-describedby={hintId}
        aria-invalid={Boolean(problem)}
        maxLength={MAX_NAME_LENGTH}
        autoComplete="off"
        enterKeyHint="done"
        // The focus outline already draws the field, so its line steps aside.
        className="block min-h-11 w-full min-w-0 rounded-control border-b border-ink bg-transparent font-semibold focus-visible:border-transparent"
      />
      {/* Inside the h1 with the field, so the hint stays under it. Mounted for screen readers. */}
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
