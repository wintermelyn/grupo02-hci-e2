import { describe, expect, it } from 'vitest'
import { today } from '../../lib/dates'
import type { Book, LibraryEntry } from '../../types'
import { arrangeResults, groupByAuthor, matchRange, MAX_AUTHORS, MAX_BOOKS } from './results'

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

describe('matchRange', () => {
  it('finds the search at the start of a word', () => {
    expect(matchRange('Stephen King', 'king')).toEqual([8, 12])
  })

  it('does not take the end of a word for a match, also further on in the text', () => {
    expect(matchRange('Stephen Hawking', 'king')).toBeUndefined()
    expect(matchRange('Hawking y King', 'king')).toEqual([10, 14])
  })

  it('takes punctuation as the end of a word', () => {
    expect(matchRange('Jean-Paul Sartre', 'paul')).toEqual([5, 9])
  })

  it('ignores accents and case, and marks the text as it is written', () => {
    expect(matchRange('Gabriel García Márquez', 'GARCIA')).toEqual([8, 14])
  })

  it('leaves alone a letter that does not fold into one, and an empty search', () => {
    expect(matchRange('İstanbul', 'stan')).toBeUndefined()
    expect(matchRange('Dune', '  ')).toBeUndefined()
  })
})

describe('arrangeResults', () => {
  const stephen = book('1', 'Stephen King')
  const hawking = book('2', 'Stephen Hawking')

  it('leads with the author when no title starts with the search', () => {
    expect(arrangeResults([stephen], 'king', NOTHING).lead).toBe('author')
  })

  it('leads with the book when its title starts with the search, even with an author', () => {
    const results = [{ ...book('1', 'Stephen King'), title: 'King Lear' }]
    expect(arrangeResults(results, 'king', NOTHING).lead).toBe('book')
    expect(arrangeResults([book('1', 'Otra')], 'libro', NOTHING).lead).toBe('book')
  })

  it('has no lead for the books of one author, or for an empty list', () => {
    expect(arrangeResults([stephen], 'stephen king', NOTHING).lead).toBeUndefined()
    expect(arrangeResults([], 'king', NOTHING).lead).toBeUndefined()
  })

  it('marks the search, except in the books of one author', () => {
    expect(arrangeResults([stephen], 'king', NOTHING).marked).toBe('king')
    expect(arrangeResults([stephen], 'stephen king', NOTHING).marked).toBe('')
  })

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
    expect(summary).toBe('3 libros · 2 en Mis libros')
  })

  it('uses the singular for one book', () => {
    expect(arrangeResults([book('1')], 'libro', NOTHING).summary).toBe('1 libro')
  })

  describe('with more books than the list shows', () => {
    const many = Array.from({ length: MAX_BOOKS + 5 }, (_, index) =>
      book(String(index), 'Stephen King'),
    )

    it('stops at the most relevant and says of how many', () => {
      const { books, summary } = arrangeResults(many, 'libro', {})
      expect(books).toHaveLength(MAX_BOOKS)
      expect(summary).toBe(`Los ${MAX_BOOKS} más relevantes de ${MAX_BOOKS + 5}`)
    })

    it('keeps the library in the list and counts it', () => {
      const { books, summary } = arrangeResults(many, 'libro', { 44: entry('44') })
      expect(books[0].id).toBe('44')
      expect(summary).toBe(`Los ${MAX_BOOKS} más relevantes de ${MAX_BOOKS + 5} · 1 en Mis libros`)
    })

    it('still counts every book of an author', () => {
      const { authors } = arrangeResults(many, 'king', {})
      expect(authors[0].books).toHaveLength(MAX_BOOKS + 5)
    })

    it('shows all of them when the search is the author', () => {
      const { books, summary } = arrangeResults(many, 'stephen king', {})
      expect(books).toHaveLength(MAX_BOOKS + 5)
      expect(summary).toBe(`${MAX_BOOKS + 5} libros`)
    })
  })

  it('caps the list of authors', () => {
    const many = Array.from({ length: MAX_AUTHORS + 2 }, (_, index) =>
      book(String(index), `Autor ${index}`),
    )
    expect(arrangeResults(many, 'autor', NOTHING).authors).toHaveLength(MAX_AUTHORS)
  })
})
