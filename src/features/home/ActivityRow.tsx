import { Link } from 'react-router'
import { BookCover, bookPath } from '../../components'
import { ActivityAvatar, ActivityLine } from './ActivityLine'
import { shortTimeAgo, type FeedItem } from './feed'
import { LikeButton } from './LikeButton'

export interface ActivityRowProps {
  item: FeedItem
  /** The URL the book page goes back to. */
  from: string
}

/** All of it opens the book; the avatar and the heart go over that link. */
export function ActivityRow({ item, from }: ActivityRowProps) {
  const { activity, user, book } = item
  return (
    <li className="relative flex min-w-0 items-center gap-3 rounded-row bg-shell py-1.5 pr-1 pl-2 transition-colors duration-100 has-[[data-activity-link]:active]:bg-sand-deep hover:bg-sand lg:py-2">
      <span className="w-10 shrink-0 lg:w-12">
        <BookCover book={book} />
      </span>
      <div className="min-w-0 flex-1">
        <ActivityAvatar user={user} />
        <Link
          to={bookPath(book.id)}
          state={{ from }}
          viewTransition
          data-activity-link
          className="block outline-none after:absolute after:inset-0 after:rounded-row focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-ink"
        >
          <ActivityLine item={item}>
            <span className="shrink-0 whitespace-pre"> · {shortTimeAgo(activity.date)}</span>
          </ActivityLine>
          <span className="mt-0.5 line-clamp-1 font-serif text-[1.0625rem]/snug font-semibold">
            {book.title}
          </span>
          <span className="block truncate text-sm text-muted max-lg:hidden">{book.authors[0]}</span>
        </Link>
      </div>
      {/* Under 360 px the heart lends the air around it, for the whole sentence to fit beside it. */}
      <LikeButton
        item={item}
        wordFrom="lg"
        className="relative z-10 shrink-0 max-[359px]:-ml-3.5"
      />
    </li>
  )
}
