import { fireEvent, screen, within } from '@testing-library/react'
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
    .filter((link) => link.hasAttribute('aria-current'))
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

  it.each([
    ['/mas', 'page'],
    ['/amigos', 'true'],
    ['/perfil', 'true'],
    ['/biblioteca', 'page'],
    ['/biblioteca/carpeta/terror', 'true'],
  ])('%s is announced as aria-current=%s', (path, value) => {
    renderApp(path)
    const [nav] = navigationBars()
    const active = within(nav)
      .getAllByRole('link')
      .find((link) => link.hasAttribute('aria-current'))
    expect(active).toHaveAttribute('aria-current', value)
  })

  it('marks no section on a book page', () => {
    renderApp('/libro/OL81626W')
    for (const nav of navigationBars()) expect(activeSections(nav)).toEqual([])
  })

  describe('scroll between pages', () => {
    const scrollTo = (top: number) => {
      document.documentElement.scrollTop = top
      fireEvent.scroll(window)
    }
    const scrolled = () => document.documentElement.scrollTop

    it('starts another page at the top and returns to the list with its back link', () => {
      renderApp('/biblioteca?tag=want')
      scrollTo(400)

      fireEvent.click(screen.getByRole('link', { name: /^Fundación/ }))
      expect(scrolled()).toBe(0)

      fireEvent.click(within(screen.getByRole('main')).getByRole('link', { name: 'Mis libros' }))
      expect(screen.getByRole('heading', { level: 1, name: 'Mis libros' })).toBeInTheDocument()
      expect(scrolled()).toBe(400)
    })

    it('stays in place when a filter changes the URL of the same page', () => {
      renderApp('/biblioteca?tag=want')
      scrollTo(400)
      fireEvent.click(screen.getByRole('button', { name: /Leído/ }))
      expect(scrolled()).toBe(400)
    })
  })
})
