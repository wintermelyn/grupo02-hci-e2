import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'
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
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.restoreAllMocks()
})
