import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  addRecentSearch,
  clearRecentSearches,
  MAX_RECENT,
  readRecentSearches,
} from './recentSearchStore'

beforeEach(() => {
  localStorage.clear()
})

describe('recent searches', () => {
  it('starts empty and keeps what was added, newest first', () => {
    expect(readRecentSearches()).toEqual([])
    const first = addRecentSearch('king', [])
    addRecentSearch('dune', first)
    expect(readRecentSearches()).toEqual(['dune', 'king'])
  })

  it('moves a repeated term to the front, ignoring case', () => {
    expect(addRecentSearch('KING', ['dune', 'king'])).toEqual(['KING', 'dune'])
  })

  it('keeps the last few', () => {
    const terms = Array.from({ length: MAX_RECENT }, (_, index) => `término ${index}`)
    const next = addRecentSearch('nuevo', terms)
    expect(next).toHaveLength(MAX_RECENT)
    expect(next[0]).toBe('nuevo')
  })

  it('is empty again after clearing', () => {
    addRecentSearch('king', [])
    clearRecentSearches()
    expect(readRecentSearches()).toEqual([])
  })

  it.each(['no es json', '{"a":1}', '[1,null]'])('ignores stored data like %s', (stored) => {
    localStorage.setItem('gr-e2-buscados', stored)
    expect(readRecentSearches()).toEqual([])
  })

  it('still works when storage is blocked', () => {
    const blocked = () => {
      throw new DOMException('', 'SecurityError')
    }
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(blocked)
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(blocked)
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(blocked)
    expect(readRecentSearches()).toEqual([])
    expect(addRecentSearch('king', [])).toEqual(['king'])
    expect(() => clearRecentSearches()).not.toThrow()
  })
})
