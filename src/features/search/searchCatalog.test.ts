import { describe, expect, it } from 'vitest'
import type { Book } from '../../types'
import { matchesAuthor, searchCatalog, toSearchable } from './searchCatalog'

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

describe('matchesAuthor', () => {
  it('goes by the start of a word of the name', () => {
    expect(matchesAuthor('Stephen King', 'king')).toBe(true)
    expect(matchesAuthor('Stephen Hawking', 'king')).toBe(false)
    expect(matchesAuthor('Gabriel García Márquez', 'garcia marquez')).toBe(true)
  })

  it('has nothing to say about an empty search', () => {
    expect(matchesAuthor('Stephen King', ' ')).toBe(false)
  })
})
