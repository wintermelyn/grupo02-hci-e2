import { Pencil, Plus } from 'lucide-react'
import { today } from '../lib/dates'
import { STATUS_LABELS, STATUS_ORDER } from '../lib/status'
import { selectBook, selectEntry, useStore } from '../store'
import type { Book, BookId, LibraryEntry, ReadingStatus } from '../types'
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

const LIST = new Intl.ListFormat('es-CL', { style: 'long', type: 'conjunction' })

/** Says both things the menu does, in step with "Agregar o quitar" on the row below. */
const CHANGE_LABEL = 'Cambiar o quitar'

/** Says what leaving costs for this book, so it is read before and not in the toast after. */
function whatIsLost(entry: LibraryEntry): string | undefined {
  const { folderIds, startedAt, finishedAt, rating } = entry
  const folders = folderIds.length
  const lost = [
    folders > 0 && (folders === 1 ? '1 carpeta' : `${folders} carpetas`),
    (startedAt || finishedAt) && 'las fechas',
    rating !== undefined && 'el puntaje',
  ].filter((item): item is string => Boolean(item))
  return lost.length > 0 ? `Pierdes ${LIST.format(lost)}` : undefined
}

/**
 * The tag with its pencil (D2). Opens a menu next to it; a chosen tag applies at once. Taking the
 * book out of the library lives here too: it takes the same two taps as adding it.
 */
export function StatusControl({ bookId, book, className }: StatusControlProps) {
  const entry = useStore(selectEntry(bookId))
  const title = useStore(selectBook(bookId))?.title ?? book?.title
  const setStatus = useStore((state) => state.setStatus)
  const finishBook = useStore((state) => state.finishBook)
  const upsertBook = useStore((state) => state.upsertBook)
  const removeFromLibrary = useStore((state) => state.removeFromLibrary)
  const current = entry?.status
  const statusChanged = useChanged(current)

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
      options={STATUS_ORDER.map((status) => ({
        id: status,
        label: <StatusTag status={status} />,
        checked: current === status,
        onSelect: () => choose(status),
      }))}
      actions={
        entry && [
          {
            id: 'remove',
            label: 'Quitar de Mis libros',
            detail: whatIsLost(entry),
            onSelect: () => removeFromLibrary([bookId]),
          },
        ]
      }
      trigger={(triggerProps) => (
        // One button for both states, so the focus can come back to it after adding the book.
        <button
          {...triggerProps}
          type="button"
          aria-label={current && `${STATUS_LABELS[current]}. ${CHANGE_LABEL}: ${bookName}`}
          className={cx(
            'flex min-h-11 items-center gap-3 rounded-control font-semibold',
            'transition-[background-color,translate] duration-100',
            // The whole row opens the menu, so the row answers the cursor, like a date row, and
            // Cambiar o quitar only reacts when the cursor is really on it.
            current
              ? 'group -mx-2 w-[calc(100%+1rem)] justify-between pl-2 hover:bg-ink/5 active:bg-ink/10'
              : 'w-full justify-center bg-ink px-4 text-white hover:bg-ink/90 active:translate-y-px active:bg-ink/80',
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
              {/* An action in a row, so it is drawn as a quiet compact Button. At 320 px it only
                  fits next to "Lo quiero" smaller and without the pencil: the text says it all. */}
              <span className="inline-flex min-h-11 items-center gap-1.5 rounded-control px-2 whitespace-nowrap transition-[background-color,translate] duration-100 group-aria-expanded:bg-ink/5 hover:bg-ink/5 active:translate-y-px active:bg-ink/10 max-[359px]:pl-0 max-[359px]:text-sm">
                <Pencil aria-hidden size={16} className="max-[359px]:hidden" />
                {CHANGE_LABEL}
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
