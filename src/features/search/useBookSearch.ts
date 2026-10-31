import { useEffect, useState } from 'react'
import { searchBooks, type BookSearchResult } from '../../lib/openlibrary'

interface Answer extends BookSearchResult {
  text: string
  attempt: number
}

export interface BookSearch extends BookSearchResult {
  /** The query without its outer spaces. Empty means there is nothing to search for. */
  text: string
  loading: boolean
  retry: () => void
}

/** Searches for `query` and cancels the search before, so a late answer never replaces a newer one. */
export function useBookSearch(query: string): BookSearch {
  const text = query.trim()
  const [attempt, setAttempt] = useState(0)
  const [answer, setAnswer] = useState<Answer>()

  useEffect(() => {
    if (!text) return
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

  const current = answer?.text === text && answer.attempt === attempt ? answer : undefined
  return {
    text,
    loading: text !== '' && !current,
    books: current?.books ?? [],
    offline: current?.offline ?? false,
    retry: () => setAttempt((value) => value + 1),
  }
}
