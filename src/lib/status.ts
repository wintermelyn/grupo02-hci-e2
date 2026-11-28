import type { ReadingStatus } from '../types'

/** Single source for status wording, so every screen names a status the same way. */
export const STATUS_LABELS: Record<ReadingStatus, string> = {
  want: 'Lo quiero',
  owned: 'Lo tengo',
  reading: 'Leyendo',
  read: 'Leído',
}

/** The order of the tags everywhere they are listed. */
export const STATUS_ORDER: readonly ReadingStatus[] = ['want', 'owned', 'reading', 'read']
