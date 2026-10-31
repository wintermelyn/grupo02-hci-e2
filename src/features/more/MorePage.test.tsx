import { fireEvent, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { currentLocation, renderApp } from '../../test/router'

const main = () => within(screen.getByRole('main'))

describe('MorePage', () => {
  it('shows Amigos and Mi perfil without any other step', () => {
    renderApp('/mas')
    expect(screen.getByRole('heading', { level: 1, name: 'Más' })).toBeInTheDocument()
    expect(main().getByRole('link', { name: 'Amigos' })).toHaveAttribute('href', '/amigos')
    expect(main().getByRole('link', { name: 'Mi perfil' })).toHaveAttribute('href', '/perfil')
  })

  it('gives each link a touch area of at least 44 px, with its icon', () => {
    renderApp('/mas')
    for (const name of ['Amigos', 'Mi perfil']) {
      const link = main().getByRole('link', { name })
      expect(link).toHaveClass('min-h-14')
      expect(link.querySelectorAll('svg[aria-hidden="true"]')).not.toHaveLength(0)
    }
  })

  it('opens Amigos, with Más still marked in the navigation', () => {
    renderApp('/mas')
    fireEvent.click(main().getByRole('link', { name: 'Amigos' }))
    expect(currentLocation()).toBe('/amigos')
    for (const nav of screen.getAllByRole('navigation', { name: 'Principal' })) {
      expect(within(nav).getByRole('link', { name: 'Más' })).toHaveAttribute('aria-current', 'true')
    }
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
