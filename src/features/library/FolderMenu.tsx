import { useMemo } from 'react'
import { AnchoredMenu, type AnchoredMenuProps } from '../../components'
import { useStore } from '../../store'
import type { Book } from '../../types'
import { pinnedFirst } from './filters'

export interface FolderMenuProps {
  book: Book
  /** The folders the book is in. */
  folderIds: string[]
  /** The control, which spreads the props it receives. */
  trigger: AnchoredMenuProps['trigger']
  className?: string
}

/** Every folder, each a tap to add the book or take it out: a quick change, undone from the toast. */
export function FolderMenu({ book, folderIds, trigger, className }: FolderMenuProps) {
  const folders = useStore((state) => state.folders)
  const addToFolder = useStore((state) => state.addToFolder)
  const removeFromFolder = useStore((state) => state.removeFromFolder)
  const options = useMemo(
    () =>
      pinnedFirst(folders).map(({ id, name }) => {
        const checked = folderIds.includes(id)
        return {
          id,
          label: name,
          checked,
          onSelect: () => (checked ? removeFromFolder : addToFolder)([book.id], id),
        }
      }),
    [folders, folderIds, book.id, addToFolder, removeFromFolder],
  )

  return (
    <AnchoredMenu
      label={`Carpetas de «${book.title}»`}
      kind="checkbox"
      checkedLabel="Agregado"
      align="end"
      resetKey={book.id}
      className={className}
      options={options}
      trigger={trigger}
    />
  )
}
