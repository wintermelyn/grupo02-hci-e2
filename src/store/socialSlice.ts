import type { Friendship } from '../types'
import type { SliceCreator } from '.'

export interface SocialActions {
  /** Ignores unknown ids and anyone who is already a friend or already has a request. */
  sendFriendRequest: (userId: string) => void
  cancelFriendRequest: (userId: string) => void
  removeFriend: (userId: string) => void
  /**
   * Accepts pending requests older than 4 s and schedules a timer for the rest. A timer only
   * accepts if the request is still pending with the same `since`. Called once at startup.
   */
  processPendingRequests: () => void
  /** A gesture towards a friend, not a figure: giving a like says who it reaches, taking it back says nothing. */
  toggleLike: (activityId: string) => void
}

/** How long a simulated person takes to accept a request. */
export const ACCEPT_AFTER_MS = 4000

const firstName = (name: string) => name.split(' ')[0]

// None of these actions touch library or folders, so they skip commit. Only removing a friend keeps
// an undo copy: the others are undone with one tap on the button that replaces them.
export const createSocialSlice: SliceCreator<SocialActions> = (set, get) => {
  /** A homonym goes with the username, or the toast would not say who it was. */
  function nameOf(userId: string) {
    const { users } = get()
    const user = users.find(({ id }) => id === userId)
    if (!user) return undefined
    const hasHomonym = users.some(({ id, name }) => id !== userId && name === user.name)
    return hasHomonym ? `${user.name} (@${user.username})` : user.name
  }

  /** Timers are never cleared: cancelling or resetting the demo leaves nothing here to accept. */
  function accept({ userId, since }: Friendship) {
    const isCurrent = (friendship: Friendship) =>
      friendship.userId === userId && friendship.status === 'pending' && friendship.since === since

    const { friendships, showToast, undoSnapshot } = get()
    if (!friendships.some(isCurrent)) return
    set({
      friendships: friendships.map((friendship) =>
        isCurrent(friendship) ? { ...friendship, status: 'friends' } : friendship,
      ),
    })
    // A new toast would take Deshacer away, and the screen already shows the accepted request.
    if (!undoSnapshot) showToast(`${nameOf(userId)} aceptó tu solicitud`)
  }

  function scheduleAcceptance(request: Friendship) {
    const remaining = ACCEPT_AFTER_MS - (Date.now() - Date.parse(request.since))
    if (remaining <= 0) accept(request)
    else setTimeout(() => accept(request), remaining)
  }

  function drop(
    userId: string,
    status: Friendship['status'],
    message: (name?: string) => string,
    undoable = false,
  ) {
    const { friendships, library, folders, showToast } = get()
    const found = friendships.some(
      (friendship) => friendship.userId === userId && friendship.status === status,
    )
    if (!found) return
    set({
      friendships: friendships.filter((friendship) => friendship.userId !== userId),
      undoSnapshot: undoable ? { library, folders, friendships } : null,
    })
    showToast(message(nameOf(userId)), { undoable })
  }

  return {
    sendFriendRequest: (userId) => {
      const { friendships, showToast } = get()
      const name = nameOf(userId)
      if (!name || friendships.some((friendship) => friendship.userId === userId)) return

      const request: Friendship = { userId, status: 'pending', since: new Date().toISOString() }
      set({ friendships: [...friendships, request] })
      showToast(`Solicitud enviada a ${name}`)
      scheduleAcceptance(request)
    },

    cancelFriendRequest: (userId) => {
      drop(userId, 'pending', (name) => `Solicitud a ${name} cancelada`)
    },

    removeFriend: (userId) => {
      drop(userId, 'friends', (name) => `${name} ya no está en tus amigos`, true)
    },

    processPendingRequests: () => {
      get()
        .friendships.filter(({ status }) => status === 'pending')
        .forEach(scheduleAcceptance)
    },

    toggleLike: (activityId) => {
      const { activities, likedActivityIds, users, showToast, undoSnapshot } = get()
      if (likedActivityIds.includes(activityId)) {
        set({ likedActivityIds: likedActivityIds.filter((id) => id !== activityId) })
        return
      }
      set({ likedActivityIds: [...likedActivityIds, activityId] })
      const activity = activities.find(({ id }) => id === activityId)
      const user = users.find(({ id }) => id === activity?.userId)
      // As in accept: a new toast would take Deshacer away, and the button already shows the like.
      if (user && !undoSnapshot) showToast(`${firstName(user.name)} verá que te gustó`)
    },
  }
}
