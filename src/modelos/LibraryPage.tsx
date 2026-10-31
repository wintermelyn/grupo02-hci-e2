import { Bookmark, SearchX } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import {
  BookCover,
  Button,
  EmptyState,
  PageHeader,
  SearchField,
  TagFilter,
  type TagFilterValue,
} from '../components'
import { BookList } from '../features/library/BookList'
import {
  compareTitles,
  countByTag,
  matchesQuery,
  parseTag,
  pinnedFirst,
  TAG_PARAM,
  useBookLookup,
} from '../features/library/filters'
import { FolderCard } from '../features/library/FolderCard'
import { STATUS_LABELS } from '../lib/status'
import { useStore } from '../store'
import type { Book } from '../types'
import { MODELO } from './modelo'
import { NewFolderTile, SiNo, useAviso } from './piezas'

const VIEW_PARAM = 'vista'
const NO_FOLDER = 'sin-carpeta'

function Aviso() {
  const aviso = useAviso()
  if (!aviso) return null
  const { book, days } = aviso
  const question = '¿Sigues queriendo leer este libro?'

  if (MODELO === 'b') {
    return (
      <section aria-label="Aviso" className="mt-4 flex gap-3.5 border-b border-line pb-4 md:items-center">
        <div className="w-24 shrink-0">
          <BookCover book={book} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-2 md:flex-row md:items-center">
          <div>
            <h2 className="font-serif text-heading font-semibold text-balance">{question}</h2>
            <p className="mt-1 text-muted">
              {book.title} · {days} días en tu lista
            </p>
          </div>
          <SiNo bookId={book.id} className="md:w-56 md:shrink-0" />
        </div>
      </section>
    )
  }

  if (MODELO === 'c') {
    return (
      <section aria-label="Aviso" className="mt-3 flex items-center gap-3 border-b border-line py-2">
        <div className="w-10 shrink-0">
          <BookCover book={book} />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold">{question}</h2>
          <p className="truncate font-serif text-base/6 font-semibold">{book.title}</p>
        </div>
        <SiNo bookId={book.id} className="w-24 shrink-0 gap-1 md:w-40 md:gap-2" />
      </section>
    )
  }

  return (
    <section aria-label="Aviso" className="mt-4 border-b border-line pb-3">
      <div className="flex items-center gap-3.5">
        <div className="w-14 shrink-0">
          <BookCover book={book} />
        </div>
        <div className="min-w-0 flex-1 md:flex md:items-center md:justify-between md:gap-6">
          <div className="min-w-0">
            <h2 className="font-serif text-lg/snug font-semibold text-balance">{question}</h2>
            <p className="text-sm text-muted">
              {book.title} · {days} días en tu lista
            </p>
          </div>
          <SiNo bookId={book.id} className="mt-2 max-w-52 md:mt-0 md:w-52 md:shrink-0" />
        </div>
      </div>
    </section>
  )
}

