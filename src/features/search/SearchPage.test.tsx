import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter, Routes, useNavigate } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { forgetSearches } from '../../lib/openlibrary'
import { appRoutes } from '../../routes'
import { useStore } from '../../store'
import { CurrentLocation } from '../../test/CurrentLocation'
import { currentLocation, renderApp } from '../../test/router'
import { readRecentSearches } from './recentSearchStore'

const fetchMock = vi.fn<typeof fetch>()

/** Open Library answers with these documents. */
function answerWith(...docs: object[]) {
  fetchMock.mockImplementation(async () => new Response(JSON.stringify({ docs })))
}

/** Open Library says it has `numFound` books and sends these documents. */
function answerPage(numFound: number, ...docs: object[]) {
  fetchMock.mockImplementation(async () => new Response(JSON.stringify({ numFound, docs })))
}

/** Leaves the answers pending, and hands back how to deliver them. */
function holdAnswers() {
  const pending: ((response: Response) => void)[] = []
  fetchMock.mockImplementation(() => new Promise((resolve) => pending.push(resolve)))
  return (...docs: object[]) => {
    pending.forEach((resolve) => resolve(new Response(JSON.stringify({ docs }))))
  }
}

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

function failNetwork() {
  fetchMock.mockRejectedValue(new TypeError('Failed to fetch'))
}

/** How many times it asked for a search, apart from what a book page asks for. */
const searches = () =>
  fetchMock.mock.calls.filter(([url]) => String(url).includes('/search.json')).length

const search = () => screen.getByRole('searchbox', { name: 'Buscar libros y autores' })
const type = (text: string) => fireEvent.change(search(), { target: { value: text } })
const section = (name: string) => screen.getByRole('heading', { name }).closest('section')!
const earlierBooks = () => screen.queryByRole('heading', { name: 'De tu búsqueda anterior' })

/** What takes height over the books on a phone, where the list shows four. jsdom has no layout. */
const authorRowsOnAPhone = () =>
  Math.min(within(section('Autores')).getAllByRole('listitem', { hidden: true }).length, 4)

const APOCALYPSE = {
  key: '/works/OL123W',
  title: 'Apocalipsis',
  author_name: ['Stephen King'],
}

/** A work by someone else whose name also matches "king". */
const byOtherKing = (id: number, name: string) => ({
  key: `/works/OL${id}W`,
  title: `Obra ${id}`,
  author_name: [name],
})

beforeEach(() => {
  localStorage.clear()
  forgetSearches()
  fetchMock.mockReset()
  answerWith()
  vi.stubGlobal('fetch', fetchMock)
  return () => {
    vi.unstubAllGlobals()
  }
})

