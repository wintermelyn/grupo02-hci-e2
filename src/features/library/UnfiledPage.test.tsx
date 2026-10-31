import { act, fireEvent, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { currentLocation, renderApp } from '../../test/router'
import { state } from '../../test/store'

const UNFILED = '/biblioteca/sin-carpeta'
const HABITOS = 'OL17930368W'

const main = () => within(screen.getByRole('main'))
const tagButton = (name: RegExp) => main().getByRole('button', { name })

function bookTitles() {
  return main()
    .getAllByRole('listitem')
    .map((item) => within(item).getAllByRole('link').at(-1)?.textContent)
}

describe('UnfiledPage', () => {
  it('opens from its card on the board, as one more folder', () => {
    renderApp('/biblioteca')
    fireEvent.click(main().getByRole('link', { name: /^Sin carpeta/ }))
    expect(currentLocation()).toBe(UNFILED)
    expect(screen.getByRole('heading', { level: 1, name: 'Sin carpeta' })).toBeInTheDocument()
  })

  it('has what a folder has: the way back, the tags and its search', () => {
    renderApp(UNFILED)
    expect(main().getByRole('link', { name: 'Mis libros' })).toHaveAttribute('href', '/biblioteca')
    expect(tagButton(/^Todos: 4 libros/)).toHaveAttribute('aria-pressed', 'true')
    expect(main().getByRole('searchbox', { name: 'Buscar en «Sin carpeta»' })).toBeInTheDocument()
  })

  it('has nothing of what only a folder of the person has', () => {
    renderApp(UNFILED)
    expect(main().queryByRole('button', { name: 'Opciones' })).not.toBeInTheDocument()
  })

  it('lists the books outside every folder, with Hábitos atómicos, by title', () => {
    renderApp(UNFILED)
    const titles = bookTitles()
    expect(titles).toHaveLength(4)
    expect(titles.some((title) => title?.startsWith('Hábitos atómicos'))).toBe(true)
    expect(titles[0]).toMatch(/^Breve historia del tiempo/)
  })

  it('filters by tag inside the page, as a folder does', () => {
    renderApp(UNFILED)
    fireEvent.click(tagButton(/^Lo tengo/))
    expect(currentLocation()).toBe(`${UNFILED}?tag=owned`)
    expect(bookTitles()).toHaveLength(1)
    fireEvent.click(tagButton(/^Leyendo/))
    expect(main().getByRole('heading', { name: 'Ningún libro en «Leyendo»' })).toBeInTheDocument()
    fireEvent.click(main().getByRole('button', { name: 'Ver todos los libros' }))
    expect(bookTitles()).toHaveLength(4)
  })

  it('finds a book with its search, and says what it did not find', () => {
    renderApp(UNFILED)
    const searchBox = main().getByRole('searchbox')
    fireEvent.change(searchBox, { target: { value: 'hábitos' } })
    expect(bookTitles()).toHaveLength(1)
    fireEvent.change(searchBox, { target: { value: 'zzz' } })
    expect(
      main().getByText('Ningún libro de «Sin carpeta» coincide con «zzz».'),
    ).toBeInTheDocument()
  })

  it('follows the store when a book gets a folder', () => {
    renderApp(UNFILED)
    act(() => state().addToFolder([HABITOS], 'proximos'))
    expect(bookTitles()).toHaveLength(3)
  })

  it('is where the book page goes back to', () => {
    renderApp(UNFILED)
    fireEvent.click(main().getByRole('link', { name: /^Hábitos atómicos/ }))
    fireEvent.click(main().getByRole('link', { name: 'Sin carpeta' }))
    expect(currentLocation()).toBe(UNFILED)
  })

  it('stays in place, with the way back, when no book is left', () => {
    const { library } = state()
    const unfiled = Object.values(library).filter(({ folderIds }) => folderIds.length === 0)
    renderApp(UNFILED)
    act(() =>
      state().addToFolder(
        unfiled.map(({ bookId }) => bookId),
        'proximos',
      ),
    )
    expect(
      main().getByRole('heading', { name: 'Todos tus libros tienen carpeta' }),
    ).toBeInTheDocument()
    expect(main().getByRole('link', { name: 'Mis libros' })).toBeInTheDocument()
  })
})
