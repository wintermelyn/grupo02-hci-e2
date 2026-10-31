import { BookRow } from '../../components'
import type { Book } from '../../types'

export interface BookListProps {
  /** Names the list for screen readers. */
  title: string
  books: Book[]
}

export function BookList({ title, books }: BookListProps) {
  return (
    <section className="mt-2">
      <h2 className="sr-only">{title}</h2>
      <ul className="md:grid md:grid-cols-2 md:gap-x-8">
        {books.map((book) => (
          <li key={book.id} className="border-b border-line last:border-b-0">
            <BookRow book={book} />
          </li>
        ))}
      </ul>
    </section>
  )
}
