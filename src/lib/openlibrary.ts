import { normalizeText } from '../features/library/filters'
import { useStore } from '../store'
import type { Book, BookId } from '../types'

const API_URL = 'https://openlibrary.org'
const COVERS_URL = 'https://covers.openlibrary.org/b/id'

/** How long a search waits for the person to stop typing. */
export const SEARCH_DELAY_MS = 350
export const REQUEST_TIMEOUT_MS = 5000

const SEARCH_LIMIT = 20
const MAX_AUTHORS_OF_A_WORK = 3
const SEARCH_FIELDS = [
  'key',
  'title',
  'author_name',
  'cover_i',
  'first_publish_year',
  'number_of_pages_median',
  'editions',
  'editions.title',
  'editions.cover_i',
].join(',')

const WORK_ID = /^OL\d+W$/

export interface BookSearchResult {
  books: Book[]
  /** Open Library did not answer, so the books come only from what the app already has. */
  offline: boolean
}

interface SearchDoc {
  key?: string
  title?: string
  author_name?: string[]
  cover_i?: number
  first_publish_year?: number
  number_of_pages_median?: number
  editions?: { docs?: { title?: string; cover_i?: number }[] }
}

interface WorkDoc {
  title?: string
  description?: string | { value?: string }
  covers?: number[]
  first_publish_date?: string
  authors?: { author?: { key?: string } }[]
}

/** Punctuation breaks words too, so "Jean-Paul" starts at "paul" and "J. R. R." reads as initials. */
function words(text: string): string {
  return normalizeText(text).replace(/[^\p{L}\p{N}]+/gu, ' ').trim()
}

/** By the start of a word of the name, so "king" finds Stephen King and not Hawking. */
export function matchesAuthor(name: string, query: string): boolean {
  const wanted = words(query)
  return wanted !== '' && ` ${words(name)}`.includes(` ${wanted}`)
}

function matchesBook({ title, authors }: Book, query: string): boolean {
  return (
    normalizeText(title).includes(normalizeText(query)) ||
    authors.some((name) => matchesAuthor(name, query))
  )
}

function localMatches(query: string): Book[] {
  const { seedBooks, extraBooks } = useStore.getState()
  return Object.values({ ...seedBooks, ...extraBooks }).filter((book) =>
    matchesBook(book, query),
  )
}

const coverUrl = (coverId: number) => `${COVERS_URL}/${coverId}-L.jpg?default=false`

function bookFromDoc(doc: SearchDoc): Book | undefined {
  const id = doc.key?.split('/').pop()
  // The search asks for Spanish, so this edition has the title the person would look for.
  const edition = doc.editions?.docs?.[0]
  const title = edition?.title ?? doc.title
  if (!id || !title) return undefined
  const cover = edition?.cover_i ?? doc.cover_i
  return {
    id,
    title,
    // A work can list the same person once per edition.
    authors: [...new Set(doc.author_name)],
    coverUrl: cover ? coverUrl(cover) : undefined,
    year: doc.first_publish_year,
    pages: doc.number_of_pages_median,
  }
}

/** Local books go first, and a live result never repeats one, by id or by title and author. */
export function mergeResults(local: Book[], live: Book[]): Book[] {
  const seen = new Set<string>()
  return [...local, ...live].filter((book) => {
    const keys = [book.id, `${normalizeText(book.title)}|${normalizeText(book.authors[0] ?? '')}`]
    if (keys.some((key) => seen.has(key))) return false
    keys.forEach((key) => seen.add(key))
    return true
  })
}

/** Resolves to null on a 404. Throws on any other answer, on a network failure and at the timeout. */
async function getJson<T>(url: string, signal?: AbortSignal): Promise<T | null> {
  const request = new AbortController()
  const abort = () => request.abort()
  const timeout = setTimeout(abort, REQUEST_TIMEOUT_MS)
  signal?.addEventListener('abort', abort)
  try {
    const response = await fetch(url, { signal: request.signal })
    if (response.status === 404) return null
    if (!response.ok) throw new Error(`Open Library respondió ${response.status}`)
    return (await response.json()) as T
  } finally {
    clearTimeout(timeout)
    signal?.removeEventListener('abort', abort)
  }
}

/** Waits for the typing to stop. Rejects as soon as `signal` says a newer search replaced this one. */
function untilTypingStops(signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(signal.reason)
      return
    }
    const timer = setTimeout(resolve, SEARCH_DELAY_MS)
    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(timer)
        reject(signal.reason)
      },
      { once: true },
    )
  })
}

/**
 * Searches Open Library and adds what the app already has. When the service fails or takes more
 * than 5 s, it answers with the local books and says so. Rejects only when `signal` aborts, so each
 * keystroke cancels the previous search by aborting it.
 */
export async function searchBooks(query: string, signal: AbortSignal): Promise<BookSearchResult> {
  await untilTypingStops(signal)
  const local = localMatches(query)
  const params = new URLSearchParams({
    q: query,
    lang: 'es',
    limit: String(SEARCH_LIMIT),
    fields: SEARCH_FIELDS,
  })
  try {
    const answer = await getJson<{ docs?: SearchDoc[] }>(
      `${API_URL}/search.json?${params}`,
      signal,
    )
    const live = (answer?.docs ?? []).flatMap((doc) => bookFromDoc(doc) ?? [])
    return { books: mergeResults(local, live), offline: false }
  } catch (error) {
    if (signal.aborted) throw error
    return { books: local, offline: true }
  }
}

function descriptionOf({ description }: WorkDoc): string | undefined {
  return typeof description === 'string' ? description : description?.value
}

/** A name that does not load leaves the book without it, which is better than losing the book. */
async function authorNames({ authors = [] }: WorkDoc): Promise<string[]> {
  const keys = authors.flatMap(({ author }) => author?.key ?? []).slice(0, MAX_AUTHORS_OF_A_WORK)
  const answers = await Promise.allSettled(
    keys.map((key) => getJson<{ name?: string }>(`${API_URL}${key}.json`)),
  )
  return answers.flatMap((answer) =>
    answer.status === 'fulfilled' && answer.value?.name ? answer.value.name : [],
  )
}

/**
 * Loads a work that is not in the store. Resolves to null when Open Library does not have it, and
 * rejects when it cannot answer, so the page can tell "not found" from "try again".
 */
export async function fetchWork(id: BookId): Promise<Book | null> {
  if (!WORK_ID.test(id)) return null
  const work = await getJson<WorkDoc>(`${API_URL}/works/${id}.json`)
  if (!work?.title) return null
  // Open Library marks a missing cover with -1.
  const cover = work.covers?.find((covers) => covers > 0)
  const year = work.first_publish_date?.match(/\d{4}/)?.[0]
  return {
    id,
    title: work.title,
    authors: await authorNames(work),
    coverUrl: cover ? coverUrl(cover) : undefined,
    description: descriptionOf(work),
    year: year ? Number(year) : undefined,
  }
}
