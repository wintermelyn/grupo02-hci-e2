const RECENT_KEY = 'gr-e2-buscados'

export const MAX_RECENT = 4

// Storage can be blocked or full: a search that is not remembered is no reason to fail, so every
// read and write goes through a try. Not in the store, because they are not part of a demo's data.
export function readRecentSearches(): string[] {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]')
    if (!Array.isArray(stored)) return []
    return stored.filter((term): term is string => typeof term === 'string').slice(0, MAX_RECENT)
  } catch {
    return []
  }
}

function writeRecentSearches(terms: string[]) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(terms))
  } catch {
    // The list on screen still has it until the page closes.
  }
}

/** Reiniciar demo calls this too, because the store does not know about them. */
export function clearRecentSearches() {
  try {
    localStorage.removeItem(RECENT_KEY)
  } catch {
    // There is nothing to clear.
  }
}

/** The term goes first, once, ignoring case. Returns the new list. */
export function addRecentSearch(term: string, current: string[]): string[] {
  const lower = term.toLocaleLowerCase('es-CL')
  const others = current.filter((item) => item.toLocaleLowerCase('es-CL') !== lower)
  const next = [term, ...others].slice(0, MAX_RECENT)
  writeRecentSearches(next)
  return next
}
