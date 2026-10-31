import { useMemo } from 'react'
import { useCatalog } from '../../lib/catalog'
import { useStore } from '../../store'
import type { Book, User } from '../../types'
import { useBookLookup } from '../library/filters'
import { groupByAuthor, type AuthorGroup } from './results'

const MAX_LIBRARY_AUTHORS = 8
const MAX_FRIENDS_BOOKS = 8

export interface FriendsBook {
  book: Book
  /** The friend who read it last. */
  friend: User
}

/**
 * The authors of the library, to recognise a name instead of recalling how it is spelled. Tapping
 * one lists the catalog, so that is what the card counts, and it stays blank without the catalog.
 */
export function useLibraryAuthors(): AuthorGroup[] {
  const library = useStore((state) => state.library)
  const bookOf = useBookLookup()
  const { status, books } = useCatalog()
  const inCatalog = useMemo(
    () => new Map(groupByAuthor(books).map(({ name, count }) => [name, count])),
    [books],
  )
  return useMemo(
    () =>
      groupByAuthor(Object.keys(library).flatMap((id) => bookOf(id) ?? []))
        .slice(0, MAX_LIBRARY_AUTHORS)
        .map((author) => ({
          ...author,
          count: status === 'ready' ? (inCatalog.get(author.name) ?? 0) : undefined,
        })),
    [library, bookOf, status, inCatalog],
  )
}

/** What friends started or finished, newest first. "Quiere leer" is not something they read. */
export function useFriendsBooks(): FriendsBook[] {
  const activities = useStore((state) => state.activities)
  const friendships = useStore((state) => state.friendships)
  const users = useStore((state) => state.users)
  const bookOf = useBookLookup()
  return useMemo(() => {
    const friends = new Set(
      friendships.filter(({ status }) => status === 'friends').map(({ userId }) => userId),
    )
    const read = activities.filter(({ userId, kind }) => friends.has(userId) && kind !== 'want')
    const seen = new Set<string>()
    return read
      .flatMap(({ bookId, userId }) => {
        const book = bookOf(bookId)
        const friend = users.find(({ id }) => id === userId)
        if (!book || !friend || seen.has(bookId)) return []
        seen.add(bookId)
        return [{ book, friend }]
      })
      .slice(0, MAX_FRIENDS_BOOKS)
  }, [activities, friendships, users, bookOf])
}
