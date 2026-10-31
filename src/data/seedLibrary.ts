import { daysAgo } from '../lib/dates'
import type { BookId, Folder, LibraryEntry } from '../types'

// Book ids are Open Library work keys from books.json. docs/desarrollo/tareas.md lists which ones each task uses.

/**
 * Add 1 whenever this file or the shape of library data changes, so browsers with stored data
 * from the old seed start over. Part of the persist version in src/store/index.ts.
 */
export const LIBRARY_SEED_VERSION = 2

const FOLDERS = [
  { id: 'proximos', name: 'Próximos', pinned: true, createdDaysAgo: 400 },
  { id: 'terror', name: 'Terror', createdDaysAgo: 300 },
  { id: 'novela', name: 'Novela', createdDaysAgo: 300 },
  { id: 'ciencia-ficcion', name: 'Ciencia ficción', createdDaysAgo: 250 },
  { id: 'regalos', name: 'Regalos', createdDaysAgo: 120 },
] as const

type FolderId = (typeof FOLDERS)[number]['id']

// Folder contents in one place; each entry's folderIds are derived from here.
const FOLDER_BOOKS: Record<FolderId, BookId[]> = {
  proximos: ['OL20901051W', 'OL278437W'],
  terror: [
    'OL81613W',
    'OL81631W',
    'OL81626W',
    'OL85892W',
    'OL450063W',
    'OL3171069W',
    'OL20759125W',
    'OL20901051W',
    'OL927199W',
    'OL81633W',
  ],
  novela: [
    'OL14860424W',
    'OL278437W',
    'OL712032W',
    'OL166894W',
    'OL66554W',
    'OL274505W',
    'OL1731119W',
    'OL1905255W',
    'OL274574W',
  ],
  'ciencia-ficcion': [
    'OL893414W',
    'OL46125W',
    'OL27258W',
    'OL17267881W',
    'OL64365W',
    'OL675783W',
    'OL1168083W',
    'OL103123W',
  ],
  regalos: ['OL82563W', 'OL10263W', 'OL17075811W'],
}

interface Added {
  id: BookId
  added: number
}

interface Reading extends Added {
  started: number
}

interface Read extends Reading {
  finished: number
  rating?: number
}

// Numbers are days ago, so the demo always looks recent.
const WANT: Added[] = [
  { id: 'OL81613W', added: 210 }, // It
  { id: 'OL81631W', added: 205 }, // Cementerio de animales
  { id: 'OL450063W', added: 175 }, // Frankenstein
  { id: 'OL3171069W', added: 160 }, // La maldición de Hill House
  { id: 'OL20759125W', added: 140 }, // Gótico
  { id: 'OL927199W', added: 130 }, // El exorcista
  { id: 'OL278437W', added: 15 }, // La sombra del viento
  { id: 'OL712032W', added: 110 }, // Los detectives salvajes
  { id: 'OL166894W', added: 100 }, // Crimen y castigo
  { id: 'OL66554W', added: 95 }, // Orgullo y prejuicio
  { id: 'OL46125W', added: 90 }, // Fundación
  { id: 'OL27258W', added: 85 }, // Neuromante
  { id: 'OL17267881W', added: 60 }, // El problema de los tres cuerpos
  { id: 'OL64365W', added: 55 }, // Un mundo feliz
  { id: 'OL675783W', added: 50 }, // El cuento de la criada
  { id: 'OL1892617W', added: 40 }, // Breve historia del tiempo
  { id: 'OL17930368W', added: 35 }, // Hábitos atómicos
]

const OWNED: Added[] = [
  { id: 'OL85892W', added: 180 }, // Drácula
  { id: 'OL20901051W', added: 20 }, // Nuestra parte de noche
  { id: 'OL14860424W', added: 120 }, // Rayuela
  { id: 'OL17075811W', added: 45 }, // Sapiens
  { id: 'OL1811898W', added: 25 }, // El hombre que confundió…
]

const READING: Reading[] = [
  { id: 'OL81626W', added: 190, started: 12 }, // T1: Carrie
  { id: 'OL893414W', added: 70, started: 30 }, // Dune
]

const READ: Read[] = [
  { id: 'OL274505W', added: 400, started: 380, finished: 350, rating: 5 }, // Cien años
  { id: 'OL10263W', added: 365, started: 360, finished: 358, rating: 5 }, // Principito
  { id: 'OL82563W', added: 340, started: 335, finished: 320, rating: 4 }, // Harry Potter
  { id: 'OL1168083W', added: 300, started: 290, finished: 270, rating: 5 }, // 1984
  { id: 'OL1168007W', added: 260, started: 255, finished: 250, rating: 4 }, // Rebelión en la granja
  { id: 'OL103123W', added: 240, started: 230, finished: 220, rating: 4 }, // Fahrenheit 451
  { id: 'OL1731119W', added: 200, started: 185, finished: 180, rating: 5 }, // Pedro Páramo
  { id: 'OL1905255W', added: 170, started: 150, finished: 125, rating: 4 }, // Casa de los espíritus
  { id: 'OL81633W', added: 110, started: 100, finished: 80, rating: 5 }, // El resplandor
  { id: 'OL274574W', added: 75, started: 65, finished: 62 }, // Crónica de una muerte anunciada
]

function folderIdsOf(bookId: BookId): string[] {
  return FOLDERS.filter(({ id }) => FOLDER_BOOKS[id].includes(bookId)).map(({ id }) => id)
}

function baseEntry({ id, added }: Added): LibraryEntry {
  return { bookId: id, status: 'want', folderIds: folderIdsOf(id), addedAt: daysAgo(added) }
}

function buildEntries(): LibraryEntry[] {
  return [
    ...WANT.map(baseEntry),
    ...OWNED.map((book) => ({ ...baseEntry(book), status: 'owned' as const })),
    ...READING.map((book) => ({
      ...baseEntry(book),
      status: 'reading' as const,
      startedAt: daysAgo(book.started),
    })),
    ...READ.map((book) => ({
      ...baseEntry(book),
      status: 'read' as const,
      startedAt: daysAgo(book.started),
      finishedAt: daysAgo(book.finished),
      rating: book.rating,
    })),
  ]
}

/** Built on every reset, like the rest of the seed, so dates are relative to today. */
export function buildInitialFolders(): Folder[] {
  return FOLDERS.map(({ createdDaysAgo, ...folder }) => ({
    ...folder,
    createdAt: daysAgo(createdDaysAgo),
  }))
}

/** Built on every reset, like the rest of the seed, so dates are relative to today. */
export function buildInitialLibrary(): Record<BookId, LibraryEntry> {
  return Object.fromEntries(buildEntries().map((entry) => [entry.bookId, entry]))
}
