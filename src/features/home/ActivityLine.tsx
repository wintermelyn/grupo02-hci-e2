import type { ReactNode } from 'react'
import { ACTIVITY_VERBS, firstName, type FeedItem } from './feed'

export interface ActivityLineProps {
  item: FeedItem
  /** The date, in the form each list has room for. */
  children?: ReactNode
}

/** One line, always. */
export function ActivityLine({ item: { activity, user }, children }: ActivityLineProps) {
  return (
    <span className="block truncate text-sm text-muted">
      <span className="font-semibold text-ink">{firstName(user.name)}</span>{' '}
      {ACTIVITY_VERBS[activity.kind]}
      {children}
    </span>
  )
}
