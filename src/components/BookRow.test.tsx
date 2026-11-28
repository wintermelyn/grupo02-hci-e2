import { act, fireEvent, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { currentLocation, renderWithRouter } from '../test/router'
import { state } from '../test/store'
import type { Book } from '../types'
import { BookRow } from './BookRow'

// Not in seedBooks or extraBooks, like a result of Buscar.
const catalogBook: Book = { id: 'OL0000001W', title: 'Libro del catálogo', authors: ['Autora'] }

function libraryBook(bookId: string): Book {
  const book = state().getBook(bookId)
  if (!book) throw new Error(`the catalog needs ${bookId}`)
  return book
}

function renderRow(book: Book) {
  renderWithRouter(<BookRow book={book} />, { route: '/buscar' })
}

describe('BookRow', () => {
  it('opens the page of the book and stores nothing, as it only looked at it', () => {
    renderRow(catalogBook)
    fireEvent.click(screen.getByRole('link', { name: /Libro del catálogo/ }))
    expect(state().extraBooks).toEqual({})
    expect(currentLocation()).toBe(`/libro/${catalogBook.id}`)
  })

  it('lets the list mark what matched, in the title and in the authors', () => {
    renderWithRouter(<BookRow book={catalogBook} highlight={(text) => <mark>{text}</mark>} />, {
      route: '/buscar',
    })
    const marked = [...document.querySelectorAll('mark')].map(({ textContent }) => textContent)
    expect(marked).toEqual(['Libro del catálogo', 'Autora'])
  })

  it('swaps my tag and stars for a note in a list about someone else', () => {
    const book = libraryBook('OL274505W') // Leído, 5 estrellas
    renderWithRouter(<BookRow book={book} note={<span>En común</span>} />)
    expect(screen.getByText('En común')).toBeInTheDocument()
    expect(screen.queryByText('Leído')).not.toBeInTheDocument()
    expect(screen.queryByRole('img', { name: /estrellas/ })).not.toBeInTheDocument()
  })

  it('shows no tag for a book outside the library', () => {
    renderRow(catalogBook)
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

  it('adds the folders on their own line, and keeps the tag with its text and the ribbon', () => {
    const book = libraryBook('OL81613W')
    renderWithRouter(<BookRow book={book} folders={['Próximos', 'Terror']} />)
    const row = screen.getByRole('link', { name: /It/ })
    expect(row).toHaveTextContent('Lo quiero')
    expect(screen.getByText('Próximos · Terror').parentElement).toBe(row)
    expect(document.querySelector('.ribbon')).not.toBeNull()
  })

  it('leaves the line out for a book with no folders', () => {
    renderWithRouter(<BookRow book={libraryBook('OL81613W')} folders={[]} />)
    expect(screen.getByText('Lo quiero')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /It/ })).not.toHaveTextContent('·')
  })

  it('shows the rating of a rated book', () => {
    renderRow(libraryBook('OL274505W'))
    expect(screen.getByRole('img', { name: '5 de 5 estrellas' })).toBeInTheDocument()
  })

  it('shows the trailing content', () => {
    renderWithRouter(<BookRow book={catalogBook} trailing={<button>Quitar</button>} />, {
      route: '/buscar',
    })
    expect(screen.getByRole('button', { name: 'Quitar' })).toBeInTheDocument()
  })
})
