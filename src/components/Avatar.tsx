import type { User } from '../types'
import { cx } from './cx'

export type AvatarSize = 'xs' | 'sm' | 'lg'

export interface AvatarProps {
  user: Pick<User, 'name' | 'avatarColor'>
  size?: AvatarSize
  className?: string
}

// `xs` goes inside a line of text: at that size the serif closes up, so it takes the sans.
const SIZE_CLASSES: Record<AvatarSize, string> = {
  xs: 'size-6 font-sans text-[0.625rem] font-bold ring-1 ring-line',
  sm: 'size-10 font-serif text-sm font-semibold',
  lg: 'size-16 font-serif text-xl font-semibold',
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toLocaleUpperCase('es-CL')
}

/** Decorative: every screen shows the name next to it, so screen readers skip it. */
export function Avatar({ user, size = 'sm', className }: AvatarProps) {
  return (
    <span
      aria-hidden
      className={cx(
        'flex shrink-0 items-center justify-center rounded-full text-white',
        SIZE_CLASSES[size],
        className,
      )}
      style={{ backgroundColor: user.avatarColor }}
    >
      {initials(user.name)}
    </span>
  )
}
