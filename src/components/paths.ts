import type { BookId } from '../types'

export function bookPath(bookId: BookId): string {
  return `/libro/${encodeURIComponent(bookId)}`
}

export function folderPath(folderId: string): string {
  return `/biblioteca/carpeta/${encodeURIComponent(folderId)}`
}
