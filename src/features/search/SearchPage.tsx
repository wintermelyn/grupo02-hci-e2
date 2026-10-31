import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { useSearchParams } from 'react-router'
import { ErrorState, LoadingState, PageHeader, SearchField } from '../../components'
import { useStore } from '../../store'
import { useBookLookup } from '../library/filters'
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
  const { text, loading, books, offline, more, retry } = search
  const bookOf = useBookLookup()
  const booksHeading = useRef<HTMLHeadingElement>(null)
  const focusOnBooks = useRef(false)

  const results = useMemo(
    // The store's copy can know more than the search did, like a description found on the book page.
    () =>
      arrangeResults(
        books.map((book) => bookOf(book.id) ?? book),
        text,
        library,
        more,
      ),
    [books, bookOf, text, library, more],
  )

  useEffect(() => {
    if (!focusOnBooks.current) return
    focusOnBooks.current = false
    booksHeading.current?.focus({ preventScroll: true })
  }, [text])

  // Typing does not fill the history, but an author is a step: Back returns to the search before it.
  const setQuery = (value: string) => setParams(value ? { q: value } : {}, { replace: true })
  const remember = (term: string) => setRecent((current) => addRecentSearch(term, current))

  function pickAuthor(name: string) {
    remember(name)
    focusOnBooks.current = true
    setParams({ q: name })
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
      ) : books.length === 0 && loading ? (
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
            loading={loading}
            booksHeading={booksHeading}
            onPickAuthor={pickAuthor}
            onOpenBook={() => remember(text)}
          />
        </>
      )}
    </section>
  )
}
