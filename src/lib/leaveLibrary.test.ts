import { describe, expect, it } from 'vitest'
import type { Folder } from '../types'
import { foldersLeft, placesLeft } from './leaveLibrary'

const folders: Folder[] = [
  { id: 'terror', name: 'Terror', createdAt: '2026-01-01' },
  { id: 'novela', name: 'Novela', createdAt: '2026-01-01' },
]

describe('placesLeft', () => {
  it.each([
    ['no folders', [], 'Mis libros'],
    ['one folder, by its name', ['terror'], 'Mis libros y de Terror'],
    ['several, by how many', ['terror', 'novela'], 'Mis libros y de sus 2 carpetas'],
    ['only the folders that still exist', ['terror', 'borrada'], 'Mis libros y de Terror'],
  ])('says %s', (_case, folderIds, places) => {
    expect(placesLeft(folderIds, folders)).toBe(places)
  })
})

describe('foldersLeft', () => {
  it.each([
    ['nothing with no folders', [], undefined],
    ['one folder by its name', ['terror'], 'Terror'],
    ['several by how many', ['terror', 'novela'], 'sus 2 carpetas'],
    ['only the folders that still exist', ['terror', 'borrada'], 'Terror'],
    ['nothing when none still exists', ['borrada'], undefined],
  ])('says %s', (_case, folderIds, left) => {
    expect(foldersLeft(folderIds, folders)).toBe(left)
  })
})
