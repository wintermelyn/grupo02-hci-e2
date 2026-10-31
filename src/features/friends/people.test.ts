import { describe, expect, it } from 'vitest'
import users from '../../data/users.json'
import { friendsLabel, looksForPerson, peopleSearchPath, requestsLabel } from './people'

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

describe('looksForPerson', () => {
  it.each([
    ['anything with an @', '@alguien', true],
    ['spaces before the @', '  @camitorres', true],
    ['a full name', 'Camila Torres', true],
    ['the start of a name, without accents', 'tomas', true],
    ['the start of a surname', 'torres', true],
    ['the start of a username', 'camit', true],
    ['the middle of a name', 'ernand', false],
    ['a book', 'fundación', false],
    ['a lone @', '@', false],
    ['nothing', '', false],
  ])('%s', (_, text, expected) => {
    expect(looksForPerson(text, users)).toBe(expected)
  })
})

describe('peopleSearchPath', () => {
  it('keeps the @ and the spaces of the text', () => {
    expect(peopleSearchPath('@camitorres')).toBe('/amigos?q=%40camitorres')
    expect(peopleSearchPath('Camila Torres')).toBe('/amigos?q=Camila+Torres')
  })
})
