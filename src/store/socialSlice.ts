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
  toggleLike: (activityId: string) => void
}

/** How long a simulated person takes to accept a request. */
export const ACCEPT_AFTER_MS = 4000

// None of these actions touch library or folders, so they skip commit and their toasts have no undo.
export const createSocialSlice: SliceCreator<SocialActions> = (set, get) => {
  const nameOf = (userId: string) => get().users.find(({ id }) => id === userId)?.name

  /** Timers are never cleared: cancelling or resetting the demo leaves nothing here to accept. */
  function accept({ userId, since }: Friendship) {
    const isCurrent = (friendship: Friendship) =>
      friendship.userId === userId && friendship.status === 'pending' && friendship.since === since

    const { friendships, showToast } = get()
    if (!friendships.some(isCurrent)) return
    set({
      friendships: friendships.map((friendship) =>
        isCurrent(friendship) ? { ...friendship, status: 'friends' } : friendship,
      ),
    })
    showToast(`${nameOf(userId)} aceptó tu solicitud`)
  }

  function scheduleAcceptance(request: Friendship) {
    const remaining = ACCEPT_AFTER_MS - (Date.now() - Date.parse(request.since))
    if (remaining <= 0) accept(request)
    else setTimeout(() => accept(request), remaining)
  }

  function drop(userId: string, status: Friendship['status'], message: (name?: string) => string) {
    const { friendships, showToast } = get()
    const found = friendships.some(
      (friendship) => friendship.userId === userId && friendship.status === status,
    )
    if (!found) return
    set({ friendships: friendships.filter((friendship) => friendship.userId !== userId) })
    showToast(message(nameOf(userId)))
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
      drop(userId, 'friends', (name) => `${name} ya no está en tus amigos`)
    },

    processPendingRequests: () => {
      get()
        .friendships.filter(({ status }) => status === 'pending')
        .forEach(scheduleAcceptance)
    },

    toggleLike: (activityId) => {
      set(({ likedActivityIds }) => ({
        likedActivityIds: likedActivityIds.includes(activityId)
          ? likedActivityIds.filter((id) => id !== activityId)
          : [...likedActivityIds, activityId],
      }))
    },
  }
}
