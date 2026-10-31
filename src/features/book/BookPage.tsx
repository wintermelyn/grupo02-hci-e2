import { Sparkle } from 'lucide-react'
import type { CSSProperties } from 'react'
import { matchPath, useLocation, useParams } from 'react-router'
import { BackLink, BookCover, StatusControl, Wordmark } from '../../components'
import { coverTone } from '../../lib/coverTone'
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
  const edition = [year, pages && `${pages} páginas`].filter(Boolean).join(' · ')
  return (
    <div className="mt-1.5 text-sm text-muted md:text-base">
      <p>{authors.join(', ')}</p>
      {edition && <p>{edition}</p>}
    </div>
  )
}

/** Where the text comes from, so it reads like the author line and not like a warning. */
function DescriptionSource({ translated, live }: { translated?: boolean; live: boolean }) {
  if (translated) {
    return (
      <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
        <Sparkle aria-hidden size={14} fill="currentColor" strokeWidth={1.5} />
        Traducción hecha con IA
      </p>
    )
  }
  if (live)
    return <p className="mt-2 text-sm text-muted">Descripción de Open Library, sin traducir</p>
  return null
}

/** Always there, in the same place: most books have no description, and the page keeps its shape. */
function AboutBook({ book }: { book: Book }) {
  const { description, descriptionTranslated } = book
  const { searching, live } = useBookDescription(book)
  return (
    <section className="mt-7 lg:mt-10">
      <h2 className="section-title">Sobre este libro</h2>
      {description ? (
        <>
          <p className="mt-3 max-w-[60ch] wrap-break-word whitespace-pre-line">{description}</p>
          <DescriptionSource translated={descriptionTranslated} live={live} />
        </>
      ) : (
        <p className="mt-3 text-muted">
          {searching ? 'Buscando la descripción…' : 'Aún no tenemos descripción de este libro.'}
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
      <div className="flex items-center justify-between pt-3 lg:pt-8">
        <BackLink to={back.to} label={back.label} />
        <Wordmark />
      </div>

      {/*
        One shape for every book. The cover stands on the colour of its book, as in Descubrir, with
        everything that is read beside it, so a long description never leaves the page lopsided.
      */}
      <div className="md:mt-3 md:grid md:grid-cols-[17.5rem_minmax(0,1fr)] md:items-start md:gap-x-8 lg:grid-cols-[minmax(16.5rem,4fr)_minmax(0,7fr)] lg:gap-x-12">
        {/* The scene follows the reading on a long page. Its foot leaves room for the ribbon. */}
        <div
          style={{ '--tone': coverTone(book.id) } as CSSProperties}
          className="tone-scene flex justify-center rounded-stage pt-4 pb-6 md:sticky md:top-4 md:px-6 md:pt-10 md:pb-14"
        >
          <BookCover book={book} size="lg" status={entry?.status} raised />
        </div>

        <div className="min-w-0">
          <header className="mt-3 md:mt-0">
            <h1 className="page-title wrap-break-word hyphens-auto">{book.title}</h1>
            <BookDetails {...book} />
          </header>

          <dl className="mt-3 border-t border-line md:mt-5">
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
