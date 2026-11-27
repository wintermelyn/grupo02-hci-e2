import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { Button, InlineConfirm } from '../../components'
import { ignoreSecondClick } from '../../components/ignoreSecondClick'
import { whatIsLost } from '../../lib/leaveLibrary'
import { useStore } from '../../store'
import type { Book, LibraryEntry } from '../../types'

export interface LeaveLibraryProps {
  book: Book
  entry: LibraryEntry
  /**
   * The question goes with the book, so whoever shows it decides where the focus goes. It has to be
   * something that stays: the toast keeps it, to give it back after Deshacer or on Tab.
   */
  onLeave: () => void
}

/**
 * Taking the book out of Mis libros, on its own and below the record, so changing the tag never
 * sits one tap away from it. In testing the two together made people wary of the menu, so this one
 * asks in the page and says what goes with the book. Deshacer still follows.
 */
export function LeaveLibrary({ book, entry, onLeave }: LeaveLibraryProps) {
  const folders = useStore((state) => state.folders)
  const removeFromLibrary = useStore((state) => state.removeFromLibrary)
  const focusToast = useStore((state) => state.focusToast)
  const [asking, setAsking] = useState(false)
  const button = useRef<HTMLButtonElement>(null)
  const question = useRef<HTMLDivElement>(null)
  const returnFocus = useRef(false)

  // The question opens where the button was, which on a phone can be under the bottom bar. After the
  // focus goes to Cancelar, so the margins decide where it stops: clear of the bar and of the toast.
  useEffect(() => {
    if (asking) question.current?.scrollIntoView?.({ block: 'nearest' })
  }, [asking])

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
    onLeave()
    removeFromLibrary([book.id])
    // Enter and Space send a click with no clicks counted. By keyboard, Deshacer is too far away.
    if (detail === 0) focusToast()
  }

  if (asking) {
    return (
      <div ref={question} className="col-span-2 mt-3 scroll-mt-4 scroll-mb-36 lg:scroll-mb-20">
        <InlineConfirm
          title={`¿Quitar «${book.title}» de Mis libros?`}
          confirmLabel="Quitar de Mis libros"
          onConfirm={leave}
          onCancel={cancel}
        >
          {whatIsLost(entry, folders)}
        </InlineConfirm>
      </div>
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
