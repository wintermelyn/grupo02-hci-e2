import { ACTIVITY_VERBS, firstName, timeAgo, type FeedItem } from './feed'

/**
 * One line, always. At 320 px there is no room for the date, and it is what can go: Inicio is in
 * order and the view has its period. A hidden class and not a shorter text, so nothing changes at
 * other widths.
 */
export function ActivityLine({ item: { activity, user } }: { item: FeedItem }) {
  return (
    <span className="block truncate text-sm text-muted">
      <span className="font-semibold text-ink">{firstName(user.name)}</span>{' '}
      {ACTIVITY_VERBS[activity.kind]}
      <span className="max-[359px]:hidden"> · {timeAgo(activity.date)}</span>
    </span>
  )
}
