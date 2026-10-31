import { BookCover } from '../../components'
import { booksLabel } from '../library/filters'
import type { AuthorGroup } from './results'

const MAX_COVERS = 2

interface AuthorTileProps {
  author: AuthorGroup
  counted: boolean
  onPick: (name: string) => void
}

function AuthorTile({ author, counted, onPick }: AuthorTileProps) {
  return (
    <button
      type="button"
      onClick={() => onPick(author.name)}
      className="-mx-2 flex min-h-16 w-[calc(100%+1rem)] items-center gap-3 rounded-control px-2 py-2 text-left transition-colors duration-100 hover:bg-shell active:bg-sand"
    >
      <span className="flex w-15 shrink-0">
        {author.books.slice(0, MAX_COVERS).map((book, index) => (
          <span key={book.id} className={index ? '-ml-5 w-10' : 'relative z-10 w-10'}>
            <BookCover book={book} className="text-sm!" />
          </span>
        ))}
      </span>
      <span className="min-w-0">
        <span className="block truncate font-serif text-lg/6 font-semibold">{author.name}</span>
        {counted && (
          <span className="block text-sm text-muted">{booksLabel(author.books.length)}</span>
        )}
      </span>
    </button>
  )
}

export interface AuthorListProps {
  title: string
  authors: AuthorGroup[]
  /** False when `books` is only a page of a search, where the amount would not be the author's. */
  counted?: boolean
  onPick: (name: string) => void
}

/** Four on a phone, so the books that follow stay near. */
export function AuthorList({ title, authors, counted = true, onPick }: AuthorListProps) {
  return (
    <section className="mt-5">
      <h2 className="font-serif text-heading font-semibold">{title}</h2>
      <ul className="mt-1 max-md:[&>li:nth-child(n+5)]:hidden md:grid md:grid-cols-2 md:gap-x-8 lg:grid-cols-3">
        {authors.map((author) => (
          <li
            key={author.name}
            className="border-b border-line last:border-b-0 max-md:nth-4:border-b-0 md:border-b-0"
          >
            <AuthorTile author={author} counted={counted} onPick={onPick} />
          </li>
        ))}
      </ul>
    </section>
  )
}
