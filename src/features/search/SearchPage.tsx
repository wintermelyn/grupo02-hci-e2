import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type RefObject,
} from 'react'
import { useSearchParams } from 'react-router'
import { ErrorState, SearchField, Wordmark } from '../../components'
import { useStore } from '../../store'
import { useBookLookup } from '../library/filters'
import { useListFilters } from '../library/useListFilters'
import { addRecentSearch, clearRecentSearches, readRecentSearches } from './recentSearchStore'
import { arrangeResults } from './results'
import { SearchSkeleton } from './SearchSkeleton'
import { SearchStart } from './SearchStart'
import { NoResults, SearchResults } from './SearchResults'
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

/**
 * A new search starts at its first result, right under the field, which stays at the top of the
 * screen. With the page above that point the results are already in view, so nothing moves.
 */
function useStartAtResults(text: string, field: RefObject<HTMLElement | null>) {
  const start = useRef<HTMLDivElement>(null)
  const shown = useRef(text)
  useLayoutEffect(() => {
    if (shown.current === text) return
    shown.current = text
    if (!start.current || !field.current) return
    const page = document.documentElement
    const { top } = start.current.getBoundingClientRect()
    const resultsTop = page.scrollTop + top - field.current.offsetHeight
    if (page.scrollTop > resultsTop) page.scrollTop = resultsTop
  }, [text, field])
  return start
}

export function SearchPage() {
  // The field keeps its own value: if it waited for the URL, each letter would lose the caret.
  const { typed, search } = useListFilters()
  const [, setParams] = useSearchParams()
  const { text, loading, failed, books, retry } = useBookSearch(typed)
  const library = useStore((state) => state.library)
  const authors = useLibraryAuthors()
  const friendsBooks = useFriendsBooks()
  const [recent, setRecent] = useState(readRecentSearches)
  const field = useFocusOnWideScreen(typed === '')
  const resultsStart = useStartAtResults(text, field)
  const bookOf = useBookLookup()
  const booksHeading = useRef<HTMLHeadingElement>(null)
  const focusOnBooks = useRef(false)

  const results = useMemo(
    // The catalog carries no descriptions, and the 54 books of the app do.
    () =>
      arrangeResults(
        books.map((book) => bookOf(book.id) ?? book),
        text,
        library,
      ),
    [books, bookOf, text, library],
  )

  useEffect(() => {
    if (!focusOnBooks.current) return
    focusOnBooks.current = false
    booksHeading.current?.focus({ preventScroll: true })
  }, [text])

  const remember = (term: string) => setRecent((current) => addRecentSearch(term, current))

  // Typing does not fill the history, but an author is a step: Back returns to the search before it.
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
      {/* Not PageHeader: its row is as tall as a button, and that would move the field. */}
      <header className="flex items-center justify-between gap-3 pt-3 lg:pt-8">
        <h1 className="page-title">Buscar</h1>
        <Wordmark />
      </header>
      {/* Solid and to the edges of the column: what scrolls under it does not show through. */}
      <div
        ref={field}
        onKeyDown={onKeyDown}
        className="full-bleed sticky top-0 z-30 mt-3 bg-paper py-2 lg:mt-4"
      >
        <SearchField
          size="lg"
          label="Buscar libros y autores"
          placeholder="Título o autor"
          value={typed}
          onChange={search}
        />
      </div>
      <div ref={resultsStart} />

      {!text ? (
        <SearchStart
          recent={recent}
          authors={authors}
          friendsBooks={friendsBooks}
          onSearch={search}
          onPickAuthor={pickAuthor}
          onClearRecent={clearRecent}
        />
      ) : loading ? (
        <SearchSkeleton />
      ) : failed ? (
        <ErrorState
          title="No pudimos buscar"
          description="Revisa tu conexión e inténtalo de nuevo. Tus libros siguen en Mis libros."
          onRetry={retry}
        />
      ) : books.length === 0 ? (
        <NoResults text={text} authors={authors} onPickAuthor={pickAuthor} />
      ) : (
        <SearchResults
          results={results}
          booksHeading={booksHeading}
          onPickAuthor={pickAuthor}
          onOpenBook={() => remember(text)}
        />
      )}
    </section>
  )
}
