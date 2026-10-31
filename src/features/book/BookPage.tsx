import { BookMinus } from 'lucide-react'
import { useRef } from 'react'
import { matchPath, useLocation, useParams } from 'react-router'
import { BackLink, BookCover, Button, StatusControl, Wordmark } from '../../components'
import { selectBook, selectEntry, useStore } from '../../store'
import type { Book, Folder } from '../../types'
import { BookFolders } from './BookFolders'
import { MissingBook } from './MissingBook'
import { ReadingDetails } from './ReadingDetails'

const LIBRARY_PATH = '/biblioteca'
const FOLDER_PATTERN = `${LIBRARY_PATH}/carpeta/:folderId`

/** BookRow says which list the book was opened from; a shared link has no such state. */
function backTarget(state: unknown, folders: Folder[]): { to: string; label: string } {
  const from = (state as { from?: string } | null)?.from
  if (!from) return { to: LIBRARY_PATH, label: 'Mis libros' }
  const [pathname] = from.split('?')
  if (pathname === LIBRARY_PATH) return { to: from, label: 'Mis libros' }
  const folderId = matchPath(FOLDER_PATTERN, pathname)?.params.folderId
  const folder = folders.find(({ id }) => id === folderId)
  return { to: from, label: folder?.name ?? 'Volver' }
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

export function BookPage() {
  const { bookId = '' } = useParams()
  const { state } = useLocation()
  const book = useStore(selectBook(bookId))
  const entry = useStore(selectEntry(bookId))
  const folders = useStore((state) => state.folders)
  const removeFromLibrary = useStore((state) => state.removeFromLibrary)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const back = backTarget(state, folders)

  if (!book) return <MissingBook key={bookId} bookId={bookId} back={back} />

  function remove() {
    removeFromLibrary([bookId])
    // The button leaves with the book, and the focus must not fall back to the top of the page.
    titleRef.current?.focus()
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
          <h1
            ref={titleRef}
            tabIndex={-1}
            className="font-serif text-title font-semibold tracking-tight short:text-heading md:text-display"
          >
            {book.title}
          </h1>
          <BookDetails {...book} />
        </header>

        <div className="short:col-span-2 md:col-start-2">
          <StatusControl bookId={book.id} book={book} className="mt-3.5 md:max-w-[34rem]" />

          {entry?.status === 'read' && <ReadingDetails bookId={book.id} entry={entry} />}

          {entry && <BookFolders book={book} entry={entry} />}

          <section className="mt-5">
            <h2 className="text-sm font-semibold text-muted">Sobre este libro</h2>
            {book.description ? (
              <p className="mt-1 max-w-[34rem] whitespace-pre-line">{book.description}</p>
            ) : (
              <p className="mt-1 text-muted">Aún no tenemos descripción de este libro.</p>
            )}
          </section>

          {entry && (
            <Button icon={BookMinus} onClick={remove} className="mt-5">
              Quitar de mi biblioteca
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}
