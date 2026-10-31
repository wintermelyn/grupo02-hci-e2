import { fireEvent, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useStore } from '../../store'
import { currentLocation, renderApp } from '../../test/router'
import { state } from '../../test/store'

const main = () => within(screen.getByRole('main'))

describe('MorePage', () => {
  it('shows Amigos and Mi perfil without any other step', () => {
    renderApp('/mas')
    expect(screen.getByRole('heading', { level: 1, name: 'Más' })).toBeInTheDocument()
    expect(main().getByRole('link', { name: 'Amigos' })).toHaveAttribute('href', '/amigos')
    expect(main().getByRole('link', { name: 'Mi perfil' })).toHaveAttribute('href', '/perfil')
  })

  it('gives each link a touch area of at least 44 px', () => {
    renderApp('/mas')
    for (const name of ['Amigos', 'Mi perfil']) {
      expect(main().getByRole('link', { name })).toHaveClass('min-h-14')
    }
  })

  it.each([
    ['Amigos', 'lucide-users'],
    ['Mi perfil', 'lucide-circle-user'],
  ])('puts the icon of %s before its name, out of what is announced', (name, icon) => {
    renderApp('/mas')
    const [first, label, arrow] = main().getByRole('link', { name }).children
    expect(first).toHaveClass(icon)
    expect(first).toHaveAttribute('aria-hidden', 'true')
    expect(label).toHaveTextContent(name)
    expect(arrow).toHaveClass('lucide-arrow-right')
  })

  it('opens Amigos, with Más still marked in the navigation', () => {
    renderApp('/mas')
    fireEvent.click(main().getByRole('link', { name: 'Amigos' }))
    expect(currentLocation()).toBe('/amigos')
    for (const nav of screen.getAllByRole('navigation', { name: 'Principal' })) {
      expect(within(nav).getByRole('link', { name: 'Más' })).toHaveAttribute('aria-current', 'true')
    }
  })

  it('has only these two links in the page, each reaching over its whole card', () => {
    renderApp('/mas')
    expect(main().getAllByRole('link')).toHaveLength(2)
    for (const name of ['Amigos', 'Mi perfil']) {
      expect(main().getByRole('link', { name })).toHaveClass('after:absolute', 'after:inset-0')
      expect(main().getByRole('link', { name }).closest('li')).toHaveClass('relative')
    }
  })

  it('shows who is behind each card with what the app already knows', () => {
    renderApp('/mas')
    expect(main().getByText('3 amigos')).toBeInTheDocument()
    expect(main().getByText('Alex Muñoz')).toBeInTheDocument()
    expect(main().getByText('@alexlee')).toBeInTheDocument()
    expect(main().getByText('Tus datos y Reiniciar demo')).toBeInTheDocument()
  })

  it('does not mention requests while there are none', () => {
    renderApp('/mas')
    expect(main().queryByText(/solicitud/)).not.toBeInTheDocument()
  })

  it('counts the requests apart from the friends', () => {
    state().sendFriendRequest('camila')
    renderApp('/mas')
    expect(main().getByText('3 amigos')).toBeInTheDocument()
    expect(main().getByText('1 solicitud enviada')).toBeInTheDocument()
  })

  it('keeps the card when there are no friends yet, and says so', () => {
    useStore.setState({ friendships: [] })
    renderApp('/mas')
    expect(main().getByText('Aún no tienes amigos')).toBeInTheDocument()
    expect(main().getByRole('link', { name: 'Amigos' })).toBeInTheDocument()
  })

  it('says that this Goodreads is a prototype for a course', () => {
    renderApp('/mas')
    expect(main().getByText(/prototipo de rediseño para un curso universitario/)).toBeVisible()
  })

  it('no longer shows the pending screen', () => {
    renderApp('/mas')
    expect(main().queryByText('Disponible pronto')).not.toBeInTheDocument()
  })
})
