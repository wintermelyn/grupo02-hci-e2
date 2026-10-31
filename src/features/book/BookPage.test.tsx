import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter, Routes, useNavigate } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { daysAgo, formatDate, today } from '../../lib/dates'
import { fetchWork } from '../../lib/openlibrary'
import { appRoutes } from '../../routes'
import { currentLocation, renderApp } from '../../test/router'
import { state } from '../../test/store'
import type { Book } from '../../types'

vi.mock('../../lib/openlibrary', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../lib/openlibrary')>()),
  fetchWork: vi.fn(),
}))

const CARRIE_ID = 'OL81626W'
const CARRIE = `/libro/${CARRIE_ID}` // Leyendo, en Terror
const NOCHE = '/libro/OL20901051W' // Lo tengo, en Próximos y Terror, con descripción
const HOMBRE = '/libro/OL1811898W' // Lo tengo, sin carpeta
const OUTSIDE = '/libro/OL698173W' // En el catálogo, fuera de la biblioteca
const CIEN_ANOS_ID = 'OL274505W'
const CIEN_ANOS = `/libro/${CIEN_ANOS_ID}` // Leído, 5 estrellas, en Novela

const main = () => within(screen.getByRole('main'))
const dialog = () => within(screen.getByRole('dialog'))
const toast = () => screen.getByText(/./, { selector: '[role="status"] p' })
const undoButton = () => screen.getByRole('button', { name: 'Deshacer' })
const foldersButton = () => main().getByRole('button', { name: /Cambiar carpetas/ })
const folderOption = (name: string) => main().getByRole('menuitemcheckbox', { name })

function setDate(label: string, value: string) {
  fireEvent.change(dialog().getByLabelText(label), { target: { value } })
}

beforeEach(() => {
  vi.mocked(fetchWork).mockReset().mockResolvedValue(null)
})

describe('BookPage', () => {
  it('shows the title and the data of the book', () => {
    renderApp(NOCHE)
    expect(main().getByRole('heading', { level: 1 })).toHaveTextContent('Nuestra parte de noche')
    expect(main().getByRole('heading', { level: 1 }).closest('header')).toHaveTextContent(
      'Mariana Enríquez · 2019 · 640 páginas',
    )
  })

  it('shows the description when the book has one', () => {
    renderApp(NOCHE)
    expect(main().getByRole('heading', { name: 'Sobre este libro' })).toBeInTheDocument()
    expect(main().getByText(/Un padre y un hijo atraviesan Argentina/)).toBeInTheDocument()
  })

  it('says so when the book has no description, without inventing one', () => {
    renderApp(CARRIE)
    expect(main().getByRole('heading', { name: 'Sobre este libro' })).toBeInTheDocument()
    expect(main().getByText('Aún no tenemos descripción de este libro.')).toBeInTheDocument()
  })

  it('shows every folder of the book, each one linking to it', () => {
    renderApp(NOCHE)
    const folders = main().getAllByRole('listitem')
    expect(folders.map((folder) => folder.textContent)).toEqual(['Próximos', 'Terror'])
    expect(main().getByRole('link', { name: 'Terror' })).toHaveAttribute(
      'href',
      '/biblioteca/carpeta/terror',
    )
  })

  it('says so when the book is in no folder', () => {
    renderApp(HOMBRE)
    expect(main().getByText('Este libro no está en ninguna carpeta.')).toBeInTheDocument()
  })

  it('offers to add a book outside the library, with no folders', () => {
    renderApp(OUTSIDE)
    expect(main().getByRole('button', { name: 'Agregar a Mis libros' })).toBeInTheDocument()
    expect(main().queryByRole('heading', { name: 'Carpetas' })).not.toBeInTheDocument()
  })

  it('changes the tag in place and keeps the book in its folders', () => {
    renderApp(CARRIE)
    fireEvent.click(main().getByRole('button', { name: /Cambiar estado/ }))
    fireEvent.click(main().getByRole('menuitemradio', { name: 'Lo tengo' }))
    expect(main().getByRole('button', { name: /^Lo tengo\./ })).toBeInTheDocument()
    expect(main().getByRole('link', { name: 'Terror' })).toBeInTheDocument()
    expect(state().library.OL81626W.folderIds).toContain('terror')
  })

  it('goes back to the list it was opened from, with its filter', () => {
    renderApp('/biblioteca?tag=reading')
    fireEvent.click(main().getByRole('link', { name: /Carrie/ }))
    expect(currentLocation()).toBe('/libro/OL81626W')
    fireEvent.click(main().getByRole('link', { name: 'Mis libros' }))
    expect(currentLocation()).toBe('/biblioteca?tag=reading')
  })

  it('goes to Mis libros from a shared link', () => {
    renderApp(CARRIE)
    expect(main().getByRole('link', { name: 'Mis libros' })).toHaveAttribute('href', '/biblioteca')
  })

  it('tells when the book does not exist', async () => {
    renderApp('/libro/OL0W')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Libro no encontrado' }),
    ).toBeInTheDocument()
  })

  it('names the folder on the way back, keeping its filters', () => {
    renderApp('/biblioteca/carpeta/terror?tag=reading&q=king')
    fireEvent.click(main().getByRole('link', { name: /Carrie/ }))
    fireEvent.click(main().getAllByRole('link', { name: 'Terror' })[0])
    expect(currentLocation()).toBe('/biblioteca/carpeta/terror?tag=reading&q=king')
  })

  it('names the folder with the name it has now', () => {
    renderApp('/biblioteca/carpeta/ciencia-ficcion')
    act(() => state().renameFolder('ciencia-ficcion', 'Futuros'))
    fireEvent.click(main().getByRole('link', { name: /^Dune/ }))
    expect(main().getAllByRole('link', { name: 'Futuros' })[0]).toHaveAttribute(
      'href',
      '/biblioteca/carpeta/ciencia-ficcion',
    )
  })
})

