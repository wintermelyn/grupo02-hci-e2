import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Routes, useNavigate } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { daysAgo, today } from '../../lib/dates'
import { appRoutes } from '../../routes'
import { stubCatalog } from '../../test/catalog'
import { currentLocation, renderApp } from '../../test/router'
import { state } from '../../test/store'
import type { Book } from '../../types'

const CARRIE_ID = 'OL81626W'
const CARRIE = `/libro/${CARRIE_ID}` // Leyendo, en Terror
const IT = '/libro/OL81613W' // Lo quiero, en Terror
const NOCHE = '/libro/OL20901051W' // Lo tengo, en Próximos y Terror, con descripción
const HOMBRE = '/libro/OL1811898W' // Lo tengo, sin carpeta
const OUTSIDE = '/libro/OL698173W' // En el catálogo, fuera de la biblioteca
const CIEN_ANOS_ID = 'OL274505W'
const CIEN_ANOS = `/libro/${CIEN_ANOS_ID}` // Leído, 5 estrellas, en Novela
const CRONICA = '/libro/OL274574W' // Leído, sin descripción

const NO_DESCRIPTION = 'Aún no tenemos descripción de este libro.'
const TRANSLATED = 'Traducción hecha con IA'
const LONG_DESCRIPTION = `${'Una frase larga sobre el libro. '.repeat(120)}Última frase.`
const SIMULATED: Book = { id: 'OL1000W', title: 'Libro simulado', authors: ['Autora'] }
const TRANSLATED_TEXT = 'Una descripción traducida.'

const main = () => within(screen.getByRole('main'))
const toast = () => screen.getByText(/./, { selector: '[role="status"] p' })
const undoButton = () => screen.getByRole('button', { name: 'Deshacer' })
const foldersButton = () => main().getByRole('button', { name: /^Agregar (o quitar|a carpeta):/ })
const folderOption = (name: string) => main().getByRole('menuitemcheckbox', { name })

const dateField = (label: string) => main().getByLabelText(label)

function deferred<T>() {
  let resolve: (value: T) => void = () => {}
  const promise = new Promise<T>((done) => {
    resolve = done
  })
  return { promise, resolve }
}

/** The way the calendar does it: a whole date, with no keys pressed. */
function pickDate(label: string, value: string) {
  fireEvent.change(dateField(label), { target: { value } })
}

/** The way a keyboard does it: partial dates first, and the date counts on leaving the field. */
function typeDate(label: string, value: string) {
  fireEvent.keyDown(dateField(label), { key: '2' })
  fireEvent.change(dateField(label), { target: { value } })
  fireEvent.blur(dateField(label))
}

/** A book the person already added: its copy comes with no text, which is in the files. */
async function openSimulated({
  description,
  descriptionTranslated,
}: Pick<Book, 'description' | 'descriptionTranslated'>) {
  stubCatalog({
    texts: description ? { [SIMULATED.id]: { description, descriptionTranslated } } : {},
  })
  state().upsertBook(SIMULATED)
  renderApp(`/libro/${SIMULATED.id}`)
  await main().findByText(description ?? NO_DESCRIPTION)
}

/** The classes that make the layout, from the grid down to what sits in each of its places. */
function pageShape() {
  const about = main().getByRole('heading', { name: 'Sobre este libro' }).closest('section')
  const header = main().getByRole('heading', { level: 1 }).closest('header')
  const grid = header?.parentElement
  return [grid, ...(grid ? [...grid.children] : []), about].map((node) =>
    node instanceof HTMLElement ? node.className : undefined,
  )
}

function chooseTag(name: string) {
  fireEvent.click(main().getByRole('button', { name: /Cambiar o quitar/ }))
  fireEvent.click(main().getByRole('menuitemradio', { name }))
}

function removeBook() {
  fireEvent.click(main().getByRole('button', { name: /Cambiar o quitar/ }))
  fireEvent.click(main().getByRole('menuitem', { name: /^Quitar de Mis libros/ }))
}

