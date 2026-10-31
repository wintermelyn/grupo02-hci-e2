import { act, fireEvent, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useStore } from '../../store'
import { ACCEPT_AFTER_MS } from '../../store/socialSlice'
import { currentLocation, renderApp } from '../../test/router'
import { state } from '../../test/store'

const main = () => within(screen.getByRole('main'))
const searchBox = () => main().getByRole('searchbox', { name: 'Buscar personas' })
const type = (value: string) => fireEvent.change(searchBox(), { target: { value } })
const heading = (name: string) => main().queryByRole('heading', { level: 2, name })
const toast = (message: string) => screen.getByText(message)

function rowOf(username: string) {
  const row = main().getByText(`@${username}`).closest('li')
  if (!row) throw new Error(`@${username} is not in a list`)
  return within(row)
}

function usernames() {
  return main()
    .queryAllByText(/^@/)
    .map((element) => element.textContent)
}

function sectionOf(title: string) {
  const section = heading(title)?.closest('section')
  if (!section) throw new Error(`There is no section called ${title}`)
  return within(section)
}

const addButton = (username: string) => rowOf(username).getByRole('button', { name: /^Agregar/ })
const cancelButton = (username: string) =>
  rowOf(username).getByRole('button', { name: /^Cancelar/ })

describe('FriendsPage without text', () => {
  it('has its header, search field and back link', () => {
    renderApp('/amigos')
    expect(screen.getByRole('heading', { level: 1, name: 'Amigos' })).toBeInTheDocument()
    expect(main().getByRole('link', { name: 'Más' })).toHaveAttribute('href', '/mas')
    expect(searchBox()).toHaveAttribute('placeholder', 'Nombre o @usuario')
  })

  it('lists the friends by name, and no section for requests while there are none', () => {
    renderApp('/amigos')
    expect(heading('Solicitudes pendientes')).not.toBeInTheDocument()
    expect(usernames()).toEqual(['@diegolee', '@tomasreads', '@valelee'])
    expect(rowOf('diegolee').getByText('Amigos')).toBeInTheDocument()
    expect(rowOf('diegolee').getByText('2 amigos en común')).toBeInTheDocument()
  })

  it('shows requests in their own section, above the friends', () => {
    state().sendFriendRequest('camila')
    renderApp('/amigos')
    expect(
      main()
        .getAllByRole('heading', { level: 2 })
        .map((h) => h.textContent),
    ).toEqual(['Solicitudes pendientes', 'Tus amigos'])
    expect(sectionOf('Solicitudes pendientes').getByText('@camitorres')).toBeInTheDocument()
    expect(sectionOf('Solicitudes pendientes').getByText('Solicitud enviada')).toBeInTheDocument()
  })

  it('moves a request to the friends when it is accepted', () => {
    vi.useFakeTimers()
    state().sendFriendRequest('camila')
    renderApp('/amigos')
    act(() => vi.advanceTimersByTime(ACCEPT_AFTER_MS))
    expect(heading('Solicitudes pendientes')).not.toBeInTheDocument()
    expect(sectionOf('Tus amigos').getByText('@camitorres')).toBeInTheDocument()
  })

  it('explains what to do with no friends and no requests', () => {
    useStore.setState({ friendships: [] })
    renderApp('/amigos')
    expect(heading('Aún no tienes amigos')).toBeInTheDocument()
    expect(heading('Tus amigos')).not.toBeInTheDocument()
  })

  it('treats a lone @ or spaces as no search', () => {
    renderApp('/amigos')
    for (const value of ['@', '   ']) {
      type(value)
      expect(heading('Tus amigos')).toBeInTheDocument()
    }
  })
})

