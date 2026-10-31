import { Construction } from 'lucide-react'
import { useParams } from 'react-router'
import { EmptyState, PageHeader, StatusControl } from '../../components'
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
      {book && <StatusControl bookId={book.id} book={book} className="mb-4" />}
      <EmptyState
        icon={Construction}
        title="Pantalla pendiente"
        description="Aquí irán los datos del libro, sus carpetas, las fechas y el puntaje. La construye el rol A (Biblioteca)."
      />
    </section>
  )
}
