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
   * The book's data, needed when it may not be in the store yet (a book of the catalog): it is
   * added with upsertBook before any change, so Mis libros has it without downloading the catalog.
   */
  book?: Book
  className?: string
}

/** Only changes the tag: taking the book out is its own action, below the record, and asks first. */
const CHANGE_LABEL = 'Cambiar estado'

/**
 * The tag with its pencil (D2). Opens a menu next to it; a chosen tag applies at once. The menu only
 * holds the tags, so choosing one never risks taking the book out of the library.
 */
export function StatusControl({ bookId, book, className }: StatusControlProps) {
  const entry = useStore(selectEntry(bookId))
  const title = useStore(selectBook(bookId))?.title ?? book?.title
  const setStatus = useStore((state) => state.setStatus)
  const finishBook = useStore((state) => state.finishBook)
  const upsertBook = useStore((state) => state.upsertBook)
  const current = entry?.status
  const statusChanged = useChanged(current)
  const isWant = current === 'want'

  function choose(status: ReadingStatus) {
    // Finishing again would replace finishedAt and drop the rating of a book already in Leído.
    if (status === current) return
    if (book) upsertBook(book)
    if (status === 'read') {
      const startedAt = entry?.startedAt ?? entry?.addedAt ?? today()
      // Only Leyendo drops finishedAt, so a book that comes back keeps the day it was finished.
      const finishedAt = entry?.finishedAt ?? today()
      finishBook(bookId, { startedAt, finishedAt, rating: entry?.rating })
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
      // In the record the row spans the whole page, and the options would sit far from Actual.
      align={current ? 'start' : 'fill'}
      iconLabels
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
          aria-label={current && `${STATUS_LABELS[current]}. ${CHANGE_LABEL}: ${bookName}`}
          className={cx(
            'flex min-h-11 items-center gap-3 font-semibold',
            'transition-[background-color,scale] duration-150',
            // The whole row opens the menu, so the row answers the cursor, like a date row, and
            // Cambiar estado only reacts when the cursor is really on it.
            current
              ? 'group -mx-2 w-[calc(100%+1rem)] justify-between rounded-control pl-2 hover:bg-ink/5 active:bg-ink/10'
              : 'w-full justify-center rounded-full bg-ink px-4 text-white hover:bg-ink/90 active:scale-98 active:bg-ink/80',
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
              {/* An action in a row, so it is drawn as a quiet compact Button. Under 360 px it is
                  smaller and loses the pencil. "Lo quiero" is the longest tag: next to it the
                  pencil goes under 390 px, and under 375 px the text says "Cambiar". The row is
                  called Estado, and the name of the button still says it in full. */}
              <span className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-2.5 whitespace-nowrap transition-[background-color,scale] duration-150 group-aria-expanded:bg-sand hover:bg-sand active:scale-98 active:bg-sand-deep max-[359px]:pl-0 max-[359px]:text-sm">
                <Pencil
                  aria-hidden
                  size={16}
                  className={isWant ? 'max-[390px]:hidden' : 'max-[359px]:hidden'}
                />
                <span className={cx(isWant && 'max-[375px]:hidden')}>{CHANGE_LABEL}</span>
                {isWant && <span className="min-[375px]:hidden">Cambiar</span>}
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
