import { act, fireEvent, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { coverTone } from '../../lib/coverTone'
import { useStore } from '../../store'
import { ACCEPT_AFTER_MS } from '../../store/socialSlice'
import { currentLocation, renderApp } from '../../test/router'
import { state } from '../../test/store'

const main = () => within(screen.getByRole('main'))
const heading = (name: string) => main().queryByRole('heading', { level: 2, name })
const backLink = () => main().getByRole('link', { name: 'Amigos' })
const removeButton = (username: string) =>
  main().getByRole('button', { name: `Quitar a @${username} de amigos` })

function sectionOf(title: string) {
  const section = heading(title)?.closest('section')
  if (!section) throw new Error(`There is no section called ${title}`)
  return within(section)
}

/** Keeps only `bookIds` in the library, so a test decides what counts as a book in common. */
function keepInLibrary(...bookIds: string[]) {
  const entries = Object.values(state().library).filter(({ bookId }) => bookIds.includes(bookId))
  useStore.setState({ library: Object.fromEntries(entries.map((entry) => [entry.bookId, entry])) })
}

function withoutBooks(userId: string, list: 'readingIds' | 'readIds') {
  useStore.setState({
    users: state().users.map((user) => (user.id === userId ? { ...user, [list]: [] } : user)),
  })
}

function titlesIn(section: string) {
  return sectionOf(section)
    .getAllByRole('listitem')
    .map((item) => within(item).getAllByRole('link').at(-1)?.textContent)
}

describe('PersonPage', () => {
  it('titles the page with the name and the @usuario', () => {
    renderApp('/amigos/camila')
    expect(screen.getByRole('heading', { level: 1, name: 'Camila Torres' })).toBeInTheDocument()
    expect(main().getByText('@camitorres')).toBeInTheDocument()
    expect(main().getByText(/^3 amigos en común/)).toBeInTheDocument()
    expect(main().queryByText('Disponible pronto')).not.toBeInTheDocument()
  })

  it('tells both homonyms apart', () => {
    renderApp('/amigos/ctorres99')
    expect(screen.getByRole('heading', { level: 1, name: 'Camila Torres' })).toBeInTheDocument()
    expect(main().getByText('@ctorres_99')).toBeInTheDocument()
    expect(main().getByText(/^Sin amigos en común/)).toBeInTheDocument()
  })

  it('goes back to Amigos without a search', () => {
    renderApp('/amigos/camila')
    expect(backLink()).toHaveAttribute('href', '/amigos')
  })

  it('goes back to the search it came from', () => {
    renderApp('/amigos/camila?q=Camila')
    expect(backLink()).toHaveAttribute('href', '/amigos?q=Camila')
  })

  it('keeps the search after visiting a book', () => {
    renderApp('/amigos/camila?q=Camila')
    fireEvent.click(sectionOf('Está leyendo').getByRole('link'))
    expect(currentLocation()).toMatch(/^\/libro\//)
    fireEvent.click(main().getByRole('link', { name: 'Volver' }))
    expect(currentLocation()).toBe('/amigos/camila?q=Camila')
    expect(backLink()).toHaveAttribute('href', '/amigos?q=Camila')
  })
})

describe('PersonPage action', () => {
  it('offers a single Agregar, like the rows of Amigos', () => {
    renderApp('/amigos/camila')
    const button = main().getByRole('button', { name: 'Agregar a @camitorres' })
    expect(button).toHaveTextContent('Agregar')
    expect(button).not.toHaveClass('bg-ink')
    expect(main().getAllByRole('button')).toHaveLength(1)
  })

  it('gives Agregar, Cancelar and Quitar de amigos the same weight', () => {
    vi.useFakeTimers()
    renderApp('/amigos/camila')
    const add = main().getByRole('button', { name: /^Agregar/ })
    const weight = add.className
    fireEvent.click(add)
    expect(main().getByRole('button', { name: /^Cancelar/ }).className).toBe(weight)
    act(() => vi.advanceTimersByTime(ACCEPT_AFTER_MS))
    expect(removeButton('camitorres').className).toBe(weight)
  })

  it('states the request apart from Cancelar, which is not the button just tapped', () => {
    renderApp('/amigos/camila')
    const button = main().getByRole('button', { name: 'Agregar a @camitorres' })
    fireEvent.click(button)
    expect(button).not.toBeInTheDocument()
    expect(main().getByText('Solicitud enviada')).toBeInTheDocument()
    fireEvent.click(main().getByRole('button', { name: /^Cancelar/ }))
    expect(main().getByRole('button', { name: 'Agregar a @camitorres' })).toBeInTheDocument()
  })

  it('keeps the focus near when the button leaves', () => {
    renderApp('/amigos/camila')
    const button = main().getByRole('button', { name: 'Agregar a @camitorres' })
    button.focus()
    fireEvent.click(button)
    expect(document.activeElement).not.toBe(document.body)
    expect(document.activeElement).toHaveTextContent('Solicitud enviada')
  })

  it('states the friendship apart from the button that ends it, after 4 s', () => {
    vi.useFakeTimers()
    renderApp('/amigos/camila')
    fireEvent.click(main().getByRole('button', { name: /^Agregar/ }))
    const cancel = main().getByRole('button', { name: /^Cancelar/ })
    act(() => vi.advanceTimersByTime(ACCEPT_AFTER_MS))
    expect(cancel).not.toBeInTheDocument()
    expect(main().queryByText('Solicitud enviada')).not.toBeInTheDocument()
    expect(main().getByText('Amigos', { selector: 'span' })).toBeInTheDocument()
    expect(removeButton('camitorres')).toBeInTheDocument()
  })

  it('removes a friend in one tap, as many as adding, with Deshacer', () => {
    renderApp('/amigos/diego')
    fireEvent.click(removeButton('diegolee'))
    expect(main().getByRole('button', { name: 'Agregar a @diegolee' })).toBeInTheDocument()
    expect(screen.getByText('Diego Fuentes ya no está en tus amigos')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Deshacer' }))
    expect(removeButton('diegolee')).toBeInTheDocument()
  })
})

describe('PersonPage books', () => {
  it('shows what the person is reading and has read', () => {
    renderApp('/amigos/ignacio')
    expect(sectionOf('Está leyendo').getAllByRole('listitem')).toHaveLength(1)
    expect(sectionOf('Últimos leídos').getAllByRole('listitem')).toHaveLength(2)
  })

  it('shows each book once, marking on its row what is in common', () => {
    keepInLibrary('OL893414W', 'OL1168083W', 'OL81626W')
    renderApp('/amigos/diego')
    expect(main().getByText(/2 libros en común/)).toBeInTheDocument()
    expect(main().getAllByText('En común')).toHaveLength(2)
    expect(titlesIn('Está leyendo').join()).toContain('En común')
    expect(heading('Libros en común')).not.toBeInTheDocument()
    expect(main().queryByText(/Carrie/)).not.toBeInTheDocument()
  })

  it('does not show my tag or my stars, which could pass for theirs', () => {
    renderApp('/amigos/diego')
    expect(titlesIn('Está leyendo').join()).not.toMatch(/Lo quiero|Lo tengo|Leyendo|Leído/)
    expect(main().queryByRole('img', { name: /estrellas/ })).not.toBeInTheDocument()
  })

  it('follows the library when a book leaves it', () => {
    keepInLibrary('OL893414W', 'OL1168083W')
    renderApp('/amigos/diego')
    act(() => keepInLibrary('OL893414W'))
    expect(main().getByText(/1 libro en común/)).toBeInTheDocument()
  })

  it('says so when there is nothing in common', () => {
    keepInLibrary()
    renderApp('/amigos/diego')
    expect(main().getByText(/Sin libros en común/)).toBeInTheDocument()
    expect(main().queryByText('En común')).not.toBeInTheDocument()
  })

  it.each([
    ['Está leyendo', 'readingIds'],
    ['Últimos leídos', 'readIds'],
  ] as const)('hides %s when there is nothing to show', (title, list) => {
    withoutBooks('diego', list)
    renderApp('/amigos/diego')
    expect(heading(title)).not.toBeInTheDocument()
  })
})

describe('PersonPage reading card', () => {
  const card = () => sectionOf('Está leyendo').getByRole('link')

  it('takes the colour of its book, with the book as its only link', () => {
    renderApp('/amigos/camila')
    expect(card()).toHaveAttribute('href', '/libro/OL278437W')
    expect(card()).toHaveStyle({ backgroundColor: coverTone('OL278437W') })
    expect(card()).toHaveClass('text-white')
  })

  it('says what is in common inside the card, and nothing when it is not', () => {
    keepInLibrary('OL278437W')
    renderApp('/amigos/camila')
    expect(within(card()).getByText('En común')).toBeInTheDocument()
    act(() => keepInLibrary())
    expect(within(card()).queryByText('En común')).not.toBeInTheDocument()
  })

  it('carries no ribbon of my status, which could pass for theirs', () => {
    renderApp('/amigos/camila')
    expect(card().querySelector('[class*="ribbon"]')).toBeNull()
  })
})

describe('PersonPage shelf', () => {
  const shelf = () => sectionOf('Últimos leídos').getByRole('list')

  it('is a rail that keeps its edges on a phone and a row of covers on a computer', () => {
    renderApp('/amigos/diego')
    expect(shelf()).toHaveClass('rail', 'full-bleed', 'overflow-x-auto', 'lg:grid')
  })

  it('opens each book, and the book goes back to this person', () => {
    renderApp('/amigos/ignacio')
    const [first] = within(shelf()).getAllByRole('link')
    fireEvent.click(first)
    expect(currentLocation()).toMatch(/^\/libro\//)
    fireEvent.click(main().getByRole('link', { name: 'Volver' }))
    expect(currentLocation()).toBe('/amigos/ignacio')
  })

  it('marks only the books in common', () => {
    keepInLibrary('OL1168083W')
    renderApp('/amigos/diego')
    expect(within(shelf()).getAllByText('En común')).toHaveLength(1)
  })
})

describe('PersonPage without a person', () => {
  it.each(['/amigos/nadie', '/amigos/me', '/amigos/constructor'])(
    'shows %s as not found, with one h1 and a way back',
    (path) => {
      renderApp(path)
      expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
      expect(
        screen.getByRole('heading', { level: 1, name: 'Persona no encontrada' }),
      ).toBeInTheDocument()
      expect(backLink()).toHaveAttribute('href', '/amigos')
      fireEvent.click(main().getByRole('button', { name: 'Ir a Amigos' }))
      expect(currentLocation()).toBe('/amigos')
    },
  )
})
