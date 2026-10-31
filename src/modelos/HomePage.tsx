import { BookOpen, UserPlus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Avatar, BookCover, bookPath, Button, EmptyState, PageHeader, StatusTag } from '../components'
import { cx } from '../components/cx'
import { useBookLookup } from '../features/library/filters'
import { useStore } from '../store'
import type { Activity, Book, LibraryEntry, User } from '../types'
import { ago, daysSince, firstName, VERB } from './datos'
import { MODELO } from './modelo'
import { BandTabs, LikeButton } from './piezas'

interface Reading {
  book: Book
  entry: LibraryEntry
}

function useHome() {
  const library = useStore((state) => state.library)
  const activities = useStore((state) => state.activities)
  const friendships = useStore((state) => state.friendships)
  const users = useStore((state) => state.users)
  const bookOf = useBookLookup()
  const reading = useMemo<Reading[]>(
    () =>
      Object.values(library)
        .filter(({ status }) => status === 'reading')
        .flatMap((entry) => {
          const book = bookOf(entry.bookId)
          return book ? [{ book, entry }] : []
        })
        .sort((a, b) => (b.entry.startedAt ?? '').localeCompare(a.entry.startedAt ?? '')),
    [library, bookOf],
  )
  const feed = useMemo(() => {
    const friends = new Set(friendships.filter((f) => f.status === 'friends').map((f) => f.userId))
    return activities.flatMap((activity) => {
      const user = users.find(({ id }) => id === activity.userId)
      const book = bookOf(activity.bookId)
      return user && book && friends.has(user.id) ? [{ activity, user, book }] : []
    })
  }, [activities, friendships, users, bookOf])
  return { reading, feed }
}

type FeedItem = ReturnType<typeof useHome>['feed'][number]

function ReadingRow({ book, entry }: Reading) {
  return (
    <Link
      to={bookPath(book.id)}
      state={{ from: '/' }}
      className="-mx-2 flex items-center gap-3.5 rounded-control px-2 py-2.5 transition-colors duration-100 active:bg-shell"
    >
      <div className="w-14 shrink-0 md:w-16">
        <BookCover book={book} size="sm" status="reading" />
      </div>
      <div className="min-w-0">
        <span className="line-clamp-2 font-serif text-lg/snug font-semibold">{book.title}</span>
        <span className="flex flex-wrap items-center gap-x-2 text-sm text-muted">
          <StatusTag status={entry.status} size="sm" />
          <span>{book.authors[0]}</span>
        </span>
        <span className="text-sm text-muted">
          Empezado {entry.startedAt ? ago(entry.startedAt).toLowerCase() : ''}
        </span>
      </div>
    </Link>
  )
}

function CompactActivity({ activity, user, book }: FeedItem) {
  return (
    <li className="flex items-center gap-3 border-b border-line py-2 last:border-b-0">
      <Avatar user={user} />
      <div className="min-w-0 flex-1">
        <p className="text-sm text-muted">
          <Link to={`/amigos/${user.id}`} className="font-semibold text-ink">
            {firstName(user.name)}
          </Link>{' '}
          {VERB[activity.kind]} · {ago(activity.date)}
        </p>
        <Link
          to={bookPath(book.id)}
          state={{ from: '/' }}
          className="line-clamp-2 font-serif text-base/5 font-semibold"
        >
          {book.title}
        </Link>
      </div>
      <LikeButton id={activity.id} className="shrink-0" />
    </li>
  )
}

const FEED_PREVIEW = 5

function ReadingTile({ book, entry }: Reading) {
  return (
    <Link
      to={bookPath(book.id)}
      state={{ from: '/' }}
      className="group block transition-[translate] duration-100 active:translate-y-px"
    >
      <BookCover book={book} status="reading" />
      <span className="mt-5 line-clamp-2 font-serif text-lg/snug font-semibold">{book.title}</span>
      <span className="text-sm text-muted">
        Llevas {entry.startedAt ? daysSince(entry.startedAt) : 0} días
      </span>
    </Link>
  )
}

function ActivityText({ user, activity, book }: { user: User; activity: Activity; book: Book }) {
  return (
    <>
      <p className="text-sm text-muted">
        <Link to={`/amigos/${user.id}`} className="font-semibold text-ink">
          {firstName(user.name)}
        </Link>{' '}
        {VERB[activity.kind]}
        {activity.rating ? ` · ${activity.rating} de 5` : ''}
      </p>
      <Link
        to={bookPath(book.id)}
        state={{ from: '/' }}
        className="line-clamp-2 font-serif text-base/snug font-semibold"
      >
        {book.title}
      </Link>
    </>
  )
}

function ActivityRow({ activity, user, book }: FeedItem) {
  return (
    <li className="flex gap-3 border-b border-line py-2.5 last:border-b-0">
      <Avatar user={user} />
      <div className="min-w-0 flex-1">
        <ActivityText user={user} activity={activity} book={book} />
        <div className="-ml-2 flex items-center gap-1 text-sm text-muted">
          <LikeButton id={activity.id} />
          <span>· {ago(activity.date)}</span>
        </div>
      </div>
      <div className="w-10 shrink-0 pt-0.5">
        <BookCover book={book} />
      </div>
    </li>
  )
}

