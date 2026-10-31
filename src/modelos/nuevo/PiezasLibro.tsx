import type { ComponentProps, ReactNode } from 'react'
import { Link } from 'react-router'
import { BookCover, bookPath } from '../../components'
import { cx } from '../../components/cx'
import { useStore } from '../../store'
import type { Book } from '../../types'

/** Toda portada de Descubrir abre su ficha, y vuelve a Descubrir. */
export function EnlaceLibro({
  book,
  children,
  ...rest
}: { book: Book; children: ReactNode } & Omit<ComponentProps<typeof Link>, 'to'>) {
  const upsertBook = useStore((state) => state.upsertBook)
  return (
    <Link
      to={bookPath(book.id)}
      state={{ from: '/descubrir' }}
      viewTransition
      onClick={() => upsertBook(book)}
      {...rest}
    >
      {children}
    </Link>
  )
}

export function Portada({ book, className }: { book: Book; className?: string }) {
  return <BookCover book={book} className={cx('sombra-portada', className)} />
}

export function datosDe(book: Book): string {
  return [book.authors[0], book.year, book.pages ? `${book.pages} páginas` : undefined]
    .filter(Boolean)
    .join(' · ')
}

export const SIN_DESCRIPCION = 'Aún no tenemos descripción de este libro.'
