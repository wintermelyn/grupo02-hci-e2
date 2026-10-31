import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Routes, useNavigate } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { appRoutes } from '../../routes'
import { useStore } from '../../store'
import { stubCatalog } from '../../test/catalog'
import { CurrentLocation } from '../../test/CurrentLocation'
import { currentLocation, renderApp } from '../../test/router'
import { state } from '../../test/store'
import type { Book } from '../../types'
import { readRecentSearches } from './recentSearchStore'

function GoBack() {
  const navigate = useNavigate()
  return <button onClick={() => navigate(-1)}>Atrás</button>
}

/** The whole app with Más before the search in the history, and a button for the browser's Back. */
function renderAfterMas(path: string) {
  render(
    <MemoryRouter initialEntries={['/mas', path]} initialIndex={1}>
      <GoBack />
      <Routes>{appRoutes}</Routes>
      <CurrentLocation />
    </MemoryRouter>,
  )
}

const search = () => screen.getByRole('searchbox', { name: 'Buscar libros y autores' })
const type = (text: string) => fireEvent.change(search(), { target: { value: text } })
const main = () => within(screen.getByRole('main'))
const section = (name: string) => screen.getByRole('heading', { name }).closest('section')!
const waitForSection = async (name: string) =>
  (await screen.findByRole('heading', { name })).closest('section')!

const APOCALYPSE: Book = { id: 'OL123W', title: 'Apocalipsis', authors: ['Stephen King'] }

/** The books of the app, the rest of what the catalog has after them, and `others` at the end. */
function catalog(...others: Partial<Book>[]) {
  return stubCatalog({ books: [...Object.values(state().seedBooks), APOCALYPSE, ...others] })
}

beforeEach(() => {
  localStorage.clear()
})

describe('before typing', () => {
  it('shows the authors of the library and what friends read, and no recent searches', () => {
    renderApp('/buscar')
    expect(within(section('Autores de Mis libros')).getByText('Stephen King')).toBeInTheDocument()
    expect(within(section('Lo que leen tus amigos')).getByText('Dune')).toBeInTheDocument()
    expect(screen.queryByText('Búsquedas recientes')).not.toBeInTheDocument()
  })

  it('keeps the separation between its blocks at every width', () => {
    localStorage.setItem('gr-e2-buscados', JSON.stringify(['king']))
    renderApp('/buscar')
    expect(search().parentElement?.parentElement).toHaveClass('mt-3', 'lg:mt-4')
    expect(section('Búsquedas recientes')).toHaveClass('mt-4')
    expect(section('Autores de Mis libros')).toHaveClass('mt-7', 'lg:mt-7')
    expect(section('Lo que leen tus amigos')).toHaveClass('mt-8')
  })

  it('downloads the catalog on arrival, with nothing on the screen waiting for it', () => {
    const files = catalog()
    renderApp('/buscar')
    expect(files).toHaveBeenCalledOnce()
    expect(files.mock.calls[0][0]).toBe('/catalog/index.json')
    expect(screen.queryByText('Buscando…')).not.toBeInTheDocument()
    return act(async () => undefined)
  })

  it('leaves out what friends only want to read', () => {
    renderApp('/buscar')
    expect(
      within(section('Lo que leen tus amigos')).queryByText('Las venas abiertas de América Latina'),
    ).not.toBeInTheDocument()
  })

  it('counts the books of each author in the catalog, the number that tapping them shows', async () => {
    catalog()
    renderApp('/buscar')
    const authors = within(section('Autores de Mis libros'))
    const king = await authors.findByRole('button', { name: /Stephen King.*5 libros/ })
    fireEvent.click(king)
    expect(screen.getByText('5 libros · 4 en Mis libros')).toBeInTheDocument()
  })

  it('says no amount until the catalog arrives, and keeps its line', async () => {
    catalog()
    renderApp('/buscar')
    const authors = within(section('Autores de Mis libros'))
    const king = authors.getByRole('button', { name: 'Stephen King' })
    expect(king.querySelector('.min-h-5')).toBeEmptyDOMElement()
    expect(await authors.findByText('5 libros')).toBeInTheDocument()
  })

  it('says no amount if the catalog fails', async () => {
    stubCatalog({ failing: [/index/] })
    renderApp('/buscar')
    await act(async () => undefined)
    const authors = within(section('Autores de Mis libros'))
    expect(authors.getByRole('button', { name: 'Stephen King' })).toBeInTheDocument()
    expect(authors.queryByText(/\d+ libros?$/)).not.toBeInTheDocument()
  })

  it('keeps the place of friends when there are none', () => {
    useStore.setState({ friendships: [] })
    renderApp('/buscar')
    expect(
      within(section('Lo que leen tus amigos')).getByText(/Cuando agregues amigos/),
    ).toBeInTheDocument()
  })

  it('offers the recent searches, and they can be cleared', () => {
    localStorage.setItem('gr-e2-buscados', JSON.stringify(['king', 'dune']))
    renderApp('/buscar')
    fireEvent.click(screen.getByRole('button', { name: 'dune' }))
    expect(currentLocation()).toBe('/buscar?q=dune')

    fireEvent.click(screen.getByRole('button', { name: 'Borrar búsqueda' }))
    fireEvent.click(screen.getByRole('button', { name: 'Borrar búsquedas recientes' }))
    expect(screen.queryByText('Búsquedas recientes')).not.toBeInTheDocument()
    expect(readRecentSearches()).toEqual([])
  })

  it('shows in the field what a recent search puts in the URL', () => {
    localStorage.setItem('gr-e2-buscados', JSON.stringify(['dune']))
    renderApp('/buscar')
    fireEvent.click(screen.getByRole('button', { name: 'dune' }))
    expect(search()).toHaveValue('dune')
  })

  it('does not hint that people are found elsewhere, which a question of the evaluation asks', () => {
    renderApp('/buscar')
    expect(screen.queryByText(/Buscas a una persona/)).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Amigos' })).not.toBeInTheDocument()
  })

  it('names Buscar on the way back from a book of the shelf', () => {
    renderApp('/buscar')
    fireEvent.click(within(section('Lo que leen tus amigos')).getByRole('link', { name: /Dune/ }))
    fireEvent.click(main().getByRole('link', { name: 'Buscar' }))
    expect(currentLocation()).toBe('/buscar')
  })

  it('says which friend read each book', () => {
    renderApp('/buscar')
    const shelf = within(section('Lo que leen tus amigos'))
    const dune = shelf.getByRole('link', { name: /Dune/ })
    expect(dune).toHaveTextContent('Diego')
  })
})

