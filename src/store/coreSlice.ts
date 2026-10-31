import { today } from '../lib/dates'
import { STATUS_LABELS } from '../lib/status'
import type { AppState, Book, BookId, ISODate, LibraryEntry, ReadingStatus } from '../types'
import type { SliceCreator } from '.'

/** The part of the state that undo restores. */
export type LibraryData = Pick<AppState, 'library' | 'folders'>

/** Statuses that can be set directly; 'read' only goes through finishBook (role A). */
export type DirectStatus = Exclude<ReadingStatus, 'read'>

export interface CoreActions {
  /** The only way to change library or folders: applies the change, keeps an undo copy and shows the toast. */
  commit: (label: string, mutator: (current: LibraryData) => Partial<LibraryData>) => void
  undo: () => void
  showToast: (message: string, options?: { undoable?: boolean }) => void
  /** Hides the toast and drops the undo copy. */
  dismissToast: () => void
  /** Stops the auto-dismiss timer while the toast is hovered or focused. */
  pauseToast: () => void
  /** Restarts the auto-dismiss timer with the full TOAST_DURATION_MS. */
  resumeToast: () => void
  /** Adds a book from the API to extraBooks. Never overwrites a seed book. */
  upsertBook: (book: Book) => void
  /**
   * Adds the book to the library or changes its status. Ignores ids that getBook does not know,
   * so call upsertBook first for an API book. Leaving Leído drops finishedAt and rating, which
   * describe that finished reading; undo brings them back. Leído → Leyendo is a re-read, so
   * startedAt becomes today. Moving to Lo quiero sets wantCheckedAt to today, so the D5 prompt does
   * not ask about a book the person just chose.
   */
  setStatus: (bookId: BookId, status: DirectStatus) => void
  /** Looks in seedBooks first, then in extraBooks. In a component, use `useStore(selectBook(id))`. */
  getBook: (id: BookId) => Book | undefined
}

export const TOAST_DURATION_MS = 5000

const DIRECT_STATUSES: readonly ReadingStatus[] = ['want', 'owned', 'reading']

let toastTimer: ReturnType<typeof setTimeout> | undefined
let lastToastId = 0

// Ids come from the URL, so a plain lookup would match inherited keys such as "constructor".
function lookup<T>(record: Record<string, T>, key: string): T | undefined {
  return Object.hasOwn(record, key) ? record[key] : undefined
}

/**
 * Selector for a book's library entry, undefined when the book is not in the library. Use it
 * instead of `state.library[id]`, whose type never includes undefined:
 * `useStore(selectEntry(bookId))`.
 */
export const selectEntry =
  (bookId: BookId) =>
  (state: AppState): LibraryEntry | undefined =>
    lookup(state.library, bookId)

/**
 * Selector for a book, from seedBooks or extraBooks. Use it instead of calling a selected getBook
 * during render: getBook never changes, so that component would miss a later upsertBook.
 * `useStore(selectBook(bookId))`.
 */
export const selectBook =
  (bookId: BookId) =>
  (state: AppState): Book | undefined =>
    lookup(state.seedBooks, bookId) ?? lookup(state.extraBooks, bookId)

function startedAtFor(
  current: LibraryEntry | undefined,
  status: DirectStatus,
): ISODate | undefined {
  if (status !== 'reading') return current?.startedAt
  const rereading = current?.status === 'read'
  return rereading ? today() : (current?.startedAt ?? today())
}

export const createCoreSlice: SliceCreator<CoreActions> = (set, get) => ({
  commit: (label, mutator) => {
    const { library, folders } = get()
    set({ ...mutator({ library, folders }), undoSnapshot: { library, folders } })
    get().showToast(label, { undoable: true })
  },

  undo: () => {
    const { undoSnapshot } = get()
    if (!undoSnapshot) return
    set({ ...undoSnapshot, undoSnapshot: null })
    get().showToast('Cambio deshecho')
  },

  showToast: (message, { undoable = false } = {}) => {
    clearTimeout(toastTimer)
    lastToastId += 1
    set((state) => ({
      toast: { id: lastToastId, message, undoable },
      undoSnapshot: undoable ? state.undoSnapshot : null,
    }))
    toastTimer = setTimeout(get().dismissToast, TOAST_DURATION_MS)
  },

  dismissToast: () => {
    clearTimeout(toastTimer)
    set({ toast: null, undoSnapshot: null })
  },

  pauseToast: () => {
    clearTimeout(toastTimer)
  },

  resumeToast: () => {
    clearTimeout(toastTimer)
    if (get().toast) toastTimer = setTimeout(get().dismissToast, TOAST_DURATION_MS)
  },

  upsertBook: (book) => {
    if (lookup(get().seedBooks, book.id)) return
    set((state) => ({ extraBooks: { ...state.extraBooks, [book.id]: book } }))
  },

  setStatus: (bookId, status) => {
    // The type already excludes 'read'; this also stops casts and untyped callers.
    if (!DIRECT_STATUSES.includes(status) || !get().getBook(bookId)) return
    const current = selectEntry(bookId)(get())
    if (current?.status === status) return

    const base: Omit<LibraryEntry, 'status'> = current ?? {
      bookId,
      folderIds: [],
      addedAt: today(),
    }
    const { finishedAt: _finishedAt, rating: _rating, ...kept } = base
    const entry: LibraryEntry = { ...kept, status, startedAt: startedAtFor(current, status) }
    if (status === 'want') entry.wantCheckedAt = today()
    const label = current
      ? `Estado cambiado a «${STATUS_LABELS[status]}»`
      : `Agregado a Mis libros como «${STATUS_LABELS[status]}»`
    get().commit(label, ({ library }) => ({ library: { ...library, [bookId]: entry } }))
  },

  getBook: (id) => selectBook(id)(get()),
})
