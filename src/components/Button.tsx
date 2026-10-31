import type { LucideIcon } from 'lucide-react'
import type { ComponentProps } from 'react'
import { cx } from './cx'

export type ButtonVariant = 'primary' | 'secondary' | 'quiet' | 'danger'

export interface ButtonProps extends ComponentProps<'button'> {
  /** Use `primary` for at most one action per screen. */
  variant?: ButtonVariant
  /** Shown before the text; the text label is always required. */
  icon?: LucideIcon
  /** Less side padding, for a row or a title that shares its width with text. */
  compact?: boolean
}

// A button is a pill and a field is white with a magnifier or a line of text in it. Only the main
// action is filled, so a screen shows one black shape: the others are drawn by their edge.
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-ink text-white hover:bg-ink/90 active:bg-ink/80',
  // Inverted only while its menu is open, so ink means open and never just the cursor passing by.
  secondary:
    'border border-edge text-ink hover:bg-sand active:bg-sand-deep aria-expanded:border-ink aria-expanded:bg-ink aria-expanded:text-white',
  // No edge at rest: for an action inside a row, and for what is secondary to the page.
  quiet: 'text-ink hover:bg-sand active:bg-sand-deep aria-expanded:bg-sand',
  danger: 'bg-danger text-white hover:bg-danger/90 active:bg-danger/80',
}

export function Button({
  variant = 'secondary',
  icon: Icon,
  compact = false,
  type = 'button',
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        'inline-flex min-h-11 items-center justify-center rounded-full font-semibold whitespace-nowrap',
        compact ? 'gap-1.5 px-2.5' : 'gap-2 px-4',
        'transition-[background-color,border-color,color,scale] duration-150 active:scale-98',
        'disabled:cursor-not-allowed disabled:border-transparent disabled:bg-sand disabled:text-muted',
        VARIANT_CLASSES[variant],
        className,
      )}
      {...rest}
    >
      {Icon && <Icon aria-hidden size={18} />}
      {children}
    </button>
  )
}
