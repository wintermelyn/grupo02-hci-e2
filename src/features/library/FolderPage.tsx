import { FolderOpen, FolderX, SearchX } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import { EmptyState, PageHeader, SearchField, TagFilter } from '../../components'
import { ignoreSecondClick } from '../../components/ignoreSecondClick'
import { STATUS_LABELS } from '../../lib/status'
import { useStore } from '../../store'
import type { Book, Folder } from '../../types'
import { BookList } from './BookList'
import {
  booksLabel,
  compareTitles,
  countByTag,
  matchesQuery,
  parseTag,
  TAG_PARAM,
  useBookLookup,
} from './filters'
import { FolderOptions } from './FolderOptions'

const LIBRARY_PATH = '/biblioteca'
const QUERY_PARAM = 'q'

function NoBooks({ folder, label, query }: { folder: Folder; label?: string; query: string }) {
  if (query) {
    return (
      <EmptyState
        icon={SearchX}
        title="Sin resultados"
        description={
          label
            ? `Ningún libro con el estado «${label}» coincide con «${query}». Prueba con «Todos».`
            : `Ningún libro de «${folder.name}» coincide con «${query}».`
        }
      />
    )
  }
  return (
    <EmptyState
      icon={FolderOpen}
      title="Aún no hay libros aquí"
      description={`Cuando un libro de esta carpeta tenga el estado «${label}», va a aparecer en esta lista.`}
    />
  )
}

function FolderContent({ folder, onDelete }: { folder: Folder; onDelete: () => void }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const tag = parseTag(searchParams.get(TAG_PARAM))
  // The URL changes in a transition. The field needs its value at once, or it would lose letters.
  const [typed, setTyped] = useState(searchParams.get(QUERY_PARAM) ?? '')
  const query = typed.trim()
  const library = useStore((state) => state.library)
  const bookOf = useBookLookup()

  const entries = useMemo(
    () => Object.values(library).filter(({ folderIds }) => folderIds.includes(folder.id)),
    [library, folder.id],
  )
  const counts = useMemo(() => countByTag(entries), [entries])

  const books = useMemo<Book[]>(
    () =>
      entries
        .filter(({ status }) => tag === 'all' || status === tag)
        .flatMap(({ bookId }) => bookOf(bookId) ?? [])
        .filter((book) => matchesQuery(book, query))
        .sort(compareTitles),
    [entries, tag, query, bookOf],
  )

  // Replaces the entry, so the book page comes back to this list and Back leaves the folder.
  function setParam(name: string, value: string) {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current)
        if (value) next.set(name, value)
        else next.delete(name)
        return next
      },
      { replace: true },
    )
  }

  function search(value: string) {
    setTyped(value)
    setParam(QUERY_PARAM, value)
  }

  const label = tag === 'all' ? undefined : STATUS_LABELS[tag]

  return (
    <section>
      <PageHeader
        title={folder.name}
        subtitle={`${booksLabel(counts.all)}${folder.pinned ? ' · fija' : ''}`}
        backTo={LIBRARY_PATH}
        backLabel="Mis libros"
        action={
          !folder.pinned && (
            <FolderOptions folder={folder} bookCount={counts.all} onDelete={onDelete} />
          )
        }
      >
        <TagFilter
          value={tag}
          counts={counts}
          onChange={(value) => setParam(TAG_PARAM, value === 'all' ? '' : value)}
        />
      </PageHeader>

      {counts.all === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="Esta carpeta está vacía"
          description="Abre un libro y agrégalo aquí desde su bloque «Carpetas»."
        />
      ) : (
        <>
          <SearchField
            label={`Buscar en «${folder.name}»`}
            placeholder="Título o autor"
            value={typed}
            onChange={search}
            className="mt-5 md:max-w-lg"
          />
          {/* The list changes while typing, which a screen reader would not otherwise hear. */}
          <p role="status" className="sr-only">
            {query && booksLabel(books.length)}
          </p>
          {books.length > 0 ? (
            <BookList title={label ?? 'Libros'} books={books} />
          ) : (
            <NoBooks folder={folder} label={label} query={query} />
          )}
        </>
      )}
    </section>
  )
}

export function FolderPage() {
  const { folderId } = useParams()
  const navigate = useNavigate()
  const folders = useStore((state) => state.folders)
  const deleteFolder = useStore((state) => state.deleteFolder)
  const folder = useMemo(() => folders.find(({ id }) => id === folderId), [folders, folderId])
  const [leaving, setLeaving] = useState(false)

  function deleteAndLeave(id: string) {
    // The store changes first and the URL right after, which must not flash "Carpeta no encontrada".
    setLeaving(true)
    // The panel goes away with this page, before it can guard against the second tap.
    ignoreSecondClick()
    navigate(LIBRARY_PATH, { replace: true })
    deleteFolder(id)
  }

  if (leaving) return null

  if (!folder) {
    return (
      <section>
        <PageHeader title="Carpeta no encontrada" backTo={LIBRARY_PATH} backLabel="Mis libros" />
        <EmptyState
          icon={FolderX}
          title="No encontramos esta carpeta"
          description="Puede que la hayas eliminado o que el enlace esté incompleto. Vuelve a Mis libros para seguir."
        />
      </section>
    )
  }

  return (
    <FolderContent
      // A new folder starts with its own search.
      key={folder.id}
      folder={folder}
      onDelete={() => deleteAndLeave(folder.id)}
    />
  )
}
