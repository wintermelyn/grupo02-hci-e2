import { STATUS_LABELS } from '../lib/status'
import type { ReadingStatus } from '../types'
import { cx } from './cx'
import { STATUS_ICONS, STATUS_TEXT } from './statusStyles'

export interface StatusTagProps {
  status: ReadingStatus
  /** `sm` for lists, where every row has one and none should compete with the titles. */
  size?: 'sm' | 'md'
  className?: string
}

/** Read-only status: icon, text and colour together, with no fill. */
export function StatusTag({ status, size = 'md', className }: StatusTagProps) {
  const Icon = STATUS_ICONS[status]
  const isSmall = size === 'sm'
  return (
    <span
      className={cx(
        'inline-flex items-center font-semibold',
        isSmall ? 'gap-1 text-sm' : 'gap-1.5',
        STATUS_TEXT[status],
        className,
      )}
    >
      <Icon aria-hidden size={isSmall ? 14 : 18} strokeWidth={isSmall ? 2.5 : 2} />
      {STATUS_LABELS[status]}
    </span>
  )
}
