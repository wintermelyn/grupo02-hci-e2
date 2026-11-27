import type { Folder, LibraryEntry } from '../types'

const LIST = new Intl.ListFormat('es-CL', { style: 'long', type: 'conjunction' })

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

/**
 * Says what leaving costs for a book, before it is confirmed. The book goes out of its folders and
 * they stay, in the same words as the D5 prompt, and only what is really gone is called a loss.
 */
export function whatIsLost(entry: LibraryEntry, allFolders: Folder[]): string {
  const { folderIds, startedAt, finishedAt, rating, currentPage } = entry
  const folders = foldersLeft(folderIds, allFolders)
  const lost = [
    (startedAt || finishedAt) && 'las fechas',
    currentPage !== undefined && 'la página en la que vas',
    rating !== undefined && 'el puntaje',
  ].filter((item): item is string => Boolean(item))
  const data = lost.length > 0 ? LIST.format(lost) : undefined
  if (folders && data) return `También sale de ${folders} y pierdes ${data}.`
  if (folders) return `También sale de ${folders}.`
  if (data) return `Pierdes ${data}.`
  return 'No tiene carpetas, fechas ni puntaje que perder.'
}
