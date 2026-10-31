import { ChevronRight, CircleAlert, RotateCcw, SearchX, Users } from 'lucide-react'
import type { MouseEventHandler, ReactNode, Ref } from 'react'
import { Link } from 'react-router'
import { BookRow, Button, EmptyState } from '../../components'
import { cx } from '../../components/cx'
import type { Book } from '../../types'
import { peopleSearchPath } from '../friends/people'
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

export function OfflineNotice({ onRetry }: { onRetry: () => void }) {
  return (
    <p
      role="status"
      className="mt-3 flex items-center gap-2 rounded-row bg-shell py-1 pr-1 pl-3 text-sm"
    >
      {/* On a phone the icon is what can go: the sentence already takes three lines. */}
      <CircleAlert aria-hidden size={18} className="shrink-0 text-muted max-md:hidden" />
      <span className="min-w-0 flex-1">
        No pudimos conectar. Te mostramos los libros que ya están en la app.
      </span>
      <Button compact variant="quiet" icon={RotateCcw} onClick={onRetry}>
        Reintentar
      </Button>
    </p>
  )
}

const PEOPLE_LINK = 'Buscar personas en Amigos'

/** Buscar finds books and authors, so a search for someone is told where people are. */
export function PeopleNotice({ text }: { text: string }) {
  return (
    <Link
      to={peopleSearchPath(text)}
      className="mt-3 flex min-h-11 items-center gap-2 rounded-row bg-shell px-3 font-semibold transition-colors duration-100 hover:bg-sand active:bg-sand-deep"
    >
      <Users aria-hidden size={18} className="shrink-0 text-muted" />
      <span className="min-w-0 flex-1">{PEOPLE_LINK}</span>
      <ChevronRight aria-hidden size={18} className="shrink-0 text-muted" />
    </Link>
  )
}

export interface NoResultsProps {
  text: string
  /** PeopleNotice is already on the screen, and the advice about authors would not help. */
  forPerson: boolean
  /** The way out: the authors the person already has. */
  authors: AuthorGroup[]
  onPickAuthor: (name: string) => void
}

export function NoResults({ text, forPerson, authors, onPickAuthor }: NoResultsProps) {
  return (
    <>
      <EmptyState
        icon={SearchX}
        title={`No encontramos «${cutQuery(text)}»`}
        description={
          forPerson
            ? 'Aquí encuentras libros y autores. A las personas, en Amigos.'
            : 'Revisa cómo se escribe o prueba solo con el apellido del autor.'
        }
        action={
          !forPerson && (
            <Link
              to={peopleSearchPath(text)}
              className="inline-flex min-h-11 items-center rounded-full border border-edge px-4 font-semibold transition-colors duration-100 hover:bg-sand active:bg-sand-deep"
            >
              {PEOPLE_LINK}
            </Link>
          )
        }
      />
      {authors.length > 0 && (
        <AuthorList
          title="Autores de Mis libros"
          authors={authors.slice(0, AUTHORS_AS_WAY_OUT)}
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
  /** Open Library has not answered yet, so the list can still grow. */
  loading: boolean
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
  loading,
  booksHeading,
  onPickAuthor,
  onOpenBook,
}: SearchResultsProps) {
  const { authors, books, earlier, summary, lead, countedAuthors, marked } = results
  const status = books.length > 0 ? 'Buscando más…' : 'Buscando…'
  const bestBook = lead === 'book' ? books[0] : undefined
  const listed = bestBook ? books.slice(1) : books
  const shown = lead ? listed.slice(0, BOOKS_BESIDE_LEAD) : listed
  const further = lead ? listed.slice(BOOKS_BESIDE_LEAD) : []
  const hasList = shown.length > 0 || earlier.length > 0
  const highlight = (text: string) => <Highlight text={text} query={marked} />
  const opened: MouseEventHandler = ({ target }) => {
    if (target instanceof Element && target.closest('a')) onOpenBook()
  }

  const booksTitle = (
    <h2 ref={booksHeading} tabIndex={-1} className="w-fit rounded-control section-title">
      Libros
    </h2>
  )
  const bookList = hasList && (
    <>
      {shown.length > 0 && (
        <BookGrid
          books={shown}
          highlight={highlight}
          className={lead ? GRID_BESIDE_LEAD : ROOMY_GRID}
          onClick={opened}
        />
      )}
      {earlier.length > 0 && (
        <div aria-busy="true" className={shown.length > 0 ? 'mt-4' : 'mt-1'}>
          <h3 className="text-sm text-muted">De tu búsqueda anterior</h3>
          <div className="opacity-70">
            <BookGrid books={earlier} className={ROOMY_GRID} />
          </div>
        </div>
      )}
    </>
  )

  return (
    <>
      <p role="status" className="mt-3 text-sm text-muted">
        {loading ? status : summary}
      </p>
      <div className="lg:mt-7 lg:grid lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-4">
        {authors.length > 0 && (
          <AuthorList
            title="Autores"
            authors={authors}
            counted={countedAuthors}
            reserving={loading}
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
            {bookList}
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
