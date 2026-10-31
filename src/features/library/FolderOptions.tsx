import { CircleAlert, Ellipsis } from 'lucide-react'
import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { AnchoredMenu, BottomSheet, Button } from '../../components'
import { useStore } from '../../store'
import type { Folder } from '../../types'
import { booksLabel, normalizeText } from './filters'

export interface FolderOptionsProps {
  folder: Folder
  /** How many books the folder has, which the confirmation states. */
  bookCount: number
  /** Deletes the folder and leaves its page. */
  onDelete: () => void
}

type OpenSheet = 'rename' | 'delete'

const MAX_NAME_LENGTH = 40

/** The header action of a folder. A pinned folder has none, since it can't change. */
export function FolderOptions({ folder, bookCount, onDelete }: FolderOptionsProps) {
  const folders = useStore((state) => state.folders)
  const renameFolder = useStore((state) => state.renameFolder)
  const [sheet, setSheet] = useState<OpenSheet>()
  const [name, setName] = useState('')
  const nameRef = useRef<HTMLInputElement>(null)
  const formId = useId()
  const hintId = useId()

  useEffect(() => {
    if (sheet !== 'rename') return
    nameRef.current?.focus()
    nameRef.current?.select()
  }, [sheet])

  const close = () => setSheet(undefined)

  function openRename() {
    setName(folder.name)
    setSheet('rename')
  }

  const wanted = normalizeText(name)
  const repeated = folders.some(
    ({ id, name: other }) => id !== folder.id && normalizeText(other) === wanted,
  )
  const problem =
    (!wanted && 'Escribe un nombre para la carpeta.') ||
    (repeated && 'Ya tienes una carpeta con ese nombre.') ||
    undefined

  function saveName(event: FormEvent) {
    event.preventDefault()
    if (problem) return
    renameFolder(folder.id, name)
    close()
  }

  function confirmDelete() {
    close()
    onDelete()
  }

  return (
    <>
      <AnchoredMenu
        label={`Opciones de «${folder.name}»`}
        kind="action"
        align="end"
        options={[
          { id: 'rename', label: 'Renombrar carpeta', onSelect: openRename },
          { id: 'delete', label: 'Eliminar carpeta', onSelect: () => setSheet('delete') },
        ]}
        trigger={(triggerProps) => (
          <Button {...triggerProps} icon={Ellipsis}>
            Opciones
          </Button>
        )}
      />

      <BottomSheet
        open={sheet === 'rename'}
        onClose={close}
        title="Renombrar carpeta"
        footer={
          <>
            <Button onClick={close}>Cancelar</Button>
            <Button type="submit" form={formId} variant="primary" disabled={Boolean(problem)}>
              Guardar
            </Button>
          </>
        }
      >
        <form id={formId} onSubmit={saveName}>
          <label className="block">
            <span className="mb-1 block font-medium">Nombre</span>
            <input
              ref={nameRef}
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={MAX_NAME_LENGTH}
              autoComplete="off"
              enterKeyHint="done"
              aria-describedby={hintId}
              className="min-h-11 w-full rounded-control border border-muted bg-white px-3"
            />
          </label>
          {/* Stays mounted, so screen readers announce why Guardar is off. */}
          <div id={hintId} role="status">
            {problem && (
              <p className="mt-2 flex items-center gap-1.5 text-sm">
                <CircleAlert aria-hidden size={16} className="shrink-0 text-muted" />
                {problem}
              </p>
            )}
          </div>
        </form>
      </BottomSheet>

      <BottomSheet
        open={sheet === 'delete'}
        onClose={close}
        title={`Eliminar «${folder.name}»`}
        footer={
          <>
            <Button onClick={close}>Cancelar</Button>
            <Button variant="danger" onClick={confirmDelete}>
              Eliminar carpeta
            </Button>
          </>
        }
      >
        <p>
          {bookCount === 0
            ? 'Esta carpeta no tiene libros.'
            : `Esta carpeta tiene ${booksLabel(bookCount)}. ${
                bookCount === 1 ? 'El libro sigue' : 'Los libros siguen'
              } en tu biblioteca.`}
        </p>
      </BottomSheet>
    </>
  )
}
