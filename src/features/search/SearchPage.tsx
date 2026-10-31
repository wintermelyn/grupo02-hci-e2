import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { useSearchParams } from 'react-router'
import { ErrorState, LoadingState, PageHeader, SearchField } from '../../components'
import { useStore } from '../../store'
import { addRecentSearch, clearRecentSearches, readRecentSearches } from './recentSearchStore'
import { arrangeResults } from './results'
import { SearchStart } from './SearchStart'
import { NoResults, OfflineNotice, SearchResults } from './SearchResults'
import { useBookSearch } from './useBookSearch'
import { useFriendsBooks, useLibraryAuthors } from './useSearchStart'

const WIDE_SCREEN = '(min-width: 768px)'

/** On a computer the field is ready to type in. On a phone that would cover the page with the keyboard. */
function useFocusOnWideScreen(enabled: boolean) {
  const field = useRef<HTMLDivElement>(null)
  // Read once: it must not take the focus back while the person uses the page.
  const onArrival = useRef(enabled)
  useEffect(() => {
    if (onArrival.current && window.matchMedia?.(WIDE_SCREEN).matches) {
      field.current?.querySelector('input')?.focus()
    }
  }, [])
  return field
}

export function SearchPage() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const search = useBookSearch(query)
  const library = useStore((state) => state.library)
  const authors = useLibraryAuthors()
  const friendsBooks = useFriendsBooks()
  const [recent, setRecent] = useState(readRecentSearches)
  const field = useFocusOnWideScreen(query === '')
  const { text, loading, books, offline, retry } = search

  const results = useMemo(() => arrangeResults(books, text, library), [books, text, library])

  const setQuery = (value: string) => setParams(value ? { q: value } : {}, { replace: true })
  const remember = (term: string) => setRecent((current) => addRecentSearch(term, current))

  function pickAuthor(name: string) {
    remember(name)
    setQuery(name)
  }

  function clearRecent() {
    clearRecentSearches()
    setRecent([])
  }

  function onKeyDown({ key }: KeyboardEvent) {
    if (key === 'Enter' && text) remember(text)
  }

  return (
    <section>
      <PageHeader title="Buscar">
        <div ref={field} onKeyDown={onKeyDown} className="mb-4 md:max-w-2xl">
          <SearchField
            label="Buscar libros y autores"
            placeholder="Título o autor"
            value={query}
            onChange={setQuery}
          />
        </div>
      </PageHeader>

      {!text ? (
        <SearchStart
          recent={recent}
          authors={authors}
          friendsBooks={friendsBooks}
          onSearch={setQuery}
          onPickAuthor={pickAuthor}
          onClearRecent={clearRecent}
        />
      ) : loading ? (
        <div className="mt-3">
          <LoadingState label="Buscando…" />
        </div>
      ) : offline && books.length === 0 ? (
        // Without the service, an empty list does not mean the book is not there.
        <ErrorState
          title="No pudimos buscar"
          description="Revisa tu conexión e inténtalo de nuevo. Tus libros siguen en Mis libros."
          onRetry={retry}
        />
      ) : books.length === 0 ? (
        <NoResults text={text} authors={authors} onPickAuthor={pickAuthor} />
      ) : (
        <>
          {offline && <OfflineNotice onRetry={retry} />}
          <SearchResults
            results={results}
            onPickAuthor={pickAuthor}
            onOpenBook={() => remember(text)}
          />
        </>
      )}
    </section>
  )
}
