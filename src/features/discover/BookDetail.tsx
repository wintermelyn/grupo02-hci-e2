import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { bookPath, StatusTag } from '../../components'
import { cx } from '../../components/cx'
import { useChanged } from '../../components/useChanged'
import { selectEntry, useStore } from '../../store'
import type { Book } from '../../types'
import type { LoadedList } from './useDiscoverLists'
import { useFittingLines } from './useFittingLines'

const NO_DESCRIPTION = 'Aún no tenemos descripción de este libro.'

function facts({ authors, year, pages }: Book): string {
  return [authors[0], year, pages ? `${pages} páginas` : undefined].filter(Boolean).join(' · ')
}

export interface BookDetailProps {
  list: LoadedList
  book: Book
  position: number
  total: number
  /** The URL the book page goes back to. */
  from: string
}

/**
 * On a phone the text keeps one height, so the button and the count stay in place from book to book.
 * What a short title leaves free goes to the description, and never under the title.
 */
export function BookDetail({ list, book, position, total, from }: BookDetailProps) {
  const entry = useStore(selectEntry(book.id))
  const changed = useChanged(book.id)
  const { box, lines } = useFittingLines(book.id)
  const reason = list.reasons?.[book.id]
  const toBook = { to: bookPath(book.id), state: { from }, viewTransition: true }

  return (
    <div className="mt-2 flex min-w-0 flex-col sm:mt-4 lg:col-start-1 lg:row-start-1 lg:mt-0">
      <div className="flex h-42 flex-col sm:h-auto">
        <h2 className="text-sm font-semibold text-muted lg:text-base">
          {list.title}
          <span className="hidden font-normal sm:inline"> · {list.note}</span>
        </h2>
        <div
          key={book.id}
          className={cx('flex min-h-0 flex-1 flex-col', changed && 'animate-tag-in')}
        >
          <Link
            {...toBook}
            tabIndex={-1}
            className="mt-0.5 font-serif text-[1.375rem]/[1.15] font-semibold tracking-[-0.02em] text-balance sm:text-[1.75rem]/[1.12] lg:mt-2 lg:text-[2.75rem]/[1.06]"
          >
            <span className="line-clamp-2 lg:line-clamp-3">{book.title}</span>
          </Link>
          <p className="mt-1 flex min-w-0 items-center gap-2 text-sm text-muted lg:mt-3 lg:text-base">
            {entry && <StatusTag status={entry.status} size="sm" />}
            <span className="min-w-0 truncate">{facts(book)}</span>
          </p>
          {reason && (
            <p className="text-sm font-semibold text-ribbon lg:mt-1 lg:text-base">{reason}</p>
          )}
          <div
            ref={box}
            className="mt-1 min-h-0 flex-1 text-[0.9375rem]/[1.45] text-muted sm:flex-none lg:mt-3 lg:text-base/relaxed"
          >
            <p
              style={{ WebkitLineClamp: lines }}
              className="line-clamp-2 max-w-[60ch] sm:line-clamp-3! lg:line-clamp-7!"
            >
              {book.description || NO_DESCRIPTION}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between gap-4 lg:mt-5 lg:justify-start">
        <Link
          {...toBook}
          aria-label={`Ver ficha de ${book.title}`}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 font-semibold text-white transition-[background-color,scale] duration-150 hover:bg-ink/90 active:scale-98 active:bg-ink/80 lg:min-h-12 lg:px-6"
        >
          Ver ficha
          <ArrowRight aria-hidden size={18} />
        </Link>
        <p aria-live="polite" className="text-sm font-semibold text-muted tabular-nums">
          <span className="sr-only">{book.title}, </span>
          {position + 1} de {total}
        </p>
      </div>
    </div>
  )
}
