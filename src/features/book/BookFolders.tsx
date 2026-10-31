import { Pencil } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router'
import { AnchoredMenu, Button, folderPath } from '../../components'
import { useStore } from '../../store'
import type { Book, LibraryEntry } from '../../types'
import { pinnedFirst } from '../library/filters'

export interface BookFoldersProps {
  book: Book
  entry: LibraryEntry
}

/**
 * The chips lead to each folder and the control next to them changes them. A quick change, so it
 * is a menu: adding and removing cost the same two taps, with or without folders.
 */
export function BookFolders({ book, entry }: BookFoldersProps) {
  const folders = useStore((state) => state.folders)
  const addToFolder = useStore((state) => state.addToFolder)
  const removeFromFolder = useStore((state) => state.removeFromFolder)
  const bookFolders = useMemo(
    () => folders.filter(({ id }) => entry.folderIds.includes(id)),
    [folders, entry.folderIds],
  )
  const options = useMemo(
    () =>
      pinnedFirst(folders).map(({ id, name }) => {
        const checked = entry.folderIds.includes(id)
        return {
          id,
          label: name,
          checked,
          onSelect: () => (checked ? removeFromFolder : addToFolder)([book.id], id),
        }
      }),
    [folders, entry.folderIds, book.id, addToFolder, removeFromFolder],
  )

  return (
    <section className="mt-5 md:max-w-[34rem]">
      <h2 className="text-sm font-semibold text-muted">Carpetas</h2>
      <div className="mt-1 flex items-start justify-between gap-2">
        {bookFolders.length > 0 ? (
          <ul className="flex min-w-0 flex-wrap gap-2">
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
          <p className="min-w-0 py-2.5 text-muted">Este libro no está en ninguna carpeta.</p>
        )}
        <AnchoredMenu
          label={`Carpetas de «${book.title}»`}
          kind="checkbox"
          checkedLabel="Agregado"
          align="end"
          resetKey={book.id}
          className="shrink-0"
          options={options}
          trigger={(triggerProps) => (
            <Button
              {...triggerProps}
              icon={Pencil}
              aria-label={`Cambiar carpetas de «${book.title}»`}
            >
              Cambiar
            </Button>
          )}
        />
      </div>
    </section>
  )
}
