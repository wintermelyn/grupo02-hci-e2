import type { Folder } from '../types'

/** The folders a book leaves with, e.g. "Terror" or "sus 2 carpetas". Undefined if it is in none. */
export function foldersLeft(folderIds: string[], folders: Folder[]): string | undefined {
  const left = folders.filter(({ id }) => folderIds.includes(id))
  if (left.length === 0) return undefined
  return left.length === 1 ? left[0].name : `sus ${left.length} carpetas`
}

/**
 * Where a book goes out of when it leaves the collection, e.g. "Mis libros y de Terror". The same
 * words before answering and in the toast after, so what the person read is what happened.
 */
export function placesLeft(folderIds: string[], folders: Folder[]): string {
  const left = foldersLeft(folderIds, folders)
  return left ? `Mis libros y de ${left}` : 'Mis libros'
}
