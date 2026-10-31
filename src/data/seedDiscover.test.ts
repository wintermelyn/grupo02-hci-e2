import { describe, expect, it } from 'vitest'
import books from './books.json'
import { DISCOVER_LISTS, FOR_YOU_LIST_ID } from './seedDiscover'
import { buildInitialLibrary } from './seedLibrary'

const allIds = DISCOVER_LISTS.flatMap(({ bookIds }) => bookIds)
const library = buildInitialLibrary()
const catalogIds = books.map(({ id }) => id)

describe('DISCOVER_LISTS', () => {
  it('uses exactly the catalogue books that are not in the initial library', () => {
    const notInLibrary = catalogIds.filter((id) => !(id in library))
    expect(allIds.toSorted()).toEqual(notInLibrary.toSorted())
  })

  it('has about 6 books for Alex, first, plus 2 or 3 ready-made lists', () => {
    const [first, ...others] = DISCOVER_LISTS
    expect(first.id).toBe(FOR_YOU_LIST_ID)
    expect(first.title).toBe('Seleccionados para ti')
    expect(first.bookIds).toHaveLength(6)
    expect([2, 3]).toContain(others.length)
  })

  it('gives a reason for every book selected for Alex, and for no other book', () => {
    const [first, ...others] = DISCOVER_LISTS
    expect(Object.keys(first.reasons ?? {}).toSorted()).toEqual(first.bookIds.toSorted())
    expect(others.every(({ reasons }) => reasons === undefined)).toBe(true)
  })
})
