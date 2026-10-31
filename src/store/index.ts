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
const BASE_VERSION = 2
const STORAGE_VERSION = BASE_VERSION + LIBRARY_SEED_VERSION + SOCIAL_SEED_VERSION

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
      migrate: () => toPersisted(buildInitialState()),
    },
  ),
)
