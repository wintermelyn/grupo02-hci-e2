import { BookX } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Button, EmptyState, ErrorState, PageHeader } from '../../components'
import { isWorkId, useCatalog } from '../../lib/catalog'
import type { BookId } from '../../types'
import { BookSkeleton } from './BookSkeleton'

export interface MissingBookProps {
  bookId: BookId
  back: { to: string; label: string }
}

/**
 * A book that is not at hand, e.g. a link opened in another browser. Once the catalog arrives, the
 * book page takes over if the book is in it. An id that cannot be a book does not need the catalog.
 */
export function MissingBook({ bookId, back }: MissingBookProps) {
  const navigate = useNavigate()
  const canBeABook = isWorkId(bookId)
  const { status, retry } = useCatalog({ off: !canBeABook })

  if (status === 'loading') return <BookSkeleton back={back} />

  if (status === 'failed') {
    return (
      <section>
        <PageHeader title="No pudimos cargar el libro" backTo={back.to} backLabel={back.label} />
        <ErrorState
          title="Falló la conexión"
          description="Revisa tu conexión e inténtalo de nuevo."
          onRetry={retry}
        />
      </section>
    )
  }

  return (
    <section>
      <PageHeader title="Libro no encontrado" backTo={back.to} backLabel={back.label} />
      <EmptyState
        icon={BookX}
        title="El enlace no lleva a un libro"
        description="Puede que esté incompleto."
        action={<Button onClick={() => navigate('/biblioteca')}>Ir a Mis libros</Button>}
      />
    </section>
  )
}
