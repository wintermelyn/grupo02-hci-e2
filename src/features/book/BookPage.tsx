import { BookX } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useLocation, useParams } from 'react-router'
import {
  BackLink,
  BookCover,
  EmptyState,
  folderPath,
  PageHeader,
  StatusControl,
} from '../../components'
import { selectBook, selectEntry, useStore } from '../../store'
import type { Book, LibraryEntry } from '../../types'

const LIBRARY_PATH = '/biblioteca'

/** BookRow says which list the book was opened from; a shared link has no such state. */
function backTarget(state: unknown): { to: string; label: string } {
  const from = (state as { from?: string } | null)?.from
  if (!from) return { to: LIBRARY_PATH, label: 'Mis libros' }
  const isLibrary = from === LIBRARY_PATH || from.startsWith(`${LIBRARY_PATH}?`)
  return { to: from, label: isLibrary ? 'Mis libros' : 'Volver' }
}

function bookDetails({ authors, year, pages }: Book): string {
  return [authors.join(', '), year, pages && `${pages} páginas`].filter(Boolean).join(' · ')
}

function BookFolders({ entry }: { entry: LibraryEntry }) {
  const folders = useStore((state) => state.folders)
  const bookFolders = useMemo(
    () => folders.filter(({ id }) => entry.folderIds.includes(id)),
    [folders, entry.folderIds],
  )

  return (
    <section className="mt-5">
      <h2 className="text-sm font-semibold text-muted">Carpetas</h2>
      {bookFolders.length > 0 ? (
        <ul className="mt-1 flex flex-wrap gap-2">
          {bookFolders.map(({ id, name }) => (
            <li key={id}>
              <Link
                to={folderPath(id)}
                className="inline-flex min-h-11 items-center rounded-control bg-sand px-3 font-medium transition-colors duration-100 hover:bg-line active:bg-shell"
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-1 text-muted">Este libro no está en ninguna carpeta.</p>
      )}
    </section>
  )
}

export function BookPage() {
  const { bookId = '' } = useParams()
  const { state } = useLocation()
  const book = useStore(selectBook(bookId))
  const entry = useStore(selectEntry(bookId))
  const back = backTarget(state)

  if (!book) {
    return (
      <section>
        <PageHeader title="Libro no encontrado" backTo={back.to} backLabel={back.label} />
        <EmptyState
          icon={BookX}
          title="No encontramos este libro"
          description="Puede que el enlace esté incompleto. Vuelve a Mis libros para seguir."
        />
      </section>
    )
  }

  return (
    // On short screens the page always has room to scroll, so the menu can open below the control.
    <article className="[@media(max-height:640px)]:min-h-[calc(100dvh+2.5rem)]">
      <div className="full-bleed bg-shell pt-2 md:mx-0 md:bg-transparent md:px-0 md:pt-6">
        <BackLink to={back.to} label={back.label} />
      </div>

      <div className="md:mt-2 md:grid md:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] md:items-start md:gap-10">
        {/* The band keeps the cover in view: the menu always opens below it. */}
        <div className="full-bleed flex justify-center bg-shell pt-1 pb-9 md:mx-0 md:rounded-card md:px-0 md:pt-9 md:pb-12">
          <BookCover
            book={book}
            size="lg"
            status={entry?.status}
            className="[@media(max-height:640px)]:w-28"
          />
        </div>

        <div className="pt-6 md:pt-0">
          <header className="text-center md:text-left">
            <h1 className="font-serif text-title font-semibold tracking-tight md:text-display">
              {book.title}
            </h1>
            <p className="mt-0.5 text-muted">{bookDetails(book)}</p>
          </header>

          <StatusControl bookId={book.id} book={book} className="mt-3.5 md:max-w-sm" />

          {entry && <BookFolders entry={entry} />}

          {book.description && (
            <section className="mt-5">
              <h2 className="text-sm font-semibold text-muted">Sobre este libro</h2>
              <p className="mt-1 max-w-prose whitespace-pre-line">{book.description}</p>
            </section>
          )}
        </div>
      </div>
    </article>
  )
}
