import { beforeEach, describe, expect, it, vi } from 'vitest'
import { buildInitialFolders, buildInitialLibrary } from '../data/seedLibrary'
import { buildInitialActivities, buildInitialFriendships, me, users } from '../data/seedSocial'
import { daysAgo, today } from '../lib/dates'
import { state } from '../test/store'
import type { Book, Friendship, LibraryEntry, ReadingStatus } from '../types'
import { TOAST_DURATION_MS } from './coreSlice'
import { selectBook, selectEntry, useStore } from '.'

// What the store should hold after a reset. Built at the same (fake) time as the store's copy.
function buildSeed() {
  return {
    library: buildInitialLibrary(),
    folders: buildInitialFolders(),
    friendships: buildInitialFriendships(),
  }
}

const STORAGE_KEY = 'gr-e2'
const PERSISTED_KEYS = ['extraBooks', 'folders', 'friendships', 'library', 'likedActivityIds']
const unknownBook: Book = { id: 'OL0000001W', title: 'Libro nuevo', authors: ['Autora'] }
const pendingRequest: Friendship = {
  userId: 'camila',
  status: 'pending',
  since: '2026-10-27T12:00:00.000Z',
}

function seedEntry(status: ReadingStatus): LibraryEntry {
  const entry = Object.values(state().library).find((candidate) => candidate.status === status)
  if (!entry) throw new Error(`the seed needs a book in "${status}"`)
  return entry
}

beforeEach(() => {
  vi.useFakeTimers()
})

describe('getBook, upsertBook, selectBook and selectEntry', () => {
  it('adds API books to extraBooks', () => {
    state().upsertBook(unknownBook)
    expect(state().extraBooks[unknownBook.id]).toEqual(unknownBook)
    expect(state().getBook(unknownBook.id)).toEqual(unknownBook)
  })

  it('never overwrites a seed book', () => {
    const seedBook = state().getBook(seedEntry('want').bookId)
    if (!seedBook) throw new Error('library entries must point to catalog books')
    state().upsertBook({ ...seedBook, title: 'Otro título', authors: [] })
    expect(state().getBook(seedBook.id)).toBe(seedBook)
    expect(state().extraBooks).toEqual({})
  })

  it('selectBook sees a book added later with upsertBook', () => {
    expect(selectBook(unknownBook.id)(state())).toBeUndefined()
    state().upsertBook(unknownBook)
    expect(selectBook(unknownBook.id)(state())).toEqual(unknownBook)
  })

  it('ignores inherited object keys', () => {
    expect(state().getBook('constructor')).toBeUndefined()
    expect(selectBook('constructor')(state())).toBeUndefined()
    expect(selectEntry('constructor')(state())).toBeUndefined()
  })

  it('selectEntry returns the library entry, or undefined outside the library', () => {
    const want = seedEntry('want')
    expect(selectEntry(want.bookId)(state())).toBe(want)
    expect(selectEntry(unknownBook.id)(state())).toBeUndefined()
  })
})

