import { useMemo } from 'react'
import { useCatalog } from '../../lib/catalog'
import type { Book } from '../../types'
import { searchCatalog, toSearchable } from './searchCatalog'

export interface BookSearch {
  /** The query without its outer spaces. Empty means there is nothing to search for. */
  text: string
  /** The catalog has not arrived yet. */
  loading: boolean
  /** The catalog could not be downloaded, so an empty list says nothing. */
  failed: boolean
  books: Book[]
  retry: () => void
}

/**
 * Searches the catalog, which is downloaded on arriving at Buscar. It runs in the render, so each
 * letter gets its list in the same frame and there is no answer to wait for or to cancel.
 */
export function useBookSearch(query: string): BookSearch {
  const text = query.trim()
  const { status, books, retry } = useCatalog()
  const searchable = useMemo(() => books.map(toSearchable), [books])
  const found = useMemo(() => searchCatalog(searchable, text), [searchable, text])
  return { text, loading: status === 'loading', failed: status === 'failed', books: found, retry }
}
