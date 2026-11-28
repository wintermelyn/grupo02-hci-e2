import { Link, useMatch } from 'react-router'
import { useStore } from '../store'
import { Avatar } from './Avatar'
import { cx } from './cx'

export const PROFILE_PATH = '/perfil'

/**
 * Mi perfil under lg, where the bar keeps its five sections: the person's own face at the top of
 * every page, where Gmail or the App Store put the account.
 */
export function ProfileLink() {
  const me = useStore((state) => state.me)
  const isHere = Boolean(useMatch(PROFILE_PATH))
  return (
    <Link
      to={PROFILE_PATH}
      aria-label="Mi perfil"
      aria-current={isHere ? 'page' : undefined}
      className="group -mr-1.5 ml-auto flex size-11 shrink-0 items-center justify-center rounded-full"
    >
      <Avatar
        user={me}
        size="md"
        className={cx(
          'transition-[box-shadow] duration-100',
          isHere
            ? 'ring-2 ring-ink ring-offset-2 ring-offset-paper'
            : 'group-active:ring-2 group-active:ring-sand-deep',
        )}
      />
    </Link>
  )
}