describe('changing the search with the page scrolled', () => {
  const page = document.documentElement
  /** Where the results start, measured from the top of the page. */
  const RESULTS_TOP = 120

  beforeEach(() => {
    catalog()
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(
      () => ({ top: RESULTS_TOP - page.scrollTop }) as DOMRect,
    )
  })

  afterEach(() => {
    page.scrollTop = 0
  })

  async function renderScrolledTo(top: number) {
    renderApp('/buscar?q=apocalipsis')
    await screen.findByRole('link', { name: /Apocalipsis/ })
    page.scrollTop = top
    fireEvent.scroll(window)
  }

  it('takes the page to the start of the new results', async () => {
    await renderScrolledTo(900)
    type('dune')
    expect(page.scrollTop).toBe(RESULTS_TOP)
  })

  it('does the same on clearing the search', async () => {
    await renderScrolledTo(900)
    type('')
    expect(page.scrollTop).toBe(RESULTS_TOP)
  })

  it('leaves the page alone when the results are already in view', async () => {
    await renderScrolledTo(50)
    type('dune')
    expect(page.scrollTop).toBe(50)
  })

  it('leaves the page alone when the search stays the same', async () => {
    await renderScrolledTo(900)
    type('apocalipsis ')
    expect(page.scrollTop).toBe(900)
  })

  it('still comes back from a book to where the list was', async () => {
    await renderScrolledTo(900)
    fireEvent.click(screen.getByRole('link', { name: /Apocalipsis/ }))
    expect(page.scrollTop).toBe(0)
    fireEvent.click(main().getByRole('link', { name: 'Buscar' }))
    expect(page.scrollTop).toBe(900)
  })
})

