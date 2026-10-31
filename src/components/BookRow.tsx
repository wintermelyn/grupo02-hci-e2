import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router'
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
  const { pathname, search } = useLocation()
  const open = () => upsertBook(book)
  // The book page goes back to this exact list, with its filter.
  const linkState = { from: pathname + search }

  return (
    <div className="-mx-2 flex items-center gap-3.5 rounded-control px-2 transition-colors duration-100 has-[a:active]:bg-shell">
      {/* The title link is the one announced; the cover is a second, larger touch target. */}
      <Link
        to={bookPath(book.id)}
        state={linkState}
        onClick={open}
        tabIndex={-1}
        aria-hidden
        className="shrink-0 py-2.5"
      >
        <BookCover book={book} size="sm" status={entry?.status} />
      </Link>
      <Link
        to={bookPath(book.id)}
        state={linkState}
        onClick={open}
        className="block min-w-0 flex-1 rounded-control py-2.5"
      >
        <span className="line-clamp-2 font-serif text-lg/snug font-semibold">{book.title}</span>
        <span className="flex flex-wrap items-center gap-x-2 text-sm text-muted">
          {entry && <StatusTag status={entry.status} size="sm" />}
          <span>{book.authors.join(', ')}</span>
        </span>
        {entry?.rating !== undefined && <Stars value={entry.rating} />}
      </Link>
      {trailing && <div className="shrink-0">{trailing}</div>}
    </div>
  )
}
