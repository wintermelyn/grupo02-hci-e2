import { act, fireEvent, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useStore } from '../../store'
import { ACCEPT_AFTER_MS } from '../../store/socialSlice'
import { currentLocation, renderApp } from '../../test/router'
import { state } from '../../test/store'

const main = () => within(screen.getByRole('main'))
const heading = (name: string) => main().queryByRole('heading', { level: 2, name })
const backLink = () => main().getByRole('link', { name: 'Amigos' })

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
    expect(main().getByText('3 amigos en común')).toBeInTheDocument()
    expect(main().queryByText('Disponible pronto')).not.toBeInTheDocument()
  })

  it('tells both homonyms apart', () => {
    renderApp('/amigos/ctorres99')
    expect(screen.getByRole('heading', { level: 1, name: 'Camila Torres' })).toBeInTheDocument()
    expect(main().getByText('@ctorres_99')).toBeInTheDocument()
    expect(main().getByText('Sin amigos en común')).toBeInTheDocument()
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

describe('PersonPage books', () => {
  it('says that the tags and stars of the rows are mine', () => {
    renderApp('/amigos/camila')
    expect(main().getByText(/son los tuyos/)).toBeInTheDocument()
  })

  it('does not say it when no book is in my library', () => {
    state().removeFromLibrary(Object.keys(state().library))
    renderApp('/amigos/camila')
    expect(main().queryByText(/son los tuyos/)).not.toBeInTheDocument()
  })
})

describe('PersonPage action', () => {
  it('offers a single Agregar, like the rows of Amigos', () => {
    renderApp('/amigos/camila')
    const button = main().getByRole('button', { name: 'Agregar a @camitorres' })
    expect(button).toHaveTextContent('Agregar')
    expect(button).toHaveClass('bg-white')
    expect(main().getAllByRole('button')).toHaveLength(1)
  })

  it('shows the request with Cancelar, in the same weight and on the same button', () => {
    renderApp('/amigos/camila')
    const button = main().getByRole('button', { name: 'Agregar a @camitorres' })
    button.focus()
    fireEvent.click(button)
    expect(main().getByText('Solicitud enviada')).toBeInTheDocument()
    const cancel = main().getByRole('button', { name: /^Cancelar/ })
    expect(cancel).toHaveClass('bg-white')
    expect(cancel).toHaveFocus()
    fireEvent.click(cancel)
    expect(main().getByRole('button', { name: 'Agregar a @camitorres' })).toBeInTheDocument()
  })

  it('becomes Amigos with Quitar de amigos after 4 s', () => {
    vi.useFakeTimers()
    renderApp('/amigos/camila')
    fireEvent.click(main().getByRole('button', { name: /^Agregar/ }))
    act(() => vi.advanceTimersByTime(ACCEPT_AFTER_MS))
    expect(main().getByText('Amigos', { selector: 'span' })).toBeInTheDocument()
    expect(main().getByRole('button', { name: /^Quitar de amigos/ })).toHaveClass('bg-white')
    expect(main().queryByText('Solicitud enviada')).not.toBeInTheDocument()
  })

  it('removes a friend with one step and offers to add them again', () => {
    renderApp('/amigos/diego')
    fireEvent.click(main().getByRole('button', { name: /^Quitar de amigos/ }))
    expect(main().getByRole('button', { name: 'Agregar a @diegolee' })).toBeInTheDocument()
    expect(screen.getByText('Diego Fuentes ya no está en tus amigos')).toBeInTheDocument()
  })
})

describe('PersonPage books', () => {
  it('shows what the person is reading and has read', () => {
    renderApp('/amigos/ignacio')
    expect(sectionOf('Está leyendo').getAllByRole('listitem')).toHaveLength(1)
    expect(sectionOf('Últimos leídos').getAllByRole('listitem')).toHaveLength(2)
  })

  it('counts as in common what the person reads or read and is in my library', () => {
    keepInLibrary('OL893414W', 'OL1168083W', 'OL81626W')
    renderApp('/amigos/diego')
    expect(titlesIn('Libros en común')).toHaveLength(2)
    expect(titlesIn('Libros en común').join()).toContain('Dune')
    expect(titlesIn('Libros en común').join()).not.toContain('Carrie')
  })

  it('follows the library when a book leaves it', () => {
    keepInLibrary('OL893414W', 'OL1168083W')
    renderApp('/amigos/diego')
    act(() => keepInLibrary('OL893414W'))
    expect(titlesIn('Libros en común')).toHaveLength(1)
  })

  it('says so when there is nothing in common', () => {
    keepInLibrary()
    renderApp('/amigos/diego')
    expect(main().getByText('Todavía no tienen libros en común.')).toBeInTheDocument()
  })

  it.each([
    ['Está leyendo', 'readingIds'],
    ['Últimos leídos', 'readIds'],
  ] as const)('hides %s when there is nothing to show', (title, list) => {
    withoutBooks('diego', list)
    renderApp('/amigos/diego')
    expect(heading(title)).not.toBeInTheDocument()
    expect(heading('Libros en común')).toBeInTheDocument()
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
      expect(main().queryByRole('button')).not.toBeInTheDocument()
    },
  )
})
