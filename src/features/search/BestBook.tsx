import { ArrowRight } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { BookCover, bookPath, StatusTag } from '../../components'
import { coverTone } from '../../lib/coverTone'
import { selectEntry, useStore } from '../../store'
import type { Book } from '../../types'

export interface BestBookProps {
  book: Book
  onOpen: () => void
}

/** The book the search most likely wanted, with its colour and room for what it is about. */
export function BestBook({ book, onOpen }: BestBookProps) {
  const entry = useStore(selectEntry(book.id))
  const upsertBook = useStore((state) => state.upsertBook)
  const { pathname, search } = useLocation()

  return (
    <Link
      to={bookPath(book.id)}
      state={{ from: pathname + search }}
      viewTransition
      onClick={() => {
        upsertBook(book)
        onOpen()
      }}
      style={{ backgroundColor: coverTone(book.id) }}
      className="flex h-full min-h-56 gap-4 rounded-tile p-4 text-white transition-[translate] duration-150 active:translate-y-px lg:gap-5 lg:p-5"
    >
      <span className="cover-lift block w-28 shrink-0 self-start lg:w-40">
        <BookCover book={book} raised />
      </span>
      <span className="flex min-w-0 flex-1 flex-col items-start">
        <span className="line-clamp-4 font-serif text-[1.5rem]/[1.12] font-semibold tracking-[-0.02em] text-balance lg:text-[1.75rem]/[1.12]">
          {book.title}
        </span>
        <span className="mt-1.5 text-sm text-white/88">{book.authors.join(', ')}</span>
        {entry && (
          <span className="mt-2 rounded-full bg-white px-2.5 py-1">
            <StatusTag status={entry.status} size="sm" />
          </span>
        )}
        {book.description && (
          <span className="mt-3 line-clamp-5 text-sm text-white/88 max-lg:hidden">
            {book.description}
          </span>
        )}
        <span className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-semibold">
          Ver ficha
          <ArrowRight aria-hidden size={16} />
        </span>
      </span>
    </Link>
  )
}
