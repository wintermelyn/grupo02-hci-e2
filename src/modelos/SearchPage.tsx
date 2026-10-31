import { CircleAlert, History, RotateCcw, SearchX } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import {
  BookCover,
  BookRow,
  Button,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  SearchField,
} from '../components'
import { matchesQuery, normalizeText, useBookLookup } from '../features/library/filters'
import { useStore } from '../store'
import type { Book } from '../types'
import { MODELO } from './modelo'
import { ShelfBook } from './piezas'

function Lista({ title, books }: { title?: string; books: Book[] }) {
  return (
    <section className="mt-5">
      {title && <h2 className="font-serif text-heading font-semibold">{title}</h2>}
      <ul className="mt-0.5 md:grid md:grid-cols-2 md:gap-x-8">
        {books.map((book) => (
          <li
            key={book.id}
            className="border-b border-line last:border-b-0 md:nth-last-2:odd:border-b-0"
          >
            <BookRow book={book} />
          </li>
        ))}
      </ul>
    </section>
  )
}

interface Autor {
  name: string
  covers: Book[]
  count: number
}

function AuthorTile({ author, onPick }: { author: Autor; onPick: (name: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onPick(author.name)}
      className="flex min-h-16 w-full items-center gap-3 rounded-control py-2 text-left transition-colors duration-100 hover:bg-shell active:bg-sand md:-mx-2 md:w-[calc(100%+1rem)] md:px-2"
    >
      <span className="flex w-15 shrink-0">
        {author.covers.slice(0, 2).map((book, index) => (
          <span key={book.id} className={index ? '-ml-5 w-10' : 'relative z-10 w-10'}>
            <BookCover book={book} />
          </span>
        ))}
      </span>
      <span className="min-w-0">
        <span className="block truncate font-serif text-lg/6 font-semibold">{author.name}</span>
        <span className="block text-sm text-muted">
          {author.count} {author.count === 1 ? 'libro' : 'libros'}
        </span>
      </span>
    </button>
  )
}

function AuthorGrid({
  title,
  authors,
  onPick,
}: {
  title: string
  authors: Autor[]
  onPick: (name: string) => void
}) {
  return (
    <section className="mt-5">
      <h2 className="font-serif text-heading font-semibold">{title}</h2>
      <ul className="mt-1 max-md:[&>li:nth-child(n+5)]:hidden md:grid md:grid-cols-2 md:gap-x-8 lg:grid-cols-3">
        {authors.map((author) => (
          <li key={author.name} className="border-b border-line last:border-b-0 md:border-b-0">
            <AuthorTile author={author} onPick={onPick} />
          </li>
        ))}
      </ul>
    </section>
  )
}

const RECENT_KEY = 'gr-e2-buscados'
const MAX_RECENT = 4

function readRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]')
  } catch {
    return []
  }
}

function FriendsShelf({ books }: { books: Book[] }) {
  return (
    <section className="mt-6">
      <h2 className="font-serif text-heading font-semibold">Lo que leen tus amigos</h2>
      <ul className="full-bleed mt-2 flex snap-x scroll-px-4 gap-3 overflow-x-auto px-4 pb-3 [scrollbar-width:none] md:mx-0 md:w-auto md:grid md:grid-cols-6 md:gap-4 md:overflow-visible md:px-0">
        {books.map((book) => (
          <li key={book.id} className="w-24 shrink-0 snap-start md:w-auto">
            <ShelfBook book={book} />
          </li>
        ))}
      </ul>
    </section>
  )
}

function group(books: Book[]): Autor[] {
  const byName = new Map<string, Book[]>()
  for (const book of books) {
    const name = book.authors[0]
    if (name) byName.set(name, [...(byName.get(name) ?? []), book])
  }
  return [...byName]
    .map(([name, list]) => ({ name, covers: list, count: list.length }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'es'))
}

