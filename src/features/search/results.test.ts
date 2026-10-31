import { describe, expect, it } from 'vitest'
import { today } from '../../lib/dates'
import type { Book, LibraryEntry } from '../../types'
import { arrangeResults, groupByAuthor, MAX_AUTHORS } from './results'

const book = (id: string, ...authors: string[]): Book => ({ id, title: `Libro ${id}`, authors })
const entry = (bookId: string): LibraryEntry => ({
  bookId,
  status: 'want',
  folderIds: [],
  addedAt: today(),
})
const NOTHING = {}

describe('groupByAuthor', () => {
  it('counts a book for each of its authors, the most read first', () => {
    const groups = groupByAuthor([book('1', 'Ana', 'Beto'), book('2', 'Beto'), book('3')])
    expect(groups.map(({ name, books }) => [name, books.length])).toEqual([
      ['Beto', 2],
      ['Ana', 1],
    ])
  })

  it('sorts equals by name, with Spanish rules', () => {
    const groups = groupByAuthor([book('1', 'Zoe'), book('2', 'Ñuñoa'), book('3', 'Ana')])
    expect(groups.map(({ name }) => name)).toEqual(['Ana', 'Ñuñoa', 'Zoe'])
  })
})

describe('arrangeResults', () => {
  const stephen = book('1', 'Stephen King')
  const hawking = book('2', 'Stephen Hawking')

  it('finds an author by the start of a word of the name', () => {
    const { authors } = arrangeResults([stephen, hawking], 'king', NOTHING)
    expect(authors.map(({ name }) => name)).toEqual(['Stephen King'])
  })

  it('leaves the list as it is when no author matches', () => {
    const { authors, books } = arrangeResults([stephen, hawking], 'libro', NOTHING)
    expect(authors).toEqual([])
    expect(books).toHaveLength(2)
  })

  it('filters to the books of an author once the search is their name', () => {
    const results = [
      book('1', 'Stephen King'),
      book('2', 'Otra Persona'),
      book('3', 'Stephen King'),
    ]
    const { authors, books, summary } = arrangeResults(results, 'stephen king', NOTHING)
    expect(authors).toEqual([])
    expect(books.map(({ id }) => id)).toEqual(['1', '3'])
    expect(summary).toBe('2 libros')
  })

  it('puts the library first and says how many of them are there', () => {
    const { books, summary } = arrangeResults([book('1'), book('2'), book('3')], 'libro', {
      3: entry('3'),
      2: entry('2'),
    })
    expect(books.map(({ id }) => id)).toEqual(['2', '3', '1'])
    expect(summary).toBe('3 libros · 2 en tu biblioteca')
  })

  it('uses the singular for one book', () => {
    expect(arrangeResults([book('1')], 'libro', NOTHING).summary).toBe('1 libro')
  })

  it('caps the list of authors', () => {
    const many = Array.from({ length: MAX_AUTHORS + 2 }, (_, index) =>
      book(String(index), `Autor ${index}`),
    )
    expect(arrangeResults(many, 'autor', NOTHING).authors).toHaveLength(MAX_AUTHORS)
  })
})
