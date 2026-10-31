import { BookX } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Button, EmptyState, ErrorState, PageHeader } from '../../components'
import { fetchWork } from '../../lib/openlibrary'
import { useStore } from '../../store'
import type { BookId } from '../../types'
import { BookSkeleton } from './BookSkeleton'

export interface MissingBookProps {
  bookId: BookId
  back: { to: string; label: string }
}

/**
 * A book the store does not have, e.g. a link opened in another browser. Once found, upsertBook
 * makes the book page take over. Mount it with key={bookId}, so a new book starts over.
 */
export function MissingBook({ bookId, back }: MissingBookProps) {
  const navigate = useNavigate()
  const upsertBook = useStore((state) => state.upsertBook)
  const [load, setLoad] = useState<'loading' | 'missing' | 'failed'>('loading')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    // After leaving this book, a late answer must not land on the next one.
    let abandoned = false
    fetchWork(bookId).then(
      (book) => {
        if (abandoned) return
        if (book?.id === bookId) upsertBook(book)
        else setLoad('missing')
      },
      () => {
        if (!abandoned) setLoad('failed')
      },
    )
    return () => {
      abandoned = true
    }
  }, [bookId, attempt, upsertBook])

  function retry() {
    setLoad('loading')
    setAttempt((current) => current + 1)
  }

  if (load === 'loading') return <BookSkeleton back={back} />

  if (load === 'failed') {
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
