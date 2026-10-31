import { Link } from 'react-router'
import { BookCover, bookPath } from '../../components'
import type { Book } from '../../types'

function ShelfBook({ book }: { book: Book }) {
  return (
    <Link
      to={bookPath(book.id)}
      state={{ from: '/buscar' }}
      className="block rounded-control transition-[translate] duration-100 active:translate-y-px"
    >
      <BookCover book={book} />
      <span className="mt-2 line-clamp-2 font-serif text-base/5 font-semibold">{book.title}</span>
      <span className="mt-0.5 line-clamp-1 text-sm text-muted">{book.authors[0]}</span>
    </Link>
  )
}

/** A row that slides on a phone, with the next cover cut at the edge to show there is more. */
export function FriendsShelf({ books }: { books: Book[] }) {
  return (
    <section className="mt-6">
      <h2 className="font-serif text-heading font-semibold">Lo que leen tus amigos</h2>
      {books.length === 0 ? (
        <p className="mt-1 text-muted">Cuando agregues amigos, aquí vas a ver qué están leyendo.</p>
      ) : (
        <ul className="full-bleed mt-2 flex snap-x scroll-px-4 gap-3 overflow-x-auto pb-3 [scrollbar-width:none] md:mx-0 md:grid md:w-auto md:grid-cols-6 md:gap-4 md:overflow-visible md:px-0">
          {books.map((book) => (
            <li key={book.id} className="w-24 shrink-0 snap-start md:w-auto">
              <ShelfBook book={book} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
