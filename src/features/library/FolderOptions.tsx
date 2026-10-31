import { AnchoredMenu, Button } from '../../components'
import type { Folder } from '../../types'

export interface FolderOptionsProps {
  folder: Folder
  onRename: () => void
  onDelete: () => void
}

/** The actions on a whole folder. A pinned folder has none, since it can't change. */
export function FolderOptions({ folder, onRename, onDelete }: FolderOptionsProps) {
  return (
    <AnchoredMenu
      label={`Opciones de «${folder.name}»`}
      kind="action"
      align="end"
      options={[
        { id: 'rename', label: 'Renombrar carpeta', onSelect: onRename },
        { id: 'delete', label: 'Eliminar carpeta', onSelect: onDelete },
      ]}
      trigger={(triggerProps) => (
        <Button {...triggerProps} compact>
          Opciones
        </Button>
      )}
    />
  )
}
