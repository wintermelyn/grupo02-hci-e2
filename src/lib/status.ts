import type { ReadingStatus } from '../types'

/** Single source for status wording, so every screen names a status the same way. */
export const STATUS_LABELS: Record<ReadingStatus, string> = {
  want: 'Lo quiero',
  owned: 'Lo tengo',
  reading: 'Leyendo',
  read: 'Leído',
}