describe('setStatus', () => {
  beforeEach(() => {
    state().upsertBook(unknownBook)
  })

  it('adds a missing book as Quiero, without startedAt', () => {
    state().setStatus(unknownBook.id, 'want')
    expect(state().library[unknownBook.id]).toEqual({
      bookId: unknownBook.id,
      status: 'want',
      owned: false,
      folderIds: [],
      addedAt: today(),
    })
    expect(state().library[unknownBook.id].startedAt).toBeUndefined()
  })

  it('adds a missing book as Leyendo, started today', () => {
    state().setStatus(unknownBook.id, 'reading')
    expect(state().library[unknownBook.id]).toMatchObject({
      status: 'reading',
      addedAt: today(),
      startedAt: today(),
    })
  })

  it('sets startedAt when a Quiero book moves to Leyendo', () => {
    const want = seedEntry('want')
    expect(want.startedAt).toBeUndefined()
    state().setStatus(want.bookId, 'reading')
    expect(state().library[want.bookId]).toEqual({ ...want, status: 'reading', startedAt: today() })
  })

  it('keeps an existing startedAt', () => {
    const reading = seedEntry('reading')
    state().setStatus(reading.bookId, 'want')
    expect(state().library[reading.bookId].startedAt).toBe(reading.startedAt)
    state().setStatus(reading.bookId, 'reading')
    expect(state().library[reading.bookId].startedAt).toBe(reading.startedAt)
  })

  it('drops finishedAt and rating when a book leaves Leído, and undo brings them back', () => {
    const read = seedEntry('read')
    expect(read.finishedAt).toBeDefined()
    state().setStatus(read.bookId, 'want')
    const entry = state().library[read.bookId]
    expect(entry).toMatchObject({ status: 'want', startedAt: read.startedAt })
    expect(entry).not.toHaveProperty('finishedAt')
    expect(entry).not.toHaveProperty('rating')
    state().undo()
    expect(state().library[read.bookId]).toBe(read)
  })

  it('starts a re-read today when a Leído book moves to Leyendo', () => {
    const read = seedEntry('read')
    expect(read.startedAt).not.toBe(today())
    state().setStatus(read.bookId, 'reading')
    const entry = state().library[read.bookId]
    expect(entry).toMatchObject({ status: 'reading', startedAt: today() })
    expect(entry).not.toHaveProperty('finishedAt')
    expect(entry).not.toHaveProperty('rating')
  })

  it('ignores a book that getBook does not know', () => {
    const library = state().library
    state().setStatus('OL0000002W', 'want')
    expect(state().library).toBe(library)
    expect(state().toast).toBeNull()
  })

  it('rejects Leído, both in the type and at runtime', () => {
    const library = state().library
    const reading = seedEntry('reading')
    // @ts-expect-error only finishBook may set 'read'
    state().setStatus(reading.bookId, 'read')
    // @ts-expect-error only finishBook may set 'read'
    state().setStatus(unknownBook.id, 'read')
    expect(state().library).toBe(library)
    expect(state().toast).toBeNull()
  })

  it('does nothing when the status does not change', () => {
    const want = seedEntry('want')
    const library = state().library
    state().setStatus(want.bookId, 'want')
    expect(state().library).toBe(library)
    expect(state().toast).toBeNull()
  })

  it('is undoable', () => {
    const library = state().library
    state().setStatus(seedEntry('want').bookId, 'reading')
    expect(state().toast).toMatchObject({ undoable: true })
    state().undo()
    expect(state().library).toBe(library)
  })
})

describe('commit and undo', () => {
  const addFolder = () =>
    state().commit('Carpeta creada', ({ folders }) => ({
      folders: [...folders, { id: 'nueva', name: 'Nueva', createdAt: today() }],
    }))

  it('snapshots only library and folders, as they were before the change', () => {
    const { library, folders } = state()
    addFolder()
    expect(state().undoSnapshot).toStrictEqual({ library, folders })
    expect(state().undoSnapshot?.folders).toBe(folders)
    expect(state().toast).toMatchObject({ message: 'Carpeta creada', undoable: true })
  })

  it('passes the current library and folders to the mutator', () => {
    const mutator = vi.fn(() => ({}))
    state().commit('Sin cambios', mutator)
    expect(mutator).toHaveBeenCalledWith({ library: state().library, folders: state().folders })
  })

  it('restores library and folders without touching friendships', () => {
    const { library, folders } = state()
    state().commit('Libros quitados', () => ({ library: {}, folders: [] }))
    const friendships = [...state().friendships, pendingRequest]
    useStore.setState({ friendships })

    state().undo()
    expect(state().library).toBe(library)
    expect(state().folders).toBe(folders)
    expect(state().friendships).toBe(friendships)
    expect(state().undoSnapshot).toBeNull()
    expect(state().toast).toMatchObject({ message: 'Cambio deshecho', undoable: false })
  })

  it('does nothing without a snapshot', () => {
    const { library, folders } = state()
    state().undo()
    expect(state().library).toBe(library)
    expect(state().folders).toBe(folders)
    expect(state().toast).toBeNull()
  })
})

