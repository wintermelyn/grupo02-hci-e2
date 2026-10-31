import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useListFilters } from './useListFilters'

const url = vi.hoisted(() => ({ params: new URLSearchParams() }))

// A URL that only changes when the test says so: in the app it arrives later, in a transition.
vi.mock('react-router', () => ({
  useSearchParams: () => [url.params, vi.fn()],
}))

function renderFilters(query = '') {
  const setUrl = (value: string) => {
    url.params = new URLSearchParams(value ? { q: value } : {})
  }
  setUrl(query)
  const hook = renderHook(() => useListFilters())
  return {
    typed: () => hook.result.current.typed,
    type: (value: string) => act(() => hook.result.current.search(value)),
    arrive: (value: string) => {
      setUrl(value)
      hook.rerender()
    },
  }
}

describe('useListFilters', () => {
  beforeEach(() => {
    url.params = new URLSearchParams()
  })

  it('starts from the URL', () => {
    expect(renderFilters('king').typed()).toBe('king')
  })

  it('does not lose letters to a URL that arrives behind what is typed', () => {
    const { typed, type, arrive } = renderFilters()
    type('k')
    type('ki')
    arrive('k')
    expect(typed()).toBe('ki')
    arrive('ki')
    expect(typed()).toBe('ki')
  })

  it('follows a URL that changes from outside', () => {
    const { typed, type, arrive } = renderFilters()
    type('king')
    arrive('king')
    arrive('')
    expect(typed()).toBe('')
    arrive('dune')
    expect(typed()).toBe('dune')
  })

  it('follows a change from outside that lands before what was written', () => {
    const { typed, type, arrive } = renderFilters('king')
    type('kin')
    arrive('')
    expect(typed()).toBe('')
  })

  it('ignores the steps a batch of letters skips', () => {
    const { typed, type, arrive } = renderFilters()
    type('k')
    type('ki')
    type('kin')
    arrive('kin')
    arrive('')
    expect(typed()).toBe('')
  })
})
