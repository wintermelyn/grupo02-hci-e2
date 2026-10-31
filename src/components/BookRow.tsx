import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router'
import { selectEntry, useStore } from '../store'
import type { Book } from '../types'
import { BookCover } from './BookCover'
import { cx } from './cx'
import { bookPath } from './paths'
import { Stars } from './Stars'
import { StatusTag } from './StatusTag'

export interface BookRowProps {
  /** May come from the API: the row adds it with upsertBook before opening it. */
  book: Book
  /** Extra content at the top right, e.g. a "Quitar" button. */
  trailing?: ReactNode
  /** In a list about someone else: replaces my tag and stars, which could pass for theirs. */
  note?: ReactNode
  /**
   * Where the book is filed, on a line of its own under the author. The tag keeps its text: the
   * button of a filter leaves the screen as soon as the list scrolls.
   */
  folders?: string[]
  /** Smaller, for a list that has to be read at a glance, like the results of Buscar. */
  compact?: boolean
  /** Marks what a search matched, in the title and in the authors. */
  highlight?: (text: string) => ReactNode
}

export function BookRow({
  book,
  trailing,
  note,
  folders,
  compact = false,
  highlight = (text) => text,
}: BookRowProps) {
  const upsertBook = useStore((state) => state.upsertBook)
  const entry = useStore(selectEntry(book.id))
  const { pathname, search } = useLocation()
  const open = () => upsertBook(book)
  // The book page goes back to this exact list, with its filter.
  const linkState = { from: pathname + search }

  return (
    <div className="-mx-2 flex items-center gap-3.5 rounded-row px-2 transition-colors duration-100 hover:bg-shell has-[a:active]:bg-sand">
      {/* The title link is the one announced; the cover is a second, larger touch target. */}
      <Link
        to={bookPath(book.id)}
        state={linkState}
        onClick={open}
        tabIndex={-1}
        aria-hidden
        className={cx('shrink-0', compact ? 'py-2' : 'py-2.5')}
      >
        <BookCover
          book={book}
          size={compact ? 'xs' : 'sm'}
          status={note === undefined ? entry?.status : undefined}
        />
      </Link>
      <Link
        to={bookPath(book.id)}
        state={linkState}
        onClick={open}
        className={cx('block min-w-0 flex-1 rounded-row', compact ? 'py-2' : 'py-2.5')}
      >
        <span
          className={cx(
            'line-clamp-2 font-serif font-semibold',
            compact ? 'text-[1.0625rem]/snug' : 'text-lg/snug',
          )}
        >
          {highlight(book.title)}
        </span>
        <span className="flex flex-wrap items-center gap-x-2 text-sm text-muted">
          {entry && note === undefined && <StatusTag status={entry.status} size="sm" />}
          <span>{highlight(book.authors.join(', '))}</span>
        </span>
        {note}
        {folders && folders.length > 0 && (
          <span className="line-clamp-2 text-sm font-medium wrap-break-word">
            {folders.join(' · ')}
          </span>
        )}
        {note === undefined && entry?.status === 'read' && entry.rating !== undefined && (
          <Stars value={entry.rating} />
        )}
      </Link>
      {trailing && <div className="shrink-0">{trailing}</div>}
    </div>
  )
}
