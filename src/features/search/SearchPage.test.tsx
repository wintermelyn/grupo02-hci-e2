import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useStore } from '../../store'
import { currentLocation, renderApp } from '../../test/router'
import { readRecentSearches } from './recentSearchStore'

const fetchMock = vi.fn<typeof fetch>()

/** Open Library answers with these documents. */
function answerWith(...docs: object[]) {
  fetchMock.mockImplementation(async () => new Response(JSON.stringify({ docs })))
}

function failNetwork() {
  fetchMock.mockRejectedValue(new TypeError('Failed to fetch'))
}

const search = () => screen.getByRole('searchbox', { name: 'Buscar libros y autores' })
const type = (text: string) => fireEvent.change(search(), { target: { value: text } })
const section = (name: string) => screen.getByRole('heading', { name }).closest('section')!

const APOCALYPSE = {
  key: '/works/OL123W',
  title: 'Apocalipsis',
  author_name: ['Stephen King'],
}

beforeEach(() => {
  localStorage.clear()
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
    expect(
      within(section('Autores de tu biblioteca')).getByText('Stephen King'),
    ).toBeInTheDocument()
    expect(within(section('Autores de tu biblioteca')).getByText('4 libros')).toBeInTheDocument()
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

  it('sends a person who looks for someone to Amigos', () => {
    renderApp('/buscar')
    expect(screen.getByRole('link', { name: 'Amigos' })).toHaveAttribute('href', '/amigos')
  })
})

describe('with results', () => {
  it('shows loading, then how many there are and how many the person has', async () => {
    answerWith(APOCALYPSE)
    renderApp('/buscar')
    type('carrie')
    expect(screen.getByText('Buscando…')).toBeInTheDocument()
    expect(await screen.findByText('2 libros · 1 en tu biblioteca')).toBeInTheDocument()
    expect(currentLocation()).toBe('/buscar?q=carrie')
  })

  it('separates authors and books, and tapping an author filters their books', async () => {
    answerWith(APOCALYPSE, { key: '/works/OL5W', title: 'King Lear', author_name: ['Shakespeare'] })
    renderApp('/buscar?q=king')
    const authors = await screen.findByRole('heading', { name: 'Autores' })
    const list = within(authors.closest('section')!)
    expect(list.getByText('5 libros')).toBeInTheDocument()
    expect(within(section('Libros')).getByText('King Lear')).toBeInTheDocument()

    fireEvent.click(list.getByRole('button', { name: /Stephen King/ }))
    expect(currentLocation()).toBe('/buscar?q=Stephen+King')
    await screen.findByText('Apocalipsis')
    expect(screen.queryByText('King Lear')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Autores' })).not.toBeInTheDocument()
    expect(readRecentSearches()).toEqual(['Stephen King'])
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

describe('without results', () => {
  it('says so and offers the authors of the library as a way out', async () => {
    renderApp('/buscar?q=zzzz')
    expect(await screen.findByText('No encontramos «zzzz»')).toBeInTheDocument()
    fireEvent.click(
      within(section('Autores de tu biblioteca')).getByRole('button', { name: /George Orwell/ }),
    )
    expect(currentLocation()).toBe('/buscar?q=George+Orwell')
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
