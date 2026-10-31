import { subDays } from 'date-fns'
import { daysAgo } from '../lib/dates'
import type { Activity, Friendship, User } from '../types'
import userList from './users.json'

// users.json holds the whole directory. "camila" is the T3 person and "ctorres99" her homonym;
// docs/desarrollo/tareas.md lists the details. Me's readingIds/readIds stay empty: my books live in the library.
const ME_ID = 'me'

/**
 * Add 1 whenever this file or the shape of social data changes, so browsers with stored data
 * from the old seed start over. Part of the persist version in src/store/index.ts.
 */
export const SOCIAL_SEED_VERSION = 3

function findMe(list: User[]): User {
  const found = list.find((user) => user.id === ME_ID)
  if (!found) throw new Error(`users.json must include the user with id "${ME_ID}"`)
  return found
}

export const me: User = findMe(userList)

/** Everyone in the directory except me. */
export const users: User[] = userList.filter((user) => user.id !== ME_ID)

/** Friendship.since is a date-time, so it is built from Date rather than from lib/dates. */
function friendsSince(days: number): Friendship['since'] {
  return subDays(new Date(), days).toISOString()
}

/** Built on every reset so friendships always look recent. */
export function buildInitialFriendships(): Friendship[] {
  return [
    { userId: 'diego', status: 'friends', since: friendsSince(420) },
    { userId: 'valentina', status: 'friends', since: friendsSince(230) },
    { userId: 'tomas', status: 'friends', since: friendsSince(95) },
  ]
}

/** Built on every reset so the feed always looks recent. Newest first. */
export function buildInitialActivities(): Activity[] {
  return [
    { id: 'act-1', userId: 'valentina', bookId: 'OL20901051W', kind: 'started', date: daysAgo(0) },
    {
      id: 'act-2',
      userId: 'tomas',
      bookId: 'OL1811898W',
      kind: 'finished',
      date: daysAgo(1),
      rating: 5,
    },
    { id: 'act-3', userId: 'diego', bookId: 'OL893414W', kind: 'started', date: daysAgo(2) },
    {
      id: 'act-4',
      userId: 'diego',
      bookId: 'OL17267881W',
      kind: 'finished',
      date: daysAgo(3),
      rating: 4,
    },
    {
      id: 'act-5',
      userId: 'valentina',
      bookId: 'OL81633W',
      kind: 'finished',
      date: daysAgo(4),
      rating: 5,
    },
    { id: 'act-6', userId: 'tomas', bookId: 'OL698173W', kind: 'want', date: daysAgo(5) },
    { id: 'act-7', userId: 'tomas', bookId: 'OL17075811W', kind: 'started', date: daysAgo(6) },
    { id: 'act-8', userId: 'valentina', bookId: 'OL927199W', kind: 'want', date: daysAgo(8) },
    {
      id: 'act-9',
      userId: 'diego',
      bookId: 'OL2172356W',
      kind: 'finished',
      date: daysAgo(10),
      rating: 4,
    },
    {
      id: 'act-10',
      userId: 'valentina',
      bookId: 'OL17319533W',
      kind: 'finished',
      date: daysAgo(13),
      rating: 3,
    },
  ]
}
