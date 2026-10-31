import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { selectEntry, useStore } from '../store'
import type { Book } from '../types'
import { BookCover } from './BookCover'
import { bookPath } from './paths'
import { Stars } from './Stars'
import { StatusTag } from './StatusTag'

export interface BookRowProps {
  /** May come from the API: the row adds it with upsertBook before opening it. */
  book: Book
  /** Extra content at the top right, e.g. a "Quitar" button. */
  trailing?: ReactNode
}

export function BookRow({ book, trailing }: BookRowProps) {
  const upsertBook = useStore((state) => state.upsertBook)
  const entry = useStore(selectEntry(book.id))
  const open = () => upsertBook(book)

  return (
    <div className="flex items-start gap-3 rounded-xl border-2 border-gray-200 bg-white p-3">
      {/* The title link is the one announced; the cover is a second, larger touch target. */}
      <Link to={bookPath(book.id)} onClick={open} tabIndex={-1} aria-hidden>
        <BookCover book={book} size="sm" />
      </Link>
      <Link to={bookPath(book.id)} onClick={open} className="block min-w-0 flex-1 rounded">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-semibold">{book.title}</span>
          {entry && <StatusTag status={entry.status} />}
        </span>
        <span className="block text-sm text-gray-700">{book.authors.join(', ')}</span>
        {entry?.rating !== undefined && <Stars value={entry.rating} />}
      </Link>
      {trailing && <div className="shrink-0">{trailing}</div>}
    </div>
  )
}
