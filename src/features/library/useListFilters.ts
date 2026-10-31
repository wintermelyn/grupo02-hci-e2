import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { parseTag, TAG_PARAM } from './filters'

const QUERY_PARAM = 'q'

/** The tag and the search of a list of books. They live in the URL, so the book page returns to them. */
export function useListFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  // The URL changes in a transition. The field needs its value at once, or it would lose letters.
  const [typed, setTyped] = useState(searchParams.get(QUERY_PARAM) ?? '')

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
