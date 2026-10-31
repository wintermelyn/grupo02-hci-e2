import { beforeEach, describe, expect, it, vi } from 'vitest'
import { state } from '../test/store'
import { useStore } from '.'
import { ACCEPT_AFTER_MS } from './socialSlice'

const friendshipOf = (userId: string) =>
  state().friendships.find((friendship) => friendship.userId === userId)

const toastMessage = () => state().toast?.message

function setPending(userId: string, ageMs: number) {
  const since = new Date(Date.now() - ageMs).toISOString()
  useStore.setState({ friendships: [{ userId, status: 'pending', since }] })
}

beforeEach(() => {
  vi.useFakeTimers()
})

describe('sendFriendRequest', () => {
  it('adds a pending request with the current date-time and tells so', () => {
    vi.setSystemTime(new Date('2026-10-31T23:30:00.000-03:00'))
    state().sendFriendRequest('camila')
    expect(friendshipOf('camila')).toEqual({
      userId: 'camila',
      status: 'pending',
      since: '2026-11-01T02:30:00.000Z',
    })
    expect(state().toast).toMatchObject({
      message: 'Solicitud enviada a Camila Torres (@camitorres)',
      undoable: false,
    })
  })

  it('accepts the request after 4 s, not before', () => {
    state().sendFriendRequest('camila')
    vi.advanceTimersByTime(ACCEPT_AFTER_MS - 1)
    expect(friendshipOf('camila')?.status).toBe('pending')
    vi.advanceTimersByTime(1)
    expect(friendshipOf('camila')?.status).toBe('friends')
    expect(state().toast).toMatchObject({
      message: 'Camila Torres (@camitorres) aceptó tu solicitud',
      undoable: false,
    })
  })

  it('names a homonym by the username and anyone else by the name alone', () => {
    state().sendFriendRequest('ctorres99')
    expect(toastMessage()).toBe('Solicitud enviada a Camila Torres (@ctorres_99)')
    state().sendFriendRequest('ignacio')
    expect(toastMessage()).toBe('Solicitud enviada a Ignacio Pérez')
  })

  it('ignores an id that is not in the directory', () => {
    const before = state().friendships
    state().sendFriendRequest('nadie')
    state().sendFriendRequest('me')
    expect(state().friendships).toBe(before)
    expect(state().toast).toBeNull()
  })

  it('ignores someone who is already a friend', () => {
    const before = state().friendships
    state().sendFriendRequest('diego')
    expect(state().friendships).toBe(before)
    expect(state().toast).toBeNull()
  })

  it('ignores someone who already has a request, keeping the first one', () => {
    state().sendFriendRequest('camila')
    const first = friendshipOf('camila')
    vi.advanceTimersByTime(1000)
    state().sendFriendRequest('camila')
    expect(state().friendships.filter(({ userId }) => userId === 'camila')).toEqual([first])
  })

  it('does not touch the library or leave an undo copy', () => {
    const { library, folders } = state()
    state().sendFriendRequest('camila')
    expect(state().library).toBe(library)
    expect(state().folders).toBe(folders)
    expect(state().undoSnapshot).toBeNull()
  })
})

describe('cancelFriendRequest', () => {
  it('removes the request and tells so, without undo', () => {
    state().sendFriendRequest('camila')
    state().cancelFriendRequest('camila')
    expect(friendshipOf('camila')).toBeUndefined()
    expect(state().toast).toMatchObject({
      message: 'Solicitud a Camila Torres (@camitorres) cancelada',
      undoable: false,
    })
  })

  it('stops the acceptance', () => {
    state().sendFriendRequest('camila')
    state().cancelFriendRequest('camila')
    vi.advanceTimersByTime(ACCEPT_AFTER_MS)
    expect(friendshipOf('camila')).toBeUndefined()
    expect(toastMessage()).toBe('Solicitud a Camila Torres (@camitorres) cancelada')
  })

  it('leaves a friend alone', () => {
    const before = state().friendships
    state().cancelFriendRequest('diego')
    expect(state().friendships).toBe(before)
    expect(state().toast).toBeNull()
  })

  it('a request sent again only counts from the new date-time', () => {
    state().sendFriendRequest('camila')
    vi.advanceTimersByTime(3000)
    state().cancelFriendRequest('camila')
    state().sendFriendRequest('camila')
    const resent = friendshipOf('camila')

    // The first timer fires here. It must not accept the new request.
    vi.advanceTimersByTime(ACCEPT_AFTER_MS - 3000)
    expect(friendshipOf('camila')).toEqual(resent)
    expect(toastMessage()).toBe('Solicitud enviada a Camila Torres (@camitorres)')

    vi.advanceTimersByTime(3000)
    expect(friendshipOf('camila')?.status).toBe('friends')
    expect(friendshipOf('camila')?.since).toBe(resent?.since)
  })

  it('accepts once when a request is cancelled and sent again in the same millisecond', () => {
    state().sendFriendRequest('camila')
    state().cancelFriendRequest('camila')
    state().sendFriendRequest('camila')
    vi.advanceTimersByTime(ACCEPT_AFTER_MS)
    expect(state().friendships.filter(({ userId }) => userId === 'camila')).toHaveLength(1)
    expect(friendshipOf('camila')?.status).toBe('friends')
  })
})

