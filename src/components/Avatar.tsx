import type { User } from '../types'
import { cx } from './cx'

export type AvatarSize = 'sm' | 'lg'

export interface AvatarProps {
  user: Pick<User, 'name' | 'avatarColor'>
  size?: AvatarSize
  className?: string
}

const SIZE_CLASSES: Record<AvatarSize, string> = {
  sm: 'size-10 text-sm',
  lg: 'size-16 text-xl',
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
        'flex shrink-0 items-center justify-center rounded-full font-serif font-semibold text-white',
        SIZE_CLASSES[size],
        className,
      )}
      style={{ backgroundColor: user.avatarColor }}
    >
      {initials(user.name)}
    </span>
  )
}