describe('with results', () => {
  beforeEach(() => {
    catalog()
  })

  it('says how many there are and how many the person has', async () => {
    renderApp('/buscar?q=carrie')
    expect(await screen.findByText('1 libro · 1 en Mis libros')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Carrie/ })).toBeInTheDocument()
    expect(currentLocation()).toBe('/buscar?q=carrie')
  })

  it('answers each letter in the same render, with nothing to wait for', async () => {
    renderApp('/buscar?q=apocalipsis')
    await screen.findByText('Apocalipsis')
    type('dune')
    expect(screen.getByRole('link', { name: /Dune/ })).toBeInTheDocument()
    expect(screen.queryByText('Apocalipsis')).not.toBeInTheDocument()
    expect(screen.queryByText('Buscando…')).not.toBeInTheDocument()
    type('apoca')
    expect(screen.getByRole('link', { name: /Apocalipsis/ })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Dune/ })).not.toBeInTheDocument()
  })

  it('says so at once when nothing matches, and goes back when the letter is erased', async () => {
    renderApp('/buscar?q=apocalipsis')
    await screen.findByText('Apocalipsis')
    type('apocalipsiss')
    expect(screen.getByText('No encontramos «apocalipsiss»')).toBeInTheDocument()
    type('apocalipsis')
    expect(screen.getByText('Apocalipsis')).toBeInTheDocument()
  })

  it('does not carry a search that was cleared into the next one', async () => {
    renderApp('/buscar?q=apocalipsis')
    await screen.findByText('Apocalipsis')
    type('')
    expect(screen.queryByText('Apocalipsis')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Autores de Mis libros' })).toBeInTheDocument()
  })

  it('finds a title and an author without accents or capitals', async () => {
    renderApp('/buscar?q=CIEN AÑOS')
    expect(await screen.findByRole('link', { name: /Cien años de soledad/ })).toBeInTheDocument()
    type('garcia marquez')
    expect(screen.getByRole('button', { name: /Gabriel García Márquez/ })).toBeInTheDocument()
  })

  it('finds by the start of a word, not in the middle of one', async () => {
    renderApp('/buscar?q=pocalipsis')
    expect(await screen.findByText('No encontramos «pocalipsis»')).toBeInTheDocument()
  })

  it('comes back from a book with its list, in its place and without downloading again', async () => {
    const files = catalog()
    renderApp('/buscar?q=apocalipsis')
    fireEvent.click(await screen.findByRole('link', { name: /Apocalipsis/ }))
    document.documentElement.scrollTop = 0

    fireEvent.click(main().getByRole('link', { name: 'Buscar' }))
    expect(screen.getByRole('link', { name: /Apocalipsis/ })).toBeInTheDocument()
    expect(files.mock.calls.filter(([url]) => url.endsWith('index.json'))).toHaveLength(1)
  })

  it('opens a book that is only in the catalog, with no waiting and without keeping it', async () => {
    renderApp('/buscar?q=apocalipsis')
    fireEvent.click(await screen.findByRole('link', { name: /Apocalipsis/ }))
    expect(currentLocation()).toBe('/libro/OL123W')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Apocalipsis')
    expect(state().extraBooks).toEqual({})
    expect(readRecentSearches()).toEqual(['apocalipsis'])
  })

  it('says when the list is only the most relevant of many', async () => {
    const others = Array.from({ length: 50 }, (_, index) => ({
      id: `OL${1000 + index}W`,
      title: `Apocalipsis ${index}`,
    }))
    catalog(...others)
    renderApp('/buscar?q=apocalipsis')
    expect(await screen.findByText('Los 40 más relevantes de 51')).toBeInTheDocument()
  })

  it('counts the books of an author', async () => {
    renderApp('/buscar?q=king')
    const authors = within(await waitForSection('Autores'))
    expect(authors.getByRole('button', { name: /Stephen King/ })).toBeInTheDocument()
    expect(authors.getByText('5 libros')).toBeInTheDocument()
  })

  it('separates authors and books, and tapping an author filters their books', async () => {
    catalog({ id: 'OL5W', title: 'King Lear', authors: ['Shakespeare'] })
    renderApp('/buscar?q=king')
    // By role: the match is marked, so the title is no longer one text node.
    expect(
      within(await waitForSection('Libros')).getByRole('link', { name: /King Lear/ }),
    ).toBeVisible()
    const list = within(section('Autores'))

    fireEvent.click(list.getByRole('button', { name: /Stephen King/ }))
    expect(currentLocation()).toBe('/buscar?q=Stephen+King')
    expect(screen.getByText('Apocalipsis')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /King Lear/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Autores' })).not.toBeInTheDocument()
    expect(readRecentSearches()).toEqual(['Stephen King'])
  })

  it('filters at once and moves the focus to the books, as the button is gone', async () => {
    renderApp('/buscar?q=king')
    await screen.findByText('Apocalipsis')
    fireEvent.click(screen.getByRole('button', { name: /Stephen King/ }))
    expect(screen.getByRole('heading', { name: 'Libros' })).toHaveFocus()
    expect(screen.getByText('Apocalipsis')).toBeInTheDocument()
    expect(screen.getByText(/en Mis libros/)).toBeInTheDocument()
  })

  it('takes Back from an author to the search it was found in, not out of Buscar', async () => {
    renderAfterMas('/buscar?q=king')
    await screen.findByText('Apocalipsis')
    fireEvent.click(screen.getByRole('button', { name: /Stephen King/ }))
    expect(currentLocation()).toBe('/buscar?q=Stephen+King')

    fireEvent.click(screen.getByRole('button', { name: 'Atrás' }))
    expect(currentLocation()).toBe('/buscar?q=king')
    expect(screen.getByRole('heading', { name: 'Autores' })).toBeInTheDocument()
  })

  it('does not fill the history while typing', async () => {
    renderAfterMas('/buscar')
    type('k')
    type('ki')
    fireEvent.click(screen.getByRole('button', { name: 'Atrás' }))
    expect(currentLocation()).toBe('/mas')
  })

  it('does not take Hawking for King', async () => {
    renderApp('/buscar?q=king')
    await screen.findByRole('heading', { name: 'Libros' })
    expect(screen.queryByText(/Stephen Hawking/)).not.toBeInTheDocument()
  })

  it('remembers a search on Enter', async () => {
    renderApp('/buscar?q=dune')
    await screen.findByRole('heading', { name: 'Libros' })
    fireEvent.keyDown(search(), { key: 'Enter' })
    expect(readRecentSearches()).toEqual(['dune'])
  })
})

