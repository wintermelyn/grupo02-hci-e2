import { Link, useLocation } from 'react-router'
import { Avatar } from '../../components'
import type { Friendship, User } from '../../types'
import { mutualFriendsLabel, personPath } from './people'
import { PersonAction } from './PersonAction'

export interface PersonRowProps {
  user: User
  /** Undefined when there is no friendship or request yet. */
  status?: Friendship['status']
  /** Keeps the state on a friend's row too, where a search mixes them with everyone else. */
  showFriendState?: boolean
}

// A fixed slot, so the name does not move when the action turns into the state of the request.
const ACTION_SLOT = 'w-26 shrink-0 justify-end text-right lg:w-auto'

/** The link and the action are siblings: a button inside a link is not valid HTML. */
export function PersonRow({ user, status, showFriendState = false }: PersonRowProps) {
  // The search travels in the link, so the page of the person can go back to it.
  const { search } = useLocation()

  return (
    <li
      data-person={user.id}
      className="border-b border-line last:border-b-0 md:nth-last-2:odd:border-b-0"
    >
      <div className="-mx-2 flex items-center gap-x-2 rounded-control px-2 transition-colors duration-100 has-[a:active]:bg-shell">
        <Link
          to={{ pathname: personPath(user.id), search }}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-control py-2.5"
        >
          <Avatar user={user} />
          <span className="min-w-0">
            <span className="block font-serif text-lg/snug font-semibold">{user.name}</span>
            <span className="block text-sm text-muted">
              {/* Between homonyms, this is what tells them apart. */}
              <span className="block font-semibold text-ink">@{user.username}</span>
              <span className="block">{mutualFriendsLabel(user.mutualFriends)}</span>
            </span>
          </span>
        </Link>
        {(status !== 'friends' || showFriendState) && (
          <PersonAction user={user} status={status} className={ACTION_SLOT} />
        )}
      </div>
    </li>
  )
}
