import { SearchX } from 'lucide-react'
import type { MouseEventHandler, ReactNode, Ref } from 'react'
import { BookRow, EmptyState } from '../../components'
import { cx } from '../../components/cx'
import type { Book } from '../../types'
import { AuthorList } from './AuthorList'
import { BestBook } from './BestBook'
import { Highlight } from './Highlight'
import type { ArrangedResults, AuthorGroup } from './results'

// A word this long still fits at 320 px, and a title cannot break inside one.
const MAX_QUERY_IN_TITLE = 24
/** As many as the best result can stand beside. */
const BOOKS_BESIDE_LEAD = 5
const AUTHORS_AS_WAY_OUT = 4

function cutQuery(text: string): string {
  return text.length > MAX_QUERY_IN_TITLE ? `${text.slice(0, MAX_QUERY_IN_TITLE)}…` : text
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
        <AuthorList
          title="Autores de Mis libros"
          authors={authors.slice(0, AUTHORS_AS_WAY_OUT)}
          className="lg:mt-10"
          onPick={onPickAuthor}
        />
      )}
    </>
  )
}

interface BookGridProps {
  books: Book[]
  className?: string
  highlight?: (text: string) => ReactNode
  onClick?: MouseEventHandler
}

/** Not BookList: its title is for screen readers, and here it is on the screen. */
function BookGrid({ books, className, highlight, onClick }: BookGridProps) {
  return (
    <ul onClick={onClick} className={cx('mt-1.5 grid md:gap-x-8', className)}>
      {books.map((book) => (
        <li key={book.id} className="min-w-0">
          <BookRow book={book} compact highlight={highlight} />
        </li>
      ))}
    </ul>
  )
}

const ROOMY_GRID = 'md:grid-cols-2 xl:grid-cols-3'
const GRID_BESIDE_LEAD = 'md:grid-cols-2 lg:grid-cols-1'

export interface SearchResultsProps {
  results: ArrangedResults
  /** Where the focus goes after picking an author, whose button is gone by then. */
  booksHeading: Ref<HTMLHeadingElement>
  onPickAuthor: (name: string) => void
  /** A book found by this search was opened, which makes the search worth remembering. */
  onOpenBook: () => void
}

/**
 * From lg the best result stands beside the first five books, and the rest goes under both. On a
 * phone the authors keep the first place, with their height reserved, and the books follow.
 */
export function SearchResults({
  results,
  booksHeading,
  onPickAuthor,
  onOpenBook,
}: SearchResultsProps) {
  const { authors, books, summary, lead, marked } = results
  const bestBook = lead === 'book' ? books[0] : undefined
  const listed = bestBook ? books.slice(1) : books
  const shown = lead ? listed.slice(0, BOOKS_BESIDE_LEAD) : listed
  const further = lead ? listed.slice(BOOKS_BESIDE_LEAD) : []
  const hasList = shown.length > 0
  const highlight = (text: string) => <Highlight text={text} query={marked} />
  const opened: MouseEventHandler = ({ target }) => {
    if (target instanceof Element && target.closest('a')) onOpenBook()
  }

  const booksTitle = (
    <h2 ref={booksHeading} tabIndex={-1} className="w-fit rounded-control section-title">
      Libros
    </h2>
  )
  return (
    <>
      <p role="status" className="mt-3 text-sm text-muted">
        {summary}
      </p>
      <div className="lg:mt-7 lg:grid lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-4">
        {authors.length > 0 && (
          <AuthorList
            title="Autores"
            authors={authors}
            layout={lead === 'author' ? 'lead' : 'row'}
            onPick={onPickAuthor}
          />
        )}
        <section className="mt-7 lg:contents">
          {bestBook && hasList && (
            <div className="mb-7 flex flex-col lg:col-span-5 lg:mb-0">
              <h2 className="section-title">Mejor resultado</h2>
              <div className="mt-3 flex-1">
                <BestBook book={bestBook} onOpen={onOpenBook} />
              </div>
            </div>
          )}
          <div
            className={cx(
              lead === 'author' &&
                'lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:pl-6',
              lead === 'book' && 'lg:col-span-7',
              lead === 'book' && hasList && 'lg:pl-6',
              lead === undefined && 'lg:col-span-12',
            )}
          >
            {booksTitle}
            {bestBook && !hasList && (
              <div className="mt-3">
                <BestBook book={bestBook} onOpen={onOpenBook} />
              </div>
            )}
            {hasList && (
              <BookGrid
                books={shown}
                highlight={highlight}
                className={lead ? GRID_BESIDE_LEAD : ROOMY_GRID}
                onClick={opened}
              />
            )}
          </div>
          {further.length > 0 && (
            <div className="mt-7 lg:col-span-12">
              <h3 className="section-title">Más libros</h3>
              <BookGrid
                books={further}
                highlight={highlight}
                className={ROOMY_GRID}
                onClick={opened}
              />
            </div>
          )}
        </section>
      </div>
    </>
  )
}
