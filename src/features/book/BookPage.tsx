import { useParams } from 'react-router'
import { PageHeader, StatusControl } from '../../components'
import { selectBook, useStore } from '../../store'

export function BookPage() {
  const { bookId = '' } = useParams()
  const book = useStore(selectBook(bookId))

  return (
    <section>
      <PageHeader
        title={book?.title ?? 'Ficha del libro'}
        backTo="/biblioteca"
        backLabel="Mis libros"
      />
      {book && <StatusControl bookId={book.id} book={book} className="mt-4" />}
    </section>
  )
}
