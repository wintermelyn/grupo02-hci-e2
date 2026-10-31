import { CircleAlert, RotateCcw, SearchX } from 'lucide-react'
import type { MouseEventHandler, Ref } from 'react'
import { BookRow, Button, EmptyState } from '../../components'
import type { Book } from '../../types'
import { AuthorList } from './AuthorList'
import type { ArrangedResults, AuthorGroup } from './results'

// A word this long still fits at 320 px, and a title cannot break inside one.
const MAX_QUERY_IN_TITLE = 24

function cutQuery(text: string): string {
  return text.length > MAX_QUERY_IN_TITLE ? `${text.slice(0, MAX_QUERY_IN_TITLE)}…` : text
}

export function OfflineNotice({ onRetry }: { onRetry: () => void }) {
  return (
    <p role="status" className="mt-3 flex items-center gap-2 border-b border-line pb-2 text-sm">
      {/* On a phone the icon is what can go: the sentence already takes three lines. */}
      <CircleAlert aria-hidden size={16} className="shrink-0 text-muted max-md:hidden" />
      <span className="min-w-0 flex-1">
        No pudimos conectar. Te mostramos los libros que ya están en la app.
      </span>
      <Button compact variant="quiet" icon={RotateCcw} onClick={onRetry}>
        Reintentar
      </Button>
    </p>
  )
}

export interface NoResultsProps {
  text: string
  /** The way out: the authors the person already has. */
  authors: AuthorGroup[]
  onPickAuthor: (name: string) => void
}

export function NoResults({ text, authors, onPickAuthor }: NoResultsProps) {
  return (
    <>
      <EmptyState
        icon={SearchX}
        title={`No encontramos «${cutQuery(text)}»`}
        description="Revisa cómo se escribe o prueba solo con el apellido del autor."
      />
      {authors.length > 0 && (
        <AuthorList title="Autores de tu biblioteca" authors={authors} onPick={onPickAuthor} />
      )}
    </>
  )
}

interface BookGridProps {
  books: Book[]
  onClick?: MouseEventHandler
}

/** Not BookList: its title is for screen readers, and here it is on the screen. */
function BookGrid({ books, onClick }: BookGridProps) {
  return (
    <ul onClick={onClick} className="mt-0.5 md:grid md:grid-cols-2 md:gap-x-8">
      {books.map((book) => (
        <li
          key={book.id}
          className="border-b border-line last:border-b-0 md:nth-last-2:odd:border-b-0"
        >
          <BookRow book={book} />
        </li>
      ))}
    </ul>
  )
}

export interface SearchResultsProps {
  results: ArrangedResults
  /** Open Library has not answered yet, so the list can still grow. */
  loading: boolean
  /** Where the focus goes after picking an author, whose button is gone by then. */
  booksHeading: Ref<HTMLHeadingElement>
  onPickAuthor: (name: string) => void
  /** A book found by this search was opened, which makes the search worth remembering. */
  onOpenBook: () => void
}

export function SearchResults({
  results,
  loading,
  booksHeading,
  onPickAuthor,
  onOpenBook,
}: SearchResultsProps) {
  const { authors, books, earlier, summary } = results
  const status = books.length > 0 ? 'Buscando más…' : 'Buscando…'
  return (
    <>
      <p role="status" className="mt-3 text-sm text-muted">
        {loading ? status : summary}
      </p>
      {authors.length > 0 && (
        <AuthorList
          title="Autores"
          authors={authors}
          counted={false}
          reserving={loading}
          onPick={onPickAuthor}
        />
      )}
      <section className="mt-5">
        <h2
          ref={booksHeading}
          tabIndex={-1}
          className="w-fit rounded-control font-serif text-heading font-semibold"
        >
          Libros
        </h2>
        {books.length > 0 && (
          <BookGrid
            books={books}
            onClick={({ target }) => {
              if (target instanceof Element && target.closest('a')) onOpenBook()
            }}
          />
        )}
        {earlier.length > 0 && (
          <div aria-busy="true" className={books.length > 0 ? 'mt-4' : 'mt-1'}>
            <h3 className="text-sm text-muted">De tu búsqueda anterior</h3>
            <div className="opacity-70">
              <BookGrid books={earlier} />
            </div>
          </div>
        )}
      </section>
    </>
  )
}
