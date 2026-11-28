import { fireEvent, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { currentLocation, renderApp } from '../test/router'

const profileLinks = () =>
  within(screen.getByRole('main')).queryAllByRole('link', { name: 'Mi perfil' })

describe('ProfileLink', () => {
  it.each(['/', '/biblioteca', '/descubrir', '/buscar', '/amigos', '/libro/OL81626W'])(
    'is at the top of %s, beside the name of the product, and only under lg',
    (path) => {
      renderApp(path)
      const [link] = profileLinks()
      expect(profileLinks()).toHaveLength(1)
      expect(link.parentElement).toHaveTextContent(/Goodreads/)
      expect(link.parentElement).toHaveClass('lg:hidden')
    },
  )

  it('shows the face of the person, with a target of 44 px', () => {
    renderApp('/')
    const [link] = profileLinks()
    expect(link).toHaveClass('size-11')
    expect(link).toHaveTextContent('AM')
  })

  it('opens Mi perfil, and says it is there', () => {
    renderApp('/')
    fireEvent.click(profileLinks()[0])
    expect(currentLocation()).toBe('/perfil')
    expect(profileLinks()[0]).toHaveAttribute('aria-current', 'page')
  })

  it('is not current anywhere else', () => {
    renderApp('/amigos')
    expect(profileLinks()[0]).not.toHaveAttribute('aria-current')
  })
})
