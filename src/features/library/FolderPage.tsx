import { FolderOpen, FolderX, SearchX } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import {
  Button,
  EmptyState,
  InlineConfirm,
  PageHeader,
  SearchField,
  TagFilter,
  type TagFilterValue,
} from '../../components'
import { cx } from '../../components/cx'
import { ignoreSecondClick } from '../../components/ignoreSecondClick'
import { STATUS_LABELS } from '../../lib/status'
import { useStore } from '../../store'
import type { Book, Folder } from '../../types'
import { BookList } from './BookList'
import {
  booksLabel,
  compareTitles,
  countByTag,
  folderNameProblem,
  matchesQuery,
  parseTag,
  TAG_PARAM,
  useBookLookup,
} from './filters'
import { FolderNameField } from './FolderNameField'
import { FolderOptions } from './FolderOptions'

const LIBRARY_PATH = '/biblioteca'
const QUERY_PARAM = 'q'

interface NoBooksProps {
  folder: Folder
  label?: string
  query: string
  /** How many books the folder has, whatever their tag. */
  total: number
  onShowAll: () => void
}

function NoBooks({ folder, label, query, total, onShowAll }: NoBooksProps) {
  // A book that changes its tag leaves this list but stays in the folder, so the way back is here.
  const showAll = label && <Button onClick={onShowAll}>Ver todos los libros</Button>

  if (query) {
    return (
      <EmptyState
        icon={SearchX}
        title="Sin resultados"
        description={
          label
            ? `Ningún libro con el estado «${label}» coincide con «${query}».`
            : `Ningún libro de «${folder.name}» coincide con «${query}».`
        }
        action={showAll}
      />
    )
  }
  return (
    <EmptyState
      icon={FolderOpen}
      title={`Ningún libro en «${label}»`}
      description={
        total === 1
          ? 'El libro de esta carpeta tiene otro estado.'
          : `Los ${total} libros de esta carpeta tienen otro estado.`
      }
      action={showAll}
    />
  )
}

type Editing = 'rename' | 'delete'

