import type { BookId } from '../types'

/** One section of Descubrir. They all have the same shape, because D6 puts them on the same level. */
export interface DiscoverList {
  id: string
  /** Short name of the list, for a place that has no room for the title. */
  label: string
  title: string
  note: string
  bookIds: BookId[]
  /** Why a book is here, in the person's words. Only the selection made for Alex has reasons. */
  reasons?: Record<BookId, string>
}

export const FOR_YOU_LIST_ID = 'para-ti'

const HORROR = 'Porque guardas Terror'
const SCIENCE_FICTION = 'Porque guardas Ciencia ficción'

/**
 * Uses the 20 catalogue books that are not in the initial library. "Seleccionados para ti" comes
 * first and hides what the person added since, so its books follow Alex's tastes: horror and science
 * fiction. These are ids of a fixed catalogue with no dates, so this is a constant and not a function.
 */
export const DISCOVER_LISTS: readonly DiscoverList[] = [
  {
    id: FOR_YOU_LIST_ID,
    label: 'Para ti',
    title: 'Seleccionados para ti',
    note: 'Según lo que guardas',
    bookIds: ['OL17319533W', 'OL59800W', 'OL109524W', 'OL103134W', 'OL2172356W', 'OL52114W'],
    reasons: {
      OL17319533W: HORROR,
      OL59800W: SCIENCE_FICTION,
      OL109524W: SCIENCE_FICTION,
      OL103134W: SCIENCE_FICTION,
      OL2172356W: SCIENCE_FICTION,
      OL52114W: SCIENCE_FICTION,
    },
  },
  {
    id: 'clasicos',
    label: 'Clásicos',
    title: 'Clásicos de siempre',
    note: 'Los que todos citan',
    bookIds: ['OL503666W', 'OL498556W', 'OL468431W', 'OL3140822W', 'OL266178W'],
  },
  {
    id: 'latinoamerica',
    label: 'Latinoamérica',
    title: 'Voces de Latinoamérica',
    note: 'Novela y cuento de la región',
    bookIds: ['OL274518W', 'OL110971W', 'OL617847W', 'OL698173W'],
  },
  {
    id: 'ensayo',
    label: 'Ensayo',
    title: 'Para entender el mundo',
    note: 'Ciencia e ideas',
    bookIds: ['OL15829966W', 'OL15992072W', 'OL1268413W', 'OL1966488W', 'OL46241W'],
  },
]