describe('removeFriend', () => {
  it('removes the friend and tells so, and undo brings the friendship back', () => {
    const before = friendshipOf('diego')
    state().removeFriend('diego')
    expect(friendshipOf('diego')).toBeUndefined()
    expect(state().toast).toMatchObject({
      message: 'Diego Fuentes ya no está en tus amigos',
      undoable: true,
    })
    state().undo()
    expect(friendshipOf('diego')).toEqual(before)
  })

  it('does not leave a request stuck when undo brings back the one accepted meanwhile', () => {
    state().sendFriendRequest('camila')
    state().removeFriend('diego')
    vi.advanceTimersByTime(ACCEPT_AFTER_MS)
    expect(friendshipOf('camila')?.status).toBe('friends')
    state().undo()
    expect(friendshipOf('camila')?.status).toBe('friends')
  })

  it('does not take Deshacer away when a request is accepted', () => {
    state().sendFriendRequest('camila')
    state().removeFromLibrary(['OL81626W'])
    vi.advanceTimersByTime(ACCEPT_AFTER_MS)
    expect(friendshipOf('camila')?.status).toBe('friends')
    expect(state().toast).toMatchObject({
      undoable: true,
      message: '«Carrie» salió de Mis libros y de Terror',
    })
  })

  it('leaves a pending request alone', () => {
    state().sendFriendRequest('camila')
    state().removeFriend('camila')
    expect(friendshipOf('camila')?.status).toBe('pending')
  })

  it('lets the same person be added again', () => {
    state().removeFriend('diego')
    state().sendFriendRequest('diego')
    vi.advanceTimersByTime(ACCEPT_AFTER_MS)
    expect(friendshipOf('diego')?.status).toBe('friends')
  })
})

describe('processPendingRequests', () => {
  it('accepts a stored request older than 4 s at once, with its toast', () => {
    setPending('camila', ACCEPT_AFTER_MS + 1)
    state().processPendingRequests()
    expect(friendshipOf('camila')?.status).toBe('friends')
    expect(toastMessage()).toBe('Camila Torres (@camitorres) aceptó tu solicitud')
  })

  it('accepts a request of exactly 4 s', () => {
    setPending('camila', ACCEPT_AFTER_MS)
    state().processPendingRequests()
    expect(friendshipOf('camila')?.status).toBe('friends')
  })

  it('schedules a newer request for the time it has left', () => {
    setPending('camila', 1500)
    state().processPendingRequests()
    expect(friendshipOf('camila')?.status).toBe('pending')
    vi.advanceTimersByTime(ACCEPT_AFTER_MS - 1500 - 1)
    expect(friendshipOf('camila')?.status).toBe('pending')
    vi.advanceTimersByTime(1)
    expect(friendshipOf('camila')?.status).toBe('friends')
  })

  it('leaves friendships as they are', () => {
    const before = state().friendships
    state().processPendingRequests()
    expect(state().friendships).toBe(before)
    expect(state().toast).toBeNull()
  })

  it('shows one acceptance even when called twice', () => {
    setPending('camila', 1000)
    state().processPendingRequests()
    state().processPendingRequests()
    vi.advanceTimersByTime(ACCEPT_AFTER_MS)
    state().dismissToast()
    vi.advanceTimersByTime(ACCEPT_AFTER_MS)
    expect(state().toast).toBeNull()
  })

  it('a scheduled acceptance does nothing after a cancel', () => {
    setPending('camila', 1000)
    state().processPendingRequests()
    state().cancelFriendRequest('camila')
    vi.advanceTimersByTime(ACCEPT_AFTER_MS)
    expect(friendshipOf('camila')).toBeUndefined()
  })
})

describe('Reiniciar demo', () => {
  it('cancels a request on its way', () => {
    state().sendFriendRequest('camila')
    state().resetDemo()
    vi.advanceTimersByTime(ACCEPT_AFTER_MS)
    expect(friendshipOf('camila')).toBeUndefined()
    expect(state().friendships).toHaveLength(3)
    expect(state().toast).toBeNull()
  })
})

describe('toggleLike', () => {
  it('likes an activity and takes the like back', () => {
    state().toggleLike('act-1')
    state().toggleLike('act-2')
    expect(state().likedActivityIds).toEqual(['act-1', 'act-2'])
    state().toggleLike('act-1')
    expect(state().likedActivityIds).toEqual(['act-2'])
  })

  it('tells who the like reaches, with no way to undo it', () => {
    state().toggleLike('act-1')
    expect(state().toast).toMatchObject({
      message: 'Valentina verá que te gustó',
      undoable: false,
    })
    state().toggleLike('act-2')
    expect(toastMessage()).toBe('Tomás verá que te gustó')
  })

  it('does not take Deshacer away from a change in the library', () => {
    state().setStatus('OL81626W', 'want')
    const { toast } = state()
    state().toggleLike('act-1')
    expect(state().likedActivityIds).toEqual(['act-1'])
    expect(state().toast).toEqual(toast)
    state().undo()
    expect(state().library.OL81626W.status).toBe('reading')
  })

  it('says nothing when the like is taken back', () => {
    state().toggleLike('act-1')
    state().dismissToast()
    state().toggleLike('act-1')
    expect(state().toast).toBeNull()
  })

  it('shows no toast for an activity that is not there', () => {
    state().toggleLike('act-inexistente')
    expect(state().toast).toBeNull()
  })
})
