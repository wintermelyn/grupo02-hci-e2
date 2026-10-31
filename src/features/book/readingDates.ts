import { today } from '../../lib/dates'
import type { ISODate } from '../../types'

/**
 * Why these dates cannot be saved, in the person's words, or undefined when they can. ISO dates
 * sort as text, so they need no parsing. The picker already holds back most of these, but a date
 * can still be typed.
 */
export function readingDatesProblem(startedAt: ISODate, finishedAt: ISODate): string | undefined {
  if (!startedAt || !finishedAt) return 'Completa las dos fechas.'
  const limit = today()
  if (startedAt > limit || finishedAt > limit) return 'Las fechas no pueden ser futuras.'
  if (finishedAt < startedAt) return 'El fin no puede ser anterior al inicio.'
  return undefined
}
