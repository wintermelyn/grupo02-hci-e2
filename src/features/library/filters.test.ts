import { describe, expect, it } from 'vitest'
import type { Book, Folder } from '../../types'
import { folderNameProblem, matchesQuery, normalizeText, parseTag, pinnedFirst } from './filters'

const book: Book = { id: 'OL1W', title: 'Gótico', authors: ['Silvia Moreno-García', 'Otra Autora'] }

describe('matchesQuery', () => {
  it.each(['Gótico', 'gotico', 'GÓTICO', '  gót ', 'moreno-garcia', 'autora', 'gotico silvia', ''])(
    'finds the book with "%s"',
    (query) => {
      expect(matchesQuery(book, query)).toBe(true)
    },
  )

  it('leaves out what does not match', () => {
    expect(matchesQuery(book, 'drácula')).toBe(false)
  })
})

describe('normalizeText', () => {
  it('ignores case, accents and the spaces around the text', () => {
    expect(normalizeText('  Ciencia Ficción ')).toBe('ciencia ficcion')
  })
})

describe('parseTag', () => {
  it('reads a tag and falls back to Todos', () => {
    expect(parseTag('read')).toBe('read')
    expect(parseTag('otro')).toBe('all')
    expect(parseTag(null)).toBe('all')
  })
})

describe('pinnedFirst', () => {
  it('moves the pinned folder first and keeps the order of the rest', () => {
    const folders: Folder[] = [
      { id: 'b', name: 'B', createdAt: '2026-01-01' },
      { id: 'c', name: 'C', createdAt: '2026-01-01' },
      { id: 'a', name: 'A', pinned: true, createdAt: '2026-01-01' },
    ]
    expect(pinnedFirst(folders).map(({ id }) => id)).toEqual(['a', 'b', 'c'])
  })
})

describe('folderNameProblem', () => {
  const folders: Folder[] = [{ id: 'novela', name: 'Novela', createdAt: '2026-01-01' }]

  it('asks for a name', () => {
    expect(folderNameProblem('   ', folders)).toBe('Escribe un nombre para la carpeta.')
  })

  it('compares without case, accents or the spaces around', () => {
    expect(folderNameProblem(' NOVÉLA ', folders)).toBe('Ya tienes una carpeta con ese nombre.')
    expect(folderNameProblem('Viajes', folders)).toBeUndefined()
  })

  it('lets a folder keep its own name', () => {
    expect(folderNameProblem('novela', folders, 'novela')).toBeUndefined()
  })
})
