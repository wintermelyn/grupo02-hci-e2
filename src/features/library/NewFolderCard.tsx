import { Plus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button, TextField } from '../../components'
import { ignoreSecondClick } from '../../components/ignoreSecondClick'
import { useStore } from '../../store'
import { folderNameProblem, MAX_FOLDER_NAME_LENGTH } from './filters'

/**
 * Takes the place of covers, name and count, so from a tablet up the field measures the same as a
 * FolderCard, also when it is alone in its row. The content goes over it, in the same grid cell.
 */
function CardShape() {
  return (
    <span aria-hidden className="invisible col-start-1 row-start-1 max-md:hidden">
      {/* In two cells and the gap between them, this gap leaves a cover of the same height. */}
      <span className="grid grid-cols-4 gap-4.5">
        <span className="aspect-2/3" />
      </span>
      <span className="mt-2.5 block h-7" />
      <span className="block h-5" />
    </span>
  )
}

/**
 * The last card of the board. It goes from a card shaped like a folder, which is pressed, to a white
 * card with a field, which is written on. To write it gets two cells on every screen: half of a
 * phone's row would show the last dozen letters of a name of up to 40, and one cell of a tablet would
 * not fit Crear and Cancelar.
 */
export function NewFolderCard() {
  const folders = useStore((state) => state.folders)
  const createFolder = useStore((state) => state.createFolder)
  const [name, setName] = useState<string>()
  const [triedEmpty, setTriedEmpty] = useState(false)
  const openRef = useRef<HTMLButtonElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const giveFocusBack = useRef(false)
  const writing = name !== undefined
  const problem = writing ? folderNameProblem(name, folders) : undefined

  // The field takes the focus, but the bottom bar could cover Crear and Cancelar below it.
  useEffect(() => {
    if (writing) formRef.current?.scrollIntoView?.({ block: 'nearest' })
  }, [writing])

  // The button only exists again once the field has closed.
  useEffect(() => {
    if (writing || !giveFocusBack.current) return
    giveFocusBack.current = false
    openRef.current?.focus()
  }, [writing])

  function start() {
    // Crear and Cancelar take the place of this button, under the second tap of a double tap.
    ignoreSecondClick()
    setTriedEmpty(false)
    setName('')
  }

  function stop() {
    ignoreSecondClick()
    giveFocusBack.current = true
    setName(undefined)
  }

  function save() {
    if (name === undefined || problem) {
      setTriedEmpty(true)
      return
    }
    createFolder(name)
    stop()
  }

  if (!writing) {
    return (
      <li>
        <button
          ref={openRef}
          type="button"
          onClick={start}
          className="block h-full w-full rounded-card bg-sand p-3 text-left transition-[background-color,translate] duration-100 hover:bg-sand-deep active:translate-y-px active:bg-sand-deep"
        >
          <span className="grid grid-cols-2 gap-1.5">
            <span className="aspect-2/3 rounded-[2px_3px_3px_2px] bg-shell" />
            <span className="aspect-2/3 rounded-[2px_3px_3px_2px] bg-shell" />
          </span>
          {/* Beside the words and not among them, so it never stays alone at the end of a line. */}
          <span className="mt-2.5 flex items-center gap-1 font-serif text-lg font-semibold">
            <Plus aria-hidden size={18} className="shrink-0" />
            Nueva carpeta
          </span>
          <span className="block text-sm text-muted">Un libro puede estar en varias</span>
        </button>
      </li>
    )
  }

  return (
    // Two cells do not fit in the last column, so the row below takes them on that same side.
    <li className="col-span-2 md:max-lg:[&:nth-child(4n)]:col-start-3 lg:[&:nth-child(5n)]:col-start-4">
      <div
        ref={formRef}
        className="grid h-full scroll-mb-20 rounded-card border border-edge bg-white p-3 md:scroll-mb-4"
      >
        <CardShape />
        <div className="col-start-1 row-start-1 flex min-w-0 flex-col justify-between gap-1.5">
          {/* Room for the name, the field and the reason, which takes two lines at 320 px. */}
          <div className="min-h-23.5 font-serif text-lg max-[22rem]:min-h-28.5">
            {/* What was pressed stays on screen, so the empty field says what it is waiting for. */}
            <span aria-hidden className="mb-1.5 block font-sans text-sm font-semibold">
              Nueva carpeta
            </span>
            <TextField
              label="Nombre de la carpeta nueva"
              value={name}
              onChange={setName}
              onSubmit={save}
              onCancel={stop}
              // An empty field is where it starts, and only a reason once the person has written.
              problem={name !== '' || triedEmpty ? problem : undefined}
              maxLength={MAX_FOLDER_NAME_LENGTH}
            />
          </div>
          <div className="grid grid-cols-2 gap-1">
            <Button compact variant="primary" disabled={Boolean(problem)} onClick={save}>
              Crear
            </Button>
            <Button compact onClick={stop}>
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </li>
  )
}
