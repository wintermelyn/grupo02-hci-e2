import { RotateCcw, Sparkle } from 'lucide-react'
import { matchPath, useLocation, useParams } from 'react-router'
import { BookCover, Button, StatusControl } from '../../components'
import { useCatalogBook } from '../../lib/catalog'
import { selectBook, selectEntry, useStore } from '../../store'
import type { Book, Folder, ReadingStatus } from '../../types'
import { UNFILED_NAME, UNFILED_PATH } from '../library/filters'
import { BookFolders } from './BookFolders'
import {
  BOOK_ABOUT,
  BOOK_COLUMNS,
  BOOK_COVER,
  BOOK_READING,
  BOOK_RECORD,
  BookTopRow,
} from './BookSkeleton'
import { LedgerRow } from './LedgerRow'
import { MissingBook } from './MissingBook'
import { ReadingDetails } from './ReadingDetails'
import { useBookDescription } from './useBookDescription'

const LIBRARY_PATH = '/biblioteca'
const SEARCH_PATH = '/buscar'
const FOLDER_PATTERN = `${LIBRARY_PATH}/carpeta/:folderId`

/** The tags that have a reading to show. Lo quiero and Lo tengo keep theirs, out of sight. */
const WITH_READING: readonly ReadingStatus[] = ['reading', 'read']

/** BookRow says which list the book was opened from; a shared link has no such state. */
function backTarget(state: unknown, folders: Folder[]): { to: string; label: string } {
  const from = (state as { from?: string } | null)?.from
  if (!from) return { to: LIBRARY_PATH, label: 'Mis libros' }
  const [pathname] = from.split('?')
  if (pathname === LIBRARY_PATH) return { to: from, label: 'Mis libros' }
  if (pathname === UNFILED_PATH) return { to: from, label: UNFILED_NAME }
  if (pathname === SEARCH_PATH) return { to: from, label: 'Buscar' }
  const folderId = matchPath(FOLDER_PATTERN, pathname)?.params.folderId
  const folder = folders.find(({ id }) => id === folderId)
  return { to: from, label: folder?.name ?? 'Volver' }
}

function BookDetails({ authors, year, pages }: Book) {
  // The number and its unit stay together.
  const edition = [year, pages && `${pages} páginas`].filter(Boolean).join(' · ')
  return (
    <div className="mt-1 text-sm wrap-break-word text-muted md:mt-1.5 md:text-base">
      <p>{authors.join(', ') || 'Autor desconocido'}</p>
      {edition && <p>{edition}</p>}
    </div>
  )
}

/** Where the text comes from, so it reads like the author line and not like a warning. */
function TranslatedByAI() {
  return (
    <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
      <Sparkle aria-hidden size={14} fill="currentColor" strokeWidth={1.5} />
      Traducción hecha con IA
    </p>
  )
}

/** Only the text failed, so the page stays and only this section offers to try again. */
function DescriptionFailed({ onRetry }: { onRetry: () => void }) {
  return (
    <p
      role="status"
      className="mt-3 flex items-center gap-2 rounded-row bg-shell py-1 pr-1 pl-3 text-sm"
    >
      <span className="min-w-0 flex-1">No pudimos cargar la descripción.</span>
      <Button compact variant="quiet" icon={RotateCcw} onClick={onRetry}>
        Reintentar
      </Button>
    </p>
  )
}

/** Always there, in the same place: most books have no description, and the page keeps its shape. */
function AboutBook({ book }: { book: Book }) {
  const { description, descriptionTranslated, loading, failed, retry } = useBookDescription(book)
  return (
    <section className={BOOK_ABOUT}>
      <h2 className="section-title">Sobre este libro</h2>
      {description ? (
        <>
          <p className="mt-3 max-w-[60ch] wrap-break-word whitespace-pre-line">{description}</p>
          {descriptionTranslated && <TranslatedByAI />}
        </>
      ) : failed ? (
        <DescriptionFailed onRetry={retry} />
      ) : (
        <p className="mt-3 text-muted">
          {loading ? 'Buscando la descripción…' : 'Aún no tenemos descripción de este libro.'}
        </p>
      )}
    </section>
  )
}

export function BookPage() {
  const { bookId = '' } = useParams()
  const { state } = useLocation()
  const stored = useStore(selectBook(bookId))
  const listed = useCatalogBook(bookId)
  const book = stored ?? listed
  const entry = useStore(selectEntry(bookId))
  const folders = useStore((state) => state.folders)
  const back = backTarget(state, folders)

  if (!book) return <MissingBook key={bookId} bookId={bookId} back={back} />

  return (
    <article>
      <BookTopRow back={back} />

      {/*
        One shape for every book. On a phone the title goes beside the cover, and from a tablet up
        everything that is read does, so a long description never leaves the page lopsided.
      */}
      <div className={BOOK_COLUMNS}>
        <div className={BOOK_COVER}>
          <BookCover book={book} size="lg" status={entry?.status} />
        </div>

        <div className={BOOK_READING}>
          <header className="min-w-0">
            <h1 className="font-serif text-heading font-semibold tracking-tight wrap-break-word md:page-title">
              {book.title}
            </h1>
            <BookDetails {...book} />
          </header>

          <dl className={BOOK_RECORD}>
            <LedgerRow label="Estado">
              {/* On a wide record, a full-width black pill would weigh more than the title. */}
              <StatusControl
                bookId={book.id}
                book={book}
                className={entry ? undefined : 'md:w-fit'}
              />
            </LedgerRow>
            {entry && WITH_READING.includes(entry.status) && (
              <ReadingDetails bookId={book.id} entry={entry} />
            )}
            {entry && <BookFolders book={book} entry={entry} />}
          </dl>

          <AboutBook book={book} />
        </div>
      </div>
    </article>
  )
}
