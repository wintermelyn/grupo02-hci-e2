import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { Avatar } from '../../components'
import { cx } from '../../components/cx'
import { personPath } from '../friends/people'
import { ACTIVITY_VERBS, firstName, type FeedItem } from './feed'

/**
 * The first thing on the line, going over the link of the whole row. It takes no height, so the row
 * link stays measured from the row itself: 44 px to touch around an avatar of 24.
 */
export function ActivityAvatar({ user }: Pick<FeedItem, 'user'>) {
  return (
    <span className="relative block h-0">
      <Link
        to={personPath(user.id)}
        aria-label={`Ver a ${user.name}`}
        className="absolute -top-2 -left-2.5 z-10 flex size-11 items-center justify-center rounded-full"
      >
        <Avatar user={user} size="xs" />
      </Link>
    </span>
  )
}

export interface ActivityLineProps {
  item: FeedItem
  /** The date, in the form each list has room for. */
  children?: ReactNode
  className?: string
}

/** One line, always. It leaves room for ActivityAvatar. */
export function ActivityLine({ item: { activity, user }, children, className }: ActivityLineProps) {
  return (
    <span className={cx('flex min-h-7 items-center pl-7.5 text-sm text-muted', className)}>
      <span className="truncate">
        <span className="font-semibold text-ink">{firstName(user.name)}</span>{' '}
        {ACTIVITY_VERBS[activity.kind]}
        {children}
      </span>
    </span>
  )
}
