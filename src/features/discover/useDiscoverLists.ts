import { useMemo } from 'react'
import { DISCOVER_LISTS, FOR_YOU_LIST_ID, type DiscoverList } from '../../data/seedDiscover'
import { useStore } from '../../store'
import type { Book } from '../../types'
import { useBookLookup } from '../library/filters'

export interface LoadedList extends DiscoverList {
  books: Book[]
}

/** "Seleccionados para ti" hides what the person already has. The other lists show it, with its tag. */
export function useDiscoverLists(): LoadedList[] {
  const library = useStore((state) => state.library)
  const bookOf = useBookLookup()
  return useMemo(
    () =>
      DISCOVER_LISTS.map((list) => ({
        ...list,
        books: list.bookIds
          .filter((id) => list.id !== FOR_YOU_LIST_ID || !Object.hasOwn(library, id))
          .flatMap((id) => bookOf(id) ?? []),
      })),
    [library, bookOf],
  )
}
