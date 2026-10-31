import { differenceInCalendarDays } from 'date-fns'
import { parseDate, today } from '../../lib/dates'
import type { Activity, Book, BookId, Friendship, ISODate, User } from '../../types'

export interface FeedItem {
  activity: Activity
  user: User
  book: Book
}

export type FeedPeriod = 'today' | 'week' | 'earlier'

export interface FeedGroup {
  period: FeedPeriod
  label: string
  items: FeedItem[]
}

const PERIODS: readonly { period: FeedPeriod; label: string }[] = [
  { period: 'today', label: 'Hoy' },
  { period: 'week', label: 'Esta semana' },
  { period: 'earlier', label: 'Antes' },
]

/** Counted back from today and not by calendar week, so a Monday does not leave it almost empty. */
const DAYS_IN_WEEK_GROUP = 7

export const ACTIVITY_VERBS: Record<Activity['kind'], string> = {
  started: 'empezó',
  finished: 'terminó',
  want: 'quiere leer',
}

export const firstName = (name: string) => name.split(' ')[0]

export function daysSince(date: ISODate): number {
  return differenceInCalendarDays(parseDate(today()), parseDate(date))
}

/** "Hoy", "Ayer" or "Hace 3 días". */
export function timeAgo(date: ISODate): string {
  const days = daysSince(date)
  if (days <= 0) return 'Hoy'
  if (days === 1) return 'Ayer'
  return `Hace ${days} días`
}

/** The activity as one sentence, for a control that needs to say which one it acts on. */
export function activitySentence({ activity, user, book }: FeedItem): string {
  return `${firstName(user.name)} ${ACTIVITY_VERBS[activity.kind]} ${book.title}`
}

/** What goes under a book in "Leyendo ahora". */
export function readingTime(startedAt: ISODate | undefined): string {
  if (!startedAt) return 'Sin fecha de inicio'
  const days = daysSince(startedAt)
  if (days <= 0) return 'Empezaste hoy'
  return days === 1 ? 'Llevas 1 día' : `Llevas ${days} días`
}

/** What the person's current friends did, newest first. */
export function buildFeed(
  activities: Activity[],
  friendships: Friendship[],
  users: User[],
  bookOf: (id: BookId) => Book | undefined,
): FeedItem[] {
  const friends = new Set(
    friendships.filter(({ status }) => status === 'friends').map(({ userId }) => userId),
  )
  return activities
    .flatMap((activity) => {
      const user = users.find(({ id }) => id === activity.userId)
      const book = bookOf(activity.bookId)
      return user && book && friends.has(user.id) ? [{ activity, user, book }] : []
    })
    .toSorted((a, b) => b.activity.date.localeCompare(a.activity.date))
}

function periodOf(date: ISODate): FeedPeriod {
  const days = daysSince(date)
  if (days <= 0) return 'today'
  return days < DAYS_IN_WEEK_GROUP ? 'week' : 'earlier'
}

/** Hoy, Esta semana and Antes, in that order and only those with something in them. */
export function groupByPeriod(items: FeedItem[]): FeedGroup[] {
  return PERIODS.flatMap(({ period, label }) => {
    const inPeriod = items.filter(({ activity }) => periodOf(activity.date) === period)
    return inPeriod.length > 0 ? [{ period, label, items: inPeriod }] : []
  })
}
