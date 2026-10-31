import { describe, expect, it } from 'vitest'
import { daysAgo, today } from '../lib/dates'
import { state, stubAction } from '../test/store'

const CARRIE = 'OL81626W' // Leyendo, en Terror
const NOCHE = 'OL20901051W' // Lo tengo, en Próximos y Terror
const HOMBRE = 'OL1811898W' // Lo tengo, sin carpeta
const CIEN_ANOS = 'OL274505W' // Leído, 5 estrellas, en Novela
const OUTSIDE = 'OL698173W' // En el catálogo, fuera de la biblioteca

describe('finishBook', () => {
  const details = { startedAt: daysAgo(12), finishedAt: today() }

  it('sets the book to Leído, keeping its folders and everything else', () => {
    const before = state().library[CARRIE]
    state().finishBook(CARRIE, details)
    expect(state().library[CARRIE]).toEqual({ ...before, status: 'read', ...details })
    expect(state().toast?.message).toBe('Estado cambiado a «Leído»')
  })

  it('creates the entry for a book outside the library', () => {
    state().finishBook(OUTSIDE, { ...details, rating: 4 })
    expect(state().library[OUTSIDE]).toEqual({
      bookId: OUTSIDE,
      status: 'read',
      folderIds: [],
      addedAt: today(),
      rating: 4,
      ...details,
    })
    expect(state().toast?.message).toBe('Agregado a Mis libros como «Leído»')
  })

  it('ignores ids that getBook does not know', () => {
    const commit = stubAction('commit')
    state().finishBook('OL0W', details)
    expect(commit).not.toHaveBeenCalled()
    expect(state().library).not.toHaveProperty('OL0W')
  })

  it('saves Editar lectura on a book already in Leído', () => {
    const changes = { startedAt: daysAgo(40), finishedAt: daysAgo(30), rating: 3 }
    state().finishBook(CIEN_ANOS, changes)
    expect(state().library[CIEN_ANOS]).toMatchObject({ status: 'read', ...changes })
    expect(state().toast?.message).toBe('Lectura actualizada')
  })

  it('clears the rating when it comes undefined', () => {
    state().finishBook(CIEN_ANOS, details)
    expect(state().library[CIEN_ANOS]).not.toHaveProperty('rating')
  })

  it('can be undone', () => {
    const before = state().library[CARRIE]
    state().finishBook(CARRIE, details)
    state().undo()
    expect(state().library[CARRIE]).toEqual(before)
  })
})

describe('removeFromLibrary', () => {
  it('takes the books out of the library, and undo brings them back', () => {
    const before = state().library[CARRIE]
    state().removeFromLibrary([CARRIE, HOMBRE])
    expect(state().library).not.toHaveProperty(CARRIE)
    expect(state().library).not.toHaveProperty(HOMBRE)
    expect(state().toast?.message).toBe('Quitado de tu biblioteca')
    expect(state().toast?.undoable).toBe(true)
    state().undo()
    expect(state().library[CARRIE]).toEqual(before)
  })

  it('changes nothing when no book is in the library', () => {
    const commit = stubAction('commit')
    state().removeFromLibrary([OUTSIDE, 'constructor'])
    expect(commit).not.toHaveBeenCalled()
  })
})

describe('createFolder', () => {
  it('adds a folder and returns its id', () => {
    const id = state().createFolder('  Para el verano ')
    expect(state().folders.at(-1)).toEqual({ id, name: 'Para el verano', createdAt: today() })
    expect(state().toast?.message).toBe('Carpeta «Para el verano» creada')
    expect(id).toBe('para-el-verano')
  })

  it('never repeats an id, even with the same name or one with no letters', () => {
    const ids = ['Terror', 'Terror', 'térror', '¡¡¡', '???'].map(state().createFolder)
    const all = state().folders.map(({ id }) => id)
    expect(new Set(all).size).toBe(all.length)
    expect(ids).toEqual(['terror-2', 'terror-3', 'terror-4', 'carpeta', 'carpeta-2'])
  })

  it('can be undone', () => {
    const id = state().createFolder('Nueva')
    state().undo()
    expect(state().folders.map((folder) => folder.id)).not.toContain(id)
  })
})

