import { Undo2 } from 'lucide-react'
import { useRef, type FocusEvent, type PointerEvent } from 'react'
import { useStore } from '../store'
import type { Toast as ToastData } from '../types'

type Hold = 'hover' | 'focus'

/**
 * Renders the store's toast. The store hides it after 5 s (TOAST_DURATION_MS) and drops the
 * undo copy at the same time. Mounted once, in AppShell.
 */
export function Toast() {
  const toast = useStore((state) => state.toast)

  return (
    // The live region stays mounted so screen readers announce each new message.
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-50 flex justify-center px-4 md:bottom-6"
    >
      {toast && <ToastCard key={toast.id} toast={toast} />}
    </div>
  )
}

/**
 * The timer pauses while the card is hovered or focused, so someone reaching Deshacer with the
 * mouse or the keyboard does not lose it (WCAG 2.2.1). Only a mouse counts as hover: a tap fires
 * pointerenter without a matching pointerleave, which would keep the toast (and its undo copy) forever. Keyed by toast id, so holds start empty
 * for every new toast even if the focused button was removed without a blur event.
 */
function ToastCard({ toast }: { toast: ToastData }) {
  const undo = useStore((state) => state.undo)
  const pauseToast = useStore((state) => state.pauseToast)
  const resumeToast = useStore((state) => state.resumeToast)
  const holds = useRef(new Set<Hold>())

  function setHold(hold: Hold, active: boolean) {
    if (active) holds.current.add(hold)
    else holds.current.delete(hold)
    if (holds.current.size > 0) pauseToast()
    else resumeToast()
  }

  function setHover(event: PointerEvent<HTMLDivElement>, active: boolean) {
    if (event.pointerType === 'mouse') setHold('hover', active)
  }

  function onBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) setHold('focus', false)
  }

  return (
    <div
      onPointerEnter={(event) => setHover(event, true)}
      onPointerLeave={(event) => setHover(event, false)}
      onFocus={() => setHold('focus', true)}
      onBlur={onBlur}
      className="pointer-events-auto flex w-full max-w-md items-center justify-between gap-3 rounded-xl bg-gray-900 py-2 pr-2 pl-4 text-white shadow-lg transition duration-200 starting:translate-y-2 starting:opacity-0 motion-reduce:transition-none"
    >
      <p>{toast.message}</p>
      {toast.undoable && (
        <button
          type="button"
          onClick={undo}
          className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-lg px-3 font-semibold text-amber-300 active:bg-white/10"
        >
          <Undo2 aria-hidden size={18} />
          Deshacer
        </button>
      )}
    </div>
  )
}