describe('before typing', () => {
  it('shows the authors of the library and what friends read, and no recent searches', () => {
    renderApp('/buscar')
    expect(within(section('Autores de Mis libros')).getByText('Stephen King')).toBeInTheDocument()
    expect(within(section('Autores de Mis libros')).getByText('4 libros')).toBeInTheDocument()
    expect(within(section('Lo que leen tus amigos')).getByText('Dune')).toBeInTheDocument()
    expect(screen.queryByText('Búsquedas recientes')).not.toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('leaves out what friends only want to read', () => {
    renderApp('/buscar')
    expect(
      within(section('Lo que leen tus amigos')).queryByText('Las venas abiertas de América Latina'),
    ).not.toBeInTheDocument()
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

  it('does not hint that people are found elsewhere, which a question of the evaluation asks', () => {
    renderApp('/buscar')
    expect(screen.queryByText(/Buscas a una persona/)).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Amigos' })).not.toBeInTheDocument()
  })

  it('says which friend read each book', () => {
    renderApp('/buscar')
    const shelf = within(section('Lo que leen tus amigos'))
    const dune = shelf.getByRole('link', { name: /Dune/ })
    expect(dune).toHaveTextContent('Diego')
  })
})

describe('with results', () => {
  it('shows what the app has at once, then how many there are and how many the person has', async () => {
    answerWith(APOCALYPSE)
    renderApp('/buscar')
    type('carrie')
    expect(screen.getByRole('link', { name: /Carrie/ })).toBeInTheDocument()
    expect(screen.getByText('Buscando más…')).toBeInTheDocument()
    expect(await screen.findByText('2 libros · 1 en Mis libros')).toBeInTheDocument()
    expect(screen.queryByText('Buscando más…')).not.toBeInTheDocument()
    expect(currentLocation()).toBe('/buscar?q=carrie')
  })

  it('shows a loading list only when the app has nothing to show yet', async () => {
    answerWith(APOCALYPSE)
    renderApp('/buscar')
    type('apocalipsis')
    expect(screen.getByText('Buscando…')).toBeInTheDocument()
    expect(await screen.findByText('Apocalipsis')).toBeInTheDocument()
    expect(screen.queryByText('Buscando…')).not.toBeInTheDocument()
  })

  it('adds what arrives after what is on the screen, without moving it', async () => {
    const deliver = holdAnswers()
    renderApp('/buscar?q=carrie')
    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce())
    deliver(APOCALYPSE)
    await screen.findByText('Apocalipsis')
    const titles = within(section('Libros')).getAllByRole('link')
    expect(titles.map(({ textContent }) => textContent)).toEqual([
      expect.stringContaining('Carrie'),
      expect.stringContaining('Apocalipsis'),
    ])
  })

  it('keeps the place of the authors that can still arrive, so the books do not move', async () => {
    const deliver = holdAnswers()
    renderApp('/buscar?q=king')
    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce())
    const firstBook = within(section('Libros')).getAllByRole('link')[0]
    expect(within(section('Autores')).getAllByRole('button')).toHaveLength(1)
    expect(authorRowsOnAPhone()).toBe(4)

    deliver(
      byOtherKing(1, 'Martin Luther King'),
      byOtherKing(2, 'Billie Jean King'),
      byOtherKing(3, 'Coretta Scott King'),
    )
    await screen.findByText(/en Mis libros/)
    expect(within(section('Autores')).getAllByRole('button')).toHaveLength(4)
    expect(authorRowsOnAPhone()).toBe(4)
    expect(within(section('Libros')).getAllByRole('link')[0]).toBe(firstBook)
  })

  it('frees the place that no author took', async () => {
    const deliver = holdAnswers()
    renderApp('/buscar?q=king')
    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce())
    deliver()
    await screen.findByText(/en Mis libros/)
    expect(authorRowsOnAPhone()).toBe(1)
  })

  it('reserves nothing for authors when none matched yet', async () => {
    const deliver = holdAnswers()
    renderApp('/buscar?q=carrie')
    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce())
    expect(screen.queryByRole('heading', { name: 'Autores' })).not.toBeInTheDocument()
    deliver()
  })

  it('keeps the list of a search that goes on, dimmed and apart from what matches', async () => {
    answerWith(APOCALYPSE)
    renderApp('/buscar?q=apocalipsis')
    await screen.findByText('Apocalipsis')

    const deliver = holdAnswers()
    type('apocalipsiss')
    expect(earlierBooks()?.parentElement).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByText('Apocalipsis').closest('.opacity-70')).toBeInTheDocument()
    expect(screen.getByText('Buscando…', { selector: 'p' })).toBeInTheDocument()

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))
    deliver()
    expect(await screen.findByText('No encontramos «apocalipsiss»')).toBeInTheDocument()
    expect(screen.queryByText('Apocalipsis')).not.toBeInTheDocument()
  })

  it('does not take a book kept from the search before for one of this search', async () => {
    answerWith(APOCALYPSE)
    renderApp('/buscar?q=apocalipsis')
    await screen.findByText('Apocalipsis')

    holdAnswers()
    type('apocalipsiss')
    fireEvent.click(screen.getByRole('link', { name: /Apocalipsis/ }))
    expect(currentLocation()).toBe('/libro/OL123W')
    expect(readRecentSearches()).toEqual([])
  })

  it.each([
    ['dune', /Dune/],
    ['qqqzzz', undefined],
  ])('drops the list when "%s" is another search, not more of it', async (next, local) => {
    answerWith(APOCALYPSE)
    renderApp('/buscar?q=king')
    await screen.findByText('Apocalipsis')

    holdAnswers()
    type(next)
    expect(screen.queryByText('Apocalipsis')).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Carrie/ })).not.toBeInTheDocument()
    expect(earlierBooks()).not.toBeInTheDocument()
    if (local) expect(screen.getByRole('link', { name: local })).toBeInTheDocument()
    else expect(screen.getByText('Buscando…')).toBeInTheDocument()
  })

  it('does not dim what still matches, like the books of the author just tapped', async () => {
    answerWith(APOCALYPSE)
    renderApp('/buscar?q=king')
    await screen.findByText('Apocalipsis')

    holdAnswers()
    fireEvent.click(screen.getByRole('button', { name: /Stephen King/ }))
    expect(screen.getByText('Apocalipsis')).toBeInTheDocument()
    expect(earlierBooks()).not.toBeInTheDocument()
  })

  it('does not carry a search that was cleared into the next one', async () => {
    answerWith(APOCALYPSE)
    renderApp('/buscar?q=apocalipsis')
    await screen.findByText('Apocalipsis')
    type('')
    holdAnswers()
    type('dune')
    expect(screen.queryByText('Apocalipsis')).not.toBeInTheDocument()
  })

  it('comes back from a book with its list, in its place and without asking again', async () => {
    answerWith(APOCALYPSE)
    renderApp('/buscar?q=apocalipsis')
    fireEvent.click(await screen.findByRole('link', { name: /Apocalipsis/ }))
    document.documentElement.scrollTop = 0

    fireEvent.click(screen.getByRole('link', { name: 'Volver' }))
    expect(screen.getByRole('link', { name: /Apocalipsis/ })).toBeInTheDocument()
    expect(screen.queryByText('Buscando más…')).not.toBeInTheDocument()
    expect(searches()).toBe(1)
  })

  it('does not lose on the way back what the book page found', async () => {
    answerWith(APOCALYPSE)
    renderApp('/buscar?q=apocalipsis')
    fireEvent.click(await screen.findByRole('link', { name: /Apocalipsis/ }))
    await waitFor(() => expect(useStore.getState().extraBooks.OL123W.description).toBe(''))

    fireEvent.click(screen.getByRole('link', { name: 'Volver' }))
    fireEvent.click(screen.getByRole('link', { name: /Apocalipsis/ }))
    expect(useStore.getState().extraBooks.OL123W.description).toBe('')
  })

  it('says when the list is only the most relevant of many', async () => {
    answerPage(295526, APOCALYPSE)
    renderApp('/buscar?q=apocalipsis')
    expect(await screen.findByText('El más relevante')).toBeInTheDocument()
  })

  it('leaves out of the authors an amount that would only be the one of this page', async () => {
    answerPage(295526, APOCALYPSE)
    renderApp('/buscar?q=king')
    await screen.findByText('Los 5 más relevantes · 4 en Mis libros')
    const authors = within(section('Autores'))
    expect(authors.getByRole('button', { name: /Stephen King/ })).toBeInTheDocument()
    expect(authors.queryByText(/\d libros?/)).not.toBeInTheDocument()
  })

  it('separates authors and books, and tapping an author filters their books', async () => {
    answerWith(APOCALYPSE, { key: '/works/OL5W', title: 'King Lear', author_name: ['Shakespeare'] })
    renderApp('/buscar?q=king')
    // By role: the match is marked, so the title is no longer one text node.
    expect(await within(section('Libros')).findByRole('link', { name: /King Lear/ })).toBeVisible()
    const list = within(section('Autores'))

    fireEvent.click(list.getByRole('button', { name: /Stephen King/ }))
    expect(currentLocation()).toBe('/buscar?q=Stephen+King')
    await screen.findByText('Apocalipsis')
    expect(screen.queryByRole('link', { name: /King Lear/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Autores' })).not.toBeInTheDocument()
    expect(readRecentSearches()).toEqual(['Stephen King'])
  })

  it('filters at once and moves the focus to the books, as the button is gone', async () => {
    answerWith(APOCALYPSE)
    renderApp('/buscar?q=king')
    await screen.findByText('Apocalipsis')
    fireEvent.click(screen.getByRole('button', { name: /Stephen King/ }))
    expect(screen.getByRole('heading', { name: 'Libros' })).toHaveFocus()
    expect(screen.getByText('Apocalipsis')).toBeInTheDocument()
    expect(await screen.findByText(/en Mis libros/)).toBeInTheDocument()
  })

  it('takes Back from an author to the search it was found in, not out of Buscar', async () => {
    answerWith(APOCALYPSE)
    renderAfterMas('/buscar?q=king')
    await screen.findByText('Apocalipsis')
    fireEvent.click(screen.getByRole('button', { name: /Stephen King/ }))
    expect(currentLocation()).toBe('/buscar?q=Stephen+King')

    fireEvent.click(screen.getByRole('button', { name: 'Atrás' }))
    expect(currentLocation()).toBe('/buscar?q=king')
    expect(await screen.findByRole('heading', { name: 'Autores' })).toBeInTheDocument()
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

  it('remembers a search when a book of it is opened, and adds the book', async () => {
    answerWith(APOCALYPSE)
    renderApp('/buscar?q=apocalipsis')
    fireEvent.click(await screen.findByRole('link', { name: /Apocalipsis/ }))
    expect(currentLocation()).toBe('/libro/OL123W')
    expect(useStore.getState().extraBooks.OL123W).toBeDefined()
    expect(readRecentSearches()).toEqual(['apocalipsis'])
  })

  it('remembers a search on Enter', async () => {
    renderApp('/buscar?q=dune')
    await screen.findByRole('heading', { name: 'Libros' })
    fireEvent.keyDown(search(), { key: 'Enter' })
    expect(readRecentSearches()).toEqual(['dune'])
  })

  it('shows only the answer to the last thing typed', async () => {
    let answerFirst: (response: Response) => void = () => undefined
    fetchMock.mockReturnValueOnce(
      new Promise((resolve) => {
        answerFirst = resolve
      }),
    )
    renderApp('/buscar?q=dune')
    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce())

    answerWith(APOCALYPSE)
    type('apocalipsis')
    await screen.findByText('Apocalipsis')
    answerFirst(new Response(JSON.stringify({ docs: [{ key: '/works/OL1W', title: 'Tarde' }] })))
    await waitFor(() => expect(screen.queryByText('Tarde')).not.toBeInTheDocument())
    expect(screen.getByText('Apocalipsis')).toBeInTheDocument()
  })
})

describe('the best result', () => {
  const marks = () => [...document.querySelectorAll('mark')].map(({ textContent }) => textContent)

  it('is the first book when its title starts with the search, in the same list', async () => {
    answerWith(APOCALYPSE, { key: '/works/OL9W', title: 'Otra novela', author_name: ['Otra'] })
    renderApp('/buscar?q=apocalipsis')
    await screen.findByText('2 libros')
    expect(screen.getByRole('heading', { name: 'Mejor resultado' })).toBeInTheDocument()
    const links = within(section('Libros')).getAllByRole('link')
    expect(links[0]).toHaveTextContent('Apocalipsis')
    expect(links[0]).toHaveTextContent('Ver ficha')
    expect(links).toHaveLength(2)
  })

  it('opens the book and remembers the search, like any other result', async () => {
    answerWith(APOCALYPSE, { key: '/works/OL9W', title: 'Otra novela', author_name: ['Otra'] })
    renderApp('/buscar?q=apocalipsis')
    await screen.findByText('2 libros')
    fireEvent.click(within(section('Libros')).getAllByRole('link')[0])
    expect(currentLocation()).toBe('/libro/OL123W')
    expect(useStore.getState().extraBooks.OL123W).toBeDefined()
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

  it('counts the books of an author when the list is complete, and not while it can grow', async () => {
    const deliver = holdAnswers()
    renderApp('/buscar?q=king')
    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce())
    expect(within(section('Autores')).queryByText('4 libros')).not.toBeInTheDocument()
    deliver()
    expect(await within(section('Autores')).findByText('4 libros')).toBeInTheDocument()
  })

  it('moves what does not fit beside it under "Más libros", still among the books', async () => {
    const others = [1, 2, 3, 4, 5, 6, 7].map((id) => byOtherKing(id, 'Otra Persona'))
    answerWith(...others.map((doc) => ({ ...doc, title: `Apocalipsis ${doc.title}` })))
    renderApp('/buscar?q=apocalipsis')
    await screen.findByText('7 libros')
    expect(screen.getByRole('heading', { name: 'Más libros' })).toBeInTheDocument()
    expect(section('Más libros')).toBe(section('Libros'))
    expect(within(section('Libros')).getAllByRole('link')).toHaveLength(7)
  })

  it('marks what matched, at the start of a word', async () => {
    answerWith({ key: '/works/OL5W', title: 'The Shining', author_name: ['Hawking Fan'] })
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

describe('when Open Library fails', () => {
  it('shows the local catalogue, says so, and can retry', async () => {
    failNetwork()
    renderApp('/buscar?q=carrie')
    expect(await screen.findByText(/No pudimos conectar/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Carrie/ })).toBeInTheDocument()

    answerWith(APOCALYPSE)
    fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }))
    expect(await screen.findByText('Apocalipsis')).toBeInTheDocument()
    expect(screen.queryByText(/No pudimos conectar/)).not.toBeInTheDocument()
  })

  it('shows an error instead of "no results" when the catalogue has nothing either', async () => {
    failNetwork()
    renderApp('/buscar?q=zzzz')
    const alert = await screen.findByRole('alert')
    expect(within(alert).getByText('No pudimos buscar')).toBeInTheDocument()
    expect(screen.queryByText(/No encontramos/)).not.toBeInTheDocument()

    answerWith(APOCALYPSE)
    fireEvent.click(within(alert).getByRole('button', { name: 'Reintentar' }))
    expect(await screen.findByText('Apocalipsis')).toBeInTheDocument()
  })
})