describe('renameFolder', () => {
  it('changes the name, and only the name', () => {
    const before = state().folders.find(({ id }) => id === 'terror')
    state().renameFolder('terror', ' Miedo ')
    expect(state().folders.find(({ id }) => id === 'terror')).toEqual({ ...before, name: 'Miedo' })
    expect(state().toast?.message).toBe('Carpeta renombrada a «Miedo»')
  })

  it.each([
    ['an unknown folder', 'nada', 'Otra'],
    ['the pinned folder', 'proximos', 'Otra'],
    ['a blank name', 'terror', '   '],
    ['the same name', 'terror', 'Terror'],
  ])('changes nothing with %s', (_case, id, name) => {
    const commit = stubAction('commit')
    state().renameFolder(id, name)
    expect(commit).not.toHaveBeenCalled()
  })
})

describe('deleteFolder', () => {
  it('removes the folder from the list and from every book, which stay in the library', () => {
    const books = Object.keys(state().library).length
    state().deleteFolder('terror')
    expect(state().folders.map(({ id }) => id)).not.toContain('terror')
    for (const { folderIds } of Object.values(state().library)) {
      expect(folderIds).not.toContain('terror')
    }
    expect(state().library[NOCHE].folderIds).toEqual(['proximos'])
    expect(Object.keys(state().library)).toHaveLength(books)
    expect(state().toast?.message).toBe('Carpeta «Terror» eliminada')
  })

  it('can be undone, with its books', () => {
    state().deleteFolder('terror')
    state().undo()
    expect(state().folders.map(({ id }) => id)).toContain('terror')
    expect(state().library[CARRIE].folderIds).toEqual(['terror'])
  })

  it('ignores a pinned or unknown folder', () => {
    const commit = stubAction('commit')
    state().deleteFolder('proximos')
    state().deleteFolder('nada')
    expect(commit).not.toHaveBeenCalled()
  })
})

describe('addToFolder', () => {
  it('adds the books and keeps their other folders', () => {
    state().addToFolder([CARRIE, HOMBRE], 'proximos')
    expect(state().library[CARRIE].folderIds).toEqual(['terror', 'proximos'])
    expect(state().library[HOMBRE].folderIds).toEqual(['proximos'])
    expect(state().toast?.message).toBe('Agregado a «Próximos»')
  })

  it('does not repeat a folder, and skips what is already there', () => {
    state().addToFolder([CARRIE, CARRIE, NOCHE], 'terror')
    expect(state().library[CARRIE].folderIds).toEqual(['terror'])
    state().addToFolder([CARRIE, CARRIE, NOCHE], 'proximos')
    expect(state().library[CARRIE].folderIds).toEqual(['terror', 'proximos'])
    expect(state().library[NOCHE].folderIds).toEqual(['proximos', 'terror'])
  })

  it('skips books outside the library', () => {
    state().addToFolder([OUTSIDE, CARRIE], 'proximos')
    expect(state().library).not.toHaveProperty(OUTSIDE)
    expect(state().library[CARRIE].folderIds).toContain('proximos')
  })

  it.each([
    ['the book is already there', [CARRIE], 'terror'],
    ['the book is outside the library', [OUTSIDE], 'terror'],
    ['the list is empty', [], 'terror'],
    ['the folder does not exist', [CARRIE], 'nada'],
  ])('makes no commit when %s', (_case, bookIds, folderId) => {
    const commit = stubAction('commit')
    state().addToFolder(bookIds, folderId)
    expect(commit).not.toHaveBeenCalled()
  })
})

