import { Check, Pencil, Plus } from 'lucide-react'
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from 'react'
import { today } from '../lib/dates'
import { STATUS_LABELS, STATUS_ORDER } from '../lib/status'
import { selectBook, selectEntry, useStore } from '../store'
import type { Book, BookId, ReadingStatus } from '../types'
import { cx } from './cx'
import { ignoreSecondClick } from './ignoreSecondClick'
import { StatusTag } from './StatusTag'
import { useChanged } from './useChanged'

export interface StatusControlProps {
  bookId: BookId
  /**
   * The book's data, needed when it may not be in the store yet (e.g. a live search result):
   * it is added with upsertBook before any change, so the library never points to an unknown book.
   */
  book?: Book
  className?: string
}

type Placement = 'below' | 'above'

const MENU_GAP = 6
const ITEM_SELECTOR = '[role="menuitemradio"]'

/**
 * Stays below the control whenever it can, because above it the menu would cover the book. A menu
 * that does not fit scrolls the page first and only opens above when the page cannot scroll.
 */
function placeMenu(trigger: HTMLElement, menu: HTMLElement): Placement {
  const { top, bottom } = trigger.getBoundingClientRect()
  const needed = menu.offsetHeight + MENU_GAP
  const bar = document.querySelector('[data-bottom-bar]')?.getBoundingClientRect()
  const limit = bar?.height ? bar.top : window.innerHeight
  const missing = bottom + needed - limit
  if (missing <= 0) return 'below'

  const scrollLeft =
    document.documentElement.scrollHeight - window.innerHeight - Math.ceil(window.scrollY)
  if (scrollLeft >= missing) {
    window.scrollBy({ top: missing + MENU_GAP })
    return 'below'
  }
  return top >= needed ? 'above' : 'below'
}