describe('T1', () => {
  it('marks Carrie as read from its folder, and undo brings everything back', () => {
    const before = state().library[CARRIE_ID]
    renderApp('/biblioteca')

    fireEvent.click(main().getByRole('link', { name: /Terror/ }))
    fireEvent.click(main().getByRole('link', { name: /^Carrie/ }))
    expect(currentLocation()).toBe(CARRIE)

    fireEvent.click(main().getByRole('button', { name: /Cambiar estado/ }))
    fireEvent.click(main().getByRole('menuitemradio', { name: 'Leído' }))
    expect(main().getByRole('button', { name: /^Leído\./ })).toBeInTheDocument()
    expect(toast()).toHaveTextContent('Estado cambiado a «Leído»')
    expect(main().getByText(formatDate(daysAgo(12)))).toBeInTheDocument()
    expect(main().getByText(formatDate(today()))).toBeInTheDocument()

    fireEvent.click(main().getAllByRole('link', { name: 'Terror' })[0])
    expect(currentLocation()).toBe('/biblioteca/carpeta/terror')
    expect(main().getByRole('link', { name: /^Carrie/ })).toHaveTextContent('Leído')
    expect(state().library[CARRIE_ID]).toMatchObject({
      status: 'read',
      folderIds: ['terror'],
      startedAt: daysAgo(12),
      finishedAt: today(),
    })

    fireEvent.click(undoButton())
    expect(state().library[CARRIE_ID]).toEqual(before)
    expect(main().getByRole('link', { name: /^Carrie/ })).toHaveTextContent('Leyendo')
    fireEvent.click(main().getByRole('link', { name: /^Carrie/ }))
    expect(main().queryByText(formatDate(today()))).not.toBeInTheDocument()
  })
})

