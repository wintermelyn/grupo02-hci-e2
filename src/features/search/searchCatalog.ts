import type { Book } from '../../types'
import { normalizeText } from '../library/filters'

/** Punctuation breaks words too, so "Jean-Paul" starts at "paul" and "J. R. R." reads as initials. */
function words(text: string): string {
  return normalizeText(text)
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
}

const startsWord = (text: string, wanted: string) => ` ${text}`.includes(` ${wanted}`)

/** By the start of a word of the name, so "king" finds Stephen King and not Hawking. */
export function matchesAuthor(name: string, query: string): boolean {
  const wanted = words(query)
  return wanted !== '' && startsWord(words(name), wanted)
}

export interface SearchableBook {
  book: Book
  title: string
  authors: string
}

/** Normalized once, when the catalog arrives, so each letter typed only compares text. */
export const toSearchable = (book: Book): SearchableBook => ({
  book,
  title: words(book.title),
  authors: words(book.authors.join(' ')),
})

/** Lower goes first: the whole title, how it starts, a word in it, the author, and any other way. */
function rank({ title, authors }: SearchableBook, phrase: string): number {
  if (title === phrase) return 0
  if (title.startsWith(phrase)) return 1
  if (startsWord(title, phrase)) return 2
  if (startsWord(authors, phrase)) return 3
  return 4
}

/**
 * Every word typed has to start a word of the title or of the authors, in any order, so "cien
 * soledad" and "marquez cien" both find it. `books` comes with the most read first, and that order
 * stays among equals.
 */
export function searchCatalog(books: SearchableBook[], query: string): Book[] {
  const phrase = words(query)
  if (!phrase) return []
  const wanted = phrase.split(' ')
  return books
    .filter(({ title, authors }) => {
      const text = `${title} ${authors}`
      return wanted.every((word) => startsWord(text, word))
    })
    .map((entry) => ({ entry, order: rank(entry, phrase) }))
    .sort((a, b) => a.order - b.order)
    .map(({ entry }) => entry.book)
}
