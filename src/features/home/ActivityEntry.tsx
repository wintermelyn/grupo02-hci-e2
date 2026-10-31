import { Link } from 'react-router'
import { Avatar, BookCover, bookPath, Stars } from '../../components'
import { personPath } from '../friends/people'
import { ActivityLine } from './ActivityLine'
import type { FeedItem } from './feed'
import { LikeButton } from './LikeButton'

export interface ActivityEntryProps {
  item: FeedItem
  /** The URL the book page goes back to, with how far the list was read. */
  from: string
}

/**
 * The row of Inicio with room for what a longer list needs: the cover, to recognise the book, and
 * the score. On a phone the actions go under the text, because next to it they leave 136 px at 320.
 */
export function ActivityEntry({ item, from }: ActivityEntryProps) {
  const { activity, user, book } = item
  const toBook = { to: bookPath(book.id), state: { from } }

  return (
    <li className="border-b border-line last:border-b-0">
      <div className="-mx-2 flex items-start gap-3 rounded-control px-2 py-2 transition-colors duration-100 has-[a:active]:bg-shell md:items-center">
        <Link
          to={personPath(user.id)}
          aria-label={`Ver a ${user.name}`}
          className="flex size-11 shrink-0 items-center justify-center rounded-full"
        >
          <Avatar user={user} />
        </Link>
        <div className="min-w-0 flex-1 md:flex md:items-center md:gap-3">
          <Link {...toBook} data-activity-link className="block min-w-0 flex-1 rounded-control">
            <ActivityLine item={item} />
            <span className="line-clamp-3 font-serif text-lg/snug font-semibold">{book.title}</span>
          </Link>
          <div className="-ml-2 flex items-center gap-2 md:ml-0 md:shrink-0 md:flex-row-reverse">
            <LikeButton activityId={activity.id} />
            {activity.rating !== undefined && <Stars value={activity.rating} />}
          </div>
        </div>
        {/* The title link is the one announced; the cover is a second target, as in BookRow. */}
        <Link {...toBook} tabIndex={-1} aria-hidden className="mt-1 w-11 shrink-0 md:mt-0">
          <BookCover book={book} />
        </Link>
      </div>
    </li>
  )
}
