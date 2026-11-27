import { fireEvent, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderApp, renderWithRouter } from '../../test/router'
import { state } from '../../test/store'
import { LeaveLibrary } from './LeaveLibrary'

const question = () => screen.getByRole('region', { name: '¿Quitar «Carrie» de Mis libros?' })

function renderCarrie(onLeave = () => {}) {
  const carrie = state().library.OL81626W
  renderWithRouter(
    <LeaveLibrary book={state().getBook(carrie.bookId)!} entry={carrie} onLeave={onLeave} />,
  )
  return carrie
}

/** Enter and Space send a click with no clicks counted. */
const pressEnter = (element: HTMLElement) => fireEvent.click(element, { detail: 0 })

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

  it('weighs less than the safe actions of the record, and leaves the danger color to Quitar', () => {
    renderCarrie()
    const leave = screen.getByRole('button', { name: 'Quitar de Mis libros: «Carrie»' })
    expect(leave).toHaveClass('text-muted', 'font-medium')
    expect(leave).not.toHaveClass('text-ink', 'font-semibold')
    expect(leave.className).not.toMatch(/danger/)
    fireEvent.click(leave)
    expect(screen.getByRole('button', { name: 'Quitar de Mis libros' })).toHaveClass('bg-danger')
  })

  it('lets whoever shows it move the focus before the book leaves', () => {
    const onLeave = vi.fn(() => expect(state().library).toHaveProperty('OL81626W'))
    renderCarrie(onLeave)
    fireEvent.click(screen.getByRole('button', { name: 'Quitar de Mis libros: «Carrie»' }))
    fireEvent.click(screen.getByRole('button', { name: 'Quitar de Mis libros' }))
    expect(onLeave).toHaveBeenCalledOnce()
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

  describe('from the keyboard, in the book page', () => {
    function leaveCarrie() {
      renderApp('/libro/OL81626W')
      const main = within(screen.getByRole('main'))
      pressEnter(main.getByRole('button', { name: 'Quitar de Mis libros: «Carrie»' }))
      pressEnter(main.getByRole('button', { name: 'Quitar de Mis libros' }))
      expect(undoButton()).toHaveFocus()
      return main
    }

    const undoButton = () => screen.getByRole('button', { name: 'Deshacer' })

    it('gives the focus back to the tag of the book after Deshacer', () => {
      const main = leaveCarrie()
      pressEnter(undoButton())
      expect(state().library).toHaveProperty('OL81626W')
      expect(main.getByRole('button', { name: 'Leyendo. Cambiar estado: «Carrie»' })).toHaveFocus()
    })

    it('goes back with Tab to the same control, now to add the book', () => {
      const main = leaveCarrie()
      fireEvent.keyDown(undoButton(), { key: 'Tab' })
      expect(main.getByRole('button', { name: 'Agregar a Mis libros' })).toHaveFocus()
    })
  })
})
