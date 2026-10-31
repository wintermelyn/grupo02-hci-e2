import { FolderOpen, FolderX } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import {
  Button,
  EmptyState,
  InlineConfirm,
  PageHeader,
  TagFilter,
  TextField,
  type TagFilterValue,
} from '../../components'
import { cx } from '../../components/cx'
import { ignoreSecondClick } from '../../components/ignoreSecondClick'
import { STATUS_LABELS } from '../../lib/status'
import { useStore } from '../../store'
import type { Folder } from '../../types'
import { BandSearch } from './BandSearch'
import { BookList } from './BookList'
import {
  booksLabel,
  countByTag,
  folderNameProblem,
  LIBRARY_PATH,
  MAX_FOLDER_NAME_LENGTH,
  TAG_PARAM,
  useFilteredBooks,
} from './filters'
import { FolderOptions } from './FolderOptions'
import { NoBooks } from './NoBooks'
import { useListFilters } from './useListFilters'

type Editing = 'rename' | 'delete'

function FolderContent({ folder, onDelete }: { folder: Folder; onDelete: () => void }) {
  const { tag, typed, query, search, setParams } = useListFilters()
  const [editing, setEditing] = useState<Editing>()
  const [name, setName] = useState('')
  const library = useStore((state) => state.library)
  const renameFolder = useStore((state) => state.renameFolder)
  const folders = useStore((state) => state.folders)
  const nameProblem = folderNameProblem(name, folders, folder.id)
  const optionsRef = useRef<HTMLDivElement>(null)
  const giveFocusBack = useRef(false)

  // What opened the editing is hidden while it lasts, so the focus can only return once it is back.
  useEffect(() => {
    if (editing || !giveFocusBack.current) return
    giveFocusBack.current = false
    optionsRef.current?.querySelector('button')?.focus()
  }, [editing])

  const entries = useMemo(
    () => Object.values(library).filter(({ folderIds }) => folderIds.includes(folder.id)),
    [library, folder.id],
  )
  const counts = useMemo(() => countByTag(entries), [entries])

  const books = useFilteredBooks(entries, tag, query)

  function chooseTag(value: TagFilterValue) {
    setParams({ [TAG_PARAM]: value === 'all' ? '' : value })
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
  const deleting = editing === 'delete'
  const hasBooks = counts.all > 0
  const options = !folder.pinned && (
    <div ref={optionsRef}>
      <FolderOptions folder={folder} onRename={startRename} onDelete={() => setEditing('delete')} />
    </div>
  )

  return (
    <section>
      <PageHeader
        title={
          renaming ? (
            // From md the buttons go beside the field, in the row of the title: the list stays put.
            <span className="flex flex-col md:flex-row md:items-start md:gap-2">
              {/* On a computer the type of the title makes the field 2 px taller than the row. */}
              <span className="block min-w-0 md:max-w-120 md:flex-1 lg:-my-px">
                <TextField
                  label={`Nombre de «${folder.name}»`}
                  value={name}
                  onChange={setName}
                  onSubmit={saveName}
                  onCancel={stopEditing}
                  problem={nameProblem}
                  maxLength={MAX_FOLDER_NAME_LENGTH}
                />
              </span>
              <span className="mt-3 mb-1 flex shrink-0 gap-2 font-sans text-base tracking-normal md:my-0">
                <Button variant="primary" onClick={saveName} disabled={Boolean(nameProblem)}>
                  Guardar
                </Button>
                <Button onClick={stopEditing}>Cancelar</Button>
              </span>
            </span>
          ) : (
            // Next to two buttons, a long name took seven lines of a 320 px phone from the list.
            <span className="wrap-break-word max-md:line-clamp-2">{folder.name}</span>
          )
        }
        subtitle={folder.pinned ? 'Carpeta fija' : undefined}
        backTo={LIBRARY_PATH}
        backLabel="Mis libros"
        action={
          !renaming &&
          (hasBooks ? (
            <BandSearch
              label={`Buscar en «${folder.name}»`}
              placeholder={`Buscar en ${folder.name}`}
              value={typed}
              onChange={search}
            >
              {options}
            </BandSearch>
          ) : (
            options
          ))
        }
      >
        <div className="relative">
          {/* From md the question stands where the tags were, which keep their height. */}
          <div className={cx(deleting && 'md:invisible')}>
            <TagFilter value={tag} counts={counts} onChange={chooseTag} />
          </div>
          {deleting && (
            <InlineConfirm
              title={`Eliminar «${folder.name}»`}
              confirmLabel="Eliminar carpeta"
              onConfirm={onDelete}
              onCancel={stopEditing}
              oneLine
              // It takes the 56 px of the tags, which keep 8 px from the search and from the list.
              className="mt-3 md:absolute md:inset-0 md:mt-0"
            >
              {!hasBooks
                ? 'Esta carpeta no tiene libros.'
                : `Esta carpeta tiene ${booksLabel(counts.all)}. ${
                    counts.all === 1 ? 'Sigue' : 'Siguen'
                  } en Mis libros.`}
            </InlineConfirm>
          )}
        </div>
      </PageHeader>

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
            <BookList
              title={label ?? 'Libros'}
              books={books}
              showFolders={tag !== 'all'}
              openFolderId={folder.id}
            />
          ) : (
            <NoBooks
              name={folder.name}
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
