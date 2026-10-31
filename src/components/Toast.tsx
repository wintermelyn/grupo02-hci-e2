import { Undo2 } from 'lucide-react'
import {
  useCallback,
  useEffect,
  useRef,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'
import { useStore } from '../store'
import type { Toast as ToastData } from '../types'

type Hold = 'hover' | 'focus' | 'menu'

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
      className="pointer-events-none fixed inset-x-0 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-45 flex justify-center px-4 lg:bottom-6 lg:pl-[calc(var(--sidebar)+1rem)]"
    >
      {toast && <ToastCard key={toast.id} toast={toast} />}
    </div>
  )
}

/**
 * The timer pauses while the card is hovered or focused, so someone reaching Deshacer with the
 * mouse or the keyboard does not lose it (WCAG 2.2.1). Only a mouse counts as hover: a tap fires
 * pointerenter without a matching pointerleave, which would keep the toast (and its undo copy) forever. Keyed by toast id, so holds start empty
 * for every new toast even if the focused button was removed without a blur event. An open menu
 * also pauses it: the menu goes on top, and Deshacer must still be there when it closes.
 */
function ToastCard({ toast }: { toast: ToastData }) {
  const undo = useStore((state) => state.undo)
  const pauseToast = useStore((state) => state.pauseToast)
  const resumeToast = useStore((state) => state.resumeToast)
  const menuOpen = useStore((state) => state.menuOpen)
  const holds = useRef(new Set<Hold>())
  const focusedBefore = useRef<HTMLElement | null>(null)
  const undoRef = useRef<HTMLButtonElement>(null)

  const setHold = useCallback(
    (hold: Hold, active: boolean) => {
      if (active) holds.current.add(hold)
      else holds.current.delete(hold)
      if (holds.current.size > 0) pauseToast()
      else resumeToast()
    },
    [pauseToast, resumeToast],
  )

  useEffect(() => {
    if (toast.takesFocus) undoRef.current?.focus()
  }, [toast.takesFocus])

  useEffect(() => {
    if (!menuOpen) return
    setHold('menu', true)
    return () => setHold('menu', false)
  }, [menuOpen, setHold])

  function setHover(event: PointerEvent<HTMLDivElement>, active: boolean) {
    if (event.pointerType === 'mouse') setHold('hover', active)
  }

  function onFocus(event: FocusEvent<HTMLDivElement>) {
    const from = event.relatedTarget
    if (from instanceof HTMLElement && !event.currentTarget.contains(from)) {
      focusedBefore.current = from
    }
    setHold('focus', true)
  }

  // Deshacer disappears with this toast, which would drop keyboard users back at the top of the page.
  // It came from where the person is, so getting the focus back must not move the page.
  function undoAndRestoreFocus() {
    undo()
    focusedBefore.current?.focus({ preventScroll: true })
  }

  function onUndoKeyDown(event: KeyboardEvent) {
    // A held Enter repeats here, and would undo what that same key has just done.
    if (event.repeat) event.preventDefault()
    // Nothing follows the toast on the page, so Tab would lose the place the focus came from.
    if (event.key === 'Tab' && toast.takesFocus && focusedBefore.current) {
      event.preventDefault()
      focusedBefore.current.focus()
    }
  }

  function onBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) setHold('focus', false)
  }

  return (
    <div
      onPointerEnter={(event) => setHover(event, true)}
      onPointerLeave={(event) => setHover(event, false)}
      onFocus={onFocus}
      onBlur={onBlur}
      className="pointer-events-auto flex w-full max-w-md items-center justify-between gap-3 rounded-float bg-ink py-1 pr-1 pl-4 text-white shadow-float transition duration-200 ease-quick starting:translate-y-2 starting:opacity-0"
    >
      {/* A long folder name without spaces must not push Deshacer out of the screen. */}
      <p className="min-w-0 wrap-anywhere">{toast.message}</p>
      {toast.undoable && (
        <button
          ref={undoRef}
          type="button"
          onClick={undoAndRestoreFocus}
          onKeyDown={onUndoKeyDown}
          className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-3 font-semibold text-shell hover:bg-white/10 focus-visible:outline-white active:bg-white/20"
        >
          <Undo2 aria-hidden size={18} />
          Deshacer
        </button>
      )}
    </div>
  )
}
