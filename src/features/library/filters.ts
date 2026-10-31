import { useMemo } from 'react'
import type { TagFilterValue } from '../../components'
import { STATUS_ORDER } from '../../lib/status'
import { useStore } from '../../store'
import type { Book, BookId, Folder, LibraryEntry } from '../../types'

export const TAG_PARAM = 'tag'

export function parseTag(value: string | null): TagFilterValue {
  return STATUS_ORDER.find((status) => status === value) ?? 'all'
}

export function compareTitles(a: Book, b: Book): number {
  return a.title.localeCompare(b.title, 'es-CL')
}

export function booksLabel(count: number): string {
  return count === 1 ? '1 libro' : `${count} libros`
}

export function pinnedFirst(folders: Folder[]): Folder[] {
  return [...folders].sort((a, b) => Number(b.pinned ?? false) - Number(a.pinned ?? false))
}

/** How many of these entries each button of TagFilter has. */
export function countByTag(entries: LibraryEntry[]): Record<TagFilterValue, number> {
  const counts: Record<TagFilterValue, number> = {
    all: entries.length,
    want: 0,
    owned: 0,
    reading: 0,
    read: 0,
  }
  for (const { status } of entries) counts[status] += 1
  return counts
}

/** Lower case and no accents, so "garcia" finds "García". */
export function normalizeText(text: string): string {
  return text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim()
}

/** By title or author. An empty query matches every book. */
export function matchesQuery({ title, authors }: Book, query: string): boolean {
  return normalizeText([title, ...authors].join(' ')).includes(normalizeText(query))
}

export const MAX_FOLDER_NAME_LENGTH = 40

/** Why a folder cannot take this name, in the person's words. */
export function folderNameProblem(
  folder: Folder,
  name: string,
  folders: Folder[],
): string | undefined {
  const wanted = normalizeText(name)
  if (!wanted) return 'Escribe un nombre para la carpeta.'
  const repeated = folders.some(
    ({ id, name: other }) => id !== folder.id && normalizeText(other) === wanted,
  )
  return repeated ? 'Ya tienes una carpeta con ese nombre.' : undefined
}

export function useBookLookup() {
  const seedBooks = useStore((state) => state.seedBooks)
  const extraBooks = useStore((state) => state.extraBooks)
  return useMemo(() => {
    const books = { ...seedBooks, ...extraBooks }
    return (bookId: BookId): Book | undefined => books[bookId]
  }, [seedBooks, extraBooks])
}
