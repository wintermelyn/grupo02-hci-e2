import { useMemo } from 'react'
import { useBookLookup } from '../../features/library/filters'
import { useStore } from '../../store'
import type { Book } from '../../types'
import { LISTAS, type Lista } from '../datos'

export type ListaCargada = Lista & { items: Book[] }

/** "Seleccionados para ti" oculta lo que ya está en la biblioteca; las demás listas no. */
export function useListas(): ListaCargada[] {
  const library = useStore((state) => state.library)
  const bookOf = useBookLookup()
  return useMemo(
    () =>
      LISTAS.map((lista) => ({
        ...lista,
        items: lista.books
          .filter((id) => lista.id !== 'para-ti' || !library[id])
          .flatMap((id) => bookOf(id) ?? []),
      })),
    [library, bookOf],
  )
}
