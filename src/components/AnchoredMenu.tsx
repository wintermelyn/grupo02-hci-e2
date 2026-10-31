import { Check } from 'lucide-react'
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from 'react'
import { cx } from './cx'
import { ignoreSecondClick } from './ignoreSecondClick'

/** `radio`: one option is the current one. `checkbox`: several can be on. `action`: commands. */
export type AnchoredMenuKind = 'radio' | 'checkbox' | 'action'

/** `fill` takes the width of the control. The others are for a control narrower than the menu. */
export type AnchoredMenuAlign = 'fill' | 'start' | 'end'

export interface AnchoredMenuOption {
  id: string
  /** Its text is also the name of the option. */
  label: ReactNode
  /** Only for `radio` and `checkbox`. */
  checked?: boolean
  onSelect: () => void
}

/** Spread them on the <button> that opens the menu. */
export interface AnchoredMenuTriggerProps {
  ref: RefObject<HTMLButtonElement | null>
  'aria-haspopup': 'menu'
  'aria-expanded': boolean
  'aria-controls': string
  onClick: (event: MouseEvent) => void
  onKeyDown: (event: KeyboardEvent) => void
}

export interface AnchoredMenuProps {
  /** Names the menu for screen readers. */
  label: string
  options: AnchoredMenuOption[]
  kind?: AnchoredMenuKind
  /** Says in words that an option is on, since the check alone would rely on an icon. */
  checkedLabel?: string
  align?: AnchoredMenuAlign
  /** The control, drawn by whoever uses the menu. */
  trigger: (props: AnchoredMenuTriggerProps) => ReactNode
  /** A new value closes the menu, e.g. the book on screen after the browser's back button. */
  resetKey?: string
  className?: string
}

type Placement = 'below' | 'above'

const MENU_GAP = 6
const ITEM_SELECTOR = '[role^="menuitem"]'

const ITEM_ROLES: Record<AnchoredMenuKind, string> = {
  radio: 'menuitemradio',
  checkbox: 'menuitemcheckbox',
  action: 'menuitem',
}

const ALIGN_CLASSES: Record<AnchoredMenuAlign, string> = {
  fill: 'inset-x-0',
  start: 'left-0 w-64',
  end: 'right-0 w-64',
}

/**
 * Stays below the control whenever it can, because above it the menu would cover what it changes.
 * A menu that does not fit scrolls the page first and only opens above when the page cannot scroll.
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

/**
 * A quick choice next to its control, for a change that is easy to undo. It does not darken or
 * block the page. Choosing applies at once, closes the menu and gives the focus back to the control.
 */
export function AnchoredMenu({
  label,
  options,
  kind = 'radio',
  checkedLabel = 'Actual',
  align = 'fill',
  trigger,
  resetKey = '',
  className,
}: AnchoredMenuProps) {
  // Tied to resetKey, so a menu left open never shows up for something else.
  const [openFor, setOpenFor] = useState<string>()
  const open = openFor === resetKey
  const [placement, setPlacement] = useState<Placement>('below')
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const focusOnOpen = useRef<'selected' | 'last'>('selected')
  const menuId = useId()

  useLayoutEffect(() => {
    const control = triggerRef.current
    const menu = menuRef.current
    if (!open || !control || !menu) return
    setPlacement(placeMenu(control, menu))
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
    setOpenFor(resetKey)
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

  function choose(option: AnchoredMenuOption) {
    closeAndReturn()
    // The menu may be over the navigation bar, so a double tap must not reach it.
    ignoreSecondClick()
    option.onSelect()
  }

  return (
    <div ref={rootRef} className={cx('relative', className)}>
      {trigger({
        ref: triggerRef,
        'aria-haspopup': 'menu',
        'aria-expanded': open,
        'aria-controls': menuId,
        onClick: onTriggerClick,
        onKeyDown: onTriggerKeyDown,
      })}

      <div
        ref={menuRef}
        id={menuId}
        role="menu"
        aria-label={label}
        hidden={!open}
        onKeyDown={onMenuKeyDown}
        className={cx(
          'absolute z-30 max-h-[60dvh] overflow-y-auto rounded-float bg-white p-1.5 shadow-float',
          'transition-[opacity,translate,display] transition-discrete duration-150 ease-quick',
          'starting:-translate-y-1 starting:opacity-0 [&[hidden]]:opacity-0',
          ALIGN_CLASSES[align],
          placement === 'below' ? 'top-full mt-1.5' : 'bottom-full mb-1.5',
        )}
      >
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            role={ITEM_ROLES[kind]}
            aria-checked={kind === 'action' ? undefined : Boolean(option.checked)}
            tabIndex={-1}
            onClick={() => choose(option)}
            className={cx(
              'flex min-h-12 w-full items-center justify-between gap-3 rounded-control px-2.5 text-left',
              'transition-colors duration-100 -outline-offset-2 hover:bg-shell active:bg-sand',
              option.checked && 'bg-shell',
            )}
          >
            {option.label}
            {/* aria-checked already says this, so it stays out of the option's name. */}
            {option.checked && (
              <span
                aria-hidden
                className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-muted"
              >
                <Check size={16} strokeWidth={3} />
                {checkedLabel}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
