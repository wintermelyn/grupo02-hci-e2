import { fireEvent, screen, within } from '@testing-library/react'
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

const option = (name: string) => within(screen.getByRole('dialog')).getByRole('button', { name })

function renderControl(bookId: string, book?: Book) {
  renderWithRouter(<StatusControl bookId={bookId} book={book} />)
}

function openPanel(name: RegExp | string = /Cambiar estado/) {
  fireEvent.click(screen.getByRole('button', { name }))
}

describe('StatusControl', () => {
  it('shows the current tag with a labelled pencil, naming the book for screen readers', () => {
    renderControl(CARRIE)
    const trigger = screen.getByRole('button', { name: 'Leyendo. Cambiar estado de «Carrie»' })
    expect(trigger).toHaveTextContent('Leyendo')
    expect(trigger).toHaveTextContent('Cambiar')
  })

  it('offers the four tags in order and marks the current one', () => {
    renderControl(CARRIE)
    openPanel()
    const dialog = screen.getByRole('dialog', { name: 'Estado de «Carrie»' })
    expect(
      within(dialog)
        .getAllByRole('button')
        .filter((button) => button.hasAttribute('aria-pressed'))
        .map((button) => button.textContent?.replace('Actual', '')),
    ).toEqual(['Lo quiero', 'Lo tengo', 'Leyendo', 'Leído'])
    expect(option('Leyendo')).toHaveAttribute('aria-pressed', 'true')
    expect(option('Leyendo')).toHaveTextContent('Actual')
    expect(option('Lo tengo')).toHaveAttribute('aria-pressed', 'false')
    expect(option('Lo tengo')).not.toHaveTextContent('Actual')
  })

  it.each([
    ['Lo quiero', 'want'],
    ['Lo tengo', 'owned'],
  ])('sets %s directly, closes the panel and shows the toast', (name, status) => {
    renderControl(CARRIE)
    openPanel()
    fireEvent.click(option(name))
    expect(state().library[CARRIE].status).toBe(status)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(state().toast).toMatchObject({ undoable: true })
    expect(screen.getByRole('button', { name: new RegExp(`^${name}\\.`) })).toBeInTheDocument()
  })

  it('sets Leyendo directly', () => {
    renderControl(IT)
    openPanel()
    fireEvent.click(option('Leyendo'))
    expect(state().library[IT].status).toBe('reading')
  })

  it('finishes a started book with finishBook, never with setStatus', () => {
    const setStatus = stubAction('setStatus')
    const finishBook = stubAction('finishBook')
    renderControl(CARRIE)
    openPanel()
    fireEvent.click(option('Leído'))
    expect(finishBook).toHaveBeenCalledExactlyOnceWith(CARRIE, {
      startedAt: daysAgo(12),
      finishedAt: today(),
    })
    expect(setStatus).not.toHaveBeenCalled()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('uses addedAt as the start date of a book that was never started', () => {
    const finishBook = stubAction('finishBook')
    renderControl(IT)
    openPanel()
    fireEvent.click(option('Leído'))
    expect(finishBook).toHaveBeenCalledExactlyOnceWith(IT, {
      startedAt: daysAgo(210),
      finishedAt: today(),
    })
  })

  it('does not finish a Leído book again, which would lose its dates and rating', () => {
    const finishBook = stubAction('finishBook')
    renderControl(CIEN_ANOS)
    openPanel()
    fireEvent.click(option('Leído'))
    expect(finishBook).not.toHaveBeenCalled()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('does nothing when the current tag is chosen', () => {
    const library = state().library
    renderControl(CARRIE)
    openPanel()
    fireEvent.click(option('Leyendo'))
    expect(state().library).toBe(library)
    expect(state().toast).toBeNull()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('keeps everything as it was when the panel closes without choosing', () => {
    const library = state().library
    renderControl(CARRIE)
    openPanel()
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar' }))
    expect(state().library).toBe(library)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})

describe('StatusControl with a book outside the library', () => {
  it('offers to add it, with nothing marked, and adds it with the chosen tag', () => {
    renderControl(apiBook.id, apiBook)
    openPanel('Agregar a Mis libros')
    expect(screen.getByRole('dialog', { name: 'Agregar a Mis libros' })).toBeInTheDocument()
    for (const name of ['Lo quiero', 'Lo tengo', 'Leyendo', 'Leído']) {
      expect(option(name)).toHaveAttribute('aria-pressed', 'false')
    }
    fireEvent.click(option('Lo tengo'))
    expect(state().getBook(apiBook.id)).toEqual(apiBook)
    expect(state().library[apiBook.id].status).toBe('owned')
    expect(screen.getByRole('button', { name: /^Lo tengo\./ })).toBeInTheDocument()
  })

  it('adds the book before finishing it, starting today', () => {
    const finishBook = stubAction('finishBook')
    renderControl(apiBook.id, apiBook)
    openPanel('Agregar a Mis libros')
    fireEvent.click(option('Leído'))
    expect(state().getBook(apiBook.id)).toEqual(apiBook)
    expect(finishBook).toHaveBeenCalledExactlyOnceWith(apiBook.id, {
      startedAt: today(),
      finishedAt: today(),
    })
  })
})
