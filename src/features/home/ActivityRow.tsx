import { Link } from 'react-router'
import { Avatar, bookPath } from '../../components'
import { personPath } from '../friends/people'
import { ActivityLine } from './ActivityLine'
import { timeAgo, type FeedItem } from './feed'
import { LikeButton } from './LikeButton'

export interface ActivityRowProps {
  item: FeedItem
  /** The URL the book page goes back to. */
  from: string
}

/** One line and a title. The avatar goes to the person and the text, a larger target, to the book. */
export function ActivityRow({ item, from }: ActivityRowProps) {
  const { activity, user, book } = item
  return (
    <li className="border-b border-line last:border-b-0">
      <div className="-mx-2 flex items-center gap-2 rounded-control px-2 transition-colors duration-100 has-[a:active]:bg-shell">
        <Link
          to={personPath(user.id)}
          aria-label={`Ver a ${user.name}`}
          className="flex size-11 shrink-0 items-center justify-center rounded-full"
        >
          <Avatar user={user} />
        </Link>
        <Link
          to={bookPath(book.id)}
          state={{ from }}
          data-activity-link
          className="block min-w-0 flex-1 rounded-control py-2"
        >
          <ActivityLine item={item}>
            <span className="max-[420px]:hidden"> · {timeAgo(activity.date)}</span>
          </ActivityLine>
          <span className="line-clamp-2 font-serif text-base/5 font-semibold">{book.title}</span>
          {/* The line has the width minus 189 px, and "Valentina quiere leer · Hace 13 días" takes 218. */}
          <span className="block text-sm text-muted min-[420px]:hidden">
            {timeAgo(activity.date)}
          </span>
        </Link>
        <LikeButton item={item} className="shrink-0" />
      </div>
    </li>
  )
}
