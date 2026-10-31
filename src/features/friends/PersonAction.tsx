import { Clock, Plus, UserCheck, type LucideIcon } from 'lucide-react'
import type { MouseEvent, ReactNode } from 'react'
import { Button } from '../../components'
import { useStore } from '../../store'
import type { Friendship, User } from '../../types'

export interface PersonActionProps {
  user: User
  /** Undefined when there is no friendship or request yet. */
  status?: Friendship['status']
  /** Offers "Quitar de amigos", which only the page of the person has. */
  canRemove?: boolean
  className?: string
}

interface Action {
  label: string
  /** Says who it is for, because the homonyms have the same name and the same buttons. */
  name: string
  icon?: LucideIcon
  run: (userId: string) => void
}

/** The state in words, so it never depends on colour or on the icon. */
function StateLabel({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted">
      <Icon aria-hidden size={16} />
      {children}
    </span>
  )
}

export function PersonAction({
  user,
  status,
  canRemove = false,
  className = '',
}: PersonActionProps) {
  const sendFriendRequest = useStore((state) => state.sendFriendRequest)
  const cancelFriendRequest = useStore((state) => state.cancelFriendRequest)
  const removeFriend = useStore((state) => state.removeFriend)

  const actions: Record<'none' | 'pending' | 'friends', Action | undefined> = {
    none: {
      label: 'Agregar',
      name: `Agregar a @${user.username}`,
      icon: Plus,
      run: sendFriendRequest,
    },
    pending: {
      label: 'Cancelar',
      name: `Cancelar la solicitud a @${user.username}`,
      run: cancelFriendRequest,
    },
    friends: canRemove
      ? {
          label: 'Quitar de amigos',
          name: `Quitar de amigos a @${user.username}`,
          run: removeFriend,
        }
      : undefined,
  }
  const action = actions[status ?? 'none']

  // Agregar turns into Cancelar under the finger, so a double tap would undo the request.
  function runOnce(event: MouseEvent) {
    if (event.detail < 2) action?.run(user.id)
  }

  return (
    <div className={`flex min-h-11 flex-wrap items-center gap-x-2 gap-y-1 ${className}`}>
      {status === 'pending' && <StateLabel icon={Clock}>Solicitud enviada</StateLabel>}
      {status === 'friends' && <StateLabel icon={UserCheck}>Amigos</StateLabel>}
      {/* Always in this slot, so the button keeps the focus when its action changes. */}
      {action && (
        <Button icon={action.icon} aria-label={action.name} onClick={runOnce}>
          {action.label}
        </Button>
      )}
    </div>
  )
}
