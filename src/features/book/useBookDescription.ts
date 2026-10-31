import { useEffect, useState } from 'react'
import { fetchDescription, isWorkId } from '../../lib/openlibrary'
import { useStore } from '../../store'
import type { Book, BookId } from '../../types'

/**
 * A book found in a live search comes without its description, because only the work has it. The
 * first visit asks for it and keeps the text, and nothing else: the year and the cover stay the ones
 * of the search. An empty text means Open Library has none, so it is not asked again; a failure
 * keeps nothing, so the next visit asks. Says whether the answer is on its way.
 */
export function useBookDescription(book: Book): boolean {
  const upsertBook = useStore((state) => state.upsertBook)
  const isLive = useStore((state) => Object.hasOwn(state.extraBooks, book.id))
  const [failedId, setFailedId] = useState<BookId>()
  const missing = isLive && book.description === undefined && isWorkId(book.id)

  useEffect(() => {
    if (!missing) return
    // After leaving this book, a late answer must not land on the next one.
    let abandoned = false
    fetchDescription(book.id).then(
      (description) => {
        if (!abandoned) upsertBook({ ...book, description: description ?? '' })
      },
      () => {
        if (!abandoned) setFailedId(book.id)
      },
    )
    return () => {
      abandoned = true
    }
  }, [book, missing, upsertBook])

  return missing && failedId !== book.id
}
