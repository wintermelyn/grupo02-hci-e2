import { describe, expect, it } from 'vitest'
import { friendsLabel, requestsLabel } from './people'

describe('people labels', () => {
  it.each([
    [0, '0 amigos'],
    [1, '1 amigo'],
    [3, '3 amigos'],
  ])('counts %i friends', (count, label) => {
    expect(friendsLabel(count)).toBe(label)
  })

  it.each([
    [1, '1 solicitud enviada'],
    [2, '2 solicitudes enviadas'],
  ])('counts %i requests', (count, label) => {
    expect(requestsLabel(count)).toBe(label)
  })
})
