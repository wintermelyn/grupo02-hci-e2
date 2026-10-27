import type { BookId } from '../types'

export function bookPath(bookId: BookId): string {
  return `/libro/${encodeURIComponent(bookId)}`
}

/** Opens the "Terminé este libro" panel on the book page (role A reads ?accion=terminar). */
export function finishBookPath(bookId: BookId): string {
  return `${bookPath(bookId)}?accion=terminar`
}
