import { useEffect, useMemo, useState } from 'react'
import {
  localMatches,
  mergeResults,
  narrowsSearch,
  savedSearch,
  searchBooks,
  type BookSearchResult,
} from '../../lib/openlibrary'

interface Answer extends BookSearchResult {
  text: string
  attempt: number
}

export interface BookSearch extends BookSearchResult {
  /** The query without its outer spaces. Empty means there is nothing to search for. */
  text: string
  /** Open Library has not answered yet, so `books` can still grow. */
  loading: boolean
  retry: () => void
}

/**
 * Searches for `query` and cancels the search before, so a late answer never replaces a newer one.
 * The books the app has are there from the first render. The list the person was looking at stays
 * under them until the answer arrives, but only if this search narrows that one: under another
 * search, those books would pass for its results. A search already answered needs no waiting.
 */
export function useBookSearch(query: string): BookSearch {
  const text = query.trim()
  const [attempt, setAttempt] = useState(0)
  const [answer, setAnswer] = useState<Answer>()

  // While rendering, so no frame shows the list of a search that was cleared.
  const saved = text ? savedSearch(text) : undefined
  if (!text && answer) setAnswer(undefined)
  if (saved && answer?.text !== text) setAnswer({ ...saved, text, attempt })

  useEffect(() => {
    if (!text || savedSearch(text)) return
    const search = new AbortController()
    searchBooks(text, search.signal).then(
      // An answer can already be on its way when the search is aborted.
      (result) => {
        if (!search.signal.aborted) setAnswer({ ...result, text, attempt })
      },
      // searchBooks only rejects when it was aborted, and whoever aborted it moved on.
      () => undefined,
    )
    return () => search.abort()
  }, [text, attempt])

  const current = answer?.text === text && answer.attempt === attempt ? answer : saved
  const kept = answer && narrowsSearch(text, answer.text) ? answer.books : undefined
  const books = useMemo(() => {
    if (current) return current.books
    return text ? mergeResults(localMatches(text), kept ?? []) : []
  }, [text, current, kept])

  return {
    text,
    loading: text !== '' && !current,
    books,
    offline: current?.offline ?? false,
    more: current?.more ?? false,
    retry: () => setAttempt((value) => value + 1),
  }
}
