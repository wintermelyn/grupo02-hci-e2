import { Link } from 'react-router'
import { BookCover, bookPath } from '../../components'
import { coverTone } from '../../lib/coverTone'
import { ActivityAvatar, ActivityLine } from './ActivityLine'
import { timeAgo, type FeedItem } from './feed'
import { LikeButton } from './LikeButton'

export interface ActivityRowProps {
  item: FeedItem
  /** The URL the book page goes back to. */
  from: string
}

/**
 * Each row carries the colour of its book, the way a reading card does, so five of them can be told
 * apart at a glance. All of it opens the book; the avatar and the heart go over that link.
 */
export function ActivityRow({ item, from }: ActivityRowProps) {
  const { activity, user, book } = item
  return (
    <li className="relative flex min-w-0 items-center gap-3 overflow-hidden rounded-row border border-line bg-white transition-colors duration-100 has-[[data-activity-link]:active]:bg-sand hover:bg-shell">
      <span
        style={{ backgroundColor: coverTone(book.id) }}
        className="flex w-16 shrink-0 items-center justify-center self-stretch py-2 lg:w-20"
      >
        <span className="w-10 lg:w-12">
          <BookCover book={book} raised />
        </span>
      </span>
      <div className="min-w-0 flex-1 py-2">
        <ActivityAvatar user={user} />
        <Link
          to={bookPath(book.id)}
          state={{ from }}
          viewTransition
          data-activity-link
          className="block outline-none after:absolute after:inset-0 after:rounded-row focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-ink"
        >
          <ActivityLine item={item}>
            <span className="whitespace-pre max-[420px]:hidden md:max-xl:hidden">
              {' '}
              · {timeAgo(activity.date)}
            </span>
          </ActivityLine>
          <span className="line-clamp-2 font-serif text-[1.0625rem]/snug font-semibold xl:line-clamp-1">
            {book.title}
          </span>
          {/*
            "Valentina quiere leer · Hace 13 días" takes 218 px. The line has the width minus 156 on a
            phone, and two columns with "Me gusta" in words leave it less until xl.
          */}
          <span className="block text-sm text-muted min-[420px]:hidden md:max-xl:block">
            {timeAgo(activity.date)}
          </span>
          <span className="block truncate text-sm text-muted max-xl:hidden">{book.authors[0]}</span>
        </Link>
      </div>
      <LikeButton item={item} className="relative z-10 mr-1 shrink-0" />
    </li>
  )
}
