import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { forgetSearches, savedSearch, searchBooks } from '../../lib/openlibrary'
import { renderApp } from '../../test/router'
import { state } from '../../test/store'
import { addRecentSearch, readRecentSearches } from '../search/recentSearchStore'

const CARRIE = 'OL81626W'

const openConfirm = () => fireEvent.click(screen.getByRole('button', { name: 'Reiniciar demo' }))

describe('ProfilePage', () => {
  it('shows the name and the username, with a way back to Más', () => {
    renderApp('/perfil')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Alex Muñoz')
    expect(screen.getByText('@alexlee')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Más', current: false })).toHaveAttribute(
      'href',
      '/mas',
    )
  })

  it('asks in the page first, with the focus on Cancelar and what is lost in view', () => {
    renderApp('/perfil')
    openConfirm()
    expect(screen.getByRole('heading', { name: '¿Reiniciar la demo?' })).toBeInTheDocument()
    expect(screen.getByText(/Pierdes los cambios/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toHaveFocus()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('cancels with nothing changed and the focus back on the button', () => {
    state().setStatus(CARRIE, 'owned')
    renderApp('/perfil')
    openConfirm()
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(state().library[CARRIE].status).toBe('owned')
    expect(screen.getByRole('button', { name: 'Reiniciar demo' })).toHaveFocus()
  })

  it('forgets the searches it answered, so a repeated task starts from zero', async () => {
    vi.stubGlobal('fetch', async () => new Response(JSON.stringify({ docs: [] })))
    forgetSearches()
    await searchBooks('dune', new AbortController().signal)
    vi.unstubAllGlobals()
    expect(savedSearch('dune')).toBeDefined()

    renderApp('/perfil')
    openConfirm()
    fireEvent.click(screen.getAllByRole('button', { name: 'Reiniciar demo' })[0])
    expect(savedSearch('dune')).toBeUndefined()
  })

  it('goes back to the start, recent searches included, and says so', () => {
    state().setStatus(CARRIE, 'owned')
    state().sendFriendRequest('camila')
    addRecentSearch('king', [])
    renderApp('/perfil')
    openConfirm()
    fireEvent.click(screen.getByRole('button', { name: 'Reiniciar demo' }))

    expect(state().library[CARRIE].status).toBe('reading')
    expect(state().friendships.map(({ userId }) => userId)).not.toContain('camila')
    expect(readRecentSearches()).toEqual([])
    expect(state().toast).toMatchObject({ message: 'Demo reiniciada', undoable: false })
    expect(screen.getByRole('button', { name: 'Reiniciar demo' })).toHaveFocus()
  })
})