export function LibraryPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tag = parseTag(searchParams.get(TAG_PARAM))
  const library = useStore((state) => state.library)
  const folders = useStore((state) => state.folders)
  const bookOf = useBookLookup()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [searching, setSearching] = useState(query !== '')
  const fieldRef = useRef<HTMLDivElement>(null)

  const entries = useMemo(() => Object.values(library), [library])
  const counts = useMemo(() => countByTag(entries), [entries])

  useEffect(() => {
    if (searching) fieldRef.current?.querySelector('input')?.focus()
  }, [searching])

  const taggedBooks = useMemo(() => {
    if (tag === 'all') return []
    return entries
      .filter(({ status }) => status === tag)
      .flatMap(({ bookId }) => bookOf(bookId) ?? [])
      .sort(compareTitles)
  }, [entries, tag, bookOf])

  const found = useMemo(() => {
    const text = query.trim()
    if (!text) return []
    return entries
      .filter(({ status }) => tag === 'all' || status === tag)
      .flatMap(({ bookId }) => bookOf(bookId) ?? [])
      .filter((book: Book) => matchesQuery(book, text))
      .sort(compareTitles)
  }, [entries, query, tag, bookOf])

  const unfiledBooks = useMemo(
    () =>
      entries
        .filter(({ folderIds }) => folderIds.length === 0)
        .flatMap(({ bookId }) => bookOf(bookId) ?? [])
        .sort(compareTitles),
    [entries, bookOf],
  )

  const board = useMemo(() => {
    const shown = new Set<string>()
    return pinnedFirst(folders).map((folder) => {
      const books = entries
        .filter(({ folderIds }) => folderIds.includes(folder.id))
        .flatMap(({ bookId }) => bookOf(bookId) ?? [])
      const covers = [
        ...books.filter(({ id }) => !shown.has(id)),
        ...books.filter(({ id }) => shown.has(id)),
      ].slice(0, 2)
      for (const { id } of covers) shown.add(id)
      return { folder, count: books.length, covers }
    })
  }, [folders, entries, bookOf])

  function chooseTag(value: TagFilterValue) {
    setSearchParams(value === 'all' ? {} : { [TAG_PARAM]: value }, { replace: true })
  }

  function closeSearch() {
    setQuery('')
    setSearching(false)
  }

  const text = query.trim()
  const showUnfiled = tag === 'all' && searchParams.get(VIEW_PARAM) === NO_FOLDER

  return (
    <section>
      <PageHeader
        title="Mis libros"
        wordmarkInline
        action={
          <>
            <div
              ref={fieldRef}
              className={
                searching
                  ? 'absolute inset-0 z-10 flex items-center bg-shell md:static md:w-72'
                  : 'hidden md:block md:w-72'
              }
            >
              <SearchField
                label="Buscar en mi biblioteca"
                placeholder="Buscar en mi biblioteca"
                value={query}
                onChange={setQuery}
                onClose={closeSearch}
              />
            </div>
            <Button compact onClick={() => setSearching(true)} className="md:hidden">
              Buscar
            </Button>
          </>
        }
      >
        <TagFilter value={tag} counts={counts} onChange={chooseTag} />
      </PageHeader>

      {text ? (
        found.length > 0 ? (
          <BookList title="Resultados" books={found} />
        ) : (
          <EmptyState
            icon={SearchX}
            title="No encontramos ese libro en tu biblioteca"
            description="Prueba con otro título o autor. Para buscar fuera de tu biblioteca, usa Buscar."
          />
        )
      ) : (
        <>
          {(tag === 'all' || tag === 'want') && <Aviso />}
          {showUnfiled ? (
            <section className="mt-5">
              <h2 className="mb-1 font-serif text-heading font-semibold">Sin carpeta</h2>
              <BookList title="Sin carpeta" books={unfiledBooks} />
            </section>
          ) : tag === 'all' ? (
            <section className="mt-5">
              <h2 className="mb-3 font-serif text-heading font-semibold">Mis carpetas</h2>
              <ul className="grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-4 lg:grid-cols-5">
                {board.map(({ folder, count, covers }) => (
                  <li key={folder.id}>
                    <FolderCard folder={folder} count={count} covers={covers} />
                  </li>
                ))}
                {unfiledBooks.length > 0 && (
                  <li>
                    <FolderCard
                      folder={{ id: NO_FOLDER, name: 'Sin carpeta' }}
                      count={unfiledBooks.length}
                      covers={unfiledBooks.slice(0, 2)}
                      to={`?${VIEW_PARAM}=${NO_FOLDER}`}
                    />
                  </li>
                )}
                <li>
                  <NewFolderTile />
                </li>
              </ul>
            </section>
          ) : taggedBooks.length === 0 ? (
            <EmptyState
              icon={Bookmark}
              title="Aún no hay libros aquí"
              description={`Cuando un libro tenga el estado «${STATUS_LABELS[tag]}», va a aparecer en esta lista.`}
            />
          ) : (
            <BookList title={STATUS_LABELS[tag]} books={taggedBooks} />
          )}
        </>
      )}
    </section>
  )
}
