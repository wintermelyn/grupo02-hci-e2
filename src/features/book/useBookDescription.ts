import { useEffect, useState } from 'react'
import { fetchDescription, isWorkId } from '../../lib/openlibrary'
import { useStore } from '../../store'
import type { Book, BookId } from '../../types'

export interface BookDescription {
  /** The answer of Open Library is on its way. */
  searching: boolean
  /** The book came from Open Library, so its text comes as it is there, untranslated. */
  live: boolean
}

/**
 * A book found in a live search comes without its description, because only the work has it. The
 * first visit asks for it and keeps the text, and nothing else: the year and the cover stay the ones
 * of the search. A book opened from a link already brought it with the work, so only what is missing
 * is asked for, wherever the book came from. An empty text means Open Library has none, so it is not
 * asked again; a failure keeps nothing, so the next visit asks.
 */
export function useBookDescription(book: Book): BookDescription {
  const upsertBook = useStore((state) => state.upsertBook)
  const live = useStore((state) => Object.hasOwn(state.extraBooks, book.id))
  const [failedId, setFailedId] = useState<BookId>()
  const missing = live && book.description === undefined && isWorkId(book.id)

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

  return { searching: missing && failedId !== book.id, live }
}
