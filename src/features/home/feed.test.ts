import { describe, expect, it } from 'vitest'
import { daysAgo, today } from '../../lib/dates'
import { state } from '../../test/store'
import type { Activity, Book } from '../../types'
import {
  activitySentence,
  buildFeed,
  groupByPeriod,
  readingTime,
  timeAgo,
  type FeedItem,
} from './feed'

const book: Book = { id: 'OL1W', title: 'Un libro', authors: ['Una autora'] }
const bookOf = (id: string) => (id === book.id ? book : undefined)

function activity(id: string, date: string, overrides: Partial<Activity> = {}): Activity {
  return { id, userId: 'diego', bookId: book.id, kind: 'started', date, ...overrides }
}

function item(date: string): FeedItem {
  const [user] = state().users
  return { activity: activity(date, date), user, book }
}

describe('timeAgo', () => {
  it.each([
    [0, 'Hoy'],
    [1, 'Ayer'],
    [2, 'Hace 2 días'],
    [30, 'Hace 30 días'],
  ])('%i days ago reads "%s"', (days, expected) => {
    expect(timeAgo(daysAgo(days))).toBe(expected)
  })
})

describe('activitySentence', () => {
  it('reads as who did what with which book', () => {
    const user = state().users.find(({ id }) => id === 'diego')!
    const item = { activity: activity('a', daysAgo(0), { kind: 'want' }), user, book }
    expect(activitySentence(item)).toBe('Diego quiere leer Un libro')
  })
})

describe('readingTime', () => {
  it.each([
    [0, 'Empezaste hoy'],
    [1, 'Llevas 1 día'],
    [12, 'Llevas 12 días'],
  ])('%i days in reads "%s"', (days, expected) => {
    expect(readingTime(daysAgo(days))).toBe(expected)
  })

  it('says so when the book has no start date', () => {
    expect(readingTime(undefined)).toBe('Sin fecha de inicio')
  })
})

describe('buildFeed', () => {
  const { friendships, users } = state()

  it('keeps only current friends, newest first', () => {
    const feed = buildFeed(
      [
        activity('old', daysAgo(3)),
        activity('stranger', daysAgo(0), { userId: 'camila' }),
        activity('new', daysAgo(1)),
      ],
      friendships,
      users,
      bookOf,
    )
    expect(feed.map((entry) => entry.activity.id)).toEqual(['new', 'old'])
  })

  it('does not count a request that is still pending', () => {
    const pending = [{ userId: 'diego', status: 'pending' as const, since: today() }]
    expect(buildFeed([activity('a', today())], pending, users, bookOf)).toEqual([])
  })

  it('skips an activity whose book the app does not know', () => {
    const feed = buildFeed(
      [activity('a', today(), { bookId: 'OL404W' })],
      friendships,
      users,
      bookOf,
    )
    expect(feed).toEqual([])
  })
})

describe('groupByPeriod', () => {
  it('splits by today, the last 7 days and before, in that order', () => {
    const groups = groupByPeriod([
      item(daysAgo(7)),
      item(daysAgo(6)),
      item(daysAgo(1)),
      item(today()),
    ])
    expect(groups.map(({ label, items }) => [label, items.length])).toEqual([
      ['Hoy', 1],
      ['Esta semana', 2],
      ['Antes', 1],
    ])
  })

  it('leaves out a period with nothing in it', () => {
    expect(groupByPeriod([item(daysAgo(20))]).map(({ label }) => label)).toEqual(['Antes'])
    expect(groupByPeriod([])).toEqual([])
  })
})
