import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { currentLocation, renderWithRouter } from '../test/router'
import { state } from '../test/store'
import type { Book } from '../types'
import { BookRow } from './BookRow'
import { LONG_PRESS_MS } from './useLongPress'

// Not in seedBooks or extraBooks, like a live search result.
const apiBook: Book = { id: 'OL0000001W', title: 'Libro de la API', authors: ['Autora'] }

function renderRow() {
  renderWithRouter(<BookRow book={apiBook} />, { route: '/buscar' })
}

describe('BookRow with a book that is not in the store', () => {
  it('adds the book before changing its status', () => {
    renderRow()
    fireEvent.click(screen.getByRole('button', { name: 'Quiero' }))
    expect(state().getBook(apiBook.id)).toEqual(apiBook)
    expect(state().library[apiBook.id]?.status).toBe('want')
  })

  it('adds the book before opening the finish panel', () => {
    renderRow()
    fireEvent.click(screen.getByRole('button', { name: 'Leído' }))
    expect(state().getBook(apiBook.id)).toEqual(apiBook)
    expect(currentLocation()).toBe(`/libro/${apiBook.id}?accion=terminar`)
  })

  it('adds the book before opening its page', () => {
    renderRow()
    fireEvent.click(screen.getByRole('link', { name: /Libro de la API/ }))
    expect(state().getBook(apiBook.id)).toEqual(apiBook)
    expect(currentLocation()).toBe(`/libro/${apiBook.id}`)
  })
})

describe('BookRow long press', () => {
  function renderPressable() {
    const onLongPress = vi.fn()
    renderWithRouter(<BookRow book={apiBook} onLongPress={onLongPress} />, { route: '/buscar' })
    return { onLongPress, link: screen.getByRole('link', { name: /Libro de la API/ }) }
  }

  it('calls onLongPress after holding, and swallows the click that ends the press', () => {
    vi.useFakeTimers()
    const { onLongPress, link } = renderPressable()
    fireEvent.pointerDown(link, { button: 0 })
    vi.advanceTimersByTime(LONG_PRESS_MS)
    expect(onLongPress).toHaveBeenCalledOnce()

    expect(fireEvent.contextMenu(link)).toBe(false)
    fireEvent.pointerUp(link)
    fireEvent.click(link)
    expect(currentLocation()).toBe('/buscar')
  })

  it('a short press still opens the book', () => {
    vi.useFakeTimers()
    const { onLongPress, link } = renderPressable()
    fireEvent.pointerDown(link, { button: 0 })
    vi.advanceTimersByTime(LONG_PRESS_MS - 1)
    fireEvent.pointerUp(link)
    fireEvent.click(link)
    vi.advanceTimersByTime(LONG_PRESS_MS)
    expect(onLongPress).not.toHaveBeenCalled()
    expect(currentLocation()).toBe(`/libro/${apiBook.id}`)
  })

  it('moving the finger (a scroll) cancels the press', () => {
    vi.useFakeTimers()
    const { onLongPress, link } = renderPressable()
    fireEvent.pointerDown(link, { button: 0, clientX: 0, clientY: 0 })
    fireEvent.pointerMove(link, { clientX: 0, clientY: 30 })
    vi.advanceTimersByTime(LONG_PRESS_MS)
    expect(onLongPress).not.toHaveBeenCalled()
  })

  it('keeps the context menu for a right click', () => {
    const { onLongPress, link } = renderPressable()
    fireEvent.pointerDown(link, { button: 2 })
    expect(fireEvent.contextMenu(link)).toBe(true)
    expect(onLongPress).not.toHaveBeenCalled()
  })
})
