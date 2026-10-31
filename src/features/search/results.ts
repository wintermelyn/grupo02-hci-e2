import { matchesAuthor } from '../../lib/openlibrary'
import type { Book, BookId, LibraryEntry } from '../../types'
import { booksLabel, normalizeText } from '../library/filters'

export interface AuthorGroup {
  name: string
  books: Book[]
}

export interface ArrangedResults {
  /** Empty when the search is already an author, whose books are the whole list. */
  authors: AuthorGroup[]
  /** The books of the library first, as the person is most likely looking for one of those. */
  books: Book[]
  summary: string
}

export const MAX_AUTHORS = 6

/** The authors with more books first, and by name among equals. */
export function groupByAuthor(books: Book[]): AuthorGroup[] {
  const byName = new Map<string, Book[]>()
  for (const book of books) {
    for (const name of book.authors) byName.set(name, [...(byName.get(name) ?? []), book])
  }
  return [...byName]
    .map(([name, list]) => ({ name, books: list }))
    .sort((a, b) => b.books.length - a.books.length || a.name.localeCompare(b.name, 'es-CL'))
}

function resultsSummary(total: number, inLibrary: number): string {
  return inLibrary > 0 ? `${booksLabel(total)} · ${inLibrary} en tu biblioteca` : booksLabel(total)
}

/**
 * Splits the books of a search into authors and books. Tapping an author searches for their name,
 * and that exact name is what filters the list to their books, whether it was tapped or typed.
 */
export function arrangeResults(
  results: Book[],
  query: string,
  library: Record<BookId, LibraryEntry>,
): ArrangedResults {
  const authors = groupByAuthor(results).filter(({ name }) => matchesAuthor(name, query))
  const wanted = normalizeText(query)
  const exact = authors.find(({ name }) => normalizeText(name) === wanted)
  const books = exact?.books ?? results
  const mine = books.filter(({ id }) => Object.hasOwn(library, id))
  const others = books.filter(({ id }) => !Object.hasOwn(library, id))
  return {
    authors: exact ? [] : authors.slice(0, MAX_AUTHORS),
    books: [...mine, ...others],
    summary: resultsSummary(books.length, mine.length),
  }
}
