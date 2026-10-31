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

// A fixed slot, so the name does not move when the action turns into the state of the request. The
// state goes above Cancelar until both fit side by side without squeezing the name.
const ACTION_SLOT = 'w-26 shrink-0 justify-end text-right min-[360px]:w-30 xl:w-auto xl:flex-nowrap'

/** The link and the action are siblings: a button inside a link is not valid HTML. */
export function PersonRow({ user, status, showFriendState = false }: PersonRowProps) {
  // The search travels in the link, so the page of the person can go back to it.
  const { search } = useLocation()

  return (
    <li data-person={user.id} className="min-w-0">
      {/* Only the link paints the row: the quiet action has to keep showing its own hover. */}
      <div className="flex h-full items-center gap-x-0.5 rounded-row bg-shell pr-2 transition-colors duration-100 has-[a:hover]:bg-sand has-[a:active]:bg-sand-deep min-[360px]:gap-x-2">
        <Link
          to={{ pathname: personPath(user.id), search }}
          className="flex min-w-0 flex-1 items-center gap-1.5 rounded-row py-2.5 pl-2 min-[360px]:gap-3 min-[360px]:pl-3"
        >
          <Avatar user={user} className="max-[359px]:size-9" />
          <span className="min-w-0">
            <span className="block font-serif text-lg/snug font-semibold max-[359px]:text-base/snug">
              {user.name}
            </span>
            <span className="block text-sm text-muted">
              {/* Between homonyms, this is what tells them apart. */}
              <span className="block font-semibold text-ink">@{user.username}</span>
              <span className="block max-[359px]:text-xs">
                {mutualFriendsLabel(user.mutualFriends)}
              </span>
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
