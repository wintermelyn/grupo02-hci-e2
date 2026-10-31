import { useMemo } from 'react'
import { useStore } from '../../store'
import type { Book, LibraryEntry } from '../../types'
import { useBookLookup } from '../library/filters'
import { buildFeed, type FeedItem } from './feed'

export interface ReadingBook {
  book: Book
  entry: LibraryEntry
}

/** What the person is reading, the most recently started first. */
export function useReadingNow(): ReadingBook[] {
  const library = useStore((state) => state.library)
  const bookOf = useBookLookup()
  return useMemo(
    () =>
      Object.values(library)
        .filter(({ status }) => status === 'reading')
        .flatMap((entry) => {
          const book = bookOf(entry.bookId)
          return book ? [{ book, entry }] : []
        })
        .toSorted((a, b) => (b.entry.startedAt ?? '').localeCompare(a.entry.startedAt ?? '')),
    [library, bookOf],
  )
}

export function useFeed(): FeedItem[] {
  const activities = useStore((state) => state.activities)
  const friendships = useStore((state) => state.friendships)
  const users = useStore((state) => state.users)
  const bookOf = useBookLookup()
  return useMemo(
    () => buildFeed(activities, friendships, users, bookOf),
    [activities, friendships, users, bookOf],
  )
}
