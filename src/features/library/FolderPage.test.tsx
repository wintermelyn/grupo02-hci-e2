import { act, fireEvent, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { currentLocation, renderApp } from '../../test/router'
import { state, stubAction } from '../../test/store'

const TERROR = '/biblioteca/carpeta/terror' // 10 libros: 6 Lo quiero, 2 Lo tengo, 1 Leyendo, 1 Leído
const PROXIMOS = '/biblioteca/carpeta/proximos' // Fija

const main = () => within(screen.getByRole('main'))
const toast = () => screen.getByText(/./, { selector: '[role="status"] p' })
const tagButton = (name: RegExp) => main().getByRole('button', { name })
const searchBox = () => main().getByRole('searchbox')
const optionsButton = () => main().getByRole('button', { name: 'Opciones' })
const openButton = () => main().getByRole('button', { name: 'Buscar en «Terror»' })
const closeButton = () => main().getByRole('button', { name: 'Cerrar búsqueda' })
const band = () => screen.getByRole('heading', { level: 1 }).closest('header') as HTMLElement
/** Tailwind is not loaded here, so what a phone shows is read from these classes. */
const searchLayer = () => searchBox().parentElement?.parentElement

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
    expect(tagButton(/^Todos: 10 libros/)).toBeInTheDocument()
    expect(main().getByRole('link', { name: 'Mis libros' })).toHaveAttribute('href', '/biblioteca')
    expect(screen.queryByText('Disponible pronto')).not.toBeInTheDocument()
  })

  it('keeps "Goodreads / prototipo" in the band, next to the options', () => {
    renderApp(TERROR)
    const band = within(screen.getByRole('heading', { level: 1 }).closest('header') as HTMLElement)
    expect(band.getByText('Goodreads')).toBeInTheDocument()
    expect(band.getByText('prototipo')).toBeInTheDocument()
    expect(band.getByRole('button', { name: 'Opciones' })).toBeInTheDocument()
  })

  it('keeps a long name to two lines on a phone, whole for screen readers', () => {
    const longName = 'Libros para regalar a mi mamá en Navidad'
    act(() => state().renameFolder('terror', longName))
    renderApp(TERROR)
    const title = screen.getByRole('heading', { level: 1, name: longName })
    expect(within(title).getByText(longName)).toHaveClass('max-md:line-clamp-2')
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
    expect(main().getByRole('heading', { name: 'Ningún libro en «Leyendo»' })).toBeInTheDocument()
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
    it('sits in the row of the title, inside the band, so opening it moves no book', () => {
      renderApp(TERROR)
      expect(band()).toContainElement(searchBox())
      const tags = screen.getByRole('group', { name: 'Filtrar por estado' })
      expect(searchBox().compareDocumentPosition(tags)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
    })

    it('says where it searches, because the title is covered on a phone', () => {
      renderApp(TERROR)
      expect(searchBox()).toHaveAttribute('placeholder', 'Buscar en Terror')
    })

    it('waits for the button on a phone and is always there on a computer', () => {
      renderApp(TERROR)
      expect(searchLayer()).toHaveClass('max-md:hidden', 'md:w-72')
      expect(openButton()).toHaveClass('md:hidden')
    })

    it('opens over the row that was touched, with the focus in the field', () => {
      renderApp(TERROR)
      fireEvent.click(openButton())
      expect(searchBox()).toHaveFocus()
      expect(searchLayer()).toHaveClass('max-md:absolute', 'max-md:inset-0', 'max-md:bg-paper')
      expect(searchLayer()).not.toHaveClass('max-md:hidden')
      expect(main().queryByRole('button', { name: 'Buscar en «Terror»' })).not.toBeInTheDocument()
    })

    it('takes Opciones out of the way, so it cannot be reached under the field', () => {
      renderApp(TERROR)
      const hiddenOnPhone = () => optionsButton().closest('.max-md\\:hidden')
      expect(hiddenOnPhone()).toBeNull()
      fireEvent.click(openButton())
      expect(hiddenOnPhone()).not.toBeNull()
    })

    it('keeps the title for screen readers while the field covers it', () => {
      renderApp(TERROR)
      fireEvent.click(openButton())
      expect(screen.getByRole('heading', { level: 1, name: 'Terror' })).toBeInTheDocument()
    })

    it.each([
      ['Cerrar', () => fireEvent.click(closeButton())],
      ['Escape', () => fireEvent.keyDown(searchBox(), { key: 'Escape' })],
    ])('leaves with its text with %s and gives the focus back to Buscar', (_name, leave) => {
      renderApp(TERROR)
      fireEvent.click(openButton())
      search('king')
      expect(bookTitles().length).toBeLessThan(10)
      leave()
      expect(openButton()).toHaveFocus()
      expect(searchLayer()).toHaveClass('max-md:hidden')
      expect(searchBox()).toHaveValue('')
      expect(currentLocation()).toBe(TERROR)
      expect(bookTitles()).toHaveLength(10)
    })

    it('opens by itself for a search that comes from the URL, without taking the focus', () => {
      renderApp(`${TERROR}?q=king`)
      expect(searchLayer()).toHaveClass('max-md:absolute')
      expect(searchBox()).not.toHaveFocus()
    })

    it('closes a search that came from the URL and gives the focus back to Buscar', () => {
      renderApp(`${TERROR}?q=king`)
      fireEvent.click(closeButton())
      expect(openButton()).toHaveFocus()
      expect(currentLocation()).toBe(TERROR)
    })

    it('keeps the second tap on Cerrar from landing on Opciones', () => {
      renderApp(`${TERROR}?q=king`)
      fireEvent.click(closeButton())
      fireEvent.click(optionsButton(), { detail: 2 })
      expect(main().queryByRole('menu')).not.toBeInTheDocument()
    })

    it('stays open with the text deleted, ready for another search', () => {
      renderApp(TERROR)
      fireEvent.click(openButton())
      search('king')
      search('')
      expect(searchLayer()).toHaveClass('max-md:absolute')
    })

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
      expect(main().queryByRole('button', { name: /^Buscar en/ })).not.toBeInTheDocument()
      expect(main().queryByRole('searchbox')).not.toBeInTheDocument()
      expect(
        main().getByText('Abre un libro y toca «Agregar» en la fila Carpetas.'),
      ).toBeInTheDocument()
      expect(tagButton(/^Todos: 0/)).toBeInTheDocument()
    })

    it('says what the search did not find', () => {
      renderApp(TERROR)
      search('zzz')
      expect(main().getByText('Ningún libro de «Terror» coincide con «zzz».')).toBeInTheDocument()
    })

    it('says the tag and the other folders of each book in a list of a tag', () => {
      renderApp(`${TERROR}?tag=owned`)
      const row = (name: RegExp) => main().getByRole('link', { name })
      expect(row(/^Nuestra parte de noche/)).toHaveTextContent('Próximos')
      expect(row(/^Nuestra parte de noche/)).not.toHaveTextContent('Terror')
      expect(row(/^Nuestra parte de noche/)).toHaveTextContent('Lo tengo')
      expect(row(/^Drácula/)).not.toHaveTextContent('Terror')
    })

    it('says which tag held the search back', () => {
      renderApp(`${TERROR}?tag=read`)
      search('zzz')
      expect(main().getByText(/estado «Leído» coincide con «zzz»/)).toBeInTheDocument()
      expect(main().getByRole('button', { name: 'Ver todos los libros' })).toBeInTheDocument()
    })

    it('tells what a tag without books in this folder is for', () => {
      renderApp('/biblioteca/carpeta/novela?tag=reading')
      expect(main().getByRole('heading', { name: 'Ningún libro en «Leyendo»' })).toBeInTheDocument()
      expect(main().getByRole('button', { name: /^Buscar en/ })).toBeInTheDocument()
    })

    it('offers a way out of a folder that does not exist', () => {
      renderApp('/biblioteca/carpeta/nada')
      fireEvent.click(main().getByRole('button', { name: 'Ir a Mis libros' }))
      expect(currentLocation()).toBe('/biblioteca')
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
      expect(main().getByText('Carpeta fija')).toBeInTheDocument()
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
    const nameField = () => main().getByRole('textbox', { name: 'Nombre de «Terror»' })
    const saveButton = () => main().getByRole('button', { name: 'Guardar' })
    const cancelButton = () => main().getByRole('button', { name: 'Cancelar' })

    function type(value: string) {
      fireEvent.change(nameField(), { target: { value } })
    }

    it('edits the name on the title, ready to change and with no panel', () => {
      renderApp(TERROR)
      chooseOption('Renombrar carpeta')
      expect(within(screen.getByRole('heading', { level: 1 })).getByRole('textbox')).toBe(
        nameField(),
      )
      expect(nameField()).toHaveValue('Terror')
      expect(nameField()).toHaveFocus()
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('uses the same focus outline as the rest of the app', () => {
      renderApp(TERROR)
      chooseOption('Renombrar carpeta')
      expect(nameField()).not.toHaveClass('outline-none')
      expect(nameField()).toHaveClass('rounded-control')
    })

    it('keeps the list in view while the name changes', () => {
      renderApp(TERROR)
      chooseOption('Renombrar carpeta')
      expect(bookTitles()).toHaveLength(10)
    })

    it('saves, goes back to the title and can be undone', () => {
      renderApp(TERROR)
      chooseOption('Renombrar carpeta')
      type('  Miedo ')
      fireEvent.click(saveButton())
      expect(screen.getByRole('heading', { level: 1, name: 'Miedo' })).toBeInTheDocument()
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
      expect(main().getByText(reason)).toBeInTheDocument()
      fireEvent.keyDown(nameField(), { key: 'Enter' })
      expect(renameFolder).not.toHaveBeenCalled()
    })

    it('saves with Enter', () => {
      renderApp(TERROR)
      chooseOption('Renombrar carpeta')
      type('Miedo')
      fireEvent.keyDown(nameField(), { key: 'Enter' })
      expect(state().folders.find(({ id }) => id === 'terror')?.name).toBe('Miedo')
    })

    it('changes only the case of its own name', () => {
      renderApp(TERROR)
      chooseOption('Renombrar carpeta')
      type('TERROR')
      expect(saveButton()).toBeEnabled()
    })

    it.each([
      ['Cancelar', () => fireEvent.click(cancelButton())],
      ['Escape', () => fireEvent.keyDown(nameField(), { key: 'Escape' })],
    ])('leaves the name as it was with %s and gives the focus back', (_name, leave) => {
      renderApp(TERROR)
      chooseOption('Renombrar carpeta')
      type('Miedo')
      leave()
      expect(screen.getByRole('heading', { level: 1, name: 'Terror' })).toBeInTheDocument()
      expect(optionsButton()).toHaveFocus()
    })

    it('starts from the current name each time', () => {
      renderApp(TERROR)
      chooseOption('Renombrar carpeta')
      type('Miedo')
      fireEvent.click(cancelButton())
      chooseOption('Renombrar carpeta')
      expect(nameField()).toHaveValue('Terror')
    })

    it('keeps Guardar and Cancelar in the row of the field, up to 480 px, from a tablet up', () => {
      renderApp(TERROR)
      chooseOption('Renombrar carpeta')
      const row = nameField().parentElement?.parentElement
      expect(row).toContainElement(saveButton())
      expect(row).toContainElement(cancelButton())
      expect(row).toHaveClass('md:flex-row')
      expect(nameField().parentElement).toHaveClass('md:max-w-120')
    })

    it('has a single primary action', () => {
      renderApp(TERROR)
      chooseOption('Renombrar carpeta')
      const buttons = main().getAllByRole('button')
      expect(buttons.filter((button) => button.classList.contains('bg-ink'))).toEqual([
        saveButton(),
      ])
    })
  })

  describe('deleting', () => {
    const strip = () => within(main().getByRole('region', { name: 'Eliminar «Terror»' }))
    const confirmButton = () => strip().getByRole('button', { name: 'Eliminar carpeta' })

    it('asks in the page, telling how many books it has and that they stay in the library', () => {
      renderApp(TERROR)
      chooseOption('Eliminar carpeta')
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(bookTitles().length).toBeGreaterThan(0)
      expect(
        strip().getByText('Esta carpeta tiene 10 libros. Siguen en Mis libros.'),
      ).toBeInTheDocument()
      expect(confirmButton().className).toContain('bg-danger')
      expect(state().folders.map(({ id }) => id)).toContain('terror')
    })

    it('takes the place of the tags from a tablet up, which keep their height', () => {
      renderApp(TERROR)
      chooseOption('Eliminar carpeta')
      const question = main().getByRole('region', { name: 'Eliminar «Terror»' })
      const tags = screen.getByRole('group', { name: 'Filtrar por estado' })
      expect(question).toHaveClass('md:absolute', 'md:inset-0')
      expect(tags.parentElement).toHaveClass('md:invisible')
      expect(question.parentElement).toContainElement(tags)
      fireEvent.keyDown(question, { key: 'Escape' })
      expect(tags.parentElement).not.toHaveClass('md:invisible')
    })

    it('counts the books of the folder, not those of the filter', () => {
      renderApp(`${TERROR}?tag=read`)
      chooseOption('Eliminar carpeta')
      expect(strip().getByText(/10 libros/)).toBeInTheDocument()
    })

    it('words it for a single book', () => {
      state().removeFromFolder(['OL10263W', 'OL17075811W'], 'regalos')
      renderApp('/biblioteca/carpeta/regalos')
      chooseOption('Eliminar carpeta')
      expect(
        main().getByText('Esta carpeta tiene 1 libro. Sigue en Mis libros.'),
      ).toBeInTheDocument()
    })

    it('words it for an empty folder', () => {
      state().createFolder('Vacía')
      renderApp('/biblioteca/carpeta/vacia')
      chooseOption('Eliminar carpeta')
      expect(main().getByText('Esta carpeta no tiene libros.')).toBeInTheDocument()
    })

    it('goes back to Mis libros with Deshacer within reach', () => {
      const books = Object.keys(state().library).length
      renderApp(TERROR)
      chooseOption('Eliminar carpeta')
      fireEvent.click(confirmButton())

      expect(currentLocation()).toBe('/biblioteca')
      expect(screen.getByRole('heading', { level: 1, name: 'Mis libros' })).toBeInTheDocument()
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

    it('deletes nothing on Cancelar, and gives the focus back to Opciones', () => {
      renderApp(TERROR)
      chooseOption('Eliminar carpeta')
      fireEvent.click(strip().getByRole('button', { name: 'Cancelar' }))
      expect(main().queryByRole('region')).not.toBeInTheDocument()
      expect(optionsButton()).toHaveFocus()
      expect(currentLocation()).toBe(TERROR)
      expect(state().folders.map(({ id }) => id)).toContain('terror')
    })
  })
})
