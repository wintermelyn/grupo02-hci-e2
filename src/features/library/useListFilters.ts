import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import { parseTag, TAG_PARAM } from './filters'

export const QUERY_PARAM = 'q'

/** The tag and the search of a list of books. They live in the URL, so the book page returns to them. */
export function useListFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const urlQuery = searchParams.get(QUERY_PARAM) ?? ''
  // The URL changes in a transition. The field needs its value at once, or it would lose letters.
  const [typed, setTyped] = useState(urlQuery)
  const pendingWrites = useRef<string[]>([])

  // A value written here can land behind what is typed by now, so it does not count. Any other is
  // the URL changing from outside, such as the section in the navigation bar.
  useEffect(() => {
    const written = pendingWrites.current.lastIndexOf(urlQuery)
    if (written >= 0) {
      pendingWrites.current.splice(0, written + 1)
    } else {
      pendingWrites.current = []
      setTyped(urlQuery)
    }
  }, [urlQuery])

  /** An empty value removes the param. Replaces the entry, so Back leaves the list. */
  function setParams(changes: Record<string, string>) {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current)
        for (const [name, value] of Object.entries(changes)) {
          if (value) next.set(name, value)
          else next.delete(name)
        }
        return next
      },
      { replace: true },
    )
  }

  function search(value: string) {
    setTyped(value)
    pendingWrites.current.push(value)
    setParams({ [QUERY_PARAM]: value })
  }

  return {
    searchParams,
    setParams,
    tag: parseTag(searchParams.get(TAG_PARAM)),
    typed,
    query: typed.trim(),
    search,
  }
}
