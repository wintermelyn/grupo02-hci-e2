import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { selectEntry, useStore } from '../store'
import type { Book } from '../types'
import { BookCover } from './BookCover'
import { cx } from './cx'
import { bookPath } from './paths'
import { Stars } from './Stars'
import { StatusControl } from './StatusControl'
import { useLongPress } from './useLongPress'

interface BaseProps {
  /** May come from the API: the row adds it with upsertBook before opening it or changing its status. */
  book: Book
  /**
   * Extra content at the top right, next to the title, e.g. a "Quitar" button. Hidden while
   * selecting. The StatusControl sits on its own line below, so this never narrows it.
   */
  trailing?: ReactNode
  /** Passed to the row's StatusControl. */
  onRequestFinish?: () => void
}

interface PlainProps {
  selectable?: false
  /** Holding the row for LONG_PRESS_MS calls this instead of opening the book, e.g. to start selection (D6). */
  onLongPress?: () => void
}

interface SelectionProps {
  /** Selection mode (D6): the whole row toggles a checkbox instead of opening the book. */
  selectable: true
  selected: boolean
  onSelectedChange: (selected: boolean) => void
}

export type BookRowProps = BaseProps & (SelectionProps | PlainProps)

const FRAME = 'rounded-xl border-2 bg-white p-3'
const LINE = 'flex items-start gap-3'

function BookText({ book }: { book: Book }) {
  const rating = useStore(selectEntry(book.id))?.rating
  return (
    <>
      <span className="block font-semibold">{book.title}</span>
      <span className="block text-sm text-gray-700">{book.authors.join(', ')}</span>
      {rating !== undefined && <Stars value={rating} />}
    </>
  )
}

export function BookRow(props: BookRowProps) {
  const { book, trailing, onRequestFinish } = props
  const upsertBook = useStore((state) => state.upsertBook)
  const longPress = useLongPress(props.selectable ? undefined : props.onLongPress)

  if (props.selectable) {
    const { selected, onSelectedChange } = props
    return (
      <label
        className={cx(
          FRAME,
          LINE,
          'cursor-pointer',
          selected ? 'border-brand bg-brand/5' : 'border-gray-200',
        )}
      >
        <input
          type="checkbox"
          checked={selected}
          onChange={(event) => onSelectedChange(event.target.checked)}
          className="mt-3 size-6 shrink-0 accent-brand"
        />
        <BookCover book={book} size="sm" />
        <span className="min-w-0 flex-1">
          <BookText book={book} />
        </span>
      </label>
    )
  }

  const open = () => upsertBook(book)

  return (
    <div
      {...longPress}
      className={cx(
        FRAME,
        'border-gray-200',
        props.onLongPress && 'select-none [-webkit-touch-callout:none]',
      )}
    >
      <div className={LINE}>
        {/* The title link is the one announced; the cover is a second, larger touch target. */}
        <Link to={bookPath(book.id)} onClick={open} tabIndex={-1} aria-hidden>
          <BookCover book={book} size="sm" />
        </Link>
        <Link to={bookPath(book.id)} onClick={open} className="block min-w-0 flex-1 rounded">
          <BookText book={book} />
        </Link>
        {trailing && <div className="shrink-0">{trailing}</div>}
      </div>
      {/* Its own line, at full width: three 44 px segments that fit "Leyendo" even with a trailing button. */}
      <StatusControl
        bookId={book.id}
        book={book}
        onRequestFinish={onRequestFinish}
        compact
        className="mt-2"
      />
    </div>
  )
}
