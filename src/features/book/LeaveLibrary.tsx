import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { Button, InlineConfirm } from '../../components'
import { ignoreSecondClick } from '../../components/ignoreSecondClick'
import { whatIsLost } from '../../lib/leaveLibrary'
import { useStore } from '../../store'
import type { Book, LibraryEntry } from '../../types'

export interface LeaveLibraryProps {
  book: Book
  entry: LibraryEntry
}

/**
 * Taking the book out of Mis libros, on its own and below the record, so changing the tag never
 * sits one tap away from it. In testing the two together made people wary of the menu, so this one
 * asks in the page and says what goes with the book. Deshacer still follows.
 */
export function LeaveLibrary({ book, entry }: LeaveLibraryProps) {
  const folders = useStore((state) => state.folders)
  const removeFromLibrary = useStore((state) => state.removeFromLibrary)
  const focusToast = useStore((state) => state.focusToast)
  const [asking, setAsking] = useState(false)
  const button = useRef<HTMLButtonElement>(null)
  const returnFocus = useRef(false)

  // The button only exists again once the question is gone.
  useEffect(() => {
    if (asking || !returnFocus.current) return
    returnFocus.current = false
    button.current?.focus()
  }, [asking])

  function cancel() {
    returnFocus.current = true
    setAsking(false)
  }

  function leave({ detail }: MouseEvent) {
    // The record shrinks as the book leaves, and the second tap would land on what comes up.
    ignoreSecondClick()
    removeFromLibrary([book.id])
    // Enter and Space send a click with no clicks counted. By keyboard, Deshacer is too far away.
    if (detail === 0) focusToast()
  }

  if (asking) {
    return (
      <InlineConfirm
        title={`¿Quitar «${book.title}» de Mis libros?`}
        confirmLabel="Quitar de Mis libros"
        onConfirm={leave}
        onCancel={cancel}
        className="col-span-2 mt-3"
      >
        {whatIsLost(entry, folders)}
      </InlineConfirm>
    )
  }

  return (
    // Its text ends where "Elegir carpetas" ends, on the row above.
    <div className="col-span-2 -mr-2 mt-1 flex justify-end">
      <Button
        ref={button}
        variant="quiet"
        compact
        aria-label={`Quitar de Mis libros: «${book.title}»`}
        onClick={() => setAsking(true)}
      >
        Quitar de Mis libros
      </Button>
    </div>
  )
}
