import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'
import { forgetCatalog } from '../lib/catalog'
import { useStore } from '../store'

// jsdom has no layout, so nothing ever resizes. useRail observes its rail on every page that has one.
class StillResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= StillResizeObserver

// Every test starts from the seed, so no test depends on the order the others run in.
beforeEach(() => {
  useStore.getState().resetDemo()
  forgetCatalog()
  // No test reaches the network. One that needs the catalog says what it answers, with stubCatalog.
  vi.stubGlobal(
    'fetch',
    vi.fn(() => new Promise(() => undefined)),
  )
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})
