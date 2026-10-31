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
  /** What the search most likely wanted, which takes the first place and the larger card. */
  lead: ResultLead
  /** False while the list can grow or is a page of a search: the amount would not be the author's. */
  countedAuthors: boolean
  /** What to mark in the rows. Nothing when the list is the books of one author. */
  marked: string
}

export type ResultLead = 'author' | 'book' | undefined

export const MAX_AUTHORS = 6

const WORD_CHARACTER = /[\p{L}\p{N}]/u

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

/** A title that starts with the search beats an author. If not, a person who types a name wants them. */
function leadOf(authors: AuthorGroup[], books: Book[], wanted: string, exact: boolean): ResultLead {
  if (exact || books.length === 0) return undefined
  if (authors.length === 0) return 'book'
  return normalizeText(books[0].title).startsWith(wanted) ? 'book' : 'author'
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
  // Once answered, the service decides what matches: it also searches what the app cannot see.
  const matching = loading ? arranged.filter((book) => matchesBook(book, query)) : arranged
  return {
    authors: exact ? [] : authors.slice(0, MAX_AUTHORS),
    books: matching,
    earlier: loading ? arranged.filter((book) => !matchesBook(book, query)) : [],
    summary: resultsSummary(books.length, mine.length, more),
    lead: leadOf(authors, matching, wanted, exact !== undefined),
    countedAuthors: !more && !loading,
    marked: exact ? '' : query,
  }
}

/**
 * Where a search shows in a text, by the start of a word: the rule an author matches by, so "king"
 * marks Stephen King and never the end of Hawking. Accents do not count, as in the search itself.
 */
export function matchRange(text: string, query: string): [number, number] | undefined {
  const wanted = normalizeText(query)
  const plain = text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
  // A letter that does not fold into one would move everything after it.
  if (!wanted || plain.length !== text.length) return undefined
  for (let at = plain.indexOf(wanted); at >= 0; at = plain.indexOf(wanted, at + 1)) {
    if (at === 0 || !WORD_CHARACTER.test(plain[at - 1])) return [at, at + wanted.length]
  }
  return undefined
}
