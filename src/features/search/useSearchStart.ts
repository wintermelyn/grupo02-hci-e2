import { useMemo } from 'react'
import { useStore } from '../../store'
import type { Book } from '../../types'
import { useBookLookup } from '../library/filters'
import { groupByAuthor, MAX_AUTHORS, type AuthorGroup } from './results'

const MAX_FRIENDS_BOOKS = 6

/** The authors of the library, to recognise a name instead of recalling how it is spelled. */
export function useLibraryAuthors(): AuthorGroup[] {
  const library = useStore((state) => state.library)
  const bookOf = useBookLookup()
  return useMemo(
    () =>
      groupByAuthor(Object.keys(library).flatMap((id) => bookOf(id) ?? [])).slice(0, MAX_AUTHORS),
    [library, bookOf],
  )
}

/** What friends started or finished, newest first. "Quiere leer" is not something they read. */
export function useFriendsBooks(): Book[] {
  const activities = useStore((state) => state.activities)
  const friendships = useStore((state) => state.friendships)
  const bookOf = useBookLookup()
  return useMemo(() => {
    const friends = new Set(
      friendships.filter(({ status }) => status === 'friends').map(({ userId }) => userId),
    )
    const read = activities.filter(({ userId, kind }) => friends.has(userId) && kind !== 'want')
    return [...new Set(read.map(({ bookId }) => bookId))]
      .flatMap((id) => bookOf(id) ?? [])
      .slice(0, MAX_FRIENDS_BOOKS)
  }, [activities, friendships, bookOf])
}
