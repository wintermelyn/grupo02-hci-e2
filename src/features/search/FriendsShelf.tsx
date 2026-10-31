import { Link } from 'react-router'
import { Avatar, BookCover, bookPath, RailArrow, useRail } from '../../components'
import { firstName } from '../home/feed'
import type { FriendsBook } from './useSearchStart'

function ShelfBook({ book, friend }: FriendsBook) {
  return (
    <Link
      to={bookPath(book.id)}
      state={{ from: '/buscar' }}
      viewTransition
      className="block rounded-control"
    >
      <span className="cover-lift block">
        <BookCover book={book} raised />
      </span>
      <span className="mt-2 line-clamp-2 font-serif text-[0.9375rem]/[1.2] font-semibold">
        {book.title}
      </span>
      <span className="mt-1 flex items-center gap-1.5 text-sm text-muted">
        <Avatar user={friend} size="xs" />
        <span className="truncate">{firstName(friend.name)}</span>
      </span>
    </Link>
  )
}

/** A rail that slides on a phone, with the next cover cut at the edge to show there is more. */
export function FriendsShelf({ books }: { books: FriendsBook[] }) {
  const { ref, canGoBack, canGoForward, advance, railProps } = useRail<HTMLUListElement>()
  return (
    <section className="mt-8">
      <h2 className="section-title">Lo que leen tus amigos</h2>
      {books.length === 0 ? (
        <p className="mt-2 text-muted">Cuando agregues amigos, aquí vas a ver qué están leyendo.</p>
      ) : (
        <div className="relative mt-3">
          <ul
            ref={ref}
            {...railProps}
            className="rail full-bleed flex snap-x scroll-pl-(--gut) gap-3.5 overflow-x-auto pt-1.5 pb-3 lg:cursor-grab lg:gap-4"
          >
            {books.map(({ book, friend }) => (
              <li key={book.id} className="w-28 shrink-0 snap-start lg:w-36">
                <ShelfBook book={book} friend={friend} />
              </li>
            ))}
          </ul>
          <RailArrow
            direction="back"
            label="Ver libros anteriores"
            onClick={() => advance(-1)}
            visible={canGoBack}
            className="top-20 -left-3"
          />
          <RailArrow
            direction="forward"
            label="Ver más libros"
            onClick={() => advance(1)}
            visible={canGoForward}
            className="top-20 -right-3"
          />
        </div>
      )}
    </section>
  )
}