function FolderContent({ folder, onDelete }: { folder: Folder; onDelete: () => void }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const tag = parseTag(searchParams.get(TAG_PARAM))
  // The URL changes in a transition. The field needs its value at once, or it would lose letters.
  const [typed, setTyped] = useState(searchParams.get(QUERY_PARAM) ?? '')
  const [searching, setSearching] = useState(false)
  const [editing, setEditing] = useState<Editing>()
  const [name, setName] = useState('')
  const query = typed.trim()
  // On a phone the field covers the title, so a search that came back from the URL needs it open too.
  const searchOpen = searching || typed !== ''
  const library = useStore((state) => state.library)
  const renameFolder = useStore((state) => state.renameFolder)
  const bookOf = useBookLookup()
  const folders = useStore((state) => state.folders)
  const nameProblem = folderNameProblem(folder, name, folders)
  const optionsRef = useRef<HTMLDivElement>(null)
  const giveFocusBack = useRef(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const searchButtonRef = useRef<HTMLButtonElement>(null)
  const giveFocusToSearchButton = useRef(false)

  // What opened the editing is hidden while it lasts, so the focus can only return once it is back.
  useEffect(() => {
    if (editing || !giveFocusBack.current) return
    giveFocusBack.current = false
    optionsRef.current?.querySelector('button')?.focus()
  }, [editing])

  // The field is mounted from the start, for computers, so autoFocus would not run on opening it.
  useEffect(() => {
    if (searching) searchRef.current?.querySelector('input')?.focus()
  }, [searching])

  // The button only exists again once the field has closed. On a computer it stays hidden, so the
  // focus stays in the field.
  useEffect(() => {
    if (searchOpen || !giveFocusToSearchButton.current) return
    giveFocusToSearchButton.current = false
    searchButtonRef.current?.focus()
  }, [searchOpen])

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

  function closeSearch() {
    // Options takes the place of Cerrar, under the second tap of a double tap.
    ignoreSecondClick()
    giveFocusToSearchButton.current = true
    search('')
    setSearching(false)
  }

  function chooseTag(value: TagFilterValue) {
    setParam(TAG_PARAM, value === 'all' ? '' : value)
  }

  function startRename() {
    setName(folder.name)
    setEditing('rename')
  }

  function stopEditing() {
    giveFocusBack.current = true
    setEditing(undefined)
  }

  function saveName() {
    if (nameProblem) return
    renameFolder(folder.id, name)
    stopEditing()
  }

  const label = tag === 'all' ? undefined : STATUS_LABELS[tag]
  const renaming = editing === 'rename'
  const hasBooks = counts.all > 0

  return (
    <section>
      <PageHeader
        title={
          renaming ? (
            <FolderNameField
              folder={folder}
              value={name}
              onChange={setName}
              onSave={saveName}
              onCancel={stopEditing}
              problem={nameProblem}
            />
          ) : (
            // Next to two buttons, a long name took seven lines of a 320 px phone from the list.
            <span className="wrap-break-word max-md:line-clamp-2">{folder.name}</span>
          )
        }
        subtitle={folder.pinned ? 'Carpeta fija' : undefined}
        backTo={LIBRARY_PATH}
        backLabel="Mis libros"
        action={
          !renaming && (
            <div className="flex items-center gap-2">
              {hasBooks && (
                // A computer has room for the field. A phone covers this row with it, so it opens
                // under the finger and nothing below moves.
                <div
                  ref={searchRef}
                  className={cx(
                    'md:w-72',
                    searchOpen
                      ? 'max-md:absolute max-md:inset-0 max-md:flex max-md:items-center max-md:bg-shell'
                      : 'max-md:hidden',
                  )}
                >
                  <SearchField
                    label={`Buscar en «${folder.name}»`}
                    placeholder={`Buscar en ${folder.name}`}
                    value={typed}
                    onChange={search}
                    onClose={closeSearch}
                    className="w-full"
                  />
                </div>
              )}
              {hasBooks && !searchOpen && (
                <Button
                  ref={searchButtonRef}
                  compact
                  aria-label={`Buscar en «${folder.name}»`}
                  onClick={() => setSearching(true)}
                  className="md:hidden"
                >
                  Buscar
                </Button>
              )}
              {!folder.pinned && (
                <div ref={optionsRef} className={cx(searchOpen && 'max-md:hidden')}>
                  <FolderOptions
                    folder={folder}
                    onRename={startRename}
                    onDelete={() => setEditing('delete')}
                  />
                </div>
              )}
            </div>
          )
        }
      >
        {renaming && (
          <div className="mt-1 mb-3 flex gap-2">
            <Button variant="primary" onClick={saveName} disabled={Boolean(nameProblem)}>
              Guardar
            </Button>
            <Button onClick={stopEditing}>Cancelar</Button>
          </div>
        )}
        <TagFilter value={tag} counts={counts} onChange={chooseTag} />
      </PageHeader>

      {editing === 'delete' && (
        <InlineConfirm
          title={`Eliminar «${folder.name}»`}
          confirmLabel="Eliminar carpeta"
          onConfirm={onDelete}
          onCancel={stopEditing}
          className="mt-3"
        >
          {!hasBooks
            ? 'Esta carpeta no tiene libros.'
            : `Esta carpeta tiene ${booksLabel(counts.all)}. ${
                counts.all === 1 ? 'El libro sigue' : 'Los libros siguen'
              } en tu biblioteca.`}
        </InlineConfirm>
      )}

      {!hasBooks ? (
        <EmptyState
          icon={FolderOpen}
          title="Esta carpeta está vacía"
          description="Abre un libro y toca «Agregar» en la fila Carpetas."
        />
      ) : (
        <>
          {/* The list changes while typing, which a screen reader would not otherwise hear. */}
          <p role="status" className="sr-only">
            {query && booksLabel(books.length)}
          </p>
          {books.length > 0 ? (
            <BookList title={label ?? 'Libros'} books={books} />
          ) : (
            <NoBooks
              folder={folder}
              label={label}
              query={query}
              total={counts.all}
              onShowAll={() => chooseTag('all')}
            />
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
    // The button goes away with this page, before it can guard against the second tap.
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
          title="El enlace no lleva a una carpeta"
          description="Puede que la hayas eliminado o que esté incompleto."
          action={<Button onClick={() => navigate(LIBRARY_PATH)}>Ir a Mis libros</Button>}
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
