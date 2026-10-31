import { differenceInCalendarDays } from 'date-fns'
import { parseDate, today } from '../lib/dates'
import type { Activity, BookId, ISODate } from '../types'

export interface Lista {
  id: string
  tab: string
  title: string
  note: string
  books: BookId[]
  why?: Record<BookId, string>
}

const TERROR = 'Porque guardas Terror'
const CF = 'Porque guardas Ciencia ficción'

export const LISTAS: Lista[] = [
  {
    id: 'para-ti',
    tab: 'Para ti',
    title: 'Seleccionados para ti',
    note: 'Según lo que guardas',
    books: ['OL17319533W', 'OL59800W', 'OL109524W', 'OL103134W', 'OL2172356W', 'OL52114W'],
    why: {
      OL17319533W: TERROR,
      OL59800W: CF,
      OL109524W: CF,
      OL103134W: CF,
      OL2172356W: CF,
      OL52114W: CF,
    },
  },
  {
    id: 'clasicos',
    tab: 'Clásicos',
    title: 'Clásicos de siempre',
    note: 'Los que todos citan',
    books: ['OL503666W', 'OL498556W', 'OL468431W', 'OL3140822W', 'OL266178W'],
  },
  {
    id: 'latinoamerica',
    tab: 'Latinoamérica',
    title: 'Voces de Latinoamérica',
    note: 'Novela y cuento de la región',
    books: ['OL274518W', 'OL110971W', 'OL617847W', 'OL698173W'],
  },
  {
    id: 'ensayo',
    tab: 'Ensayo',
    title: 'Para entender el mundo',
    note: 'Ciencia e ideas',
    books: ['OL15829966W', 'OL15992072W', 'OL1268413W', 'OL1966488W', 'OL46241W'],
  },
]

export const daysSince = (date: ISODate) =>
  differenceInCalendarDays(parseDate(today()), parseDate(date))

export function ago(date: ISODate): string {
  const days = daysSince(date)
  if (days <= 0) return 'Hoy'
  if (days === 1) return 'Ayer'
  return `Hace ${days} días`
}

export const VERB: Record<Activity['kind'], string> = {
  started: 'empezó',
  finished: 'terminó',
  want: 'quiere leer',
}

export const firstName = (name: string) => name.split(' ')[0]
