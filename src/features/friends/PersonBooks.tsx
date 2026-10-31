import { Link, useLocation } from 'react-router'
import { BookCover, bookPath, useRail } from '../../components'
import { coverTone } from '../../lib/coverTone'
import type { Book, BookId } from '../../types'

/** The book page goes back to this person, with the search they were found by. */
function useBookLinkState() {
  const { pathname, search } = useLocation()
  return { from: pathname + search }
}

function SharedMark({ className }: { className?: string }) {
  return <span className={className}>En común</span>
}

/**
 * What a person is reading, the same card as "Leyendo ahora" in Inicio. No status ribbon and no tag
 * of mine: on a page about someone else, they could pass for theirs.
 */
function ReadingCard({ book, shared }: { book: Book; shared: boolean }) {
  const state = useBookLinkState()
  return (
    <Link
      to={bookPath(book.id)}
      state={state}
      viewTransition
      style={{ backgroundColor: coverTone(book.id) }}
      className="flex h-full gap-4 rounded-tile p-4 text-white transition-[translate] duration-200 active:translate-y-px lg:gap-5 lg:p-5"
    >
      <span className="cover-lift block w-26 shrink-0 lg:w-32">
        <BookCover book={book} raised />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="line-clamp-3 font-serif text-[1.5rem]/[1.12] font-semibold tracking-[-0.02em] text-balance lg:text-[2rem]/[1.1]">
          {book.title}
        </span>
        <span className="mt-1.5 line-clamp-2 text-sm text-white/88 lg:text-base">
          {book.authors.join(', ')}
        </span>
        <span className="mt-auto pt-3 text-sm">
          {shared && <SharedMark className="font-semibold" />}
          {book.pages && (
            <span className="hidden text-white/88 lg:inline">
              {shared && ' · '}
              {book.pages} páginas
            </span>
          )}
        </span>
      </span>
    </Link>
  )
}

export function ReadingCards({ books, sharedIds }: { books: Book[]; sharedIds: Set<BookId> }) {
  return (
    <ul className="grid gap-2.5 md:grid-cols-2 lg:gap-4">
      {books.map((book) => (
        <li key={book.id} className="min-w-0 md:only:col-span-2">
          <ReadingCard book={book} shared={sharedIds.has(book.id)} />
        </li>
      ))}
    </ul>
  )
}

/**
 * What a person has read, as covers: a rail on a phone and a whole row on a computer, where all of
 * it fits and arrows would have nothing to do. Each book says once if it is in common.
 */
export function ReadShelf({ books, sharedIds }: { books: Book[]; sharedIds: Set<BookId> }) {
  const { ref, railProps } = useRail<HTMLUListElement>()
  const state = useBookLinkState()
  return (
    <ul
      ref={ref}
      {...railProps}
      className="rail full-bleed flex snap-x scroll-pl-(--gut) gap-3.5 overflow-x-auto pt-1.5 pb-3 lg:grid lg:snap-none lg:grid-cols-6 lg:gap-4 lg:overflow-visible"
    >
      {books.map((book) => (
        <li key={book.id} className="w-32 shrink-0 snap-start lg:w-auto">
          <Link
            to={bookPath(book.id)}
            state={state}
            viewTransition
            className="block rounded-control"
          >
            <span className="cover-lift block">
              <BookCover book={book} raised />
            </span>
            <span className="mt-2.5 line-clamp-2 font-serif text-[1.0625rem]/snug font-semibold">
              {book.title}
            </span>
            <span className="line-clamp-1 text-sm text-muted">{book.authors.join(', ')}</span>
            {sharedIds.has(book.id) && <SharedMark className="block text-sm font-semibold" />}
          </Link>
        </li>
      ))}
    </ul>
  )
}
