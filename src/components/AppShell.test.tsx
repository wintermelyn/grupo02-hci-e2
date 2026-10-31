import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it } from 'vitest'
import { renderApp } from '../test/router'
import { AppShell } from './AppShell'

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

  // The page has its own path, so the shell is checked alone, with one page at that path.
  it('keeps Inicio active on /actividad, where touching it goes back to where the list was', () => {
    render(
      <MemoryRouter initialEntries={['/actividad']}>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="actividad" element={<h1>Actividad</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )
    for (const nav of navigationBars()) {
      expect(activeSections(nav)).toEqual(['Inicio'])
      expect(within(nav).getByRole('link', { name: 'Inicio' })).toHaveAttribute(
        'aria-current',
        'true',
      )
    }
  })

  it('keeps the bottom bar on the edge, solid, up to lg', () => {
    renderApp('/')
    const bar = navigationBars().find((nav) => nav.hasAttribute('data-bottom-bar'))
    expect(bar).toHaveClass('fixed', 'inset-x-0', 'bottom-0', 'bg-paper', 'lg:hidden')
    expect(bar?.className).not.toContain('backdrop-blur')
  })

  it('names the product and says it is a prototype on the sidebar', () => {
    renderApp('/')
    const sidebar = screen.getByRole('complementary')
    expect(within(sidebar).getByRole('link', { name: 'Goodreads' })).toHaveAttribute('href', '/')
    expect(within(sidebar).getByText(/^Prototipo de rediseño/)).toBeInTheDocument()
  })

  it.each(['/', '/descubrir', '/buscar'])('gives %s all the width', (path) => {
    renderApp(path)
    expect(screen.getByRole('main')).not.toHaveClass('max-w-app')
  })

  it.each(['/biblioteca', '/biblioteca/carpeta/terror', '/libro/OL81626W', '/amigos'])(
    'keeps %s in the column',
    (path) => {
      renderApp(path)
      expect(screen.getByRole('main')).toHaveClass('max-w-app')
    },
  )

  it('leaves room under the last row for the bar and the toast', () => {
    renderApp('/')
    expect(screen.getByRole('main').className).toContain('pb-[calc(8rem+')
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

describe('title of the tab', () => {
  it.each([
    ['/', 'Inicio · Goodreads'],
    ['/biblioteca', 'Mis libros · Goodreads'],
    ['/buscar', 'Buscar · Goodreads'],
    ['/?actividad=1', 'Actividad de tus amigos · Goodreads'],
    ['/libro/OL81626W', 'Carrie · Goodreads'],
  ])('%s is named as its page', (path, title) => {
    renderApp(path)
    expect(document.title).toBe(title)
  })

  it('follows a change inside the page, which does not change the path', async () => {
    renderApp('/')
    fireEvent.click(screen.getByRole('link', { name: /Ver toda la actividad/ }))
    await waitFor(() => expect(document.title).toBe('Actividad de tus amigos · Goodreads'))
    fireEvent.click(screen.getByRole('link', { name: 'Inicio', current: false }))
    await waitFor(() => expect(document.title).toBe('Inicio · Goodreads'))
  })
})