describe('removeFromFolder', () => {
  it('takes the books out of that folder only', () => {
    state().removeFromFolder([NOCHE], 'terror')
    expect(state().library[NOCHE].folderIds).toEqual(['proximos'])
    expect(state().toast?.message).toBe('Quitado de «Terror»')
  })

  it('can be undone', () => {
    state().removeFromFolder([NOCHE], 'terror')
    state().undo()
    expect(state().library[NOCHE].folderIds).toEqual(['proximos', 'terror'])
  })

  it.each([
    ['the book is not there', [CARRIE], 'proximos'],
    ['the book is outside the library', [OUTSIDE], 'terror'],
    ['the list is empty', [], 'terror'],
    ['the folder does not exist', [CARRIE], 'nada'],
  ])('makes no commit when %s', (_case, bookIds, folderId) => {
    const commit = stubAction('commit')
    state().removeFromFolder(bookIds, folderId)
    expect(commit).not.toHaveBeenCalled()
  })
})

describe('every change', () => {
  it('goes through commit, so it keeps an undo copy and shows the toast', () => {
    const changes = [
      () => state().finishBook(CARRIE, { startedAt: today(), finishedAt: today() }),
      () => state().removeFromLibrary([CARRIE]),
      () => state().createFolder('Otra'),
      () => state().renameFolder('terror', 'Otra'),
      () => state().deleteFolder('regalos'),
      () => state().addToFolder([NOCHE], 'novela'),
      () => state().removeFromFolder([NOCHE], 'novela'),
    ]
    for (const change of changes) {
      state().dismissToast()
      change()
      expect(state().toast?.undoable).toBe(true)
      expect(state().undoSnapshot).not.toBeNull()
    }
  })
})

describe('setStartDate', () => {
  const CARRIE = 'OL81626W' // Leyendo
  const IT = 'OL81613W' // Lo quiero

  it('corrects the start of a book in Leyendo, with Deshacer', () => {
    const before = state().library[CARRIE]
    state().setStartDate(CARRIE, daysAgo(40))
    expect(state().library[CARRIE]).toEqual({ ...before, startedAt: daysAgo(40) })
    expect(state().toast).toMatchObject({ message: 'Lectura actualizada', undoable: true })
    state().undo()
    expect(state().library[CARRIE]).toBe(before)
  })

  it('does nothing with the same date or a book that is not in Leyendo', () => {
    const { startedAt = '' } = state().library[CARRIE]
    state().setStartDate(CARRIE, startedAt)
    state().setStartDate(IT, daysAgo(40))
    expect(state().toast).toBeNull()
    expect(state().library[IT].startedAt).toBeUndefined()
  })
})

describe('answerWantPrompt', () => {
  const IT = 'OL81613W' // Lo quiero hace 210 días, en Terror

  it('keeps the book with Sí and remembers that it asked', () => {
    state().answerWantPrompt(IT, true)
    expect(state().library[IT].wantCheckedAt).toBe(today())
    expect(state().library[IT].status).toBe('want')
    expect(state().lastWantPromptOn).toBe(today())
    expect(state().toast?.message).toBe('Sigue en tu lista')
  })

  it('takes the book out of the library and its folders with No', () => {
    state().answerWantPrompt(IT, false)
    expect(state().library).not.toHaveProperty(IT)
    expect(state().lastWantPromptOn).toBe(today())
    expect(state().toast).toMatchObject({ message: 'Quitado de tu lista', undoable: true })
  })

  it('brings the book back with Deshacer, and the prompt stays answered', () => {
    const before = state().library[IT]
    state().answerWantPrompt(IT, false)
    state().undo()
    expect(state().library[IT]).toEqual(before)
    expect(state().lastWantPromptOn).toBe(today())
  })

  it.each([
    ['out of the library', 'OL698173W'],
    ['with another tag', CARRIE],
  ])('ignores a book %s', (_name, bookId) => {
    const commit = stubAction('commit')
    state().answerWantPrompt(bookId, false)
    expect(commit).not.toHaveBeenCalled()
    expect(state().lastWantPromptOn).toBeUndefined()
  })
})