describe('FriendsPage search', () => {
  it('searches the whole directory, not only the friends', () => {
    renderApp('/amigos')
    type('fernanda')
    expect(usernames()).toEqual(['@fercastillo'])
    expect(heading('Tus amigos')).not.toBeInTheDocument()
  })

  it.each([
    ['the name in another case', 'TOMÁS', '@tomasreads'],
    ['no accents', 'tomas rojas', '@tomasreads'],
    ['no accent in a surname', 'benjamin', '@benjareyes'],
    ['the username', 'ctorres_99', '@ctorres_99'],
    ['the username with @', '@ctorres_99', '@ctorres_99'],
    ['the @ after a space', ' @fercastillo', '@fercastillo'],
    ['extra spaces', 'ignacio   perez', '@nachoperez'],
  ])('finds a person by %s', (_, value, expected) => {
    renderApp('/amigos')
    type(value)
    expect(usernames()).toEqual([expected])
  })

  it('does not find me', () => {
    renderApp('/amigos')
    type('Alex Muñoz')
    expect(usernames()).toEqual([])
  })

  it('tells both Camila Torres apart', () => {
    renderApp('/amigos')
    type('Camila Torres')
    expect(usernames()).toEqual(['@camitorres', '@ctorres_99'])
    expect(rowOf('camitorres').getByText('3 amigos en común')).toBeInTheDocument()
    expect(rowOf('ctorres_99').getByText('Sin amigos en común')).toBeInTheDocument()
    expect(rowOf('camitorres').getByRole('link')).toHaveAttribute(
      'href',
      '/amigos/camila?q=Camila+Torres',
    )
    expect(rowOf('ctorres_99').getByRole('link')).toHaveAttribute(
      'href',
      '/amigos/ctorres99?q=Camila+Torres',
    )
  })

  it('writes the singular for one friend in common', () => {
    renderApp('/amigos')
    type('ignacio')
    expect(rowOf('nachoperez').getByText('1 amigo en común')).toBeInTheDocument()
  })

  it('keeps the search in the URL without adding history entries', () => {
    renderApp('/amigos')
    type('Camila')
    expect(currentLocation()).toBe('/amigos?q=Camila')
    fireEvent.click(rowOf('camitorres').getByRole('link'))
    expect(currentLocation()).toBe('/amigos/camila?q=Camila')
    fireEvent.click(main().getByRole('link', { name: 'Amigos' }))
    expect(currentLocation()).toBe('/amigos?q=Camila')
    expect(searchBox()).toHaveValue('Camila')
    expect(usernames()).toEqual(['@camitorres', '@ctorres_99'])
  })

  it('starts from a search in the URL', () => {
    renderApp('/amigos?q=martina')
    expect(usernames()).toEqual(['@martireads'])
  })

  it('clears the URL with Borrar', () => {
    renderApp('/amigos?q=martina')
    fireEvent.click(main().getByRole('button', { name: 'Borrar búsqueda' }))
    expect(currentLocation()).toBe('/amigos')
    expect(heading('Tus amigos')).toBeInTheDocument()
  })

  it('says when nobody matches', () => {
    renderApp('/amigos')
    type('zzz')
    expect(heading('No encontramos a nadie')).toBeInTheDocument()
    expect(main().getByText(/«zzz»/)).toBeInTheDocument()
  })
})

