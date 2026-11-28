import { CircleUser } from 'lucide-react'
import { Link, useMatch } from 'react-router'
import { cx } from './cx'

export const PROFILE_PATH = '/perfil'

/**
 * Mi perfil under lg, where the bar keeps its five sections: at the top of every page, where Gmail
 * or the App Store put the account. The icon and not the initials, which a friend also has.
 */
export function ProfileLink() {
  const isHere = Boolean(useMatch(PROFILE_PATH))
  return (
    <Link
      to={PROFILE_PATH}
      aria-label="Mi perfil"
      aria-current={isHere ? 'page' : undefined}
      className={cx(
        '-mr-1.5 flex size-11 shrink-0 items-center justify-center rounded-full text-ink transition-colors duration-100',
        isHere ? 'bg-sand' : 'active:bg-sand',
      )}
    >
      <CircleUser aria-hidden size={26} strokeWidth={isHere ? 2.4 : 2} />
    </Link>
  )
}
