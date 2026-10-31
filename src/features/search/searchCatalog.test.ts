import { describe, expect, it } from 'vitest'
import type { Book } from '../../types'
import { isAuthorName, matchesAuthor, searchCatalog, toSearchable } from './searchCatalog'

const book = (title: string, ...authors: string[]): Book => ({ id: title, title, authors })

const CATALOG = [
  book('El Aleph', 'Jorge Luis Borges'),
  book('Cien años de soledad', 'Gabriel García Márquez'),
  book('La hojarasca', 'Gabriel García Márquez'),
  book('It', 'Stephen King'),
  book('Breve historia del tiempo', 'Stephen Hawking'),
  book('La soledad del corredor', 'Alan Sillitoe'),
  book('El rey de amarillo', 'Robert W. Chambers'),
  book('King Lear', 'William Shakespeare'),
  book('Niño soldado', 'Ana Ñuñez'),
  book('Buenos presagios', 'Terry Pratchett', 'Neil Gaiman'),
  book('Rey y Jean-Paul', 'J. R. R. Tolkien'),
].map(toSearchable)

const titles = (query: string) => searchCatalog(CATALOG, query).map(({ title }) => title)

describe('searchCatalog', () => {
  it('finds nothing without something to look for', () => {
    expect(titles('')).toEqual([])
    expect(titles('  ¿?  ')).toEqual([])
  })

  it('finds by the start of a word of the title or the author', () => {
    expect(titles('aleph')).toEqual(['El Aleph'])
    expect(titles('sol')).toEqual([
      'Cien años de soledad',
      'La soledad del corredor',
      'Niño soldado',
    ])
    expect(titles('leph')).toEqual([])
    expect(titles('ledad')).toEqual([])
  })

  it('does not take Hawking for King', () => {
    expect(titles('king')).toEqual(['King Lear', 'It'])
  })

  it('ignores accents and capitals, in what is written and in what is typed', () => {
    expect(titles('GARCÍA')).toEqual(['Cien años de soledad', 'La hojarasca'])
    expect(titles('garcia')).toEqual(titles('GARCÍA'))
    expect(titles('nino')).toEqual(['Niño soldado'])
    expect(titles('ñuñez')).toEqual(['Niño soldado'])
  })

  it('takes punctuation for a space', () => {
    expect(titles('paul')).toEqual(['Rey y Jean-Paul'])
    expect(titles('j r r')).toEqual(['Rey y Jean-Paul'])
  })

  it('takes initials together, with dots or with spaces for the same thing', () => {
    const books = [
      book('Harry Potter', 'J. K. Rowling'),
      book('El hobbit', 'J. R. R. Tolkien'),
      book('Las almas de Du Bois', 'W. E. B. Du Bois'),
      book('Jaque', 'Julio Kramer'),
    ].map(toSearchable)
    const found = (query: string) => searchCatalog(books, query).map(({ title }) => title)
    for (const query of ['jk rowling', 'j k rowling', 'j.k. rowling', 'J. K. Rowling', 'jk']) {
      expect(found(query)).toEqual(['Harry Potter'])
    }
    expect(found('j k')).toEqual(['Harry Potter', 'Jaque'])
    for (const query of ['jrr tolkien', 'j r r tolkien', 'j.r.r. tolkien', 'jrr']) {
      expect(found(query)).toEqual(['El hobbit'])
    }
    expect(found('web du bois')).toEqual(['Las almas de Du Bois'])
  })

  it('still finds an initial on its own', () => {
    expect(titles('r tolkien')).toEqual(['Rey y Jean-Paul'])
  })

  it('does not forgive a typing mistake, which is a decision of its own', () => {
    expect(titles('jk rowlin')).toEqual([])
    expect(titles('stephen kng')).toEqual([])
  })

  it('asks every word to start a word, in any order, across the title and the authors', () => {
    expect(titles('soledad cien')).toEqual(['Cien años de soledad'])
    expect(titles('marquez cien')).toEqual(['Cien años de soledad'])
    expect(titles('cien borges')).toEqual([])
  })

  it('finds any of the authors of a book', () => {
    expect(titles('gaiman')).toEqual(['Buenos presagios'])
    expect(titles('pratchett')).toEqual(['Buenos presagios'])
  })

  it('puts the whole title first, then how a title starts, then a word in it, then the author', () => {
    const books = [
      book('Otro libro', 'Rosa Rey'),
      book('El rey de amarillo', 'Robert W. Chambers'),
      book('Rey de reyes', 'Otra'),
      book('Rey', 'Otra'),
    ].map(toSearchable)
    expect(searchCatalog(books, 'rey').map(({ title }) => title)).toEqual([
      'Rey',
      'Rey de reyes',
      'El rey de amarillo',
      'Otro libro',
    ])
  })

  it('keeps the order of the catalog, the most read first, among equals', () => {
    const books = [book('Rey 2', 'Otra'), book('Rey 1', 'Otra')].map(toSearchable)
    expect(searchCatalog(books, 'rey').map(({ title }) => title)).toEqual(['Rey 2', 'Rey 1'])
  })
})

describe('isAuthorName', () => {
  it('compares the whole name, however its initials are written', () => {
    for (const query of ['jk rowling', 'j k rowling', 'j.k. rowling', 'J. K. Rowling']) {
      expect(isAuthorName('J. K. Rowling', query)).toBe(true)
    }
    expect(isAuthorName('J. K. Rowling', 'rowling')).toBe(false)
  })
})

describe('matchesAuthor', () => {
  it('goes by the start of a word of the name', () => {
    expect(matchesAuthor('Stephen King', 'king')).toBe(true)
    expect(matchesAuthor('Stephen Hawking', 'king')).toBe(false)
    expect(matchesAuthor('Gabriel García Márquez', 'garcia marquez')).toBe(true)
  })

  it('takes initials together for the same thing', () => {
    expect(matchesAuthor('J. K. Rowling', 'jk rowling')).toBe(true)
    expect(matchesAuthor('J. K. Rowling', 'jk')).toBe(true)
    expect(matchesAuthor('J. K. Rowling', 'k rowling')).toBe(true)
  })

  it('has nothing to say about an empty search', () => {
    expect(matchesAuthor('Stephen King', ' ')).toBe(false)
  })
})
