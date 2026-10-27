import type { LucideIcon } from 'lucide-react'
import type { ButtonHTMLAttributes } from 'react'
import { cx } from './cx'

export type ButtonVariant = 'primary' | 'secondary' | 'danger'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Use `primary` for at most one action per screen or panel. */
  variant?: ButtonVariant
  /** Shown before the text; the text label is always required. */
  icon?: LucideIcon
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'border-brand bg-brand text-white active:bg-brand/90',
  secondary: 'border-gray-500 bg-white text-gray-900 active:bg-gray-100',
  danger: 'border-danger bg-danger text-white active:bg-danger/90',
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
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border-2 px-4 font-semibold',
        'disabled:cursor-not-allowed disabled:opacity-50',
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
