import { Check } from 'lucide-react'
import { useNavigate } from 'react-router'
import { STATUS_LABELS } from '../lib/status'
import { selectBook, selectEntry, useStore } from '../store'
import type { Book, BookId, ReadingStatus } from '../types'
import { cx } from './cx'
import { finishBookPath } from './paths'
import { STATUS_FILL } from './statusStyles'

export interface StatusControlProps {
  bookId: BookId
  /**
   * The book's data, needed when it may not be in the store yet (e.g. a live search result):
   * it is added with upsertBook before any change, so the library never points to an unknown book.
   */
  book?: Book
  /**
   * Called when "Leído" is chosen, instead of changing the status: only finishBook may set
   * 'read'. Defaults to opening the "Terminé este libro" panel on the book page.
   */
  onRequestFinish?: () => void
  /** Smaller text for list rows; touch targets stay at 44 px. */
  compact?: boolean
  className?: string
}

const OPTIONS: readonly ReadingStatus[] = ['want', 'reading', 'read']

export function StatusControl({
  bookId,
  book,
  onRequestFinish,
  compact = false,
  className,
}: StatusControlProps) {
  const navigate = useNavigate()
  const current = useStore(selectEntry(bookId))?.status
  const title = useStore(selectBook(bookId))?.title ?? book?.title
  const setStatus = useStore((state) => state.setStatus)
  const upsertBook = useStore((state) => state.upsertBook)

  function choose(status: ReadingStatus) {
    if (book) upsertBook(book)
    if (status === 'read') {
      if (onRequestFinish) onRequestFinish()
      else navigate(finishBookPath(bookId))
    } else {
      setStatus(bookId, status)
    }
  }

  return (
    <div
      role="group"
      aria-label={title ? `Estado de «${title}»` : 'Estado de lectura'}
      className={cx(
        'grid grid-cols-3 rounded-lg border-2 border-gray-500 bg-white p-0.5',
        compact ? 'w-full max-w-72 text-sm' : 'w-full max-w-md',
        className,
      )}
    >
      {OPTIONS.map((status) => {
        const selected = current === status
        return (
          <button
            key={status}
            type="button"
            aria-pressed={selected}
            onClick={() => choose(status)}
            className={cx(
              'inline-flex min-h-11 items-center justify-center gap-1 rounded-md border-2 px-2',
              selected ? cx(STATUS_FILL[status], 'font-bold') : 'border-transparent text-gray-800',
            )}
          >
            {selected && !compact && <Check aria-hidden size={16} strokeWidth={3} />}
            {STATUS_LABELS[status]}
          </button>
        )
      })}
    </div>
  )
}
