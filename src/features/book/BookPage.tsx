import { matchPath, useLocation, useParams } from 'react-router'
import { BackLink, BookCover, StatusControl, Wordmark } from '../../components'
import { selectBook, selectEntry, useStore } from '../../store'
import type { Book, Folder, ReadingStatus } from '../../types'
import { BookFolders } from './BookFolders'
import { LedgerRow } from './LedgerRow'
import { MissingBook } from './MissingBook'
import { ReadingDetails } from './ReadingDetails'
import { useBookDescription } from './useBookDescription'

const LIBRARY_PATH = '/biblioteca'
const FOLDER_PATTERN = `${LIBRARY_PATH}/carpeta/:folderId`

/** The tags that have a reading to show. Lo quiero and Lo tengo keep theirs, out of sight. */
const WITH_READING: readonly ReadingStatus[] = ['reading', 'read']

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
  // The number and its unit stay together.
  const edition = [year, pages && `${pages} páginas`].filter(Boolean).join(' · ')
  return (
    <div className="mt-1 text-sm text-muted md:text-base">
      <p>{authors.join(', ')}</p>
      {edition && <p>{edition}</p>}
    </div>
  )
}

/** Always there, in the same place: most books have no description, and the page keeps its shape. */
function AboutBook({ book }: { book: Book }) {
  const { description, descriptionTranslated } = book
  const loading = useBookDescription(book)
  return (
    <section className="col-span-2 mt-5 min-w-0 md:col-span-1 md:col-start-2 lg:col-start-3 lg:border-t lg:border-line lg:pt-2.5">
      <h2 className="font-serif text-lg font-semibold">Sobre este libro</h2>
      {description ? (
        <>
          <p className="mt-1 wrap-break-word whitespace-pre-line">{description}</p>
          {/* Where the text comes from, so it reads like the author line and not like a warning. */}
          {descriptionTranslated && (
            <p className="mt-2 text-sm text-muted">Traducción hecha con IA</p>
          )}
        </>
      ) : (
        <p className="mt-1 text-muted">
          {loading ? 'Buscando la descripción…' : 'Aún no tenemos descripción de este libro.'}
        </p>
      )}
    </section>
  )
}

export function BookPage() {
  const { bookId = '' } = useParams()
  const { state } = useLocation()
  const book = useStore(selectBook(bookId))
  const entry = useStore(selectEntry(bookId))
  const folders = useStore((state) => state.folders)
  const back = backTarget(state, folders)

  if (!book) return <MissingBook key={bookId} bookId={bookId} back={back} />

  return (
    <article>
      <div className="flex items-center justify-between pt-2 md:pt-4">
        <BackLink to={back.to} label={back.label} />
        <Wordmark />
      </div>

      {/*
        One shape for every book. From lg, the description takes the third column instead of pushing
        itself under the fold. The last row takes what the cover has left, so the description follows
        the record at md, however short the record is.
      */}
      <div className="mt-1 grid grid-cols-[7rem_minmax(0,1fr)] gap-x-4 md:mt-3 md:grid-cols-[14rem_minmax(0,34rem)] md:grid-rows-[auto_auto_1fr] md:gap-x-10 lg:grid-cols-[14rem_minmax(0,1.2fr)_minmax(0,1fr)]">
        {/* The ribbon hangs below the cover, so the block leaves it room. */}
        <div className="pb-3 md:row-span-3 md:pb-5">
          <BookCover book={book} size="lg" status={entry?.status} />
        </div>

        <header className="min-w-0 lg:col-span-2">
          <h1 className="font-serif text-heading font-semibold tracking-tight hyphens-auto md:text-display">
            {book.title}
          </h1>
          <BookDetails {...book} />
        </header>

        <dl className="col-span-2 mt-2 min-w-0 self-start border-t border-line md:col-span-1 md:col-start-2 md:mt-5">
          <LedgerRow label="Estado">
            <StatusControl bookId={book.id} book={book} />
          </LedgerRow>
          {entry && WITH_READING.includes(entry.status) && (
            <ReadingDetails bookId={book.id} entry={entry} />
          )}
          {entry && <BookFolders book={book} entry={entry} />}
        </dl>

        <AboutBook book={book} />
      </div>
    </article>
  )
}
