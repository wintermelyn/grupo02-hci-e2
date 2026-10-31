import { Link, useLocation } from 'react-router'
import { Avatar } from '../../components'
import type { Friendship, User } from '../../types'
import { mutualFriendsLabel, personPath } from './people'
import { PersonAction } from './PersonAction'

export interface PersonRowProps {
  user: User
  /** Undefined when there is no friendship or request yet. */
  status?: Friendship['status']
  /** Keeps the action on its own line in every state, so accepting does not move the next row. */
  stableHeight?: boolean
}

// On a phone the action has its own line, under the text, so the row keeps its shape as it changes.
const ACTION_BELOW = 'w-full pb-2.5 pl-13 lg:w-auto lg:shrink-0 lg:pb-0 lg:pl-0'

/** The link and the action are siblings: a button inside a link is not valid HTML. */
export function PersonRow({ user, status, stableHeight = false }: PersonRowProps) {
  // The search travels in the link, so the page of the person can go back to it.
  const { search } = useLocation()

  return (
    <li
      data-person={user.id}
      className="border-b border-line last:border-b-0 md:nth-last-2:odd:border-b-0"
    >
      <div className="-mx-2 flex flex-wrap items-center gap-x-3 rounded-control px-2 transition-colors duration-100 has-[a:active]:bg-shell lg:flex-nowrap">
        <Link
          to={{ pathname: personPath(user.id), search }}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-control py-2.5"
        >
          <Avatar user={user} />
          <span className="min-w-0">
            <span className="block font-serif text-lg/snug font-semibold">{user.name}</span>
            {/* Two lines in every state, so a row never changes height next to its neighbour. */}
            <span className="block text-sm text-muted">
              {/* Between homonyms, this is what tells them apart. */}
              <span className="block font-semibold text-ink">@{user.username}</span>
              <span className="block">{mutualFriendsLabel(user.mutualFriends)}</span>
            </span>
          </span>
        </Link>
        <PersonAction
          user={user}
          status={status}
          className={status === 'friends' && !stableHeight ? 'shrink-0' : ACTION_BELOW}
        />
      </div>
    </li>
  )
}