function LedgerActivity({ item, showDate }: { item: FeedItem; showDate: boolean }) {
  const { activity, user, book } = item
  return (
    <li className="flex items-center gap-3 border-b border-line py-1.5 last:border-b-0">
      <span className="w-14 shrink-0 text-sm text-muted md:w-20">
        {showDate ? ago(activity.date) : ''}
      </span>
      <div className="min-w-0 flex-1">
        <ActivityText user={user} activity={activity} book={book} />
      </div>
      <LikeButton id={activity.id} className="shrink-0" />
    </li>
  )
}

function NoFriends() {
  return (
    <EmptyState
      icon={UserPlus}
      title="Aún no hay actividad"
      description="Cuando agregues amigos, aquí vas a ver qué están leyendo."
      action={<Button>Buscar amigos</Button>}
    />
  )
}

function NothingReading() {
  return (
    <EmptyState
      icon={BookOpen}
      title="No estás leyendo ningún libro"
      description="Cuando marques un libro como Leyendo, va a aparecer aquí."
    />
  )
}

export function HomePage() {
  const { reading, feed } = useHome()
  const [tab, setTab] = useState('leyendo')
  const [allActivity, setAllActivity] = useState(false)

  if (MODELO === 'a') {
    return (
      <section>
        <PageHeader title="Inicio">
          <BandTabs
            label="Ver"
            className="md:hidden"
            value={tab}
            onChange={setTab}
            options={[
              { id: 'leyendo', label: 'Leyendo ahora', count: reading.length },
              { id: 'amigos', label: 'Amigos', count: feed.length },
            ]}
          />
          <div className="hidden h-3 md:block" />
        </PageHeader>
        <div className="md:mt-5 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:gap-10">
          <section className={tab === 'leyendo' ? 'mt-2 md:mt-0' : 'hidden md:block'}>
            <h2 className="hidden font-serif text-heading font-semibold md:mb-1 md:block">
              Leyendo ahora
            </h2>
            <ul>
              {reading.map((item) => (
                <li key={item.book.id} className="border-b border-line last:border-b-0">
                  <ReadingRow {...item} />
                </li>
              ))}
            </ul>
            {reading.length === 0 && <NothingReading />}
          </section>
          <section className={tab === 'amigos' ? 'mt-1 md:mt-0' : 'hidden md:block'}>
            <h2 className="hidden font-serif text-heading font-semibold md:mb-1 md:block">
              Actividad de tus amigos
            </h2>
            <ul>
              {feed.map((item) => (
                <ActivityRow key={item.activity.id} {...item} />
              ))}
            </ul>
            {feed.length === 0 && <NoFriends />}
          </section>
        </div>
      </section>
    )
  }

  if (MODELO === 'b') {
    const preview = allActivity ? feed : feed.slice(0, FEED_PREVIEW)
    return (
      <section>
        <PageHeader title="Inicio" />
        <div className="md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-12">
          <section className="mt-5">
            <h2 className="mb-3 font-serif text-heading font-semibold">Leyendo ahora</h2>
            <ul className={cx('grid gap-x-4 gap-y-5', reading.length >= 3 ? 'grid-cols-3' : 'grid-cols-2')}>
              {reading.map((item) => (
                <li key={item.book.id}>
                  <ReadingTile {...item} />
                </li>
              ))}
            </ul>
            {reading.length === 0 && <NothingReading />}
          </section>
          <section className="mt-6 md:mt-5">
            <h2 className="font-serif text-heading font-semibold">Actividad de tus amigos</h2>
            <ul className="mt-1">
              {preview.map((item) => (
                <CompactActivity key={item.activity.id} {...item} />
              ))}
            </ul>
            {feed.length === 0 && <NoFriends />}
            {feed.length > FEED_PREVIEW && (
              <Button
                compact
                variant="quiet"
                onClick={() => setAllActivity((value) => !value)}
                className="mt-1 -ml-2.5"
              >
                {allActivity ? 'Ver menos' : `Ver toda la actividad (${feed.length})`}
              </Button>
            )}
          </section>
        </div>
      </section>
    )
  }

  return (
    <section>
      <PageHeader title="Inicio" />
      <div className="md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-10">
        <section className="mt-5">
          <h2 className="font-serif text-heading font-semibold">Leyendo ahora</h2>
          <ul>
            {reading.map((item) => (
              <li key={item.book.id} className="border-b border-line last:border-b-0">
                <ReadingRow {...item} />
              </li>
            ))}
          </ul>
          {reading.length === 0 && <NothingReading />}
        </section>
        <section className="mt-5">
          <h2 className="font-serif text-heading font-semibold">Actividad de tus amigos</h2>
          <ul>
            {feed.map((item, index) => (
              <LedgerActivity
                key={item.activity.id}
                item={item}
                showDate={index === 0 || feed[index - 1].activity.date !== item.activity.date}
              />
            ))}
          </ul>
          {feed.length === 0 && <NoFriends />}
        </section>
      </div>
    </section>
  )
}
