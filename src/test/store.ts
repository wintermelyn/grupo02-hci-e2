import { onTestFinished, vi, type Mock } from 'vitest'
import { useStore, type StoreState } from '../store'

/** The current state. Call it again after each action: every change replaces the object. */
export const state = () => useStore.getState()

type Action = (...args: never[]) => unknown

type ActionName = {
  [K in keyof StoreState]-?: StoreState[K] extends Action ? K : never
}[keyof StoreState]

/**
 * Replaces one store action with a mock until the current test ends. Lets a component test check
 * which action it calls, and with what, without running the action.
 */
export function stubAction<K extends ActionName>(name: K): Mock<Extract<StoreState[K], Action>> {
  const original: Partial<StoreState> = { [name]: state()[name] }
  const stub = vi.fn<Extract<StoreState[K], Action>>()
  useStore.setState({ [name]: stub })
  onTestFinished(() => {
    useStore.setState(original)
  })
  return stub
}
