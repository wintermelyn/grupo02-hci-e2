import { Clock, Plus, UserCheck, type LucideIcon } from 'lucide-react'
import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react'
import { Button } from '../../components'
import { cx } from '../../components/cx'
import { useChanged } from '../../components/useChanged'
import { useStore } from '../../store'
import type { Friendship, User } from '../../types'

export interface PersonActionProps {
  user: User
  /** Undefined when there is no friendship or request yet. */
  status?: Friendship['status']
  /** Offers "Quitar de amigos", which only the page of the person has: the rows are for finding. */
  canRemove?: boolean
  className?: string
}

/** The state in words, so it never depends on colour or on the icon. */
function StateLabel({ icon: Icon, children }: { icon?: LucideIcon; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted">
      {Icon && <Icon aria-hidden size={16} className="shrink-0" />}
      {children}
    </span>
  )
}

/**
 * The state and what can be done with it, which are never the same control: the state is text and
 * the action a Button, the same one for adding, cancelling and removing, so they weigh the same and
 * each takes one tap. Removing offers Deshacer. A tap meant for Cancelar that lands on Quitar de
 * amigos, when the timer accepts the request, ends where the person wanted: not being friends.
 * On the header of a person it is an action of the page, so it has an edge. In a row it has none.
 */
export function PersonAction({
  user,
  status,
  canRemove = false,
  className = '',
}: PersonActionProps) {
  const sendFriendRequest = useStore((state) => state.sendFriendRequest)
  const cancelFriendRequest = useStore((state) => state.cancelFriendRequest)
  const removeFriend = useStore((state) => state.removeFriend)
  const rootRef = useRef<HTMLDivElement>(null)
  const statusChanged = useChanged(status)

  const weight = canRemove
    ? ({ variant: 'secondary' } as const)
    : ({ variant: 'quiet', className: '-mr-2.5' } as const)

  // The button that had the focus may be gone. Amigos handles this for its rows.
  useEffect(() => {
    if (canRemove && statusChanged && document.activeElement === document.body) {
      rootRef.current?.focus({ preventScroll: true })
    }
  }, [canRemove, status, statusChanged])

  // Agregar is replaced under the finger, so a double tap must not reach what comes after it.
  function once(run: (userId: string) => void) {
    return (event: MouseEvent) => {
      if (event.detail < 2) run(user.id)
    }
  }

  return (
    <div
      ref={rootRef}
      tabIndex={-1}
      className={cx('flex min-h-11 flex-wrap items-center gap-x-3 gap-y-1 outline-none', className)}
    >
      {!status && (
        <Button
          {...weight}
          compact
          icon={Plus}
          aria-label={`Agregar a @${user.username}`}
          onClick={once(sendFriendRequest)}
        >
          Agregar
        </Button>
      )}

      {status === 'pending' && (
        <>
          {/* The icon only where there is room: in a row, these words already take two lines. */}
          <StateLabel icon={canRemove ? Clock : undefined}>Solicitud enviada</StateLabel>
          <Button
            {...weight}
            compact
            aria-label={`Cancelar la solicitud a @${user.username}`}
            onClick={once(cancelFriendRequest)}
          >
            Cancelar
          </Button>
        </>
      )}

      {status === 'friends' && (
        <>
          <StateLabel icon={UserCheck}>Amigos</StateLabel>
          {canRemove && (
            <Button
              {...weight}
              compact
              aria-label={`Quitar a @${user.username} de amigos`}
              onClick={once(removeFriend)}
            >
              Quitar de amigos
            </Button>
          )}
        </>
      )}
    </div>
  )
}
