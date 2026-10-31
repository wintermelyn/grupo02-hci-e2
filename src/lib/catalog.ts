import { useEffect, useMemo, useSyncExternalStore } from 'react'
import type { Book, BookId } from '../types'

// Written by `node scripts/seed-catalog.mjs publish`. They are plain files, so the app has no
// service to wait for: what it can fail at is downloading them.
const INDEX_URL = '/catalog/index.json'
const descriptionsUrl = (group: number) => `/catalog/descriptions/${group}.json`

const REQUEST_TIMEOUT_MS = 10_000
/** scripts/catalog-rules.mjs has the same number, and a test compares them. */
export const DESCRIPTION_GROUPS = 16

const WORK_ID = /^OL(\d+)W$/

export const isWorkId = (id: BookId) => WORK_ID.test(id)

/** The file of a book's description, worked out from its id alone. */
export const descriptionGroup = (id: BookId) =>
  Number(id.match(WORK_ID)?.[1] ?? 0) % DESCRIPTION_GROUPS

type CatalogRow = [
  id: BookId,
  title: string,
  authors: string[],
  year: number | null,
  pages: number | null,
  coverColor: string | null,
]

export type BookText = Pick<Book, 'description' | 'descriptionTranslated'>
type BookTexts = Record<BookId, BookText>

interface Catalog {
  /** The most read first. */
  books: Book[]
  byId: Map<BookId, Book>
}

export type FileStatus = 'loading' | 'ready' | 'failed'
type FileState<T> =
  { status: 'idle' | 'loading' | 'failed'; data?: undefined } | { status: 'ready'; data: T }

interface StaticFile<T> {
  read: () => FileState<T>
  subscribe: (listener: () => void) => () => void
  /** Does nothing while it downloads or once it has the file. */
  load: () => void
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) })
  if (!response.ok) throw new Error(`${url} respondió ${response.status}`)
  // A file that is not there can come back as the page of the app, and that fails here.
  return (await response.json()) as T
}

// Outside the components: going back to Buscar or to a book has the file at once, with no waiting.
function staticFile<Raw, T>(url: string, parse: (raw: Raw) => T): StaticFile<T> {
  let state: FileState<T> = { status: 'idle' }
  const listeners = new Set<() => void>()
  const change = (next: FileState<T>) => {
    state = next
    listeners.forEach((listener) => listener())
  }
  return {
    read: () => state,
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    load() {
      if (state.status === 'loading' || state.status === 'ready') return
      change({ status: 'loading' })
      fetchJson<Raw>(url).then(
        (raw) => change({ status: 'ready', data: parse(raw) }),
        () => change({ status: 'failed' }),
      )
    },
  }
}

function toBook([id, title, authors, year, pages, coverColor]: CatalogRow): Book {
  return {
    id,
    title,
    authors,
    coverUrl: `/covers/${id}.jpg`,
    year: year ?? undefined,
    pages: pages ?? undefined,
    coverColor: coverColor ?? undefined,
  }
}

function toCatalog(rows: CatalogRow[]): Catalog {
  const books = rows.map(toBook)
  return { books, byId: new Map(books.map((book) => [book.id, book])) }
}

const newIndex = () => staticFile(INDEX_URL, toCatalog)

let index = newIndex()
let descriptions = new Map<number, StaticFile<BookTexts>>()

function descriptionsOf(id: BookId): StaticFile<BookTexts> {
  const group = descriptionGroup(id)
  const file =
    descriptions.get(group) ?? staticFile(descriptionsUrl(group), (texts: BookTexts) => texts)
  descriptions.set(group, file)
  return file
}

/** For tests: the next one starts with nothing downloaded. */
export function forgetCatalog() {
  index = newIndex()
  descriptions = new Map()
}

const NEVER_LOADED: FileState<never> = { status: 'idle' }
const nothingToWatch = () => () => undefined

interface FileLoad<T> {
  status: FileStatus
  data?: T
  retry: () => void
}

/** Starts the download when it mounts. With no file, it says it is ready: nothing is on its way. */
function useStaticFile<T>(file: StaticFile<T> | undefined): FileLoad<T> {
  const state = useSyncExternalStore(
    file?.subscribe ?? nothingToWatch,
    file?.read ?? (() => NEVER_LOADED),
  )
  useEffect(() => file?.load(), [file])
  const retry = () => file?.load()
  if (!file) return { status: 'ready', retry }
  // Idle is the render before the effect: the download starts right after it.
  return { status: state.status === 'idle' ? 'loading' : state.status, data: state.data, retry }
}

const NO_BOOKS: Book[] = []

export interface CatalogLoad {
  status: FileStatus
  books: Book[]
  retry: () => void
}

/** The whole catalog, which downloads the first time something needs it. `off` asks for nothing. */
export function useCatalog({ off = false } = {}): CatalogLoad {
  const { status, data, retry } = useStaticFile(off ? undefined : index)
  return { status, books: data?.books ?? NO_BOOKS, retry }
}

/** A book of the catalog, if it has already been downloaded. This does not ask for it. */
export function useCatalogBook(id: BookId): Book | undefined {
  return useSyncExternalStore(index.subscribe, () => index.read().data?.byId.get(id))
}

export interface DescriptionLoad {
  status: FileStatus
  text?: BookText
  retry: () => void
}

/** Downloads the file with the text of this book. With no id, it asks for nothing. */
export function useDescription(id: BookId | undefined): DescriptionLoad {
  const file = useMemo(() => (id ? descriptionsOf(id) : undefined), [id])
  const { status, data, retry } = useStaticFile(file)
  const text = id && data && Object.hasOwn(data, id) ? data[id] : undefined
  return { status, text, retry }
}
