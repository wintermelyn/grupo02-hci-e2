import { Plus } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router'
import { AnchoredMenu, Button, folderPath } from '../../components'
import { useStore } from '../../store'
import type { Book, LibraryEntry } from '../../types'
import { pinnedFirst } from '../library/filters'
import { LedgerRow } from './LedgerRow'

export interface BookFoldersProps {
  book: Book
  entry: LibraryEntry
}

/**
 * The links lead to each folder and the button next to them changes them. A quick change, so it is
 * a menu: adding and removing cost the same two taps, with or without folders. The button keeps its
 * place at the end of the first line, and it is the links that wrap.
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
  // Named after what the person came to do. With no folders, there is nothing to take out yet.
  const hasFolders = bookFolders.length > 0
  const change = hasFolders ? 'Agregar o quitar' : 'Agregar'
  // The row says "Carpetas" on screen; a screen reader that lands on the button needs it said.
  const changeName = hasFolders ? change : 'Agregar a carpeta'

  return (
    <LedgerRow label="Carpetas">
      <div className="flex items-start justify-between gap-3">
        {hasFolders ? (
          <ul className="flex min-w-0 flex-wrap gap-x-3">
            {bookFolders.map(({ id, name }) => (
              <li key={id} className="min-w-0">
                <Link
                  to={folderPath(id)}
                  className="inline-flex min-h-11 min-w-11 items-center font-medium wrap-anywhere underline decoration-muted/50 underline-offset-4 hover:decoration-ink"
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="flex min-h-11 items-center text-muted">Sin carpetas</p>
        )}
        <AnchoredMenu
          label={`Carpetas de «${book.title}»`}
          kind="checkbox"
          checkedLabel="Agregado"
          align="end"
          resetKey={book.id}
          // Its text ends where "Cambiar o quitar" ends, on the row above.
          className="-mr-2 shrink-0"
          options={options}
          trigger={(triggerProps) => (
            <Button
              {...triggerProps}
              variant="quiet"
              compact
              // The plus only says half of "Agregar o quitar".
              icon={hasFolders ? undefined : Plus}
              aria-label={`${changeName}: «${book.title}»`}
            >
              {change}
            </Button>
          )}
        />
      </div>
    </LedgerRow>
  )
}
