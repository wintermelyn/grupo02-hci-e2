import { BookOpen } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { Avatar, BookCover, bookPath, Button, EmptyState } from '../../components'
import { cx } from '../../components/cx'
import { coverTone } from '../../lib/coverTone'
import { ACTIVITY_VERBS, firstName, readingTime, type FeedItem } from './feed'
import type { ReadingBook } from './useHome'

const THREE_COLUMNS = 3

type Company = 'alone' | 'pair' | 'many'

// Next to its text where the column has room, and over it where not.
const CARD_SHAPES: Record<Company, string> = {
  alone: 'flex-row p-3 lg:max-w-xl',
  pair: 'flex-col p-3 md:flex-row',
  many: 'flex-col p-2 min-[360px]:p-3',
}

const COVER_WIDTHS: Record<Company, string> = {
  alone: 'w-26 lg:w-32',
  pair: 'w-full md:w-26 lg:w-32',
  many: 'w-full max-w-36',
}

interface ReadingCardProps extends ReadingBook {
  /** How the card shares the row: alone, with one more book, or with two or more. */
  company: Company
  /** What a friend did with this same book. */
  friend?: FeedItem
}

/** The whole cover, always. */
function ReadingCard({ book, entry, company, friend }: ReadingCardProps) {
  // Under the cover, on a phone, the column has room for the title and little else.
  const whenRoomy = company === 'alone' ? '' : 'max-md:hidden'
  return (
    <Link
      to={bookPath(book.id)}
      state={{ from: '/' }}
      viewTransition
      style={{ backgroundColor: coverTone(book) }}
      className={cx(
        'flex h-full gap-3 rounded-tile text-white transition-[translate] duration-200 active:translate-y-px md:gap-4 md:p-4 lg:gap-5 lg:p-5',
        CARD_SHAPES[company],
      )}
    >
      <span className={cx('cover-lift block shrink-0', COVER_WIDTHS[company])}>
        <BookCover book={book} status={entry.status} raised />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        {/* A long word breaks by syllables: three columns leave 73 px at 320. */}
        <span className="line-clamp-3 font-serif text-lg/[1.15] font-semibold tracking-[-0.02em] wrap-anywhere hyphens-auto md:text-[1.5rem]/[1.12] lg:text-[2rem]/[1.1]">
          {book.title}
        </span>
        <span
          className={cx(
            'mt-1 line-clamp-1 text-sm text-white/88 lg:mt-1.5 lg:text-base',
            whenRoomy,
          )}
        >
          {book.authors[0]}
        </span>
        <span className="mt-auto pt-2 text-sm md:pt-3">
          {friend && (
            <span className={cx('mb-1 flex items-center gap-1.5 text-white/88', whenRoomy)}>
              <Avatar user={friend.user} size="xs" />
              <span className="min-w-0 truncate">
                {firstName(friend.user.name)} {ACTIVITY_VERBS[friend.activity.kind]}
              </span>
            </span>
          )}
          <span className={cx('block font-semibold', company === 'many' && 'max-[359px]:text-xs')}>
            {readingTime(entry.startedAt)}
            {book.pages && (
              <span className="font-normal text-white/88 max-lg:hidden">
                {' '}
                · {book.pages} páginas
              </span>
            )}
          </span>
        </span>
      </span>
    </Link>
  )
}

function NothingReading() {
  const navigate = useNavigate()
  return (
    <EmptyState
      icon={BookOpen}
      title="No estás leyendo ningún libro"
      description="Cuando marques un libro como Leyendo, va a aparecer aquí."
      action={<Button onClick={() => navigate('/biblioteca')}>Ir a Mis libros</Button>}
    />
  )
}

export interface ReadingNowProps {
  reading: ReadingBook[]
  feed: FeedItem[]
}

/** Almost nobody reads more than two or three books at a time, so all of them are in sight. */
export function ReadingNow({ reading, feed }: ReadingNowProps) {
  const many = reading.length >= THREE_COLUMNS
  const company: Company = many ? 'many' : reading.length === 2 ? 'pair' : 'alone'
  return (
    <section>
      <h2 className="page-title">Leyendo ahora</h2>
      {reading.length === 0 ? (
        <NothingReading />
      ) : (
        <ul
          className={cx(
            'mt-4 grid gap-2.5 lg:gap-4',
            many ? 'grid-cols-3' : reading.length === 2 ? 'grid-cols-2' : 'grid-cols-1',
          )}
        >
          {reading.map((item) => (
            <li key={item.book.id} className="min-w-0">
              <ReadingCard
                {...item}
                company={company}
                friend={feed.find(({ book }) => book.id === item.book.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
