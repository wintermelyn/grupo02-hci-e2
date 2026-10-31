import { describe, expect, it, vi } from 'vitest'
import { daysAgo, today } from '../../lib/dates'
import { state } from '../../test/store'
import type { LibraryEntry } from '../../types'
import { findWantPrompt } from './findWantPrompt'

function want(bookId: string, added: number, checked?: number): LibraryEntry {
  return {
    bookId,
    status: 'want',
    folderIds: [],
    addedAt: daysAgo(added),
    ...(checked !== undefined && { wantCheckedAt: daysAgo(checked) }),
  }
}

function libraryOf(...entries: LibraryEntry[]) {
  return Object.fromEntries(entries.map((entry) => [entry.bookId, entry]))
}

describe('findWantPrompt', () => {
  it('starts with It, as docs/desarrollo/tareas.md says', () => {
    expect(findWantPrompt(state())).toEqual({ bookId: 'OL81613W', days: 210 })
  })

  it('moves on to the next book once It has been checked', () => {
    state().answerWantPrompt('OL81613W', true)
    expect(findWantPrompt({ library: state().library })).toEqual({
      bookId: 'OL81631W',
      days: 205,
    })
  })

  it('asks about the oldest book, going by the last time it was chosen', () => {
    const library = libraryOf(want('A', 300, 10), want('B', 120), want('C', 100))
    expect(findWantPrompt({ library })?.bookId).toBe('B')
  })

  it('only asks about books that have waited more than 90 days', () => {
    expect(findWantPrompt({ library: libraryOf(want('A', 90)) })).toBeUndefined()
    expect(findWantPrompt({ library: libraryOf(want('A', 91)) })?.bookId).toBe('A')
  })

  it('leaves out other tags', () => {
    const library = libraryOf({ ...want('A', 300), status: 'owned' }, want('B', 100))
    expect(findWantPrompt({ library })?.bookId).toBe('B')
  })

  it('asks once a day', () => {
    const library = libraryOf(want('A', 200))
    expect(findWantPrompt({ library, lastWantPromptOn: today() })).toBeUndefined()
    expect(findWantPrompt({ library, lastWantPromptOn: daysAgo(1) })?.bookId).toBe('A')
  })

  it('counts calendar days also late at night in Chile', () => {
    vi.useFakeTimers({ now: new Date(2026, 9, 27, 23, 30) })
    expect(findWantPrompt({ library: libraryOf(want('A', 100)) })?.days).toBe(100)
  })

  it('has nothing to ask with an empty list', () => {
    expect(findWantPrompt({ library: {} })).toBeUndefined()
  })
})
