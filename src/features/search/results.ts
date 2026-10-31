import { matchesAuthor, matchesBook } from '../../lib/openlibrary'
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
  /** Kept from the search before while this one has no answer, and they do not match it. */
  earlier: Book[]
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

/** A page of a search is not its total: "king" has thousands of books and the page, 20. */
function amountLabel(total: number, more: boolean): string {
  if (!more) return booksLabel(total)
  return total === 1 ? 'El más relevante' : `Los ${total} más relevantes`
}

function resultsSummary(total: number, inLibrary: number, more: boolean): string {
  const amount = amountLabel(total, more)
  return inLibrary > 0 ? `${amount} · ${inLibrary} en Mis libros` : amount
}

/**
 * Splits the books of a search into authors and books. Tapping an author searches for their name,
 * and that exact name is what filters the list to their books, whether it was tapped or typed.
 */
export function arrangeResults(
  results: Book[],
  query: string,
  library: Record<BookId, LibraryEntry>,
  more = false,
  loading = false,
): ArrangedResults {
  const authors = groupByAuthor(results).filter(({ name }) => matchesAuthor(name, query))
  const wanted = normalizeText(query)
  const exact = authors.find(({ name }) => normalizeText(name) === wanted)
  const books = exact?.books ?? results
  const mine = books.filter(({ id }) => Object.hasOwn(library, id))
  const others = books.filter(({ id }) => !Object.hasOwn(library, id))
  const arranged = [...mine, ...others]
  return {
    authors: exact ? [] : authors.slice(0, MAX_AUTHORS),
    // Once answered, the service decides what matches: it also searches what the app cannot see.
    books: loading ? arranged.filter((book) => matchesBook(book, query)) : arranged,
    earlier: loading ? arranged.filter((book) => !matchesBook(book, query)) : [],
    summary: resultsSummary(books.length, mine.length, more),
  }
}
