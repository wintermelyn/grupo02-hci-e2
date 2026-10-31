import { useEffect, useRef, type FocusEvent } from 'react'

/**
 * A row can lose its button, or disappear, while the focus is on it, for example when a request is
 * accepted. Without this the keyboard would fall back to the top of the document. The focus goes to
 * the link of that person, wherever the row is now, or to the list if the person left it.
 *
 * Spread the result on the element around the rows, each with `data-person`. React does not fire
 * onBlur for a focused element it removes, so the ref still knows who had the focus.
 */
export function useKeepRowFocus(changedData: unknown) {
  const ref = useRef<HTMLDivElement>(null)
  const focusedPerson = useRef<string | undefined>(undefined)

  useEffect(() => {
    const person = focusedPerson.current
    if (!person || document.activeElement !== document.body) return
    focusedPerson.current = undefined
    const link = ref.current?.querySelector<HTMLElement>(`[data-person="${person}"] a`)
    const target = link ?? ref.current
    target?.focus({ preventScroll: true })
  }, [changedData])

  function onFocus(event: FocusEvent<HTMLDivElement>) {
    const row = event.target.closest<HTMLElement>('[data-person]')
    focusedPerson.current = row?.dataset.person
  }

  function onBlur() {
    focusedPerson.current = undefined
  }

  return { ref, tabIndex: -1, onFocus, onBlur }
}
