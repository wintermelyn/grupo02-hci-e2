import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp } from '../test/router'

const SECTIONS = ['Inicio', 'Mis libros', 'Descubrir', 'Buscar', 'Más']

// Both bars are in the DOM; CSS shows one or the other. Each list is checked on its own.
function navigationBars() {
  return screen.getAllByRole('navigation', { name: 'Principal' })
}

function activeSections(nav: HTMLElement) {
  return within(nav)
    .getAllByRole('link')
    .filter((link) => link.getAttribute('aria-current') === 'page')
    .map((link) => link.textContent)
}

describe('AppShell', () => {
  it('has the five sections, in order, on both bars', () => {
    renderApp('/')
    const bars = navigationBars()
    expect(bars).toHaveLength(2)
    for (const nav of bars) {
      expect(
        within(nav)
          .getAllByRole('link')
          .map((link) => link.textContent),
      ).toEqual(SECTIONS)
    }
  })

  it.each([
    ['/', 'Inicio'],
    ['/biblioteca', 'Mis libros'],
    ['/biblioteca/carpeta/terror', 'Mis libros'],
    ['/descubrir', 'Descubrir'],
    ['/buscar', 'Buscar'],
    ['/mas', 'Más'],
    ['/amigos', 'Más'],
    ['/amigos/camila', 'Más'],
    ['/perfil', 'Más'],
  ])('%s marks only %s', (path, section) => {
    renderApp(path)
    for (const nav of navigationBars()) expect(activeSections(nav)).toEqual([section])
  })

  it('marks no section on a book page', () => {
    renderApp('/libro/OL81626W')
    for (const nav of navigationBars()) expect(activeSections(nav)).toEqual([])
  })
})