describe('person row', () => {
  it('keeps the link and the button as siblings', () => {
    renderApp('/amigos?q=camitorres')
    const button = addButton('camitorres')
    expect(button.closest('a')).toBeNull()
    expect(rowOf('camitorres').getByRole('link')).not.toContainElement(button)
  })

  it('offers Agregar as secondary, since there are several rows', () => {
    renderApp('/amigos?q=camila')
    const buttons = main().getAllByRole('button', { name: /^Agregar/ })
    expect(buttons).toHaveLength(2)
    for (const button of buttons) {
      expect(button).toHaveTextContent('Agregar')
      expect(button).toHaveClass('bg-white')
      expect(button.querySelector('svg')).not.toBeNull()
    }
  })

  it('names each button after its person, because the homonyms share a name', () => {
    renderApp('/amigos?q=camila')
    expect(main().getByRole('button', { name: 'Agregar a @camitorres' })).toBeInTheDocument()
    expect(main().getByRole('button', { name: 'Agregar a @ctorres_99' })).toBeInTheDocument()
  })

  it('changes at once to Solicitud enviada, with Cancelar in the same weight', () => {
    renderApp('/amigos?q=camitorres')
    fireEvent.click(addButton('camitorres'))
    expect(rowOf('camitorres').getByText('Solicitud enviada')).toBeInTheDocument()
    expect(cancelButton('camitorres')).toHaveClass('bg-white')
    expect(rowOf('camitorres').queryByRole('button', { name: /^Agregar/ })).toBeNull()
    expect(toast('Solicitud enviada a Camila Torres')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Deshacer' })).not.toBeInTheDocument()
  })

  it('only changes the row that was touched', () => {
    renderApp('/amigos?q=camila')
    fireEvent.click(addButton('camitorres'))
    expect(addButton('ctorres_99')).toBeInTheDocument()
  })

  it('goes back to Agregar with Cancelar', () => {
    renderApp('/amigos?q=camitorres')
    fireEvent.click(addButton('camitorres'))
    fireEvent.click(cancelButton('camitorres'))
    expect(addButton('camitorres')).toBeInTheDocument()
    expect(state().friendships.some(({ userId }) => userId === 'camila')).toBe(false)
  })

  it('does not cancel a request with the second click of a double tap', () => {
    renderApp('/amigos?q=camitorres')
    fireEvent.click(addButton('camitorres'), { detail: 1 })
    fireEvent.click(cancelButton('camitorres'), { detail: 2 })
    expect(rowOf('camitorres').getByText('Solicitud enviada')).toBeInTheDocument()
  })

  it('says Amigos without an action for someone already added', () => {
    renderApp('/amigos?q=diego')
    expect(rowOf('diegolee').getByText('Amigos')).toBeInTheDocument()
    expect(rowOf('diegolee').queryByRole('button')).toBeNull()
  })
})

describe('focus on the rows', () => {
  it('stays on the button when Agregar becomes Cancelar', () => {
    renderApp('/amigos?q=camitorres')
    const button = addButton('camitorres')
    button.focus()
    fireEvent.click(button)
    expect(cancelButton('camitorres')).toHaveFocus()
  })

  it('goes to the link when the accepted request loses its button', () => {
    vi.useFakeTimers()
    renderApp('/amigos?q=camitorres')
    fireEvent.click(addButton('camitorres'))
    cancelButton('camitorres').focus()
    act(() => vi.advanceTimersByTime(ACCEPT_AFTER_MS))
    expect(rowOf('camitorres').getByRole('link')).toHaveFocus()
  })

  it('follows the person from the requests to the friends', () => {
    vi.useFakeTimers()
    state().sendFriendRequest('camila')
    renderApp('/amigos')
    cancelButton('camitorres').focus()
    act(() => vi.advanceTimersByTime(ACCEPT_AFTER_MS))
    expect(rowOf('camitorres').getByRole('link')).toHaveFocus()
  })

  it('goes to the list when the row disappears', () => {
    state().sendFriendRequest('camila')
    renderApp('/amigos')
    const button = cancelButton('camitorres')
    button.focus()
    fireEvent.click(button)
    expect(document.activeElement).not.toBe(document.body)
    expect(document.activeElement).toContainElement(main().getByText('@diegolee'))
  })

  it('does not take the focus from the search field', () => {
    vi.useFakeTimers()
    renderApp('/amigos?q=camitorres')
    fireEvent.click(addButton('camitorres'))
    searchBox().focus()
    act(() => vi.advanceTimersByTime(ACCEPT_AFTER_MS))
    expect(searchBox()).toHaveFocus()
  })
})

describe('Invitar contactos', () => {
  it('is a quiet link at the end that only shows a notice', () => {
    renderApp('/amigos')
    const invite = main().getByRole('button', { name: 'Invitar contactos' })
    expect(invite).toHaveClass('underline')
    expect(invite).not.toHaveClass('shadow-card')
    const before = state().friendships
    fireEvent.click(invite)
    expect(toast('Este prototipo no envía invitaciones')).toBeInTheDocument()
    expect(state().friendships).toBe(before)
  })

  it('stays available during a search', () => {
    renderApp('/amigos?q=zzz')
    expect(main().getByRole('button', { name: 'Invitar contactos' })).toBeInTheDocument()
  })
})

describe('T3', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('goes from Más to Camila Torres as a friend', () => {
    renderApp('/mas')
    fireEvent.click(main().getByRole('link', { name: 'Amigos' }))
    type('Camila Torres')
    fireEvent.click(addButton('camitorres'))

    expect(rowOf('camitorres').getByText('Solicitud enviada')).toBeInTheDocument()
    expect(toast('Solicitud enviada a Camila Torres')).toBeInTheDocument()

    act(() => vi.advanceTimersByTime(ACCEPT_AFTER_MS - 1))
    expect(rowOf('camitorres').getByText('Solicitud enviada')).toBeInTheDocument()

    act(() => vi.advanceTimersByTime(1))
    expect(toast('Camila Torres aceptó tu solicitud')).toBeInTheDocument()
    expect(rowOf('camitorres').getByText('Amigos')).toBeInTheDocument()
    expect(rowOf('camitorres').queryByText('Solicitud enviada')).toBeNull()
    expect(addButton('ctorres_99')).toBeInTheDocument()

    fireEvent.click(main().getByRole('button', { name: 'Borrar búsqueda' }))
    expect(sectionOf('Tus amigos').getByText('@camitorres')).toBeInTheDocument()
    expect(usernames()).toEqual(['@camitorres', '@diegolee', '@tomasreads', '@valelee'])
  })

  it('still ends the same when leaving the page before the 4 s', () => {
    renderApp('/amigos?q=camitorres')
    fireEvent.click(addButton('camitorres'))
    fireEvent.click(screen.getAllByRole('link', { name: 'Inicio' })[0])
    act(() => vi.advanceTimersByTime(ACCEPT_AFTER_MS))
    expect(toast('Camila Torres aceptó tu solicitud')).toBeInTheDocument()
  })
})
