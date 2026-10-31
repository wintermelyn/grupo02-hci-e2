import { screen } from '@testing-library/react'
import { useParams } from 'react-router'
import { describe, expect, it } from 'vitest'
import type { Book } from '../types'
import { currentLocation, renderWithRouter } from './router'
import { state, stubAction } from './store'

const book: Book = { id: 'OL0000001W', title: 'Libro de prueba', authors: ['Autora'] }
const bookId = book.id

function BookIdProbe() {
  return <p>{useParams().bookId}</p>
}

// The two store tests run in order: the second one proves setup.ts isolates them.
describe('test setup', () => {
  it('lets a test change the store and stub an action', () => {
    state().upsertBook(book)
    state().setStatus(bookId, 'want')
    stubAction('setStatus')
    expect(state().library[bookId]).toBeDefined()
  })

  it('starts every test from the seed with the real actions', () => {
    expect(state().library[bookId]).toBeUndefined()
    expect(state().toast).toBeNull()
    expect(localStorage.length).toBe(0)
    state().upsertBook(book)
    state().setStatus(bookId, 'want')
    expect(state().library[bookId]).toBeDefined()
  })

  it('renderWithRouter mounts the element at a route pattern', () => {
    renderWithRouter(<BookIdProbe />, {
      route: '/libro/:bookId',
      path: `/libro/${bookId}?desde=terror`,
    })
    expect(screen.getByText(bookId)).toBeInTheDocument()
    expect(currentLocation()).toBe(`/libro/${bookId}?desde=terror`)
  })
})
