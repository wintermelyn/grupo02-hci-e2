import type { Folder } from '../types'

/**
 * Where a book goes out of when it leaves the collection, e.g. "Mis libros y de Terror". The same
 * words before answering and in the toast after, so what the person read is what happened.
 */
export function placesLeft(folderIds: string[], folders: Folder[]): string {
  const left = folders.filter(({ id }) => folderIds.includes(id))
  if (left.length === 0) return 'Mis libros'
  if (left.length === 1) return `Mis libros y de ${left[0].name}`
  return `Mis libros y de sus ${left.length} carpetas`
}
