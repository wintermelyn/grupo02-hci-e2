import { act, fireEvent, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { currentLocation, renderApp } from '../../test/router'
import { state, stubAction } from '../../test/store'

const TERROR = '/biblioteca/carpeta/terror' // 10 libros: 6 Lo quiero, 2 Lo tengo, 1 Leyendo, 1 Leído
const PROXIMOS = '/biblioteca/carpeta/proximos' // Fija

const main = () => within(screen.getByRole('main'))
const dialog = () => within(screen.getByRole('dialog'))
const toast = () => screen.getByText(/./, { selector: '[role="status"] p' })
const tagButton = (name: RegExp) => main().getByRole('button', { name })
const searchBox = () => main().getByRole('searchbox')
const optionsButton = () => main().getByRole('button', { name: 'Opciones' })

function search(value: string) {
  fireEvent.change(searchBox(), { target: { value } })
}

function bookTitles() {
  return main()
    .getAllByRole('listitem')
    .map((item) => within(item).getAllByRole('link').at(-1)?.textContent)
}

function chooseOption(name: string) {
  fireEvent.click(optionsButton())
  fireEvent.click(main().getByRole('menuitem', { name }))
}

describe('FolderPage', () => {
  it('shows the name of the folder, how many books it has and the way back', () => {
    renderApp(TERROR)
    expect(screen.getByRole('heading', { level: 1, name: 'Terror' })).toBeInTheDocument()
    expect(main().getByText('10 libros')).toBeInTheDocument()
    expect(main().getByRole('link', { name: 'Mis libros' })).toHaveAttribute('href', '/biblioteca')
    expect(screen.queryByText('Disponible pronto')).not.toBeInTheDocument()
  })

  it('keeps "Goodreads / prototipo" in the band, next to the action', () => {
    renderApp(TERROR)
    const band = within(screen.getByRole('heading', { level: 1 }).closest('header') as HTMLElement)
    expect(band.getByText('Goodreads')).toBeInTheDocument()
    expect(band.getByText('prototipo')).toBeInTheDocument()
    expect(band.getByRole('button', { name: 'Opciones' })).toBeInTheDocument()
  })

  it('starts on Todos, counting only the books of this folder', () => {
    renderApp(TERROR)
    expect(tagButton(/^Todos: 10/)).toHaveAttribute('aria-pressed', 'true')
    for (const name of [/Lo quiero: 6/, /Lo tengo: 2/, /Leyendo: 1/, /Leído: 1/]) {
      expect(tagButton(name)).toHaveAttribute('aria-pressed', 'false')
    }
  })

  it('lists the books by title, each with its tag', () => {
    renderApp(TERROR)
    const titles = bookTitles()
    expect(titles).toHaveLength(10)
    expect(titles[0]).toMatch(/^Carrie.*Leyendo/)
    expect(titles[1]).toMatch(/^Cementerio de animales.*Lo quiero/)
  })

  it('filters by tag, in the URL', () => {
    renderApp(TERROR)
    fireEvent.click(tagButton(/^Leído/))
    expect(currentLocation()).toBe(`${TERROR}?tag=read`)
    expect(bookTitles()).toHaveLength(1)
    expect(bookTitles()[0]).toMatch(/^El resplandor/)
    fireEvent.click(tagButton(/^Todos/))
    expect(currentLocation()).toBe(TERROR)
    expect(bookTitles()).toHaveLength(10)
  })

  it('follows the store when a tag changes', () => {
    renderApp(`${TERROR}?tag=reading`)
    act(() => state().setStatus('OL81626W', 'owned'))
    expect(
      main().getByRole('heading', { name: 'Ningún libro con el estado «Leyendo»' }),
    ).toBeInTheDocument()
    expect(tagButton(/^Lo tengo: 3/)).toBeInTheDocument()
  })

  it('shows the way back to a book that left the active tag', () => {
    renderApp(`${TERROR}?tag=reading`)
    act(() => state().setStatus('OL81626W', 'owned'))
    expect(
      main().getByText('Los 10 libros de esta carpeta tienen otro estado.'),
    ).toBeInTheDocument()
    fireEvent.click(main().getByRole('button', { name: 'Ver todos los libros' }))
    expect(currentLocation()).toBe(TERROR)
    expect(bookTitles()).toHaveLength(10)
  })

  describe('search', () => {
    it('finds by title without caring for capitals or accents', () => {
      renderApp(TERROR)
      search('GOTICO')
      expect(bookTitles()).toHaveLength(1)
      expect(bookTitles()[0]).toMatch(/^Gótico/)
    })

    it('finds by author', () => {
      renderApp(TERROR)
      search('stephen king')
      expect(bookTitles().every((title) => title?.includes('Stephen King'))).toBe(true)
      expect(bookTitles().length).toBeGreaterThan(1)
    })

    it('looks only inside the folder', () => {
      renderApp(TERROR)
      search('dune')
      expect(main().getByRole('heading', { name: 'Sin resultados' })).toBeInTheDocument()
    })

    it('combines with the tag, and the counts stay those of the folder', () => {
      renderApp(`${TERROR}?tag=want`)
      search('king')
      expect(currentLocation()).toBe(`${TERROR}?tag=want&q=king`)
      expect(bookTitles()).toHaveLength(2)
      expect(tagButton(/^Todos: 10/)).toBeInTheDocument()
    })

    it('keeps the search when changing the tag', () => {
      renderApp(`${TERROR}?q=king`)
      fireEvent.click(tagButton(/^Leyendo/))
      expect(currentLocation()).toBe(`${TERROR}?q=king&tag=reading`)
      expect(searchBox()).toHaveValue('king')
    })

    it('starts from the URL, so the book page comes back to the same list', () => {
      renderApp(`${TERROR}?tag=reading&q=carrie`)
      expect(searchBox()).toHaveValue('carrie')
      expect(tagButton(/^Leyendo/)).toHaveAttribute('aria-pressed', 'true')
      expect(bookTitles()).toHaveLength(1)
    })

    it('leaves the URL when cleared', () => {
      renderApp(`${TERROR}?q=king`)
      fireEvent.click(main().getByRole('button', { name: 'Borrar búsqueda' }))
      expect(currentLocation()).toBe(TERROR)
      expect(bookTitles()).toHaveLength(10)
    })

    it('tells how many books it found to screen readers', () => {
      renderApp(TERROR)
      search('gotico')
      expect(screen.getByText('1 libro', { selector: '[role="status"]' })).toBeInTheDocument()
    })

    it('does not take spaces as a search', () => {
      renderApp(TERROR)
      search('   ')
      expect(bookTitles()).toHaveLength(10)
    })
  })

  describe('states', () => {
    it('says so when the folder is empty, with nothing to search', () => {
      state().createFolder('Vacía')
      renderApp('/biblioteca/carpeta/vacia')
      expect(main().getByRole('heading', { name: 'Esta carpeta está vacía' })).toBeInTheDocument()
      expect(main().queryByRole('searchbox')).not.toBeInTheDocument()
      expect(tagButton(/^Todos: 0/)).toBeInTheDocument()
    })

    it('says what the search did not find', () => {
      renderApp(TERROR)
      search('zzz')
      expect(main().getByText('Ningún libro de «Terror» coincide con «zzz».')).toBeInTheDocument()
    })

    it('says which tag held the search back', () => {
      renderApp(`${TERROR}?tag=read`)
      search('zzz')
      expect(main().getByText(/estado «Leído» coincide con «zzz»/)).toBeInTheDocument()
      expect(main().getByRole('button', { name: 'Ver todos los libros' })).toBeInTheDocument()
    })

    it('tells what a tag without books in this folder is for', () => {
      renderApp('/biblioteca/carpeta/novela?tag=reading')
      expect(
        main().getByRole('heading', { name: 'Ningún libro con el estado «Leyendo»' }),
      ).toBeInTheDocument()
      expect(searchBox()).toBeInTheDocument()
    })

    it('tells when the folder does not exist, with one h1 and the way back', () => {
      renderApp('/biblioteca/carpeta/nada')
      expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
      expect(
        screen.getByRole('heading', { level: 1, name: 'Carpeta no encontrada' }),
      ).toBeInTheDocument()
      expect(main().getByRole('link', { name: 'Mis libros' })).toHaveAttribute(
        'href',
        '/biblioteca',
      )
      expect(main().queryByRole('button', { name: 'Opciones' })).not.toBeInTheDocument()
    })
  })

  describe('Próximos', () => {
    it('says it is fixed, and has no action to rename or delete it', () => {
      renderApp(PROXIMOS)
      expect(main().getByText('2 libros · fija')).toBeInTheDocument()
      expect(main().queryByRole('button', { name: 'Opciones' })).not.toBeInTheDocument()
      expect(screen.getByText('prototipo')).toBeInTheDocument()
    })
  })

  describe('options', () => {
    it('opens a menu next to the button, without a panel', () => {
      renderApp(TERROR)
      fireEvent.click(optionsButton())
      const menu = main().getByRole('menu', { name: 'Opciones de «Terror»' })
      expect(
        within(menu)
          .getAllByRole('menuitem')
          .map((item) => item.textContent),
      ).toEqual(['Renombrar carpeta', 'Eliminar carpeta'])
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  describe('renaming', () => {
    const nameField = () => dialog().getByRole('textbox', { name: 'Nombre' })
    const saveButton = () => dialog().getByRole('button', { name: 'Guardar' })

    function type(value: string) {
      fireEvent.change(nameField(), { target: { value } })
    }

    it('opens with the current name, ready to change', () => {
      renderApp(TERROR)
      chooseOption('Renombrar carpeta')
      expect(nameField()).toHaveValue('Terror')
      expect(nameField()).toHaveFocus()
    })

    it('saves, closes the panel and can be undone', () => {
      renderApp(TERROR)
      chooseOption('Renombrar carpeta')
      type('  Miedo ')
      fireEvent.click(saveButton())
      expect(screen.getByRole('heading', { level: 1, name: 'Miedo' })).toBeInTheDocument()
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(toast()).toHaveTextContent('Carpeta renombrada a «Miedo»')
      fireEvent.click(screen.getByRole('button', { name: 'Deshacer' }))
      expect(screen.getByRole('heading', { level: 1, name: 'Terror' })).toBeInTheDocument()
    })

    it('stays on the same URL', () => {
      renderApp(`${TERROR}?tag=read`)
      chooseOption('Renombrar carpeta')
      type('Miedo')
      fireEvent.click(saveButton())
      expect(currentLocation()).toBe(`${TERROR}?tag=read`)
    })

    it.each([
      ['an empty name', '   ', 'Escribe un nombre para la carpeta.'],
      ['the name of another folder', 'Novela', 'Ya tienes una carpeta con ese nombre.'],
      ['that name in other letters', ' ciencia FICCIÓN', 'Ya tienes una carpeta con ese nombre.'],
    ])('holds back %s and says why', (_case, value, reason) => {
      const renameFolder = stubAction('renameFolder')
      renderApp(TERROR)
      chooseOption('Renombrar carpeta')
      type(value)
      expect(saveButton()).toBeDisabled()
      expect(dialog().getByText(reason)).toBeInTheDocument()
      fireEvent.submit(nameField().closest('form') as HTMLFormElement)
      expect(renameFolder).not.toHaveBeenCalled()
    })

    it('saves with Enter', () => {
      renderApp(TERROR)
      chooseOption('Renombrar carpeta')
      type('Miedo')
      fireEvent.submit(nameField().closest('form') as HTMLFormElement)
      expect(state().folders.find(({ id }) => id === 'terror')?.name).toBe('Miedo')
    })

    it('changes only the case of its own name', () => {
      renderApp(TERROR)
      chooseOption('Renombrar carpeta')
      type('TERROR')
      expect(saveButton()).toBeEnabled()
    })

    it('leaves the name as it was on Cancelar', () => {
      renderApp(TERROR)
      chooseOption('Renombrar carpeta')
      type('Miedo')
      fireEvent.click(dialog().getByRole('button', { name: 'Cancelar' }))
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 1, name: 'Terror' })).toBeInTheDocument()
    })

    it('starts from the current name each time it opens', () => {
      renderApp(TERROR)
      chooseOption('Renombrar carpeta')
      type('Miedo')
      fireEvent.click(dialog().getByRole('button', { name: 'Cancelar' }))
      chooseOption('Renombrar carpeta')
      expect(nameField()).toHaveValue('Terror')
    })

    it('has a single primary action', () => {
      renderApp(TERROR)
      chooseOption('Renombrar carpeta')
      const buttons = dialog().getAllByRole('button')
      expect(buttons.filter((button) => button.className.includes('bg-ink'))).toEqual([
        saveButton(),
      ])
    })
  })

  describe('deleting', () => {
    const confirmButton = () => dialog().getByRole('button', { name: 'Eliminar carpeta' })

    it('asks first, telling how many books it has and that they stay in the library', () => {
      renderApp(TERROR)
      chooseOption('Eliminar carpeta')
      expect(dialog().getByRole('heading', { name: 'Eliminar «Terror»' })).toBeInTheDocument()
      expect(
        dialog().getByText('Esta carpeta tiene 10 libros. Los libros siguen en tu biblioteca.'),
      ).toBeInTheDocument()
      expect(confirmButton().className).toContain('bg-danger')
      expect(state().folders.map(({ id }) => id)).toContain('terror')
    })

    it('counts the books of the folder, not those of the filter', () => {
      renderApp(`${TERROR}?tag=read`)
      chooseOption('Eliminar carpeta')
      expect(dialog().getByText(/10 libros/)).toBeInTheDocument()
    })

    it('words it for a single book', () => {
      state().removeFromFolder(['OL10263W', 'OL17075811W'], 'regalos')
      renderApp('/biblioteca/carpeta/regalos')
      chooseOption('Eliminar carpeta')
      expect(
        dialog().getByText('Esta carpeta tiene 1 libro. El libro sigue en tu biblioteca.'),
      ).toBeInTheDocument()
    })

    it('words it for an empty folder', () => {
      state().createFolder('Vacía')
      renderApp('/biblioteca/carpeta/vacia')
      chooseOption('Eliminar carpeta')
      expect(dialog().getByText('Esta carpeta no tiene libros.')).toBeInTheDocument()
    })

    it('goes back to Mis libros with the panel closed and Deshacer within reach', () => {
      const books = Object.keys(state().library).length
      renderApp(TERROR)
      chooseOption('Eliminar carpeta')
      fireEvent.click(confirmButton())

      expect(currentLocation()).toBe('/biblioteca')
      expect(screen.getByRole('heading', { level: 1, name: 'Mis libros' })).toBeInTheDocument()
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(toast()).toHaveTextContent('Carpeta «Terror» eliminada')
      expect(Object.keys(state().library)).toHaveLength(books)

      fireEvent.click(screen.getByRole('button', { name: 'Deshacer' }))
      expect(main().getByRole('link', { name: /Terror/ })).toHaveTextContent('10 libros')
    })

    it('never passes through "Carpeta no encontrada" on the way out', () => {
      renderApp(TERROR)
      chooseOption('Eliminar carpeta')
      const observer = new MutationObserver(() => {})
      observer.observe(document.body, { childList: true, subtree: true })
      fireEvent.click(confirmButton())
      const added = observer.takeRecords().flatMap((record) => [...record.addedNodes])
      observer.disconnect()
      expect(added.length).toBeGreaterThan(0)
      expect(added.map((node) => node.textContent).join()).not.toContain('Carpeta no encontrada')
    })

    it('deletes nothing on Cancelar', () => {
      renderApp(TERROR)
      chooseOption('Eliminar carpeta')
      fireEvent.click(dialog().getByRole('button', { name: 'Cancelar' }))
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(currentLocation()).toBe(TERROR)
      expect(state().folders.map(({ id }) => id)).toContain('terror')
    })
  })
})
