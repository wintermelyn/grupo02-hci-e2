import { fireEvent, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { currentLocation, renderApp } from '../../test/router'
import { state } from '../../test/store'

const CARRIE = '/libro/OL81626W' // Leyendo, en Terror
const NOCHE = '/libro/OL20901051W' // Lo tengo, en Próximos y Terror, con descripción
const OUTSIDE = '/libro/OL698173W' // En el catálogo, fuera de la biblioteca

const main = () => within(screen.getByRole('main'))

describe('BookPage', () => {
  it('shows the title and the data of the book', () => {
    renderApp(NOCHE)
    expect(main().getByRole('heading', { level: 1 })).toHaveTextContent('Nuestra parte de noche')
    expect(main().getByText('Mariana Enríquez · 2019 · 640 páginas')).toBeInTheDocument()
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
    renderApp('/libro/OL1811898W')
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

  it('tells when the book does not exist', () => {
    renderApp('/libro/OL0W')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Libro no encontrado')
  })
})