export function SearchPage() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const forced = params.get('estado')
  const seedBooks = useStore((state) => state.seedBooks)
  const library = useStore((state) => state.library)
  const bookOf = useBookLookup()
  const [settled, setSettled] = useState(query)

  useEffect(() => {
    const timer = setTimeout(() => setSettled(query), 350)
    return () => clearTimeout(timer)
  }, [query])

  const results = useMemo(() => {
    const text = settled.trim()
    if (!text) return []
    return Object.values(seedBooks).filter((book) => matchesQuery(book, text))
  }, [settled, seedBooks])

  const authors = useMemo(() => {
    const count = new Map<string, number>()
    for (const { bookId } of Object.values(library)) {
      const author = bookOf(bookId)?.authors[0]
      if (author) count.set(author, (count.get(author) ?? 0) + 1)
    }
    return [...count].sort((a, b) => b[1] - a[1]).slice(0, 4)
  }, [library, bookOf])

  const myAuthors = useMemo(
    () =>
      group(Object.keys(library).flatMap((id) => bookOf(id) ?? []))
        .slice(0, 6),
    [library, bookOf],
  )
  const matchedAuthors = useMemo(() => {
    const text = settled.trim()
    if (!text) return []
    const wanted = normalizeText(text)
    return group(Object.values(seedBooks)).filter(({ name }) =>
      normalizeText(name)
        .split(/\s+/)
        .some((word) => word.startsWith(wanted)),
    )
  }, [settled, seedBooks])

  const activities = useStore((state) => state.activities)
  const friendsBooks = useMemo(
    () =>
      [...new Set(activities.map(({ bookId }) => bookId))]
        .flatMap((id) => bookOf(id) ?? [])
        .slice(0, 6),
    [activities, bookOf],
  )

  const [recent, setRecent] = useState(readRecent)
  function remember(term: string) {
    const next = [term, ...recent.filter((item) => item !== term)].slice(0, MAX_RECENT)
    setRecent(next)
    localStorage.setItem(RECENT_KEY, JSON.stringify(next))
  }
  function forget() {
    setRecent([])
    localStorage.removeItem(RECENT_KEY)
  }
  function pickAuthor(name: string) {
    remember(name)
    setQuery(name)
  }

  const fieldRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (MODELO === 'b' && matchMedia('(min-width: 768px)').matches) {
      fieldRef.current?.querySelector('input')?.focus()
    }
  }, [])

  const setQuery = (value: string) => setParams(value ? { q: value } : {}, { replace: true })
  const text = query.trim()
  const loading = forced === 'carga' || (text !== '' && settled !== query)
  const failedAll = forced === 'error'
  const offline = forced === 'local'

  const mine = results.filter(({ id }) => library[id])
  const others = results.filter(({ id }) => !library[id])

  return (
    <section>
      <PageHeader title="Buscar">
        <div ref={fieldRef} className="mb-4 md:max-w-2xl">
          <SearchField
            label="Buscar libros y autores"
            placeholder="Título o autor"
            value={query}
            onChange={setQuery}
          />
        </div>
      </PageHeader>

      {offline && (
        <p
          role="status"
          className="mt-3 flex items-center gap-2 border-b border-line pb-2 text-sm"
        >
          <CircleAlert aria-hidden size={16} className="shrink-0 text-muted" />
          <span className="min-w-0 flex-1">
            No pudimos conectar. Te mostramos los libros que ya están en la app.
          </span>
          <Button compact variant="quiet" icon={RotateCcw}>
            Reintentar
          </Button>
        </p>
      )}

      {failedAll ? (
        <ErrorState
          title="No pudimos buscar"
          description="Revisa tu conexión e inténtalo de nuevo. Tus libros siguen en Mis libros."
          onRetry={() => setParams({ q: query }, { replace: true })}
        />
      ) : loading ? (
        <div className="mt-3">
          <LoadingState label="Buscando…" />
        </div>
      ) : !text ? (
        MODELO === 'a' ? (
          <p className="mt-5 max-w-prose text-muted">
            Encuentra cualquier libro por su título o su autor. Para buscar personas, ve a Más →
            Amigos.
          </p>
        ) : MODELO === 'b' ? (
          <>
            {recent.length > 0 && (
              <section className="mt-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-heading font-semibold">Búsquedas recientes</h2>
                  <Button compact variant="quiet" onClick={forget} className="-mr-2.5">
                    Borrar
                  </Button>
                </div>
                <ul className="-ml-2.5 flex flex-wrap">
                  {recent.map((term) => (
                    <li key={term}>
                      <Button compact variant="quiet" icon={History} onClick={() => setQuery(term)}>
                        {term}
                      </Button>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            <AuthorGrid title="Autores de tu biblioteca" authors={myAuthors} onPick={pickAuthor} />
            <FriendsShelf books={friendsBooks} />
            <p className="mt-3 text-sm text-muted">
              ¿Buscas a una persona? Eso va en Más → Amigos.
            </p>
          </>
        ) : (
          <section className="mt-5">
            <h2 className="font-serif text-heading font-semibold">Autores de tu biblioteca</h2>
            <ul className="mt-1">
              {authors.map(([author, count]) => (
                <li key={author} className="border-b border-line last:border-b-0">
                  <button
                    type="button"
                    onClick={() => setQuery(author)}
                    className="-mx-2 flex min-h-12 w-[calc(100%+1rem)] items-center justify-between gap-3 rounded-control px-2 text-left transition-colors duration-100 hover:bg-shell active:bg-sand"
                  >
                    <span className="font-serif text-lg font-semibold">{author}</span>
                    <span className="text-sm text-muted">
                      {count} {count === 1 ? 'libro' : 'libros'}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-muted">Para buscar personas, ve a Más → Amigos.</p>
          </section>
        )
      ) : results.length === 0 ? (
        <>
          <EmptyState
            icon={SearchX}
            title={`No encontramos «${text}»`}
            description="Revisa cómo se escribe o prueba solo con el apellido del autor."
          />
          {MODELO === 'b' && (
            <AuthorGrid title="Autores de tu biblioteca" authors={myAuthors} onPick={pickAuthor} />
          )}
        </>
      ) : MODELO === 'b' ? (
        <>
          <p role="status" className="mt-3 text-sm text-muted">
            {results.length} {results.length === 1 ? 'libro' : 'libros'}
            {mine.length > 0 ? ` · ${mine.length} en tu biblioteca` : ''}
          </p>
          {matchedAuthors.length > 0 && text !== matchedAuthors[0].name && (
            <AuthorGrid title="Autores" authors={matchedAuthors} onPick={pickAuthor} />
          )}
          <div onClickCapture={() => remember(text)}>
            <Lista title="Libros" books={[...mine, ...others]} />
          </div>
        </>
      ) : MODELO === 'c' ? (
        <>
          {mine.length > 0 && <Lista title="En tu biblioteca" books={mine} />}
          {others.length > 0 && <Lista title="Más libros" books={others} />}
        </>
      ) : (
        <Lista books={[...mine, ...others]} />
      )}
    </section>
  )
}
