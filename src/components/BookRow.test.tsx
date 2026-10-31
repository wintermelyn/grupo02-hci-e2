import { act, fireEvent, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { currentLocation, renderWithRouter } from '../test/router'
import { state } from '../test/store'
import type { Book } from '../types'
import { BookRow } from './BookRow'

// Not in seedBooks or extraBooks, like a live search result.
const apiBook: Book = { id: 'OL0000001W', title: 'Libro de la API', authors: ['Autora'] }

function libraryBook(bookId: string): Book {
  const book = state().getBook(bookId)
  if (!book) throw new Error(`the catalog needs ${bookId}`)
  return book
}

function renderRow(book: Book) {
  renderWithRouter(<BookRow book={book} />, { route: '/buscar' })
}

describe('BookRow', () => {
  it('adds the book before opening its page', () => {
    renderRow(apiBook)
    fireEvent.click(screen.getByRole('link', { name: /Libro de la API/ }))
    expect(state().getBook(apiBook.id)).toEqual(apiBook)
    expect(currentLocation()).toBe(`/libro/${apiBook.id}`)
  })

  it('shows no tag for a book outside the library', () => {
    renderRow(apiBook)
    expect(screen.queryByText(/Lo quiero|Lo tengo|Leyendo|Leído/)).not.toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('shows the tag read-only, inside the link to the book', () => {
    renderRow(libraryBook('OL81626W'))
    expect(screen.getByRole('link', { name: /Carrie.*Leyendo/ })).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('follows the tag when it changes', () => {
    renderRow(libraryBook('OL81613W'))
    expect(screen.getByText('Lo quiero')).toBeInTheDocument()
    act(() => state().setStatus('OL81613W', 'owned'))
    expect(screen.getByText('Lo tengo')).toBeInTheDocument()
    expect(screen.queryByText('Lo quiero')).not.toBeInTheDocument()
  })

  it('shows the rating of a rated book', () => {
    renderRow(libraryBook('OL274505W'))
    expect(screen.getByRole('img', { name: '5 de 5 estrellas' })).toBeInTheDocument()
  })

  it('shows the trailing content', () => {
    renderWithRouter(<BookRow book={apiBook} trailing={<button>Quitar</button>} />, {
      route: '/buscar',
    })
    expect(screen.getByRole('button', { name: 'Quitar' })).toBeInTheDocument()
  })
})
