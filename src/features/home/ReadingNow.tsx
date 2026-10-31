import { BookOpen } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { BookCover, bookPath, Button, EmptyState } from '../../components'
import { cx } from '../../components/cx'
import { readingTime } from './feed'
import type { ReadingBook } from './useHome'

const THREE_COLUMNS = 3

function ReadingTile({ book, entry, narrow }: ReadingBook & { narrow: boolean }) {
  return (
    <Link
      to={bookPath(book.id)}
      state={{ from: '/' }}
      className="block rounded-control transition-[translate] duration-100 active:translate-y-px"
    >
      <BookCover book={book} status={entry.status} />
      {/*
        16 px, because the ribbon hangs 8 px below the cover. A long word breaks by syllables: three
        columns leave 85 px at 320, less than "Frankenstein".
      */}
      <span className="mt-4 line-clamp-2 font-serif text-lg/snug font-semibold wrap-anywhere hyphens-auto">
        {book.title}
      </span>
      {/* Three columns leave 85 px at 320, and "Llevas 30 días" takes one line at this size. */}
      <span className={cx('block text-sm text-muted', narrow && 'max-[359px]:text-xs')}>
        {readingTime(entry.startedAt)}
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

export function ReadingNow({ reading }: { reading: ReadingBook[] }) {
  return (
    <section className="mt-5">
      <h2 className="mb-3 section-title">Leyendo ahora</h2>
      {reading.length === 0 ? (
        <NothingReading />
      ) : (
        <ul
          className={cx(
            'grid gap-x-4 gap-y-5',
            reading.length >= THREE_COLUMNS ? 'grid-cols-3' : 'grid-cols-2',
          )}
        >
          {reading.map((item) => (
            <li key={item.book.id}>
              <ReadingTile {...item} narrow={reading.length >= THREE_COLUMNS} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
