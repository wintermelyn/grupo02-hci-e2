import { Pencil, Plus } from 'lucide-react'
import { today } from '../lib/dates'
import { STATUS_LABELS, STATUS_ORDER } from '../lib/status'
import { selectBook, selectEntry, useStore } from '../store'
import type { Book, BookId, ReadingStatus } from '../types'
import { AnchoredMenu } from './AnchoredMenu'
import { cx } from './cx'
import { StatusTag } from './StatusTag'
import { useChanged } from './useChanged'

export interface StatusControlProps {
  bookId: BookId
  /**
   * The book's data, needed when it may not be in the store yet (e.g. a live search result):
   * it is added with upsertBook before any change, so the library never points to an unknown book.
   */
  book?: Book
  className?: string
}

/** The tag with its pencil (D2). Opens a menu next to it; a chosen tag applies at once. */
export function StatusControl({ bookId, book, className }: StatusControlProps) {
  const entry = useStore(selectEntry(bookId))
  const title = useStore(selectBook(bookId))?.title ?? book?.title
  const setStatus = useStore((state) => state.setStatus)
  const finishBook = useStore((state) => state.finishBook)
  const upsertBook = useStore((state) => state.upsertBook)
  const current = entry?.status
  const statusChanged = useChanged(current)

  function choose(status: ReadingStatus) {
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
    <AnchoredMenu
      label={current ? `Estado de ${bookName}` : 'Agregar a Mis libros'}
      resetKey={bookId}
      className={className}
      options={STATUS_ORDER.map((status) => ({
        id: status,
        label: <StatusTag status={status} />,
        checked: current === status,
        onSelect: () => choose(status),
      }))}
      trigger={(triggerProps) => (
        // One button for both states, so the focus can come back to it after adding the book.
        <button
          {...triggerProps}
          type="button"
          aria-label={current && `${STATUS_LABELS[current]}. Cambiar estado de ${bookName}`}
          className={cx(
            'flex min-h-13 w-full items-center gap-3 rounded-card px-3.5 font-semibold shadow-card',
            'transition-[background-color,box-shadow,translate] duration-100 active:translate-y-px active:shadow-none',
            current
              ? 'justify-between bg-white hover:bg-shell active:bg-sand'
              : 'justify-center bg-ink text-white hover:bg-ink/90 active:bg-ink/80',
          )}
        >
          {current ? (
            <>
              <StatusTag
                // A new element for each tag, so the one that changed comes in where it is being read.
                key={current}
                status={current}
                className={statusChanged ? 'animate-tag-in' : undefined}
              />
              <span className="inline-flex items-center gap-1.5">
                <Pencil aria-hidden size={16} />
                Cambiar
              </span>
            </>
          ) : (
            <>
              <Plus aria-hidden size={18} />
              Agregar a Mis libros
            </>
          )}
        </button>
      )}
    />
  )
}
