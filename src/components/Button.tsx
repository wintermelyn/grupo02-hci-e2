import type { LucideIcon } from 'lucide-react'
import type { ComponentProps } from 'react'
import { cx } from './cx'

export type ButtonVariant = 'primary' | 'secondary' | 'danger'

export interface ButtonProps extends ComponentProps<'button'> {
  /** Use `primary` for at most one action per screen or panel. */
  variant?: ButtonVariant
  /** Shown before the text; the text label is always required. */
  icon?: LucideIcon
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-ink text-white shadow-card hover:bg-ink/90 active:bg-ink/80',
  secondary: 'bg-white text-ink shadow-card hover:bg-shell active:bg-sand',
  danger: 'bg-danger text-white shadow-card hover:bg-danger/90 active:bg-danger/80',
}

export function Button({
  variant = 'secondary',
  icon: Icon,
  type = 'button',
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-control px-4 font-semibold',
        'transition-[background-color,box-shadow,translate] duration-100 active:translate-y-px active:shadow-none',
        'disabled:cursor-not-allowed disabled:bg-sand disabled:text-muted disabled:shadow-none',
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
