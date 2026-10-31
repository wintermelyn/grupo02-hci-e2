import { useDescription, type BookText } from '../../lib/catalog'
import { useStore } from '../../store'
import type { Book } from '../../types'

export interface BookDescription extends BookText {
  loading: boolean
  failed: boolean
  retry: () => void
}

/**
 * The 54 books of books.json carry their text. The rest of the catalog keeps it in files apart, which
 * are downloaded here and stay in memory, so nothing of it ends up in the person's storage.
 */
export function useBookDescription(book: Book): BookDescription {
  const carried = useStore((state) => Object.hasOwn(state.seedBooks, book.id))
  const { status, text, retry } = useDescription(carried ? undefined : book.id)
  return {
    ...(carried ? book : text),
    loading: status === 'loading',
    failed: status === 'failed',
    retry,
  }
}
