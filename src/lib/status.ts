import type { ReadingStatus } from '../types'

/** Single source for status wording, so every screen names a status the same way. */
export const STATUS_LABELS: Record<ReadingStatus, string> = {
  want: 'Quiero leerlo',
  owned: 'Lo tengo',
  reading: 'Leyendo',
  read: 'Leído',
}

/**
 * What each status means, said only where a status is chosen. Lo tengo and Quiero leerlo were
 * mistaken for each other in testing, so the line tells them apart: one is a plan, the other a
 * copy at hand. Lists and filters keep the short label.
 */
export const STATUS_HINTS: Record<ReadingStatus, string> = {
  want: 'Para más adelante',
  owned: 'En papel o digital, sin leer aún',
  reading: 'Lo estás leyendo ahora',
  read: 'Ya lo terminaste',
}

/** The order of the tags everywhere they are listed. */
export const STATUS_ORDER: readonly ReadingStatus[] = ['want', 'owned', 'reading', 'read']