describe('the best result', () => {
  beforeEach(() => {
    catalog()
  })

  const marks = () => [...document.querySelectorAll('mark')].map(({ textContent }) => textContent)

  it('is the first book when its title starts with the search, in the same list', async () => {
    catalog({ id: 'OL9W', title: 'Apocalipsis zombi', authors: ['Otra'] })
    renderApp('/buscar?q=apocalipsis')
    await screen.findByText('2 libros')
    expect(screen.getByRole('heading', { name: 'Mejor resultado' })).toBeInTheDocument()
    const links = within(section('Libros')).getAllByRole('link')
    expect(links[0]).toHaveTextContent('Apocalipsis')
    expect(links[0]).toHaveTextContent('Ver ficha')
    expect(links).toHaveLength(2)
  })

  it('opens the book and remembers the search, like any other result', async () => {
    catalog({ id: 'OL9W', title: 'Apocalipsis zombi', authors: ['Otra'] })
    renderApp('/buscar?q=apocalipsis')
    await screen.findByText('2 libros')
    fireEvent.click(within(section('Libros')).getAllByRole('link')[0])
    expect(currentLocation()).toBe('/libro/OL123W')
    expect(readRecentSearches()).toEqual(['apocalipsis'])
  })

  it('says nothing about "best" when there is only one book', async () => {
    renderApp('/buscar?q=dune')
    await screen.findByText('1 libro · 1 en Mis libros')
    expect(screen.queryByRole('heading', { name: 'Mejor resultado' })).not.toBeInTheDocument()
    expect(within(section('Libros')).getByRole('link', { name: /Dune/ })).toBeInTheDocument()
  })

  it('gives a lone author the whole row up to lg, and more size only from lg', async () => {
    renderApp('/buscar?q=king')
    await screen.findByText(/en Mis libros/)
    const author = within(section('Autores')).getByRole('button', { name: /Stephen King/ })
    expect(author.closest('li')).toHaveClass('only:max-lg:col-span-full')
    const name = within(author).getByText('Stephen King')
    expect(name).toHaveClass('text-lg/[1.15]', 'lg:text-[2rem]/[1.1]')
    expect(name).not.toHaveClass('lg:text-xl/[1.15]')
  })

  it('keeps the small name in the cards of Mis libros', () => {
    renderApp('/buscar')
    const author = within(section('Autores de Mis libros')).getByRole('button', {
      name: /Stephen King/,
    })
    const name = within(author).getByText('Stephen King')
    expect(name).toHaveClass('text-lg/[1.15]', 'lg:text-xl/[1.15]')
    expect(name).not.toHaveClass('lg:text-[2rem]/[1.1]')
  })

  it('is the author when no title starts with the search', async () => {
    renderApp('/buscar?q=king')
    await screen.findByText(/en Mis libros/)
    expect(screen.queryByRole('heading', { name: 'Mejor resultado' })).not.toBeInTheDocument()
    expect(within(section('Autores')).getByRole('button', { name: /Stephen King/ })).toHaveClass(
      'lg:min-h-80',
    )
  })

  it('moves what does not fit beside it under "Más libros", still among the books', async () => {
    catalog(
      ...[1, 2, 3, 4, 5, 6].map((id) => ({
        id: `OL${id}W`,
        title: `Apocalipsis ${id}`,
        authors: ['Otra Persona'],
      })),
    )
    renderApp('/buscar?q=apocalipsis')
    await screen.findByText('7 libros')
    expect(screen.getByRole('heading', { name: 'Más libros' })).toBeInTheDocument()
    expect(section('Más libros')).toBe(section('Libros'))
    expect(within(section('Libros')).getAllByRole('link')).toHaveLength(7)
  })

  it('marks what matched, at the start of a word', async () => {
    catalog({ id: 'OL5W', title: 'King Lear', authors: ['Hawking Fan'] })
    renderApp('/buscar?q=king')
    await screen.findByText(/en Mis libros/)
    expect(marks().length).toBeGreaterThan(0)
    expect(new Set(marks())).toEqual(new Set(['King']))
  })

  it('marks nothing in the books of one author, where every row would match', async () => {
    renderApp('/buscar?q=Stephen+King')
    await screen.findByText(/en Mis libros/)
    expect(marks()).toEqual([])
  })
})

