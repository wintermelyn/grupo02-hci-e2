import type { SliceCreator } from '.'

export interface SocialActions {
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

// Stubs from the base block with their final signatures. Role B implements them.
export const createSocialSlice: SliceCreator<SocialActions> = () => ({
  sendFriendRequest: () => {},
  cancelFriendRequest: () => {},
  removeFriend: () => {},
  processPendingRequests: () => {},
  toggleLike: () => {},
})
