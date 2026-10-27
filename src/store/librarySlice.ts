import type { BookId, ISODate } from '../types'
import type { SliceCreator } from '.'

export interface FinishDetails {
  startedAt: ISODate
  finishedAt: ISODate
  rating?: number
}

export interface LibraryActions {
  /**
   * The only way to set a book to 'read'. If the book is not in the library (e.g. Leído chosen on a
   * search result), creates the entry (owned: false, folderIds: [], addedAt: today()) first.
   */
  finishBook: (bookId: BookId, details: FinishDetails) => void
  toggleOwned: (bookId: BookId) => void
  removeFromLibrary: (bookIds: BookId[]) => void
  /** Returns the new folder id. */
  createFolder: (name: string) => string
  renameFolder: (id: string, name: string) => void
  /** Pinned folders cannot be deleted. */
  deleteFolder: (id: string) => void
  addToFolder: (bookIds: BookId[], folderId: string) => void
  removeFromFolder: (bookIds: BookId[], folderId: string) => void
  moveToFolder: (bookIds: BookId[], fromId: string, toId: string) => void
}

// Stubs from the base block with their final signatures. Role A implements them, each change
// to library or folders going through get().commit(label, mutator).
export const createLibrarySlice: SliceCreator<LibraryActions> = () => ({
  finishBook: () => {},
  toggleOwned: () => {},
  removeFromLibrary: () => {},
  createFolder: () => '',
  renameFolder: () => {},
  deleteFolder: () => {},
  addToFolder: () => {},
  removeFromFolder: () => {},
  moveToFolder: () => {},
})
