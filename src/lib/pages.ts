/**
 * Why a page cannot be saved, in the person's words, or undefined when it can. A book with no
 * known length takes any page from 1 up.
 */
export function pageProblem(page: number, pages: number | undefined): string | undefined {
  if (!Number.isInteger(page) || page < 1) return 'Escribe un número de página.'
  if (pages && page > pages) return `El libro tiene ${pages} páginas.`
  return undefined
}

/** How far into the book a page is, rounded to a whole percent. */
export function pagePercent(page: number, pages: number): number {
  return Math.min(100, Math.round((page / pages) * 100))
}
