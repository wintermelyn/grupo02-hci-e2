import { create, type StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import books from '../data/books.json'
import { buildInitialFolders, buildInitialLibrary, LIBRARY_SEED_VERSION } from '../data/seedLibrary'
import {
  buildInitialActivities,
  buildInitialFriendships,
  me,
  SOCIAL_SEED_VERSION,
  users,
} from '../data/seedSocial'
import type { AppState, Book } from '../types'
import { createCoreSlice, type CoreActions } from './coreSlice'
import { createLibrarySlice, type LibraryActions } from './librarySlice'
import { createSocialSlice, type SocialActions } from './socialSlice'

export { selectBook, selectEntry } from './coreSlice'

export type StoreState = AppState &
  CoreActions &
  LibraryActions &
  SocialActions & {
    /** Clears localStorage and goes back to the initial state. */
    resetDemo: () => void
  }

export type SliceCreator<Slice> = StateCreator<
  StoreState,
  [['zustand/persist', unknown]],
  [],
  Slice
>

type PersistedState = Pick<
  AppState,
  'library' | 'folders' | 'friendships' | 'likedActivityIds' | 'extraBooks' | 'lastWantPromptOn'
>

// Stored data from an older version is replaced by the seed. Each owner bumps only their own part
// (base: the shared types; A and B: the constant in their seed file), so the sum always goes up
// and nobody has to edit this file.
const BASE_VERSION = 3
const STORAGE_VERSION = BASE_VERSION + LIBRARY_SEED_VERSION + SOCIAL_SEED_VERSION
/** The last version with a live search: its books came from outside, but the data is still good. */
const LIVE_SEARCH_VERSION = 8

const seedBooks: Book[] = books

/** Every call builds the seed again, so Reiniciar demo gets today's dates and new objects. */
function buildInitialState(): AppState {
  return {
    me,
    seedBooks: Object.fromEntries(seedBooks.map((book) => [book.id, book])),
    extraBooks: {},
    library: buildInitialLibrary(),
    folders: buildInitialFolders(),
    users,
    friendships: buildInitialFriendships(),
    activities: buildInitialActivities(),
    likedActivityIds: [],
    // Explicit: resetDemo uses set, which merges, so a missing key would survive the reset.
    lastWantPromptOn: undefined,
    toast: null,
    undoSnapshot: null,
  }
}

/**
 * Keeps the person's data and only cleans the books the live search left. A book outside the library
 * was only looked at, and goes. One in the library stays, without its text, which came in another
 * language, and with the cover of the app: the initials stand in if the catalog does not have it.
 */
function dropLiveSearch(state: PersistedState): PersistedState {
  const books = Object.values(state.extraBooks)
    .filter(({ id }) => Object.hasOwn(state.library, id))
    .map(({ id, title, authors, year, pages }) => ({
      id,
      title,
      authors,
      year,
      pages,
      coverUrl: `/covers/${id}.jpg`,
    }))
  return { ...state, extraBooks: Object.fromEntries(books.map((book) => [book.id, book])) }
}

function toPersisted(state: AppState): PersistedState {
  const { library, folders, friendships, likedActivityIds, extraBooks, lastWantPromptOn } = state
  return { library, folders, friendships, likedActivityIds, extraBooks, lastWantPromptOn }
}

export const useStore = create<StoreState>()(
  persist<StoreState, [], [], PersistedState>(
    (set, get, api) => ({
      ...buildInitialState(),
      ...createCoreSlice(set, get, api),
      ...createLibrarySlice(set, get, api),
      ...createSocialSlice(set, get, api),
      resetDemo: () => {
        set(buildInitialState())
        api.persist.clearStorage()
      },
    }),
    {
      name: 'gr-e2',
      version: STORAGE_VERSION,
      partialize: toPersisted,
      migrate: (stored, version) =>
        version === LIVE_SEARCH_VERSION
          ? dropLiveSearch(stored as PersistedState)
          : toPersisted(buildInitialState()),
    },
  ),
)