describe('folders of a book', () => {
  it('offers every folder, with Próximos first and the ones it has marked', () => {
    renderApp(NOCHE)
    fireEvent.click(foldersButton())
    const options = main().getAllByRole('menuitemcheckbox')
    expect(options.map((option) => option.textContent)).toEqual([
      'PróximosAgregado',
      'TerrorAgregado',
      'Novela',
      'Ciencia ficción',
      'Regalos',
    ])
    expect(folderOption('Terror')).toHaveAttribute('aria-checked', 'true')
    expect(folderOption('Novela')).toHaveAttribute('aria-checked', 'false')
  })

  it('adds a folder at once, next to the ones it had', () => {
    renderApp(CARRIE)
    fireEvent.click(foldersButton())
    fireEvent.click(folderOption('Próximos'))
    expect(main().getByRole('link', { name: 'Próximos' })).toBeInTheDocument()
    expect(main().getByRole('link', { name: 'Terror' })).toBeInTheDocument()
    expect(toast()).toHaveTextContent('Agregado a «Próximos»')
    expect(state().library[CARRIE_ID].folderIds).toEqual(['terror', 'proximos'])
  })

  it('takes the same steps to remove one, and undo brings it back', () => {
    renderApp(CARRIE)
    fireEvent.click(foldersButton())
    fireEvent.click(folderOption('Terror'))
    expect(main().queryByRole('link', { name: 'Terror' })).not.toBeInTheDocument()
    expect(main().getByText('Este libro no está en ninguna carpeta.')).toBeInTheDocument()
    expect(toast()).toHaveTextContent('Quitado de «Terror»')
    fireEvent.click(undoButton())
    expect(main().getByRole('link', { name: 'Terror' })).toBeInTheDocument()
  })

  it('has the same control when the book is in no folder', () => {
    renderApp(HOMBRE)
    fireEvent.click(foldersButton())
    fireEvent.click(folderOption('Regalos'))
    expect(main().getByRole('link', { name: 'Regalos' })).toHaveAttribute(
      'href',
      '/biblioteca/carpeta/regalos',
    )
  })

  it('uses a menu next to the control, not a panel', () => {
    renderApp(CARRIE)
    fireEvent.click(foldersButton())
    expect(main().getByRole('menu', { name: 'Carpetas de «Carrie»' })).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})

describe('Quitar de mi biblioteca', () => {
  const removeButton = () => main().getByRole('button', { name: 'Quitar de mi biblioteca' })
  const noRemoveButton = () =>
    expect(
      main().queryByRole('button', { name: 'Quitar de mi biblioteca' }),
    ).not.toBeInTheDocument()

  it('removes the book at once and stays on its page, offering to add it again', () => {
    renderApp(CARRIE)
    fireEvent.click(removeButton())
    expect(currentLocation()).toBe(CARRIE)
    expect(state().library).not.toHaveProperty(CARRIE_ID)
    expect(main().getByRole('button', { name: 'Agregar a Mis libros' })).toBeInTheDocument()
    expect(main().queryByRole('heading', { name: 'Carpetas' })).not.toBeInTheDocument()
    noRemoveButton()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('keeps the focus on the page when the button leaves', () => {
    renderApp(CARRIE)
    fireEvent.click(removeButton())
    expect(main().getByRole('heading', { level: 1 })).toHaveFocus()
  })

  it('can be undone, with the tag and the folders it had', () => {
    const before = state().library[CARRIE_ID]
    renderApp(CARRIE)
    fireEvent.click(removeButton())
    expect(toast()).toHaveTextContent('Quitado de tu biblioteca')
    fireEvent.click(undoButton())
    expect(state().library[CARRIE_ID]).toEqual(before)
    expect(main().getByRole('link', { name: 'Terror' })).toBeInTheDocument()
  })

  it('is not there for a book outside the library', () => {
    renderApp(OUTSIDE)
    noRemoveButton()
  })
})

describe('dates and rating', () => {
  const entry = () => state().library[CIEN_ANOS_ID]
  const saveButton = () => dialog().getByRole('button', { name: 'Guardar' })

  function openEditor() {
    renderApp(CIEN_ANOS)
    fireEvent.click(main().getByRole('button', { name: 'Editar lectura' }))
  }

  it('shows them only with the tag Leído', () => {
    renderApp(CARRIE)
    expect(main().queryByRole('button', { name: 'Editar lectura' })).not.toBeInTheDocument()
  })

  it('shows the start, the end and the rating of a book in Leído', () => {
    renderApp(CIEN_ANOS)
    expect(main().getByText(formatDate(daysAgo(380)))).toBeInTheDocument()
    expect(main().getByText(formatDate(daysAgo(350)))).toBeInTheDocument()
    expect(main().getByRole('img', { name: '5 de 5 estrellas' })).toBeInTheDocument()
  })

  it('says so when there is no rating', () => {
    renderApp('/libro/OL274574W')
    expect(main().getByRole('img', { name: 'Sin puntaje' })).toBeInTheDocument()
  })

  it('opens with the saved values', () => {
    openEditor()
    expect(dialog().getByLabelText('Inicio')).toHaveValue(entry().startedAt)
    expect(dialog().getByLabelText('Fin')).toHaveValue(entry().finishedAt)
    expect(dialog().getByRole('radio', { name: '5 estrellas' })).toBeChecked()
    expect(saveButton()).toBeEnabled()
  })

  it('does not offer future dates in the picker', () => {
    openEditor()
    expect(dialog().getByLabelText('Inicio')).toHaveAttribute('max', today())
    expect(dialog().getByLabelText('Fin')).toHaveAttribute('max', today())
  })

  it('saves the dates and the rating, closes the panel and can be undone', () => {
    const before = entry()
    openEditor()
    setDate('Inicio', daysAgo(40))
    setDate('Fin', daysAgo(30))
    fireEvent.click(dialog().getByRole('radio', { name: '3 estrellas' }))
    fireEvent.click(saveButton())

    expect(entry()).toMatchObject({
      status: 'read',
      startedAt: daysAgo(40),
      finishedAt: daysAgo(30),
      rating: 3,
    })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(toast()).toHaveTextContent('Lectura actualizada')
    expect(main().getByText(formatDate(daysAgo(40)))).toBeInTheDocument()

    fireEvent.click(undoButton())
    expect(entry()).toEqual(before)
  })

  it('can clear the rating', () => {
    openEditor()
    fireEvent.click(dialog().getByRole('button', { name: 'Quitar puntaje' }))
    fireEvent.click(saveButton())
    expect(entry()).not.toHaveProperty('rating')
  })

  it.each([
    ['a future date', 'Fin', '2999-01-01', 'Las fechas no pueden ser futuras.'],
    ['an end before the start', 'Fin', '2000-01-01', 'El fin no puede ser anterior al inicio.'],
    ['a start after the end', 'Inicio', daysAgo(1), 'El fin no puede ser anterior al inicio.'],
    ['an empty date', 'Inicio', '', 'Completa las dos fechas.'],
  ])('holds back %s and says why', (_case, label, value, reason) => {
    const before = entry()
    openEditor()
    setDate(label, value)
    expect(saveButton()).toBeDisabled()
    expect(dialog().getByText(reason)).toBeInTheDocument()
    fireEvent.submit(dialog().getByLabelText('Inicio').closest('form') as HTMLFormElement)
    expect(entry()).toEqual(before)
  })

  it('leaves everything as it was on Cancelar', () => {
    const before = entry()
    openEditor()
    setDate('Inicio', daysAgo(40))
    fireEvent.click(dialog().getByRole('button', { name: 'Cancelar' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(entry()).toEqual(before)
  })

  it('starts over each time it opens', () => {
    openEditor()
    setDate('Inicio', daysAgo(40))
    fireEvent.click(dialog().getByRole('button', { name: 'Cancelar' }))
    fireEvent.click(main().getByRole('button', { name: 'Editar lectura' }))
    expect(dialog().getByLabelText('Inicio')).toHaveValue(entry().startedAt)
  })

  it('has one primary action, the one that saves', () => {
    openEditor()
    const buttons = dialog().getAllByRole('button')
    expect(buttons.filter((button) => button.className.includes('bg-ink'))).toEqual([saveButton()])
  })
})

describe('loading a book the store does not have', () => {
  const REMOTE: Book = { id: 'OL999W', title: 'Un libro remoto', authors: ['Una Autora'] }

  function deferred<T>() {
    let resolve: (value: T) => void = () => {}
    const promise = new Promise<T>((done) => {
      resolve = done
    })
    return { promise, resolve }
  }

  function GoTo({ to }: { to: string }) {
    const navigate = useNavigate()
    return <button onClick={() => navigate(to)}>Ir</button>
  }

  /** Opens book A, moves on to book B and hands back the answers still pending for each. */
  async function moveOnWhileLoading() {
    const answers: Record<string, ReturnType<typeof deferred<Book | null>>> = {
      OLAW: deferred(),
      OLBW: deferred(),
    }
    vi.mocked(fetchWork).mockImplementation((id) => answers[id].promise)
    render(
      <MemoryRouter initialEntries={['/libro/OLAW']}>
        <GoTo to="/libro/OLBW" />
        <Routes>{appRoutes}</Routes>
      </MemoryRouter>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Ir' }))
    await waitFor(() => expect(fetchWork).toHaveBeenCalledWith('OLBW'))
    return answers
  }

  it('shows the loading state, then the book, and keeps it in the store', async () => {
    const work = deferred<Book | null>()
    vi.mocked(fetchWork).mockReturnValue(work.promise)
    renderApp('/libro/OL999W')
    expect(fetchWork).toHaveBeenCalledWith('OL999W')
    expect(main().getByRole('heading', { level: 1 })).toHaveTextContent('Cargando libro…')
    expect(main().getByText('Cargando libro…', { selector: '.sr-only' })).toBeInTheDocument()

    await act(async () => work.resolve(REMOTE))
    expect(main().getByRole('heading', { level: 1 })).toHaveTextContent('Un libro remoto')
    expect(state().extraBooks.OL999W).toEqual(REMOTE)
  })

  it('does not look for a book the store has', () => {
    renderApp(CARRIE)
    expect(fetchWork).not.toHaveBeenCalled()
  })

  it('ends in Libro no encontrado when Open Library does not have it', async () => {
    renderApp('/libro/OL999W')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Libro no encontrado' }),
    ).toBeInTheDocument()
    expect(state().extraBooks).toEqual({})
  })

  it('does not take a different book for the one it asked for', async () => {
    vi.mocked(fetchWork).mockResolvedValue({ ...REMOTE, id: 'OL1W' })
    renderApp('/libro/OL999W')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Libro no encontrado' }),
    ).toBeInTheDocument()
    expect(state().extraBooks).toEqual({})
  })

  it('offers to try again when the request fails', async () => {
    vi.mocked(fetchWork).mockRejectedValueOnce(new Error('sin red')).mockResolvedValue(REMOTE)
    renderApp('/libro/OL999W')
    fireEvent.click(await screen.findByRole('button', { name: 'Reintentar' }))
    expect(main().getByRole('heading', { level: 1 })).toHaveTextContent('Cargando libro…')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Un libro remoto' }),
    ).toBeInTheDocument()
  })

  it('ignores a late answer after moving on to another book', async () => {
    const answers = await moveOnWhileLoading()
    await act(async () => answers.OLBW.resolve({ ...REMOTE, id: 'OLBW', title: 'El libro B' }))
    await act(async () => answers.OLAW.resolve({ ...REMOTE, id: 'OLAW', title: 'El libro A' }))
    expect(main().getByRole('heading', { level: 1 })).toHaveTextContent('El libro B')
    expect(state().extraBooks).not.toHaveProperty('OLAW')
  })

  it('does not end in "not found" because of a late answer for the previous book', async () => {
    const answers = await moveOnWhileLoading()
    await act(async () => answers.OLAW.resolve(null))
    expect(main().getByRole('heading', { level: 1 })).toHaveTextContent('Cargando libro…')
  })
})