describe('BookPage', () => {
  it('shows the title and the data of the book', () => {
    renderApp(NOCHE)
    expect(main().getByRole('heading', { level: 1 })).toHaveTextContent('Nuestra parte de noche')
    expect(main().getByRole('heading', { level: 1 }).closest('header')).toHaveTextContent(
      'Mariana Enríquez2019 · 640 páginas',
    )
  })

  it('shows the description when the book has one', () => {
    renderApp(NOCHE)
    expect(main().getByRole('heading', { name: 'Sobre este libro' })).toBeInTheDocument()
    expect(main().getByText(/Un padre y un hijo atraviesan Argentina/)).toBeInTheDocument()
  })

  it('says so in the same place when the book has no description', () => {
    renderApp(CRONICA)
    const about = main().getByRole('heading', { name: 'Sobre este libro' }).closest('section')
    expect(about).toHaveTextContent(`Sobre este libro${NO_DESCRIPTION}`)
  })

  it('keeps the same shape with and without a description', () => {
    renderApp(NOCHE)
    const withDescription = pageShape()
    cleanup()
    renderApp(CRONICA)
    expect(pageShape()).toEqual(withDescription)
  })

  it('shows the cover on its own, with no block of colour behind it', () => {
    renderApp(CARRIE)
    const reading = main().getByRole('heading', { level: 1 }).closest('header')?.parentElement
    const cover = reading?.previousElementSibling as HTMLElement
    expect(document.querySelector('.tone-scene')).toBeNull()
    expect(cover).toHaveClass('pb-3', 'md:pb-5', 'md:sticky')
    expect(cover.className).not.toMatch(/\b(bg-|rounded-)/)
  })

  it('puts the title beside the cover on a phone, with what follows in both columns', () => {
    renderApp(CARRIE)
    const title = main().getByRole('heading', { level: 1 })
    const header = title.closest('header') as HTMLElement
    const reading = header.parentElement as HTMLElement
    expect(title).toHaveClass('text-heading', 'tracking-tight', 'md:page-title')
    expect(header).toHaveClass('min-w-0')
    expect(reading).toHaveClass('contents', 'md:block')
    expect(reading.parentElement).toHaveClass('grid', 'grid-cols-[7rem_minmax(0,1fr)]')
    expect(document.querySelector('article dl')).toHaveClass('col-span-2', 'mt-2', 'md:mt-5')
    expect(
      main().getByRole('heading', { name: 'Sobre este libro' }).closest('section'),
    ).toHaveClass('col-span-2')
  })

  it('breaks a long word of the title or the author instead of leaving its column', () => {
    renderApp(CARRIE)
    const title = main().getByRole('heading', { level: 1 })
    expect(title).toHaveClass('wrap-break-word')
    expect(title).not.toHaveClass('hyphens-auto')
    expect(main().getByText('Stephen King').parentElement).toHaveClass('wrap-break-word')
  })

  it('does not say that a description is missing when there is one', () => {
    renderApp(NOCHE)
    expect(main().queryByText(NO_DESCRIPTION)).not.toBeInTheDocument()
  })

  it('shows a long description whole, with the mark after it', async () => {
    await openSimulated({ description: LONG_DESCRIPTION, descriptionTranslated: true })
    const description = main().getByText(/Última frase\.$/)
    expect(description.textContent).toBe(LONG_DESCRIPTION)
    expect(description).toHaveClass('wrap-break-word')
    expect(description.compareDocumentPosition(main().getByText(TRANSLATED))).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    )
  })

  describe('book of the catalog', () => {
    const CATALOG_BOOK: Book = {
      id: 'OL81634W',
      title: 'Misery',
      authors: ['Stephen King'],
      year: 1978,
      coverUrl: '/covers/OL81634W.jpg',
    }
    const TEXT = 'Una enfermera y un escritor.'
    const texts = { [CATALOG_BOOK.id]: { description: TEXT } }

    function holdFiles() {
      const file = deferred<Response>()
      const fetchFile = vi.fn(() => file.promise)
      vi.stubGlobal('fetch', fetchFile)
      return { fetchFile, deliver: (body: unknown) => file.resolve(Response.json(body)) }
    }

    function open() {
      state().upsertBook(CATALOG_BOOK)
      renderApp(`/libro/${CATALOG_BOOK.id}`)
    }

    it('brings its description from the files and keeps nothing of it in the store', async () => {
      stubCatalog({ texts })
      open()
      expect(await main().findByText(TEXT)).toBeInTheDocument()
      expect(state().extraBooks[CATALOG_BOOK.id]).toEqual(CATALOG_BOOK)
    })

    it('does not say it has no description while it is coming', async () => {
      const { deliver } = holdFiles()
      open()
      expect(main().getByText('Buscando la descripción…')).toBeInTheDocument()
      expect(main().queryByText(NO_DESCRIPTION)).not.toBeInTheDocument()

      await act(async () => deliver({}))
      expect(main().getByText(NO_DESCRIPTION)).toBeInTheDocument()
    })

    it('keeps the same shape while the description comes', async () => {
      const { deliver } = holdFiles()
      open()
      const loading = pageShape()
      await act(async () => deliver(texts))
      expect(main().getByText(TEXT)).toBeInTheDocument()
      expect(pageShape()).toEqual(loading)
    })

    it('offers to try again in the same place when the file fails, and it works', async () => {
      const files = stubCatalog({ texts, failing: [/descriptions/] })
      open()
      const retry = await main().findByRole('button', { name: 'Reintentar' })
      expect(retry.closest('section')).toBe(
        main().getByRole('heading', { name: 'Sobre este libro' }).closest('section'),
      )
      expect(main().queryByText(NO_DESCRIPTION)).not.toBeInTheDocument()

      stubCatalog({ texts })
      fireEvent.click(retry)
      expect(await main().findByText(TEXT)).toBeInTheDocument()
      expect(main().queryByRole('button', { name: 'Reintentar' })).not.toBeInTheDocument()
      expect(files).toHaveBeenCalledOnce()
    })

    it('has the text at once on a second visit, from what was downloaded', async () => {
      const files = stubCatalog({ texts })
      open()
      await main().findByText(TEXT)
      cleanup()
      renderApp(`/libro/${CATALOG_BOOK.id}`)
      expect(main().getByText(TEXT)).toBeInTheDocument()
      expect(files).toHaveBeenCalledOnce()
    })

    it('downloads nothing for the 54 books of the app, with or without a description', () => {
      const files = stubCatalog()
      renderApp(CRONICA)
      expect(main().getByText(NO_DESCRIPTION)).toBeInTheDocument()
      expect(files).not.toHaveBeenCalled()
    })

    it('says nothing about a translation of the books that came in Spanish', async () => {
      stubCatalog({ texts })
      open()
      await main().findByText(TEXT)
      expect(main().queryByText(TRANSLATED)).not.toBeInTheDocument()
    })
  })

  describe('machine-translated description', () => {
    const translated = { description: TRANSLATED_TEXT, descriptionTranslated: true }

    it('says where the text comes from, under the description', async () => {
      await openSimulated(translated)
      const description = main().getByText(TRANSLATED_TEXT)
      expect(description.nextElementSibling).toHaveTextContent(TRANSLATED)
    })

    // statusStyles.test.ts holds `muted` to 4.5:1 on the paper of this page.
    it('reads as a fact about the text, not as a warning', async () => {
      await openSimulated(translated)
      const mark = main().getByText(TRANSLATED)
      expect(mark).toHaveClass('text-sm', 'text-muted')
      expect(mark.querySelector('svg.lucide-sparkle')).toBeInTheDocument()
      expect(mark.closest('section')?.querySelector('.ribbon')).not.toBeInTheDocument()
    })

    it('stays out of a description that was not translated', async () => {
      await openSimulated({ description: TRANSLATED_TEXT })
      expect(main().queryByText(TRANSLATED)).not.toBeInTheDocument()
    })

    it('has nothing to say about a description that is not there', async () => {
      await openSimulated({})
      expect(main().queryByText(TRANSLATED)).not.toBeInTheDocument()
    })
  })

  it('keeps the label on the first line of a value that wraps', () => {
    renderApp(NOCHE)
    expect(main().getByText('Carpetas')).toHaveClass('self-start')
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

  it('says Agregar with no folders, and what it adds to for a screen reader', () => {
    renderApp(HOMBRE)
    expect(foldersButton().textContent).toBe('Agregar')
    expect(foldersButton()).toHaveAccessibleName(/^Agregar a carpeta:/)
    expect(main().getByText('Sin carpetas')).toBeInTheDocument()
  })

  it('leaves the plus out of Agregar o quitar, since the button also takes out', () => {
    renderApp(CARRIE)
    expect(foldersButton().textContent).toBe('Agregar o quitar')
    expect(foldersButton().querySelector('svg')).toBeNull()
  })

  it('keeps the button on its line when the folders do not fit next to it', () => {
    renderApp(NOCHE)
    expect(foldersButton().closest('.shrink-0')).not.toBeNull()
    expect(main().getAllByRole('listitem')[0].closest('ul')).toHaveClass('flex-wrap', 'min-w-0')
  })

  it('keeps Agregar a Mis libros inside the margins of the record', () => {
    renderApp(OUTSIDE)
    const add = main().getByRole('button', { name: 'Agregar a Mis libros' })
    expect(add.closest('[class*="-mx-"]')).toBeNull()
  })

  it('lets the pill take its width on a wide record, and the row once the book is in', () => {
    renderApp(OUTSIDE)
    const add = main().getByRole('button', { name: 'Agregar a Mis libros' })
    expect(add.parentElement).toHaveClass('md:w-fit')
    fireEvent.click(add)
    fireEvent.click(main().getByRole('menuitemradio', { name: 'Lo quiero' }))
    const change = main().getByRole('button', { name: /Cambiar o quitar/ })
    expect(change.parentElement).not.toHaveClass('md:w-fit')
  })

  it('tells the two controls apart: only the tag says Cambiar', () => {
    renderApp(CARRIE)
    expect(foldersButton()).toHaveTextContent('Agregar o quitar')
    expect(main().getAllByRole('button', { name: /Cambiar/ })).toHaveLength(1)
  })

  it('offers to add a book outside the library, with no folders', () => {
    renderApp(OUTSIDE)
    expect(main().getByRole('button', { name: 'Agregar a Mis libros' })).toBeInTheDocument()
    expect(main().queryByText('Carpetas')).not.toBeInTheDocument()
  })

  it('changes the tag in place and keeps the book in its folders', () => {
    renderApp(CARRIE)
    fireEvent.click(main().getByRole('button', { name: /Cambiar o quitar/ }))
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
    stubCatalog()
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

    fireEvent.click(main().getByRole('button', { name: /Cambiar o quitar/ }))
    fireEvent.click(main().getByRole('menuitemradio', { name: 'Leído' }))
    expect(main().getByRole('button', { name: /^Leído\./ })).toBeInTheDocument()
    expect(toast()).toHaveTextContent('Estado cambiado a «Leído»')
    expect(dateField('Inicio')).toHaveValue(daysAgo(12))
    expect(dateField('Fin')).toHaveValue(today())

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
    expect(main().queryByLabelText('Fin')).not.toBeInTheDocument()
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

  it('opens on the first folder, so a second Enter adds instead of taking one out', () => {
    renderApp(CARRIE)
    fireEvent.click(foldersButton())
    expect(folderOption('Próximos')).toHaveFocus()
    expect(folderOption('Terror')).toBeChecked()
  })

  it('takes the same steps to remove one, and undo brings it back', () => {
    renderApp(CARRIE)
    fireEvent.click(foldersButton())
    fireEvent.click(folderOption('Terror'))
    expect(main().queryByRole('link', { name: 'Terror' })).not.toBeInTheDocument()
    expect(foldersButton().textContent).toBe('Agregar')
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

describe('Quitar de Mis libros', () => {
  const removeOption = () => main().queryByRole('menuitem', { name: /^Quitar de Mis libros/ })

  it('takes the two taps that adding takes, in the menu of the tag', () => {
    renderApp(CARRIE)
    expect(main().queryByRole('button', { name: /Quitar de Mis libros/ })).toBeNull()
    removeBook()
    expect(currentLocation()).toBe(CARRIE)
    expect(state().library).not.toHaveProperty(CARRIE_ID)
    expect(main().getByRole('button', { name: 'Agregar a Mis libros' })).toBeInTheDocument()
    expect(main().queryByText('Carpetas')).not.toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it.each([
    ['one folder, by its name', IT, 'También sale de Terror'],
    ['several folders, by how many', NOCHE, 'También sale de sus 2 carpetas'],
    ['a folder and dates, in one line', CARRIE, 'También sale de Terror y pierdes las fechas'],
    ['also a rating', CIEN_ANOS, 'También sale de Novela y pierdes las fechas y el puntaje'],
  ])('says what will be lost before choosing: %s', (_case, path, lost) => {
    renderApp(path)
    fireEvent.click(main().getByRole('button', { name: /Cambiar o quitar/ }))
    expect(removeOption()?.textContent).toBe(`Quitar de Mis libros${lost}`)
  })

  it('says only what is lost when the book has no folder to leave', () => {
    act(() => state().removeFromFolder([CIEN_ANOS_ID], 'novela'))
    renderApp(CIEN_ANOS)
    fireEvent.click(main().getByRole('button', { name: /Cambiar o quitar/ }))
    expect(removeOption()?.textContent).toBe('Quitar de Mis librosPierdes las fechas y el puntaje')
  })

  it('has no line under Quitar when nothing goes with the book', () => {
    renderApp(HOMBRE)
    fireEvent.click(main().getByRole('button', { name: /Cambiar o quitar/ }))
    expect(removeOption()?.textContent).toBe('Quitar de Mis libros')
  })

  it('leaves the focus on the same control, which now adds the book', () => {
    renderApp(CARRIE)
    removeBook()
    expect(main().getByRole('button', { name: 'Agregar a Mis libros' })).toHaveFocus()
  })

  it('can be undone, with the tag and the folders it had', () => {
    const before = state().library[CARRIE_ID]
    renderApp(CARRIE)
    removeBook()
    expect(toast()).toHaveTextContent('«Carrie» salió de Mis libros y de Terror')
    fireEvent.click(undoButton())
    expect(state().library[CARRIE_ID]).toEqual(before)
    expect(main().getByRole('link', { name: 'Terror' })).toBeInTheDocument()
  })

  it('is not there for a book outside the library', () => {
    renderApp(OUTSIDE)
    fireEvent.click(main().getByRole('button', { name: 'Agregar a Mis libros' }))
    expect(removeOption()).not.toBeInTheDocument()
  })
})

describe('dates and rating', () => {
  const entry = () => state().library[CIEN_ANOS_ID]

  it('shows only the start of a book in Leyendo, and nothing for the other tags', () => {
    renderApp(CARRIE)
    expect(dateField('Inicio')).toHaveValue(daysAgo(12))
    expect(main().queryByLabelText('Fin')).not.toBeInTheDocument()
    expect(main().queryByRole('group', { name: 'Puntaje' })).not.toBeInTheDocument()
    chooseTag('Lo tengo')
    expect(main().queryByLabelText('Inicio')).not.toBeInTheDocument()
  })

  it('corrects the start of a book in Leyendo without finishing it', () => {
    renderApp(CARRIE)
    pickDate('Inicio', daysAgo(20))
    expect(state().library[CARRIE_ID]).toMatchObject({
      status: 'reading',
      startedAt: daysAgo(20),
    })
    expect(toast()).toHaveTextContent('Lectura actualizada')
  })

  it('shows the start, the end and the rating of a book in Leído, ready to change', () => {
    renderApp(CIEN_ANOS)
    expect(dateField('Inicio')).toHaveValue(daysAgo(380))
    expect(dateField('Fin')).toHaveValue(daysAgo(350))
    expect(main().getByRole('radio', { name: '5 estrellas' })).toBeChecked()
  })

  it('does not offer future dates, or an end before the start', () => {
    renderApp(CIEN_ANOS)
    expect(dateField('Inicio')).toHaveAttribute('max', today())
    expect(dateField('Fin')).toHaveAttribute('max', today())
    expect(dateField('Fin')).toHaveAttribute('min', entry().startedAt)
  })

  it('saves a date from the calendar at once, in place, and can be undone', () => {
    const before = entry()
    renderApp(CIEN_ANOS)
    pickDate('Fin', daysAgo(340))
    expect(entry()).toMatchObject({ status: 'read', finishedAt: daysAgo(340), rating: 5 })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(toast()).toHaveTextContent('Lectura actualizada')
    fireEvent.click(undoButton())
    expect(entry()).toEqual(before)
    expect(dateField('Fin')).toHaveValue(before.finishedAt)
  })

  it('waits for a typed date until the field is left', () => {
    const before = entry()
    renderApp(CIEN_ANOS)
    fireEvent.keyDown(dateField('Fin'), { key: '2' })
    fireEvent.change(dateField('Fin'), { target: { value: daysAgo(340) } })
    expect(entry()).toEqual(before)
    fireEvent.blur(dateField('Fin'))
    expect(entry().finishedAt).toBe(daysAgo(340))
  })

  it('saves a typed date with Enter', () => {
    renderApp(CIEN_ANOS)
    fireEvent.keyDown(dateField('Fin'), { key: '2' })
    fireEvent.change(dateField('Fin'), { target: { value: daysAgo(340) } })
    fireEvent.keyDown(dateField('Fin'), { key: 'Enter' })
    expect(entry().finishedAt).toBe(daysAgo(340))
  })

  it('moves the end along when the start passes it', () => {
    renderApp(CIEN_ANOS)
    pickDate('Inicio', daysAgo(10))
    expect(entry()).toMatchObject({ startedAt: daysAgo(10), finishedAt: daysAgo(10) })
  })

  it('rates at once, in place, and can be undone', () => {
    const before = entry()
    renderApp(CIEN_ANOS)
    fireEvent.click(main().getByRole('radio', { name: '3 estrellas' }))
    expect(entry().rating).toBe(3)
    expect(toast()).toHaveTextContent('Lectura actualizada')
    fireEvent.click(undoButton())
    expect(entry()).toEqual(before)
  })

  it('can clear the rating', () => {
    renderApp(CIEN_ANOS)
    fireEvent.click(main().getByRole('button', { name: 'Quitar puntaje' }))
    expect(entry()).not.toHaveProperty('rating')
  })

  it.each([
    ['a future date', 'Fin', '2999-01-01', 'Las fechas no pueden ser futuras.'],
    ['an end before the start', 'Fin', '2000-01-01', 'El fin no puede ser anterior al inicio.'],
    ['an empty date', 'Inicio', '', 'Elige una fecha.'],
    ['a year still being typed', 'Fin', '0202-01-01', 'Revisa el año.'],
  ])('holds back %s, says why and goes back to the saved date', (_case, label, value, reason) => {
    const before = entry()
    renderApp(CIEN_ANOS)
    typeDate(label, value)
    expect(entry()).toEqual(before)
    expect(main().getByText(new RegExp(`^${reason}`))).toBeInTheDocument()
    expect(dateField(label)).toHaveValue(label === 'Fin' ? before.finishedAt : before.startedAt)
  })

  it('has no primary action: each row saves itself', () => {
    renderApp(CIEN_ANOS)
    expect(main().queryByRole('button', { name: 'Guardar' })).not.toBeInTheDocument()
  })
})

describe('a Leído chosen by mistake', () => {
  const entry = () => state().library[CARRIE_ID]

  it('keeps the start and the rating after going back to Leyendo, with no Deshacer', () => {
    renderApp(CARRIE)
    chooseTag('Leído')
    fireEvent.click(main().getByRole('radio', { name: '4 estrellas' }))
    act(() => state().dismissToast())
    chooseTag('Leyendo')
    expect(entry()).toMatchObject({ status: 'reading', startedAt: daysAgo(12), rating: 4 })
    expect(entry()).not.toHaveProperty('finishedAt')
  })

  it('finishes again with the same start and rating', () => {
    renderApp(CARRIE)
    chooseTag('Leído')
    fireEvent.click(main().getByRole('radio', { name: '4 estrellas' }))
    chooseTag('Leyendo')
    chooseTag('Leído')
    expect(entry()).toMatchObject({
      status: 'read',
      startedAt: daysAgo(12),
      finishedAt: today(),
      rating: 4,
    })
  })

  it('keeps the day it was finished when it only went through Lo tengo', () => {
    const { finishedAt, rating } = state().library[CIEN_ANOS_ID]
    renderApp(CIEN_ANOS)
    chooseTag('Lo tengo')
    chooseTag('Leído')
    expect(state().library[CIEN_ANOS_ID]).toMatchObject({ status: 'read', finishedAt, rating })
  })
})

describe('a book the store does not have', () => {
  const LISTED: Partial<Book> = {
    id: 'OL999W',
    title: 'Un libro del catálogo',
    authors: ['Una Autora'],
  }

  function holdCatalog() {
    let deliver: (response: Response) => void = () => undefined
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise<Response>((resolve) => (deliver = resolve))),
    )
    return () =>
      deliver(Response.json([[LISTED.id, LISTED.title, LISTED.authors, 1999, 200, null]]))
  }

  function GoTo({ to }: { to: string }) {
    const navigate = useNavigate()
    return <button onClick={() => navigate(to)}>Ir</button>
  }

  it('keeps the shape of the page when the book arrives, so nothing jumps', async () => {
    const shape = () => {
      const record = document.querySelector('article dl') as HTMLElement
      const reading = record.parentElement as HTMLElement
      const grid = reading.parentElement as HTMLElement
      return [
        grid.className.replace(' motion-safe:animate-pulse', ''),
        grid.children[0].className,
        reading.className,
        record.className,
      ]
    }
    const deliver = holdCatalog()
    renderApp('/libro/OL999W')
    const loading = shape()
    await act(async () => deliver())
    expect(main().getByRole('heading', { level: 1 })).toHaveTextContent('Un libro del catálogo')
    expect(shape()).toEqual(loading)
  })

  it('shows the loading state, then the book, with its local cover and without storing it', async () => {
    const deliver = holdCatalog()
    renderApp('/libro/OL999W')
    expect(main().getByRole('heading', { level: 1 })).toHaveTextContent('Cargando libro…')
    expect(main().getByText('Cargando libro…', { selector: '.sr-only' })).toBeInTheDocument()
    expect(main().getByRole('status')).toBeInTheDocument()
    expect(main().getByRole('link', { name: 'Mis libros' })).toBeInTheDocument()
    expect(document.querySelector('article dl')).not.toBeNull()

    await act(async () => deliver())
    expect(main().getByRole('heading', { level: 1 })).toHaveTextContent('Un libro del catálogo')
    expect(document.querySelector('article img')).toHaveAttribute('src', '/covers/OL999W.jpg')
    expect(state().extraBooks).toEqual({})
  })

  it('adds any book of the catalog, which then needs no download to show up', async () => {
    stubCatalog({ books: [LISTED] })
    renderApp('/libro/OL999W')
    fireEvent.click(await main().findByRole('button', { name: 'Agregar a Mis libros' }))
    fireEvent.click(main().getByRole('menuitemradio', { name: 'Lo quiero' }))
    expect(state().library.OL999W.status).toBe('want')
    expect(state().extraBooks.OL999W).toMatchObject({
      title: 'Un libro del catálogo',
      coverUrl: '/covers/OL999W.jpg',
    })
    expect(state().extraBooks.OL999W).not.toHaveProperty('description')
  })

  it('finishes any book of the catalog from the same menu', async () => {
    stubCatalog({ books: [LISTED] })
    renderApp('/libro/OL999W')
    fireEvent.click(await main().findByRole('button', { name: 'Agregar a Mis libros' }))
    fireEvent.click(main().getByRole('menuitemradio', { name: 'Leído' }))
    expect(state().library.OL999W).toMatchObject({ status: 'read', finishedAt: today() })
  })

  it('says that the author is unknown, where the author would go', async () => {
    stubCatalog({ books: [{ ...LISTED, authors: [] }] })
    renderApp('/libro/OL999W')
    expect(await screen.findByText('Autor desconocido')).toBeInTheDocument()
  })

  it('downloads nothing for a book the store has', () => {
    const files = stubCatalog()
    renderApp(CARRIE)
    expect(files).not.toHaveBeenCalledWith('/catalog/index.json', expect.anything())
  })

  it('offers a way out when the book cannot be found', async () => {
    stubCatalog()
    renderApp('/libro/OL0W')
    fireEvent.click(await screen.findByRole('button', { name: 'Ir a Mis libros' }))
    expect(currentLocation()).toBe('/biblioteca')
  })

  it('ends in Libro no encontrado when the catalog does not have it', async () => {
    stubCatalog({ books: [LISTED] })
    renderApp('/libro/OL1W')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Libro no encontrado' }),
    ).toBeInTheDocument()
    expect(state().extraBooks).toEqual({})
  })

  it('needs no download to know an id that cannot be a book', () => {
    const files = stubCatalog()
    renderApp('/libro/constructor')
    expect(screen.getByRole('heading', { level: 1, name: 'Libro no encontrado' })).toBeVisible()
    expect(files).not.toHaveBeenCalled()
  })

  it('offers to try again when the catalog cannot be downloaded', async () => {
    stubCatalog({ failing: [/index/] })
    renderApp('/libro/OL999W')
    const retry = await screen.findByRole('button', { name: 'Reintentar' })
    expect(screen.queryByText('Libro no encontrado')).not.toBeInTheDocument()

    const deliver = holdCatalog()
    fireEvent.click(retry)
    expect(main().getByRole('heading', { level: 1 })).toHaveTextContent('Cargando libro…')
    await act(async () => deliver())
    expect(main().getByRole('heading', { level: 1 })).toHaveTextContent('Un libro del catálogo')
  })

  it('moves from one book to another with the same download', async () => {
    const files = stubCatalog({ books: [LISTED, { id: 'OL998W', title: 'El libro B' }] })
    render(
      <MemoryRouter initialEntries={['/libro/OL999W']}>
        <GoTo to="/libro/OL998W" />
        <Routes>{appRoutes}</Routes>
      </MemoryRouter>,
    )
    await screen.findByRole('heading', { level: 1, name: 'Un libro del catálogo' })
    fireEvent.click(screen.getByRole('button', { name: 'Ir' }))
    expect(main().getByRole('heading', { level: 1 })).toHaveTextContent('El libro B')
    expect(files.mock.calls.filter(([url]) => url === '/catalog/index.json')).toHaveLength(1)
  })
})
