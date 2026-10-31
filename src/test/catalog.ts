import { vi } from 'vitest'
import type { BookText } from '../lib/catalog'
import type { Book, BookId } from '../types'

export interface StubbedCatalog {
  books?: Partial<Book>[]
  /** By book id, wherever its group is. */
  texts?: Record<BookId, BookText>
  /** Fails what matches, until the test takes it out of this list. */
  failing?: RegExp[]
}

const answer = (body: unknown) => Promise.resolve(new Response(JSON.stringify(body)))

const toRow = ({ id, title, authors, year, pages, coverColor }: Partial<Book>) => [
  id,
  title ?? 'Libro',
  authors ?? ['Autora'],
  year ?? null,
  pages ?? null,
  coverColor ?? null,
]

/** Answers what the app downloads, in the shape of the files in public/catalog/. */
export function stubCatalog({ books = [], texts = {}, failing = [] }: StubbedCatalog = {}) {
  const fetchFile = vi.fn((url: string) => {
    if (failing.some((pattern) => pattern.test(url))) return Promise.reject(new Error('sin red'))
    return answer(url.endsWith('index.json') ? books.map(toRow) : texts)
  })
  vi.stubGlobal('fetch', fetchFile)
  return fetchFile
}
