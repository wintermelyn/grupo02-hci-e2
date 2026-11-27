import { describe, expect, it } from 'vitest'
import { pagePercent, pageProblem } from './pages'

describe('pageProblem', () => {
  it.each([
    [1, 608],
    [608, 608],
    [2000, undefined],
  ])('takes page %i of a book with %s pages', (page, pages) => {
    expect(pageProblem(page, pages)).toBeUndefined()
  })

  it.each([
    [0, 608, 'Escribe un número de página.'],
    [-3, 608, 'Escribe un número de página.'],
    [2.5, 608, 'Escribe un número de página.'],
    [Number.NaN, 608, 'Escribe un número de página.'],
    [609, 608, 'El libro tiene 608 páginas.'],
  ])('holds back page %s of a book with %i pages', (page, pages, problem) => {
    expect(pageProblem(page, pages)).toBe(problem)
  })
})

describe('pagePercent', () => {
  it('rounds to a whole percent', () => {
    expect(pagePercent(210, 412)).toBe(51)
    expect(pagePercent(1, 608)).toBe(0)
    expect(pagePercent(608, 608)).toBe(100)
  })
})
