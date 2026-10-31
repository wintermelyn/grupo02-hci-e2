import { X } from 'lucide-react'
import { useEffect, useId, useRef, type ReactNode } from 'react'

export interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  /** Actions pinned to the bottom of the panel, e.g. Cancelar + one primary <Button/>. */
  footer?: ReactNode
}

/**
 * The second click of a double tap would land on whatever was behind the panel, such as the
 * navigation bar under the last option. event.detail counts the clicks of a double tap, so the
 * next click is the only one that can be that second click.
 */
function ignoreSecondClick() {
  const ignore = (event: MouseEvent) => {
    if (event.detail < 2) return
    event.preventDefault()
    event.stopPropagation()
  }
  window.addEventListener('click', ignore, { capture: true, once: true })
}

/**
 * Bottom sheet on mobile, centred modal from md:. Built on the native modal <dialog>, which
 * traps focus, makes the page behind it inert and returns focus to the trigger when closed.
 *
 * The page behind includes <Toast/>, so its Deshacer button cannot be reached while the sheet is
 * open: a handler that commits a library change must also close the sheet (set open={false}).
 */
export function BottomSheet({ open, onClose, title, children, footer }: BottomSheetProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) {
      dialog.close()
      ignoreSecondClick()
    }
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      // Escape: keep the dialog open until the parent sets open={false}, so state stays in sync.
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      // Closed some other way (dialog.close(), a form with method="dialog"): tell the parent. When
      // the parent set open={false} itself, the effect's close() lands here with open already false.
      onClose={() => {
        if (open) onClose()
      }}
      // The panel covers the whole dialog box, so a click on the dialog itself is the backdrop.
      // Double tapping the button that opens the panel must not close it right away.
      onClick={(event) => {
        if (event.target === event.currentTarget && event.detail < 2) onClose()
      }}
      className="m-0 mt-auto max-h-[85dvh] w-full max-w-none rounded-t-2xl bg-white p-0 text-gray-900 shadow-xl backdrop:bg-black/50 md:m-auto md:max-w-lg md:rounded-2xl"
    >
      {open && (
        <div className="flex max-h-[85dvh] flex-col">
          <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-2">
            <h2 id={titleId} className="text-lg font-bold">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="-mr-2 inline-flex min-h-11 items-center gap-1 rounded-lg px-2 font-medium text-gray-800"
            >
              <X aria-hidden size={20} />
              Cerrar
            </button>
          </div>
          <div className="overflow-y-auto overscroll-contain px-4 py-4">{children}</div>
          {footer && (
            <div className="flex flex-wrap justify-end gap-2 border-t border-gray-200 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              {footer}
            </div>
          )}
        </div>
      )}
    </dialog>
  )
}
