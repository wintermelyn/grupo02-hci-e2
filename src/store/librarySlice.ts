import { today } from '../lib/dates'
import { STATUS_LABELS } from '../lib/status'
import type { AppState, BookId, ISODate, LibraryEntry } from '../types'
import type { SliceCreator } from '.'
import { selectEntry } from './coreSlice'

export interface FinishDetails {
  startedAt: ISODate
  finishedAt: ISODate
  rating?: number
}

export interface LibraryActions {
  /**
   * The only way to set a book to 'read', and also what "Editar lectura" saves with. If the book
   * is not in the library (e.g. Leído chosen on a search result), creates the entry (folderIds: [],
   * addedAt: today()) first. Ignores ids that getBook does not know. An undefined rating clears it.
   */
  finishBook: (bookId: BookId, details: FinishDetails) => void
  /** Corrects when a book in Leyendo was started, which finishBook cannot do: it ends the reading. */
  setStartDate: (bookId: BookId, startedAt: ISODate) => void
  removeFromLibrary: (bookIds: BookId[]) => void
  /** Returns the new folder id. */
  createFolder: (name: string) => string
  /** Pinned folders keep their name. */
  renameFolder: (id: string, name: string) => void
  /** Pinned folders cannot be deleted. The books stay in the library. */
  deleteFolder: (id: string) => void
  /** Skips books outside the library or already in the folder; with none left, changes nothing. */
  addToFolder: (bookIds: BookId[], folderId: string) => void
  /** Skips books outside the library or not in the folder; with none left, changes nothing. */
  removeFromFolder: (bookIds: BookId[], folderId: string) => void
  /** Answers the D5 prompt. See "Aviso periódico" in PLAN.md. */
  answerWantPrompt: (bookId: BookId, keep: boolean) => void
}

type Library = AppState['library']

const FALLBACK_FOLDER_ID = 'carpeta'

function slugify(name: string): string {
  return name
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Reads like the seed's ids, e.g. "ciencia-ficcion", since it also ends up in the URL. */
function uniqueFolderId(name: string, taken: Set<string>): string {
  const base = slugify(name) || FALLBACK_FOLDER_ID
  let id = base
  for (let suffix = 2; taken.has(id); suffix += 1) id = `${base}-${suffix}`
  return id
}

function withFolderIds(
  library: Library,
  bookIds: BookId[],
  change: (folderIds: string[]) => string[],
): Library {
  const changed = bookIds.map((bookId) => {
    const entry = library[bookId]
    return [bookId, { ...entry, folderIds: change(entry.folderIds) }]
  })
  return { ...library, ...Object.fromEntries(changed) }
}

export const createLibrarySlice: SliceCreator<LibraryActions> = (_set, get) => {
  function findFolder(id: string) {
    return get().folders.find((folder) => folder.id === id)
  }

  /** The books a folder change can touch: in the library and not repeated. */
  function entriesOf(bookIds: BookId[]): LibraryEntry[] {
    return [...new Set(bookIds)].flatMap((bookId) => selectEntry(bookId)(get()) ?? [])
  }

  return {
    finishBook: (bookId, { startedAt, finishedAt, rating }) => {
      if (!get().getBook(bookId)) return
      const current = selectEntry(bookId)(get())
      const base: Omit<LibraryEntry, 'status'> = current ?? {
        bookId,
        folderIds: [],
        addedAt: today(),
      }
      const { rating: _rating, ...kept } = base
      const entry: LibraryEntry = { ...kept, status: 'read', startedAt, finishedAt }
      if (rating !== undefined) entry.rating = rating

      let label = `Agregado a Mis libros como «${STATUS_LABELS.read}»`
      if (current) label = `Estado cambiado a «${STATUS_LABELS.read}»`
      if (current?.status === 'read') label = 'Lectura actualizada'
      get().commit(label, ({ library }) => ({ library: { ...library, [bookId]: entry } }))
    },

    setStartDate: (bookId, startedAt) => {
      const current = selectEntry(bookId)(get())
      if (current?.status !== 'reading' || current.startedAt === startedAt) return
      get().commit('Lectura actualizada', ({ library }) => ({
        library: { ...library, [bookId]: { ...current, startedAt } },
      }))
    },

    removeFromLibrary: (bookIds) => {
      const removed = new Set(entriesOf(bookIds).map(({ bookId }) => bookId))
      if (removed.size === 0) return
      get().commit('Quitado de tu biblioteca', ({ library }) => ({
        library: Object.fromEntries(
          Object.entries(library).filter(([bookId]) => !removed.has(bookId)),
        ),
      }))
    },

    createFolder: (name) => {
      const trimmed = name.trim()
      const id = uniqueFolderId(trimmed, new Set(get().folders.map((folder) => folder.id)))
      get().commit(`Carpeta «${trimmed}» creada`, ({ folders }) => ({
        folders: [...folders, { id, name: trimmed, createdAt: today() }],
      }))
      return id
    },

    renameFolder: (id, name) => {
      const folder = findFolder(id)
      const trimmed = name.trim()
      if (!folder || folder.pinned || !trimmed || trimmed === folder.name) return
      get().commit(`Carpeta renombrada a «${trimmed}»`, ({ folders }) => ({
        folders: folders.map((item) => (item.id === id ? { ...item, name: trimmed } : item)),
      }))
    },

    deleteFolder: (id) => {
      const folder = findFolder(id)
      if (!folder || folder.pinned) return
      const bookIds = Object.values(get().library)
        .filter(({ folderIds }) => folderIds.includes(id))
        .map(({ bookId }) => bookId)
      get().commit(`Carpeta «${folder.name}» eliminada`, ({ library, folders }) => ({
        library: withFolderIds(library, bookIds, (folderIds) =>
          folderIds.filter((folderId) => folderId !== id),
        ),
        folders: folders.filter((item) => item.id !== id),
      }))
    },

    addToFolder: (bookIds, folderId) => {
      const folder = findFolder(folderId)
      if (!folder) return
      const added = entriesOf(bookIds)
        .filter(({ folderIds }) => !folderIds.includes(folderId))
        .map(({ bookId }) => bookId)
      if (added.length === 0) return
      get().commit(`Agregado a «${folder.name}»`, ({ library }) => ({
        library: withFolderIds(library, added, (folderIds) => [...folderIds, folderId]),
      }))
    },

    removeFromFolder: (bookIds, folderId) => {
      const folder = findFolder(folderId)
      if (!folder) return
      const removed = entriesOf(bookIds)
        .filter(({ folderIds }) => folderIds.includes(folderId))
        .map(({ bookId }) => bookId)
      if (removed.length === 0) return
      get().commit(`Quitado de «${folder.name}»`, ({ library }) => ({
        library: withFolderIds(library, removed, (folderIds) =>
          folderIds.filter((id) => id !== folderId),
        ),
      }))
    },

    answerWantPrompt: (bookId, keep) => {
      if (keep) {
        const current = get().library[bookId]
        if (!current) return
        _set({
          library: { ...get().library, [bookId]: { ...current, wantCheckedAt: today() } },
          lastWantPromptOn: today(),
        })
        get().showToast('Sigue en tu lista')
        return
      }
      get().commit('Quitado de tu lista', ({ library }) => {
        const rest = { ...library }
        delete rest[bookId]
        return { library: rest }
      })
      _set({ lastWantPromptOn: today() })
    },
  }
}
