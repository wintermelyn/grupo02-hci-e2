import { useState } from 'react'

/** True once `value` changes after mount, so a transition answers an action and not a page load. */
export function useChanged<T>(value: T): boolean {
  const [previous, setPrevious] = useState(value)
  const [changed, setChanged] = useState(false)
  if (value !== previous) {
    setPrevious(value)
    setChanged(true)
  }
  return changed
}