describe('toast', () => {
  beforeEach(() => {
    state().upsertBook(unknownBook)
  })

  it('dismissToast hides the toast and drops the undo copy', () => {
    state().setStatus(unknownBook.id, 'want')
    state().dismissToast()
    expect(state().toast).toBeNull()
    expect(state().undoSnapshot).toBeNull()
    state().undo()
    expect(state().library[unknownBook.id]).toBeDefined()
  })

  it('dismisses itself, with the undo copy, after TOAST_DURATION_MS', () => {
    state().setStatus(unknownBook.id, 'want')
    vi.advanceTimersByTime(TOAST_DURATION_MS - 1)
    expect(state().undoSnapshot).not.toBeNull()
    vi.advanceTimersByTime(1)
    expect(state().toast).toBeNull()
    expect(state().undoSnapshot).toBeNull()
  })

  it('a plain toast replaces an undoable one and drops its undo copy', () => {
    state().setStatus(unknownBook.id, 'want')
    state().showToast('Código copiado')
    expect(state().toast).toMatchObject({ message: 'Código copiado', undoable: false })
    expect(state().undoSnapshot).toBeNull()
  })

  it('pauseToast keeps the toast and its undo copy until resumeToast restarts the timer', () => {
    state().setStatus(unknownBook.id, 'want')
    state().pauseToast()
    vi.advanceTimersByTime(TOAST_DURATION_MS * 2)
    expect(state().undoSnapshot).not.toBeNull()
    state().resumeToast()
    vi.advanceTimersByTime(TOAST_DURATION_MS - 1)
    expect(state().toast).not.toBeNull()
    vi.advanceTimersByTime(1)
    expect(state().toast).toBeNull()
    expect(state().undoSnapshot).toBeNull()
  })

  it('gives every toast a new id', () => {
    state().showToast('Uno')
    const first = state().toast?.id
    state().showToast('Uno')
    expect(state().toast?.id).not.toBe(first)
  })
})

describe('persistence', () => {
  const stored = () => JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')

  it(`stores only ${PERSISTED_KEYS.join(', ')} under ${STORAGE_KEY}`, () => {
    state().upsertBook(unknownBook)
    state().setStatus(unknownBook.id, 'want')
    expect(Object.keys(stored().state).sort()).toEqual(PERSISTED_KEYS)
    expect(stored().version).toBe(useStore.persist.getOptions().version)
  })

  async function rehydrateFrom(version: number) {
    // setState also writes to storage, so the stored value is set afterwards.
    useStore.setState({ library: {}, folders: [] })
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ state: { library: {} }, version }))
    await useStore.persist.rehydrate()
  }

  it('keeps stored data from the current version', async () => {
    await rehydrateFrom(useStore.persist.getOptions().version ?? 0)
    expect(state().library).toEqual({})
  })

  it('replaces stored data from an older version with the seed', async () => {
    await rehydrateFrom(0)
    const seed = buildSeed()
    expect(state().library).toEqual(seed.library)
    expect(state().folders).toEqual(seed.folders)
  })

  it('resetDemo restores the initial state and clears storage', () => {
    state().upsertBook(unknownBook)
    state().setStatus(unknownBook.id, 'reading')
    useStore.setState({
      folders: [],
      friendships: [pendingRequest],
      activities: [],
      likedActivityIds: ['act-1'],
    })

    state().resetDemo()
    expect(state()).toMatchObject({
      ...buildSeed(),
      me,
      users,
      activities: buildInitialActivities(),
      extraBooks: {},
      likedActivityIds: [],
      toast: null,
      undoSnapshot: null,
    })
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('resetDemo builds new seed objects, so nothing kept from before can change them', () => {
    const { library, folders, friendships, activities } = state()
    state().resetDemo()
    expect(state().library).not.toBe(library)
    expect(state().library).toEqual(library)
    expect(state().folders).not.toBe(folders)
    expect(state().folders[0]).not.toBe(folders[0])
    expect(state().friendships).not.toBe(friendships)
    expect(state().activities).not.toBe(activities)
  })

  it('resetDemo dates the seed from the current day', () => {
    state().resetDemo()
    const startedBefore = state().library['OL1811898W']?.startedAt
    vi.setSystemTime(Date.now() + 24 * 60 * 60 * 1000)
    state().resetDemo()
    expect(state().library['OL1811898W']?.startedAt).not.toBe(startedBefore)
    expect(state().library['OL1811898W']?.startedAt).toBe(daysAgo(12))
  })
})