describe('without results', () => {
  beforeEach(() => {
    catalog()
  })

  it('says so and offers the authors of the library as a way out', async () => {
    renderApp('/buscar?q=zzzz')
    expect(await screen.findByText('No encontramos «zzzz»')).toBeInTheDocument()
    fireEvent.click(
      within(section('Autores de Mis libros')).getByRole('button', { name: /George Orwell/ }),
    )
    expect(currentLocation()).toBe('/buscar?q=George+Orwell')
  })

  it('separates the way out from the block above as two sections', async () => {
    renderApp('/buscar?q=zzzz')
    await screen.findByText('No encontramos «zzzz»')
    expect(section('Autores de Mis libros')).toHaveClass('mt-7', 'lg:mt-10')
  })

  it('cuts a long search, which the title cannot break', async () => {
    renderApp(`/buscar?q=${'a'.repeat(60)}`)
    expect(await screen.findByText(`No encontramos «${'a'.repeat(24)}…»`)).toBeInTheDocument()
  })
})

describe('while the catalog downloads', () => {
  function holdCatalog() {
    let deliver: (response: Response) => void = () => undefined
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise<Response>((resolve) => (deliver = resolve))),
    )
    return () => deliver(Response.json([[APOCALYPSE.id, APOCALYPSE.title, APOCALYPSE.authors]]))
  }

  it('says it is searching, and what was typed meanwhile gets its list', async () => {
    const deliver = holdCatalog()
    renderApp('/buscar')
    type('apocalipsis')
    expect(screen.getByText('Buscando…')).toBeInTheDocument()
    await act(async () => deliver())
    expect(screen.getByText('Apocalipsis')).toBeInTheDocument()
    expect(screen.queryByText('Buscando…')).not.toBeInTheDocument()
  })

  it('does not wait for it before typing', () => {
    holdCatalog()
    renderApp('/buscar')
    expect(screen.getByRole('heading', { name: 'Autores de Mis libros' })).toBeInTheDocument()
    expect(screen.queryByText('Buscando…')).not.toBeInTheDocument()
  })
})

describe('when the catalog cannot be downloaded', () => {
  it('shows an error instead of "no results", and can retry in the same place', async () => {
    stubCatalog({ failing: [/index/] })
    renderApp('/buscar?q=apocalipsis')
    const alert = await screen.findByRole('alert')
    expect(within(alert).getByText('No pudimos buscar')).toBeInTheDocument()
    expect(screen.queryByText(/No encontramos/)).not.toBeInTheDocument()

    catalog()
    fireEvent.click(within(alert).getByRole('button', { name: 'Reintentar' }))
    expect(await screen.findByText('Apocalipsis')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('says nothing before typing, and the screen stays useful', async () => {
    const files = stubCatalog({ failing: [/index/] })
    renderApp('/buscar')
    await act(async () => undefined)
    expect(files).toHaveBeenCalledOnce()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Autores de Mis libros' })).toBeInTheDocument()
  })
})
