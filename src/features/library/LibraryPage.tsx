import { Bookmark, SearchX } from 'lucide-react'
import { useMemo, useRef } from 'react'
import { Button, EmptyState, PageHeader, TagFilter, type TagFilterValue } from '../../components'
import { STATUS_LABELS } from '../../lib/status'
import { useStore } from '../../store'
import type { ReadingStatus } from '../../types'
import { BandSearch } from './BandSearch'
import { BookList } from './BookList'
import {
  booksLabel,
  compareTitles,
  countByTag,
  matchesQuery,
  TAG_PARAM,
  useBookLookup,
} from './filters'
import { FolderBoard } from './FolderBoard'
import { useListFilters } from './useListFilters'
import { WantPrompt } from './WantPrompt'

const SEARCH_LABEL = 'Buscar en Mis libros'
const VIEW_PARAM = 'vista'
const NO_FOLDER = 'sin-carpeta'

function NoTaggedBooks({ status }: { status: ReadingStatus }) {
  return (
    <EmptyState
      icon={Bookmark}
      title="Aún no hay libros aquí"
      description={`Cuando un libro tenga el estado «${STATUS_LABELS[status]}», va a aparecer en esta lista.`}
    />
  )
}

interface NoResultsProps {
  query: string
  tag: TagFilterValue
  onShowAll: () => void
}

function NoResults({ query, tag, onShowAll }: NoResultsProps) {
  if (tag === 'all') {
    return (
      <EmptyState
        icon={SearchX}
        title="Sin resultados"
        description={`Nada en Mis libros coincide con «${query}». Para buscar fuera, usa Buscar en el menú.`}
      />
    )
  }
  return (
    <EmptyState
      icon={SearchX}
      title="Sin resultados"
      description={`Ningún libro con el estado «${STATUS_LABELS[tag]}» coincide con «${query}».`}
      action={<Button onClick={onShowAll}>Ver todos los libros</Button>}
    />
  )
}

export function LibraryPage() {
  const { searchParams, setParams, tag, typed, query, search } = useListFilters()
  const library = useStore((state) => state.library)
  const bookOf = useBookLookup()
  const contentRef = useRef<HTMLDivElement>(null)

  const entries = useMemo(() => Object.values(library), [library])
  const counts = useMemo(() => countByTag(entries), [entries])

  const books = useMemo(
    () =>
      entries
        .filter(({ status }) => tag === 'all' || status === tag)
        .flatMap(({ bookId }) => bookOf(bookId) ?? [])
        .filter((book) => matchesQuery(book, query))
        .sort(compareTitles),
    [entries, tag, query, bookOf],
  )

  const unfiledBooks = useMemo(
    () =>
      entries
        .filter(({ folderIds }) => folderIds.length === 0)
        .flatMap(({ bookId }) => bookOf(bookId) ?? [])
        .sort(compareTitles),
    [entries, bookOf],
  )
  const showUnfiled =
    tag === 'all' && searchParams.get(VIEW_PARAM) === NO_FOLDER && unfiledBooks.length > 0

  function chooseTag(value: TagFilterValue) {
    setParams({ [TAG_PARAM]: value === 'all' ? '' : value, [VIEW_PARAM]: '' })
  }

  function content() {
    if (showUnfiled) {
      return (
        <section className="mt-5">
          <h2 className="mb-1 section-title">Sin carpeta</h2>
          <BookList title="Sin carpeta" books={unfiledBooks} />
        </section>
      )
    }
    if (tag === 'all') {
      return (
        <FolderBoard
          entries={entries}
          unfiledBooks={unfiledBooks}
          unfiledTo={`?${VIEW_PARAM}=${NO_FOLDER}`}
        />
      )
    }
    if (books.length === 0) return <NoTaggedBooks status={tag} />
    return <BookList title={STATUS_LABELS[tag]} books={books} showFolders />
  }

  return (
    <section>
      <PageHeader
        title="Mis libros"
        wordmarkBeside
        action={
          counts.all > 0 && (
            <BandSearch
              label={SEARCH_LABEL}
              placeholder={SEARCH_LABEL}
              value={typed}
              onChange={search}
            />
          )
        }
      >
        <TagFilter value={tag} counts={counts} onChange={chooseTag} />
      </PageHeader>

      {/* The list changes while typing, which a screen reader would not otherwise hear. */}
      <p role="status" className="sr-only">
        {query && booksLabel(books.length)}
      </p>

      {query ? (
        books.length > 0 ? (
          <BookList title="Resultados" books={books} showFolders={tag !== 'all'} />
        ) : (
          <NoResults query={query} tag={tag} onShowAll={() => chooseTag('all')} />
        )
      ) : (
        <>
          {(tag === 'all' || tag === 'want') && (
            <WantPrompt onAnswered={() => contentRef.current?.focus({ preventScroll: true })} />
          )}
          {/* An answered prompt takes its buttons with it, so the focus continues here. */}
          <div ref={contentRef} tabIndex={-1} className="outline-none">
            {content()}
          </div>
        </>
      )}
    </section>
  )
}
