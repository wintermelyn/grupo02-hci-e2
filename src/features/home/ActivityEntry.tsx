import { Link } from 'react-router'
import { BookCover, bookPath, Stars } from '../../components'
import { ActivityAvatar, ActivityLine } from './ActivityLine'
import { timeAgo, type FeedItem } from './feed'
import { LikeButton } from './LikeButton'

export interface ActivityEntryProps {
  item: FeedItem
  /** The URL the book page goes back to, with how far the list was read. */
  from: string
  /** False where the period already says it, like under "Hoy". */
  dated: boolean
}

/**
 * The row of Inicio with room for what a longer list needs: a larger cover, the author and the score.
 * All of it opens the book; the avatar and the heart go over that link.
 */
export function ActivityEntry({ item, from, dated }: ActivityEntryProps) {
  const { activity, user, book } = item

  return (
    <li className="border-b border-line last:border-b-0">
      <div className="relative -mx-2 flex items-center gap-3.5 rounded-row px-2 py-3 transition-colors duration-100 has-[[data-activity-link]:active]:bg-sand hover:bg-shell">
        <span className="w-14 shrink-0">
          <BookCover book={book} />
        </span>
        <div className="min-w-0 flex-1">
          <ActivityAvatar user={user} />
          <Link
            to={bookPath(book.id)}
            state={{ from }}
            viewTransition
            data-activity-link
            className="block outline-none after:absolute after:inset-0 after:rounded-row focus-visible:after:outline-2 focus-visible:after:outline-ink"
          >
            <ActivityLine item={item}>
              {dated && (
                <span className="shrink-0 whitespace-pre max-md:hidden">
                  {' '}
                  · {timeAgo(activity.date)}
                </span>
              )}
            </ActivityLine>
            <span className="mt-0.5 line-clamp-2 font-serif text-lg/snug font-semibold">
              {book.title}
            </span>
          </Link>
          {/*
            The dot stands in the space before the date. A date that wraps starts its line, where
            the negative margin leaves that space out of the box, and the dot goes with it.
          */}
          <p className="mt-0.5 overflow-hidden text-sm text-muted">
            <span className="-ml-3 flex flex-wrap items-center">
              <span className="pl-3">
                {activity.rating !== undefined ? (
                  <Stars value={activity.rating} />
                ) : (
                  book.authors[0]
                )}
              </span>
              {dated && (
                <span className="relative pl-3 md:hidden">
                  <span aria-hidden className="absolute left-0 w-3 text-center">
                    ·
                  </span>
                  {timeAgo(activity.date)}
                </span>
              )}
            </span>
          </p>
        </div>
        <LikeButton item={item} className="relative z-10 shrink-0" />
      </div>
    </li>
  )
}
