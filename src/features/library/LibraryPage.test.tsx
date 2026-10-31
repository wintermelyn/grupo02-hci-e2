import { act, fireEvent, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { currentLocation, renderApp } from '../../test/router'
import { state } from '../../test/store'

const main = () => within(screen.getByRole('main'))
const tagButton = (name: RegExp) => main().getByRole('button', { name })
const board = () => main().queryByRole('heading', { name: 'Mis carpetas' })

function bookTitles() {
  return main()
    .getAllByRole('listitem')
    .map((item) => within(item).getAllByRole('link').at(-1)?.textContent)
}

describe('LibraryPage', () => {
  it('starts on Todos, with the total and the count of each tag', () => {
    renderApp('/biblioteca')
    expect(screen.getByRole('heading', { level: 1, name: 'Mis libros' })).toBeInTheDocument()
    expect(main().getByText('34 libros en tu biblioteca')).toBeInTheDocument()
    expect(tagButton(/^Todos/)).toHaveAttribute('aria-pressed', 'true')
    for (const name of [/Lo quiero: 17/, /Lo tengo: 5/, /Leyendo: 2/, /Leído: 10/]) {
      expect(tagButton(name)).toHaveAttribute('aria-pressed', 'false')
    }
  })

  it('shows the folder board with Próximos first and a link to each folder', () => {
    renderApp('/biblioteca')
    expect(board()).toBeInTheDocument()
    const links = main().getAllByRole('link')
    expect(links[0]).toHaveTextContent('Próximos')
    expect(links[0]).toHaveTextContent('2 libros · fija')
    expect(links[0]).toHaveAttribute('href', '/biblioteca/carpeta/proximos')
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/biblioteca/carpeta/proximos',
      '/biblioteca/carpeta/terror',
      '/biblioteca/carpeta/novela',
      '/biblioteca/carpeta/ciencia-ficcion',
      '/biblioteca/carpeta/regalos',
    ])
  })

  it('counts a book in every folder it belongs to', () => {
    renderApp('/biblioteca')
    expect(main().getByRole('link', { name: /Terror/ })).toHaveTextContent('10 libros')
    expect(main().getByRole('link', { name: /Novela/ })).toHaveTextContent('9 libros')
  })

  it('replaces the board with the books of the chosen tag, in title order', () => {
    renderApp('/biblioteca')
    fireEvent.click(tagButton(/^Lo tengo/))
    expect(board()).not.toBeInTheDocument()
    expect(tagButton(/^Lo tengo/)).toHaveAttribute('aria-pressed', 'true')
    expect(currentLocation()).toBe('/biblioteca?tag=owned')
    const titles = bookTitles()
    expect(titles).toHaveLength(5)
    expect(titles[0]).toMatch(/^Drácula/)
    expect(titles.at(-1)).toMatch(/^Sapiens/)
    for (const title of titles) expect(title).toContain('Lo tengo')
  })

  it('shows the 17 books of Lo quiero, as T2 expects', () => {
    renderApp('/biblioteca?tag=want')
    expect(bookTitles()).toHaveLength(17)
  })

  it('goes back to the board with Todos', () => {
    renderApp('/biblioteca?tag=reading')
    fireEvent.click(tagButton(/^Todos/))
    expect(board()).toBeInTheDocument()
    expect(currentLocation()).toBe('/biblioteca')
  })

  it('ignores a tag it does not know', () => {
    renderApp('/biblioteca?tag=otro')
    expect(tagButton(/^Todos/)).toHaveAttribute('aria-pressed', 'true')
    expect(board()).toBeInTheDocument()
  })

  it('follows the store when a tag changes', () => {
    renderApp('/biblioteca?tag=reading')
    expect(bookTitles()).toHaveLength(2)
    act(() => state().setStatus('OL81626W', 'owned'))
    expect(bookTitles()).toHaveLength(1)
    expect(tagButton(/^Lo tengo: 6/)).toBeInTheDocument()
  })

  it('tells what the list is for when a tag has no books', () => {
    renderApp('/biblioteca?tag=reading')
    act(() => {
      state().setStatus('OL81626W', 'owned')
      state().setStatus('OL893414W', 'owned')
    })
    expect(main().getByRole('heading', { name: 'Aún no hay libros aquí' })).toBeInTheDocument()
    expect(main().getByText(/estado «Leyendo»/)).toBeInTheDocument()
  })
})
