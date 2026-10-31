import type { User } from '../../types'

export const FRIENDS_PATH = '/amigos'

export function personPath(userId: string): string {
  return `${FRIENDS_PATH}/${encodeURIComponent(userId)}`
}

export function mutualFriendsLabel(count: number): string {
  if (count === 0) return 'Sin amigos en común'
  return count === 1 ? '1 amigo en común' : `${count} amigos en común`
}

export function sharedBooksLabel(count: number): string {
  if (count === 0) return 'Sin libros en común'
  return count === 1 ? '1 libro en común' : `${count} libros en común`
}

/** Ignores case, accents and extra spaces, so "munoz" finds "Muñoz". */
function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('es-CL')
    .replace(/\s+/g, ' ')
    .trim()
}

/** What the person typed, ready to compare. Empty means there is nothing to search for yet. */
export function searchTerm(text: string): string {
  return normalize(text.replace(/^\s*@/, ''))
}

export function matchesPerson({ name, username }: User, term: string): boolean {
  return normalize(name).includes(term) || normalize(username).includes(term)
}
