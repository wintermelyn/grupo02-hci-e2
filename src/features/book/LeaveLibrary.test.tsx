import { fireEvent, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderWithRouter } from '../../test/router'
import { state } from '../../test/store'
import { LeaveLibrary } from './LeaveLibrary'

const question = () => screen.getByRole('region', { name: '¿Quitar «Carrie» de Mis libros?' })

function renderCarrie() {
  const carrie = state().library.OL81626W
  renderWithRouter(<LeaveLibrary book={state().getBook(carrie.bookId)!} entry={carrie} />)
  return carrie
}

describe('LeaveLibrary', () => {
  afterEach(() => {
    // jsdom has no scrollIntoView, so the component calls it only when it exists.
    delete (Element.prototype as Partial<Element>).scrollIntoView
  })

  it('asks before taking the book out', () => {
    const carrie = renderCarrie()
    fireEvent.click(screen.getByRole('button', { name: 'Quitar de Mis libros: «Carrie»' }))
    expect(state().library).toHaveProperty(carrie.bookId)
    expect(question()).toBeVisible()
    fireEvent.click(screen.getByRole('button', { name: 'Quitar de Mis libros' }))
    expect(state().library).not.toHaveProperty(carrie.bookId)
  })

  it('brings the question into view, clear of the bottom bar and the toast', () => {
    const scrollIntoView = vi.fn()
    Element.prototype.scrollIntoView = scrollIntoView
    renderCarrie()
    fireEvent.click(screen.getByRole('button', { name: 'Quitar de Mis libros: «Carrie»' }))
    const place = question().parentElement!
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'nearest' })
    expect(scrollIntoView.mock.contexts).toContain(place)
    expect(place).toHaveClass('scroll-mb-36', 'lg:scroll-mb-20')
  })
})
