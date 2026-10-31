import { fireEvent, screen, within } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { daysAgo, today } from '../lib/dates'
import { renderWithRouter } from '../test/router'
import { state, stubAction } from '../test/store'
import type { Book } from '../types'
import { StatusControl } from './StatusControl'

// Not in seedBooks or extraBooks, like a live search result.
const apiBook: Book = { id: 'OL0000001W', title: 'Libro de prueba', authors: ['Autora'] }
const CARRIE = 'OL81626W' // Leyendo
const IT = 'OL81613W' // Lo quiero
const CIEN_ANOS = 'OL274505W' // Leído

const option = (name: string) => screen.getByRole('menuitemradio', { name })
const removeOption = () => screen.getByRole('menuitem', { name: /^Quitar de Mis libros/ })

function renderControl(bookId: string, book?: Book) {
  renderWithRouter(<StatusControl bookId={bookId} book={book} />)
}

const trigger = (name: RegExp | string = /Cambiar o quitar/) => screen.getByRole('button', { name })

function openMenu(name?: RegExp | string) {
  fireEvent.click(trigger(name))
}

const key = (name: string) => fireEvent.keyDown(document.activeElement as Element, { key: name })

describe('StatusControl', () => {
  it('shows the current tag with a labelled pencil, naming the book for screen readers', () => {
    renderControl(CARRIE)
    const button = trigger('Leyendo. Cambiar o quitar: «Carrie»')
    expect(button).toHaveTextContent('Leyendo')
    expect(button).toHaveTextContent('Cambiar o quitar')
  })

  it('offers the four tags in order and marks the current one', () => {
    renderControl(CARRIE)
    openMenu()
    const menu = screen.getByRole('menu', { name: 'Estado de «Carrie»' })
    expect(
      within(menu)
        .getAllByRole('menuitemradio')
        .map((item) => item.textContent?.replace('Actual', '')),
    ).toEqual(['Lo quiero', 'Lo tengo', 'Leyendo', 'Leído'])
    expect(option('Leyendo')).toBeChecked()
    expect(option('Leyendo')).toHaveTextContent('Actual')
    expect(option('Lo tengo')).not.toBeChecked()
    expect(option('Lo tengo')).not.toHaveTextContent('Actual')
  })

  it.each([
    ['Lo quiero', 'want'],
    ['Lo tengo', 'owned'],
  ])('sets %s directly, closes the menu and shows the toast', (name, status) => {
    renderControl(CARRIE)
    openMenu()
    fireEvent.click(option(name))
    expect(state().library[CARRIE].status).toBe(status)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(state().toast).toMatchObject({ undoable: true })
    expect(trigger(new RegExp(`^${name}\\.`))).toHaveFocus()
  })

  it('sets Leyendo directly', () => {
    renderControl(IT)
    openMenu()
    fireEvent.click(option('Leyendo'))
    expect(state().library[IT].status).toBe('reading')
  })

  it('offers to leave the library below the tags, set apart and saying what it costs', () => {
    renderControl(CIEN_ANOS)
    openMenu()
    const remove = removeOption()
    expect(remove).toHaveTextContent('Pierdes 1 carpeta, las fechas y el puntaje')
    expect(remove).toHaveAccessibleDescription('Pierdes 1 carpeta, las fechas y el puntaje')
    expect(screen.getByRole('separator')).toBeInTheDocument()
  })

  it('has nothing to leave when the book is not in the library', () => {
    renderControl(apiBook.id, apiBook)
    openMenu('Agregar a Mis libros')
    expect(screen.queryByRole('menuitem')).not.toBeInTheDocument()
  })

  it('finishes a started book with finishBook, never with setStatus', () => {
    const setStatus = stubAction('setStatus')
    const finishBook = stubAction('finishBook')
    renderControl(CARRIE)
    openMenu()
    fireEvent.click(option('Leído'))
    expect(finishBook).toHaveBeenCalledExactlyOnceWith(CARRIE, {
      startedAt: daysAgo(12),
      finishedAt: today(),
    })
    expect(setStatus).not.toHaveBeenCalled()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('uses addedAt as the start date of a book that was never started', () => {
    const finishBook = stubAction('finishBook')
    renderControl(IT)
    openMenu()
    fireEvent.click(option('Leído'))
    expect(finishBook).toHaveBeenCalledExactlyOnceWith(IT, {
      startedAt: daysAgo(210),
      finishedAt: today(),
    })
  })

  it('does not finish a Leído book again, which would lose its dates and rating', () => {
    const finishBook = stubAction('finishBook')
    renderControl(CIEN_ANOS)
    openMenu()
    fireEvent.click(option('Leído'))
    expect(finishBook).not.toHaveBeenCalled()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('does nothing when the current tag is chosen', () => {
    const library = state().library
    renderControl(CARRIE)
    openMenu()
    fireEvent.click(option('Leyendo'))
    expect(state().library).toBe(library)
    expect(state().toast).toBeNull()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('leaves the rest of the page usable: the menu is not a modal', () => {
    renderControl(CARRIE)
    openMenu()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger()).toHaveAttribute('aria-expanded', 'true')
    expect(trigger()).toHaveAttribute('aria-haspopup', 'menu')
  })

  it('keeps everything as it was when a click outside closes the menu', () => {
    const library = state().library
    renderControl(CARRIE)
    openMenu()
    fireEvent.pointerDown(document.body)
    expect(state().library).toBe(library)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('closes with a second click on the control, but not with a double tap', () => {
    renderControl(CARRIE)
    openMenu()
    fireEvent.click(trigger(), { detail: 2 })
    expect(screen.getByRole('menu')).toBeInTheDocument()
    fireEvent.click(trigger(), { detail: 1 })
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })
})

describe('StatusControl with the keyboard', () => {
  it('starts on the current tag and moves with the arrows, wrapping around', () => {
    renderControl(CARRIE)
    openMenu()
    expect(option('Leyendo')).toHaveFocus()
    key('ArrowDown')
    expect(option('Leído')).toHaveFocus()
    key('ArrowDown')
    expect(removeOption()).toHaveFocus()
    key('ArrowDown')
    expect(option('Lo quiero')).toHaveFocus()
    key('ArrowUp')
    expect(removeOption()).toHaveFocus()
  })

  it('jumps to the ends with Home and End', () => {
    renderControl(CARRIE)
    openMenu()
    key('Home')
    expect(option('Lo quiero')).toHaveFocus()
    key('End')
    expect(removeOption()).toHaveFocus()
  })

  it('opens from the control with the arrow keys, on the last tag and not on leaving', () => {
    renderControl(IT)
    trigger().focus()
    key('ArrowUp')
    expect(option('Leído')).toHaveFocus()
  })

  it('closes with Escape, gives the focus back and changes nothing', () => {
    const library = state().library
    renderControl(CARRIE)
    openMenu()
    key('Escape')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(trigger()).toHaveFocus()
    expect(state().library).toBe(library)
  })

  it('closes with Tab, letting the focus move on', () => {
    renderControl(CARRIE)
    openMenu()
    key('Tab')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('gives the focus back after choosing', () => {
    renderControl(CARRIE)
    openMenu()
    fireEvent.click(option('Lo tengo'))
    expect(trigger(/^Lo tengo\./)).toHaveFocus()
  })
})

describe('StatusControl when the book changes', () => {
  function BookSwitcher() {
    const [bookId, setBookId] = useState(CARRIE)
    return (
      <>
        <button onClick={() => setBookId(IT)}>Otro libro</button>
        <StatusControl bookId={bookId} />
      </>
    )
  }

  it('closes the menu instead of showing it for the other book', () => {
    renderWithRouter(<BookSwitcher />)
    openMenu()
    expect(screen.getByRole('menu', { name: 'Estado de «Carrie»' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Otro libro' }))
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })
})

describe('StatusControl with a book outside the library', () => {
  it('offers to add it, with nothing marked, and adds it with the chosen tag', () => {
    renderControl(apiBook.id, apiBook)
    const button = trigger('Agregar a Mis libros')
    openMenu('Agregar a Mis libros')
    expect(screen.getByRole('menu', { name: 'Agregar a Mis libros' })).toBeInTheDocument()
    for (const name of ['Lo quiero', 'Lo tengo', 'Leyendo', 'Leído']) {
      expect(option(name)).not.toBeChecked()
    }
    fireEvent.click(option('Lo tengo'))
    expect(state().getBook(apiBook.id)).toEqual(apiBook)
    expect(state().library[apiBook.id].status).toBe('owned')
    // The same element, so the focus can come back to it.
    expect(trigger(/^Lo tengo\./)).toBe(button)
  })

  it('adds the book before finishing it, starting today', () => {
    const finishBook = stubAction('finishBook')
    renderControl(apiBook.id, apiBook)
    openMenu('Agregar a Mis libros')
    fireEvent.click(option('Leído'))
    expect(state().getBook(apiBook.id)).toEqual(apiBook)
    expect(finishBook).toHaveBeenCalledExactlyOnceWith(apiBook.id, {
      startedAt: today(),
      finishedAt: today(),
    })
  })
})
