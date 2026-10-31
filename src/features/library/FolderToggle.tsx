import { Plus } from 'lucide-react'
import type { MouseEvent } from 'react'
import { Button } from '../../components'
import { selectEntry, useStore } from '../../store'
import type { Book, Folder } from '../../types'

export interface FolderToggleProps {
  book: Book
  folder: Folder
}

/**
 * Agregar and Quitar are one button that stays in its place, so the row does not move and the next
 * book stays where it was. They weigh the same and take one tap, and the toast offers Deshacer.
 */
export function FolderToggle({ book, folder }: FolderToggleProps) {
  const entry = useStore(selectEntry(book.id))
  const addToFolder = useStore((state) => state.addToFolder)
  const removeFromFolder = useStore((state) => state.removeFromFolder)
  const inFolder = entry?.folderIds.includes(folder.id) ?? false

  // Agregar turns into Quitar under the finger, so a double tap must not take the book out again.
  function toggle({ detail }: MouseEvent) {
    if (detail > 1) return
    const change = inFolder ? removeFromFolder : addToFolder
    change([book.id], folder.id)
  }

  return (
    // Its text ends on the margin, whichever of the two it says.
    <div className="-mr-2.5 flex w-20 justify-end min-[360px]:w-26">
      <Button
        variant="quiet"
        compact
        icon={inFolder ? undefined : Plus}
        aria-label={
          inFolder
            ? `Quitar «${book.title}» de «${folder.name}»`
            : `Agregar «${book.title}» a «${folder.name}»`
        }
        onClick={toggle}
        // What goes first in a narrow row is the icon, not the text.
        className="max-[359px]:[&>svg]:hidden"
      >
        {inFolder ? 'Quitar' : 'Agregar'}
      </Button>
    </div>
  )
}
