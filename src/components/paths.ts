import type { BookId } from '../types'

export function bookPath(bookId: BookId): string {
  return `/libro/${encodeURIComponent(bookId)}`
}
