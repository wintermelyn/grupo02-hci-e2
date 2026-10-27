import { STATUS_LABELS } from '../lib/status'
import type { ReadingStatus } from '../types'
import { cx } from './cx'
import { STATUS_FILL, STATUS_ICONS } from './statusStyles'

export interface StatusTagProps {
  status: ReadingStatus
  className?: string
}

/** Read-only status: icon, text and colour together. */
export function StatusTag({ status, className }: StatusTagProps) {
  const Icon = STATUS_ICONS[status]
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-sm font-semibold',
        STATUS_FILL[status],
        className,
      )}
    >
      <Icon aria-hidden size={14} />
      {STATUS_LABELS[status]}
    </span>
  )
}
