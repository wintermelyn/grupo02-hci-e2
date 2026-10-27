import { format, parse, subDays } from 'date-fns'
import { es } from 'date-fns/locale'
import type { ISODate } from '../types'

// Calendar dates are always handled in local time. Avoid toISOString() (UTC: after 21:00 in
// Chile it already returns tomorrow) and new Date('YYYY-MM-DD') (parsed as UTC midnight).
const ISO_FORMAT = 'yyyy-MM-dd'

export function today(): ISODate {
  return format(new Date(), ISO_FORMAT)
}

export function daysAgo(n: number): ISODate {
  return format(subDays(new Date(), n), ISO_FORMAT)
}

export function parseDate(iso: ISODate): Date {
  return parse(iso, ISO_FORMAT, new Date())
}

/** "27 de octubre de 2026" */
export function formatDate(iso: ISODate): string {
  return format(parseDate(iso), "d 'de' MMMM 'de' yyyy", { locale: es })
}
