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
  Wordmark,
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

function BookDetails({ authors, year, pages }: Book) {
  // The number and its unit stay together, and in a narrow column the author gets its own line.
  const edition = [year, pages && `${pages}\u00a0páginas`].filter(Boolean).join(' · ')
  return (
    <p className="mt-0.5 text-muted">
      <span className="short:block">{authors.join(', ')}</span>
      {edition && (
        <>
          <span className="short:hidden"> · </span>
          <span className="short:block">{edition}</span>
        </>
      )}
    </p>
  )
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
                className="inline-flex min-h-11 items-center rounded-control bg-sand px-3 font-medium transition-[background-color,translate] duration-100 hover:bg-sand-deep active:translate-y-px active:bg-sand-deep"
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
    <article>
      <div className="full-bleed flex items-center justify-between bg-shell pt-2 short:bg-transparent md:mx-0 md:bg-transparent md:px-0 md:pt-6">
        <BackLink to={back.to} label={back.label} />
        <Wordmark />
      </div>

      {/* On a short phone the cover moves next to the title, so the menu fits without scrolling. */}
      <div className="short:grid short:grid-cols-[5.5rem_minmax(0,1fr)] short:items-center short:gap-x-3.5 md:mt-2 md:grid md:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] md:grid-rows-[auto_1fr] md:items-start md:gap-x-10">
        <div className="full-bleed flex justify-center bg-shell pt-1 pb-9 short:mx-0 short:bg-transparent short:p-0 short:pb-4 md:row-span-2 md:mx-0 md:rounded-card md:px-0 md:pt-6 md:pb-11">
          <BookCover book={book} size="lg" status={entry?.status} />
        </div>

        <header className="pt-6 text-center short:pt-0 short:text-left md:pt-0 md:text-left">
          <h1 className="font-serif text-title font-semibold tracking-tight short:text-heading md:text-display">
            {book.title}
          </h1>
          <BookDetails {...book} />
        </header>

        <div className="short:col-span-2 md:col-start-2">
          <StatusControl bookId={book.id} book={book} className="mt-3.5 md:max-w-[34rem]" />

          {entry && <BookFolders entry={entry} />}

          <section className="mt-5">
            <h2 className="text-sm font-semibold text-muted">Sobre este libro</h2>
            {book.description ? (
              <p className="mt-1 max-w-[34rem] whitespace-pre-line">{book.description}</p>
            ) : (
              <p className="mt-1 text-muted">Aún no tenemos descripción de este libro.</p>
            )}
          </section>
        </div>
      </div>
    </article>
  )
}
