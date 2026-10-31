import type { Book, BookId, LibraryEntry } from '../../types'
import { booksLabel, normalizeText } from '../library/filters'
import { isAuthorName, matchesAuthor } from './searchCatalog'

export interface AuthorGroup {
  name: string
  books: Book[]
  /** How many books of theirs the card says. Unknown until the catalog arrives. */
  count: number | undefined
}

export interface ArrangedResults {
  /** Empty when the search is already an author, whose books are the whole list. */
  authors: AuthorGroup[]
  /** The books of the library first, as the person is most likely looking for one of those. */
  books: Book[]
  summary: string
  /** What the search most likely wanted, which takes the first place and the larger card. */
  lead: ResultLead
  /** What to mark in the rows. Nothing when the list is the books of one author. */
  marked: string
}

export type ResultLead = 'author' | 'book' | undefined

export const MAX_AUTHORS = 6
/** A letter can match half the catalog, and a list that long says less than the first ones. */
export const MAX_BOOKS = 40

const WORD_CHARACTER = /[\p{L}\p{N}]/u

/** The authors with more books first, and by name among equals. */
export function groupByAuthor(books: Book[]): AuthorGroup[] {
  const byName = new Map<string, Book[]>()
  for (const book of books) {
    for (const name of book.authors) byName.set(name, [...(byName.get(name) ?? []), book])
  }
  return [...byName]
    .map(([name, list]) => ({ name, books: list, count: list.length }))
    .sort((a, b) => b.books.length - a.books.length || a.name.localeCompare(b.name, 'es-CL'))
}

/** A title that starts with the search beats an author. If not, a person who types a name wants them. */
function leadOf(authors: AuthorGroup[], books: Book[], wanted: string, exact: boolean): ResultLead {
  if (exact || books.length === 0) return undefined
  if (authors.length === 0) return 'book'
  return normalizeText(books[0].title).startsWith(wanted) ? 'book' : 'author'
}

function resultsSummary(total: number, shown: number, inLibrary: number): string {
  const amount = shown < total ? `Los ${shown} más relevantes de ${total}` : booksLabel(total)
  return inLibrary > 0 ? `${amount} · ${inLibrary} en Mis libros` : amount
}

/**
 * Splits the books of a search into authors and books. Tapping an author searches for their name,
 * and that exact name is what filters the list to their books, whether it was tapped or typed. That
 * list is complete. Any other one stops at MAX_BOOKS, and the authors still count every match.
 */
export function arrangeResults(
  results: Book[],
  query: string,
  library: Record<BookId, LibraryEntry>,
): ArrangedResults {
  const authors = groupByAuthor(results).filter(({ name }) => matchesAuthor(name, query))
  const wanted = normalizeText(query)
  const exact = authors.find(({ name }) => isAuthorName(name, query))
  const books = exact?.books ?? results
  const mine = books.filter(({ id }) => Object.hasOwn(library, id))
  const others = books.filter(({ id }) => !Object.hasOwn(library, id))
  const arranged = [...mine, ...others]
  const shown = exact ? arranged : arranged.slice(0, MAX_BOOKS)
  return {
    authors: exact ? [] : authors.slice(0, MAX_AUTHORS),
    books: shown,
    summary: resultsSummary(books.length, shown.length, mine.length),
    lead: leadOf(authors, shown, wanted, exact !== undefined),
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
