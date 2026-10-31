import { Check, Pencil, Plus } from 'lucide-react'
import { useState } from 'react'
import { today } from '../lib/dates'
import { STATUS_LABELS } from '../lib/status'
import { selectBook, selectEntry, useStore } from '../store'
import type { Book, BookId, ReadingStatus } from '../types'
import { BottomSheet } from './BottomSheet'
import { Button } from './Button'
import { cx } from './cx'
import { StatusTag } from './StatusTag'

export interface StatusControlProps {
  bookId: BookId
  /**
   * The book's data, needed when it may not be in the store yet (e.g. a live search result):
   * it is added with upsertBook before any change, so the library never points to an unknown book.
   */
  book?: Book
  className?: string
}

const OPTIONS: readonly ReadingStatus[] = ['want', 'owned', 'reading', 'read']

/** The tag with its pencil (D2). Opens a panel with the four tags; a chosen tag applies at once. */
export function StatusControl({ bookId, book, className }: StatusControlProps) {
  // Tied to the book, so going to another book with the browser's back button closes the panel.
  const [openFor, setOpenFor] = useState<BookId>()
  const open = openFor === bookId
  const entry = useStore(selectEntry(bookId))
  const title = useStore(selectBook(bookId))?.title ?? book?.title
  const setStatus = useStore((state) => state.setStatus)
  const finishBook = useStore((state) => state.finishBook)
  const upsertBook = useStore((state) => state.upsertBook)
  const current = entry?.status

  function choose(status: ReadingStatus) {
    // Closed first, so the toast's Deshacer is not left behind the modal.
    setOpenFor(undefined)
    // Finishing again would replace finishedAt and drop the rating of a book already in Leído.
    if (status === current) return
    if (book) upsertBook(book)
    if (status === 'read') {
      const startedAt = entry?.startedAt ?? entry?.addedAt ?? today()
      finishBook(bookId, { startedAt, finishedAt: today() })
    } else {
      setStatus(bookId, status)
    }
  }

  const bookName = title ? `«${title}»` : 'este libro'

  return (
    <>
      {/* One button for both states: the dialog gives focus back to it after adding the book. */}
      <Button
        icon={current ? undefined : Plus}
        aria-label={current && `${STATUS_LABELS[current]}. Cambiar estado de ${bookName}`}
        onClick={() => setOpenFor(bookId)}
        className={className}
      >
        {current ? (
          <>
            <StatusTag status={current} />
            <Pencil aria-hidden size={16} />
            Cambiar
          </>
        ) : (
          'Agregar a Mis libros'
        )}
      </Button>

      <BottomSheet
        open={open}
        onClose={() => setOpenFor(undefined)}
        title={current ? `Estado de ${bookName}` : 'Agregar a Mis libros'}
      >
        <ul className="flex flex-col gap-1">
          {OPTIONS.map((status) => {
            const selected = current === status
            return (
              <li key={status}>
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => choose(status)}
                  className={cx(
                    'flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border-2 px-3 py-1',
                    selected ? 'border-gray-500' : 'border-transparent',
                  )}
                >
                  <StatusTag status={status} />
                  {/* aria-pressed already says this, so it stays out of the button's name. */}
                  {selected && (
                    <span aria-hidden className="inline-flex items-center gap-1 font-semibold">
                      <Check size={18} strokeWidth={3} />
                      Actual
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </BottomSheet>
    </>
  )
}
