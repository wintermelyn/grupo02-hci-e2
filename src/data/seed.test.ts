import { describe, expect, it } from 'vitest'
import { daysAgo, today } from '../lib/dates'
import type { Book, ReadingStatus } from '../types'
import books from './books.json'
import { buildInitialFolders, buildInitialLibrary } from './seedLibrary'
import { buildInitialActivities, buildInitialFriendships, me, users } from './seedSocial'

// These checks pin the seed to PLAN.md section 4 and to the task data listed in docs/desarrollo/tareas.md.
const T1_BOOK_ID = 'OL1811898W'
const catalog: Book[] = books
const bookIds = new Set(catalog.map((book) => book.id))
const initialLibrary = buildInitialLibrary()
const initialFolders = buildInitialFolders()
const initialFriendships = buildInitialFriendships()
const entries = Object.values(initialLibrary)
const userById = new Map(users.map((user) => [user.id, user]))
const friendIds = initialFriendships.map((friendship) => friendship.userId)

const withStatus = (status: ReadingStatus) => entries.filter((entry) => entry.status === status)
const isUnique = (values: string[]) => new Set(values).size === values.length

describe('books.json', () => {
  it('has about 50 books with unique work ids', () => {
    expect(catalog.length).toBeGreaterThanOrEqual(45)
    expect(catalog.every((book) => /^OL\d+W$/.test(book.id))).toBe(true)
    expect(isUnique(catalog.map((book) => book.id))).toBe(true)
  })

  it('points every cover to public/covers', () => {
    const covers = catalog.flatMap((book) => (book.coverUrl ? [book.coverUrl] : []))
    expect(covers.length).toBeGreaterThanOrEqual(45)
    expect(covers.every((url) => /^\/covers\/OL\d+W\.jpg$/.test(url))).toBe(true)
  })

  it('includes the T1 book in Spanish', () => {
    expect(catalog.find((book) => book.id === T1_BOOK_ID)?.title).toBe(
      'El hombre que confundió a su mujer con un sombrero',
    )
  })
})

describe('initial library', () => {
  it('has the counts per status from the plan', () => {
    expect(withStatus('want')).toHaveLength(22)
    expect(withStatus('reading')).toHaveLength(2)
    expect(withStatus('read')).toHaveLength(10)
  })

  it('only references books from the catalog, keyed by their own id', () => {
    for (const [key, entry] of Object.entries(initialLibrary)) {
      expect(entry.bookId).toBe(key)
    }
    expect(Object.keys(initialLibrary).filter((id) => !bookIds.has(id))).toEqual([])
  })

  it('has the T1 book in Leyendo, started 12 days ago, and the other one 30 days ago', () => {
    expect(initialLibrary[T1_BOOK_ID]).toMatchObject({ status: 'reading', startedAt: daysAgo(12) })
    expect(withStatus('reading').map((entry) => entry.startedAt)).toEqual(
      expect.arrayContaining([daysAgo(12), daysAgo(30)]),
    )
  })

  it('keeps dates in order and never in the future', () => {
    for (const { addedAt, startedAt, finishedAt, status } of entries) {
      const dates = [addedAt, startedAt, finishedAt].filter((date) => date !== undefined)
      expect(dates).toEqual([...dates].sort())
      expect(dates.every((date) => date <= today())).toBe(true)
      expect(finishedAt !== undefined).toBe(status === 'read')
    }
  })

  it('has the plan folders with Próximos pinned first and holding 2 books', () => {
    expect(initialFolders.map((folder) => folder.name)).toEqual([
      'Próximos',
      'Terror',
      'Novela',
      'Ciencia ficción',
      'Regalos',
    ])
    const [upcoming] = initialFolders
    expect(upcoming.pinned).toBe(true)
    expect(entries.filter((entry) => entry.folderIds.includes(upcoming.id))).toHaveLength(2)
  })

  it('has exactly one pinned folder, Próximos', () => {
    expect(initialFolders.filter((folder) => folder.pinned).map((folder) => folder.name)).toEqual([
      'Próximos',
    ])
  })

  it('only uses folders that exist', () => {
    const folderIds = new Set(initialFolders.map((folder) => folder.id))
    expect(entries.every((entry) => entry.folderIds.every((id) => folderIds.has(id)))).toBe(true)
  })
})

describe('initial social data', () => {
  it('has me as Alex Muñoz', () => {
    expect(me).toMatchObject({ name: 'Alex Muñoz', username: 'alexlee', code: 'LEE-1024' })
  })

  it('has the three friends from the plan', () => {
    expect(friendIds.map((id) => userById.get(id)?.username)).toEqual([
      'diegolee',
      'valelee',
      'tomasreads',
    ])
    expect(initialFriendships.every((friendship) => friendship.status === 'friends')).toBe(true)
  })

  it('has the T3 person, not yet added, and her homonym', () => {
    const camilas = users.filter((user) => user.name === 'Camila Torres')
    const target = camilas.find((user) => user.username === 'camitorres')
    const homonym = camilas.find((user) => user.username === 'ctorres_99')
    expect(target).toMatchObject({ code: 'LEE-4821', mutualFriends: 3 })
    expect(homonym).toMatchObject({ mutualFriends: 0 })
    expect(homonym?.avatarColor).not.toBe(target?.avatarColor)
    expect(friendIds).not.toContain(target?.id)
    expect(initialFriendships.some((friendship) => friendship.userId === target?.id)).toBe(false)
  })

  it('has exactly two people named like the T3 person', () => {
    const target = users.find((user) => user.username === 'camitorres')
    expect(users.filter((user) => user.name === target?.name)).toHaveLength(2)
  })

  it('has 4 more people in the directory', () => {
    expect(users).toHaveLength(3 + 2 + 4)
  })

  it('has unique ids, usernames and codes', () => {
    const everyone = [me, ...users]
    expect(isUnique(everyone.map((user) => user.id))).toBe(true)
    expect(isUnique(everyone.map((user) => user.username))).toBe(true)
    expect(isUnique(everyone.map((user) => user.code))).toBe(true)
  })

  it('only references books from the catalog', () => {
    const referenced = [me, ...users].flatMap((user) => [...user.readingIds, ...user.readIds])
    expect(referenced.filter((id) => !bookIds.has(id))).toEqual([])
  })

  it('only has friendships with people in the directory', () => {
    expect(friendIds.every((id) => userById.has(id))).toBe(true)
  })

  it('has about 10 recent activities by friends that match what they read', () => {
    const activities = buildInitialActivities()
    expect(activities).toHaveLength(10)
    expect(isUnique(activities.map((activity) => activity.id))).toBe(true)
    for (const activity of activities) {
      const friend = userById.get(activity.userId)
      expect(friendIds).toContain(activity.userId)
      expect(bookIds.has(activity.bookId)).toBe(true)
      expect(activity.date <= today()).toBe(true)
      if (activity.kind === 'started') expect(friend?.readingIds).toContain(activity.bookId)
      if (activity.kind === 'finished') expect(friend?.readIds).toContain(activity.bookId)
    }
  })
})
