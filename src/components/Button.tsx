import type { LucideIcon } from 'lucide-react'
import type { ComponentProps } from 'react'
import { cx } from './cx'

export type ButtonVariant = 'primary' | 'secondary' | 'quiet' | 'danger'

export interface ButtonProps extends ComponentProps<'button'> {
  /** Use `primary` for at most one action per screen. */
  variant?: ButtonVariant
  /** Shown before the text; the text label is always required. */
  icon?: LucideIcon
  /** Less side padding, for a row or a band that shares its width with text. */
  compact?: boolean
}

// What is white with a border is a field, and what can be pressed has a fill. The edge of the
// secondary is what sets its shape apart from the band: the fill alone reaches 1.31:1 on shell.
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-ink text-white hover:bg-ink/90 active:bg-ink/80',
  // Inverted only while its menu is open, so ink means open and never just the cursor passing by.
  secondary:
    'border border-edge bg-sand-deep text-ink hover:bg-sand-dark active:border-ink active:bg-sand-dark aria-expanded:border-ink aria-expanded:bg-ink aria-expanded:text-white',
  // No fill at rest: for an action inside a row, and for what is secondary to the page.
  quiet: 'text-ink hover:bg-shell active:bg-sand aria-expanded:bg-shell',
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
        'inline-flex min-h-11 items-center justify-center rounded-control font-semibold whitespace-nowrap',
        compact ? 'gap-1.5 px-2.5' : 'gap-2 px-4',
        'transition-[background-color,border-color,color,translate] duration-100 active:translate-y-px',
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
