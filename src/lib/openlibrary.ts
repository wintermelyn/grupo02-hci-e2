import type { Book, BookId } from '../types'

// Stubs from the base block with their final signatures. Role B implements them.

/** Live search with a 5 s timeout, local fallback and dedup against the seed catalogue. */
export async function searchBooks(_query: string, _signal: AbortSignal): Promise<Book[]> {
  return []
}

/** Loads a work that is not in the store; null when Open Library does not have it. */
export async function fetchWork(_id: BookId): Promise<Book | null> {
  return null
}