/** The tag with its pencil (D2). Opens a menu next to it; a chosen tag applies at once. */
export function StatusControl({ bookId, book, className }: StatusControlProps) {
  // Tied to the book, so going to another book with the browser's back button closes the menu.
  const [openFor, setOpenFor] = useState<BookId>()
  const open = openFor === bookId
  const [placement, setPlacement] = useState<Placement>('below')
  const entry = useStore(selectEntry(bookId))
  const title = useStore(selectBook(bookId))?.title ?? book?.title
  const setStatus = useStore((state) => state.setStatus)
  const finishBook = useStore((state) => state.finishBook)
  const upsertBook = useStore((state) => state.upsertBook)
  const current = entry?.status
  const statusChanged = useChanged(current)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const focusOnOpen = useRef<'selected' | 'last'>('selected')
  const menuId = useId()

  useLayoutEffect(() => {
    const trigger = triggerRef.current
    const menu = menuRef.current
    if (!open || !trigger || !menu) return
    setPlacement(placeMenu(trigger, menu))
    const items = [...menu.querySelectorAll<HTMLElement>(ITEM_SELECTOR)]
    const selected = items.find((item) => item.getAttribute('aria-checked') === 'true')
    const target = focusOnOpen.current === 'last' ? items.at(-1) : (selected ?? items[0])
    target?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    const closeOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpenFor(undefined)
    }
    document.addEventListener('pointerdown', closeOutside)
    return () => document.removeEventListener('pointerdown', closeOutside)
  }, [open])

  function openMenu(focus: 'selected' | 'last') {
    focusOnOpen.current = focus
    setOpenFor(bookId)
  }

  function closeAndReturn() {
    setOpenFor(undefined)
    triggerRef.current?.focus()
  }

  function onTriggerClick(event: MouseEvent) {
    if (!open) {
      openMenu('selected')
      return
    }
    // Double tapping the control must not close the menu it just opened.
    if (event.detail < 2) closeAndReturn()
  }

  function onTriggerKeyDown(event: KeyboardEvent) {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    event.preventDefault()
    openMenu(event.key === 'ArrowUp' ? 'last' : 'selected')
  }

  function onMenuKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Tab') {
      setOpenFor(undefined)
      return
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      closeAndReturn()
      return
    }
    const items = [...event.currentTarget.querySelectorAll<HTMLElement>(ITEM_SELECTOR)]
    const index = items.indexOf(document.activeElement as HTMLElement)
    const targets: Record<string, number> = {
      ArrowDown: (index + 1) % items.length,
      ArrowUp: (index - 1 + items.length) % items.length,
      Home: 0,
      End: items.length - 1,
    }
    if (!(event.key in targets)) return
    event.preventDefault()
    items[targets[event.key]].focus()
  }

  function choose(status: ReadingStatus) {
    closeAndReturn()
    // The menu may be over the navigation bar, so a double tap must not reach it.
    ignoreSecondClick()
    // Finishing again would replace finishedAt and drop the rating of a book already in Leído.
    if (status === current) return
    if (book) upsertBook(book)
    if (status === 'read') {
      const startedAt = entry?.startedAt ?? entry?.addedAt ?? today()
      finishBook(bookId, { startedAt, finishedAt: today() })
    } else {
      setStatus(bookId, status)
    }
  }

  const bookName = title ? `«${title}»` : 'este libro'

  return (
    <div ref={rootRef} className={cx('relative', className)}>
      {/* One button for both states, so the focus can come back to it after adding the book. */}
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={current && `${STATUS_LABELS[current]}. Cambiar estado de ${bookName}`}
        onClick={onTriggerClick}
        onKeyDown={onTriggerKeyDown}
        className={cx(
          'flex min-h-13 w-full items-center gap-3 rounded-card px-3.5 font-semibold shadow-card',
          'transition-[background-color,box-shadow,translate] duration-100 active:translate-y-px active:shadow-none',
          current
            ? 'justify-between bg-white hover:bg-shell active:bg-sand'
            : 'justify-center bg-ink text-white hover:bg-ink/90 active:bg-ink/80',
        )}
      >
        {current ? (
          <>
            <StatusTag
              // A new element for each tag, so the one that changed comes in where it is being read.
              key={current}
              status={current}
              className={statusChanged ? 'animate-tag-in' : undefined}
            />
            <span className="inline-flex items-center gap-1.5">
              <Pencil aria-hidden size={16} />
              Cambiar
            </span>
          </>
        ) : (
          <>
            <Plus aria-hidden size={18} />
            Agregar a Mis libros
          </>
        )}
      </button>

      <div
        ref={menuRef}
        id={menuId}
        role="menu"
        aria-label={current ? `Estado de ${bookName}` : 'Agregar a Mis libros'}
        hidden={!open}
        onKeyDown={onMenuKeyDown}
        className={cx(
          'absolute inset-x-0 z-30 rounded-float bg-white p-1.5 shadow-float md:right-auto md:w-72',
          'transition-[opacity,translate,display] transition-discrete duration-150 ease-quick',
          'starting:-translate-y-1 starting:opacity-0 [&[hidden]]:opacity-0',
          placement === 'below' ? 'top-full mt-1.5' : 'bottom-full mb-1.5',
        )}
      >
        {STATUS_ORDER.map((status) => {
          const selected = current === status
          return (
            <button
              key={status}
              type="button"
              role="menuitemradio"
              aria-checked={selected}
              tabIndex={-1}
              onClick={() => choose(status)}
              className={cx(
                'flex min-h-12 w-full items-center justify-between gap-3 rounded-control px-2.5',
                'transition-colors duration-100 -outline-offset-2 hover:bg-shell active:bg-sand',
                selected && 'bg-shell',
              )}
            >
              <StatusTag status={status} />
              {/* aria-checked already says this, so it stays out of the option's name. */}
              {selected && (
                <span
                  aria-hidden
                  className="inline-flex items-center gap-1 text-sm font-semibold text-muted"
                >
                  <Check size={16} strokeWidth={3} />
                  Actual
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
