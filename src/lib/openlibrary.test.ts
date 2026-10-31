import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useStore } from '../store'
import type { Book } from '../types'
import {
  fetchDescription,
  fetchWork,
  forgetSearches,
  matchesAuthor,
  mergeResults,
  REQUEST_TIMEOUT_MS,
  savedSearch,
  searchBooks,
  SEARCH_DELAY_MS,
} from './openlibrary'

const fetchMock = vi.fn<typeof fetch>()

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status })
}

/** Rejects like a real fetch when its signal aborts. */
function hangingFetch(_url: RequestInfo | URL, init?: RequestInit) {
  return new Promise<Response>((_resolve, reject) => {
    init?.signal?.addEventListener('abort', () => reject(new DOMException('', 'AbortError')))
  })
}

const LIVE_DOC = {
  key: '/works/OL123W',
  title: 'The Stand',
  author_name: ['Stephen King', 'Stephen King'],
  cover_i: 11,
  first_publish_year: 1978,
  number_of_pages_median: 800,
  editions: { docs: [{ title: 'Apocalipsis', cover_i: 22 }] },
}

async function search(query: string, signal = new AbortController().signal) {
  const pending = searchBooks(query, signal)
  await vi.advanceTimersByTimeAsync(SEARCH_DELAY_MS)
  return pending
}

beforeEach(() => {
  vi.useFakeTimers()
  forgetSearches()
  fetchMock.mockReset()
  vi.stubGlobal('fetch', fetchMock)
  return () => {
    vi.unstubAllGlobals()
  }
})

describe('matchesAuthor', () => {
  it.each([
    ['Stephen King', 'king', true],
    ['Stephen Hawking', 'king', false],
    ['Gabriel García Márquez', 'garcia', true],
    ['Gabriel García Márquez', 'garcia marq', true],
    ['Gabriel García Márquez', 'arcia', false],
    ['Jean-Paul Sartre', 'paul', true],
    ['Stephen King', '  ', false],
  ])('%s with "%s" is %s', (name, query, expected) => {
    expect(matchesAuthor(name, query)).toBe(expected)
  })
})

describe('mergeResults', () => {
  const book = (id: string, title: string, author: string): Book => ({
    id,
    title,
    authors: [author],
  })

  it('keeps local books first and drops a live copy, by id or by title and author', () => {
    const local = [book('OL1W', 'Cien años de soledad', 'Gabriel García Márquez')]
    const live = [
      book('OL1W', 'One Hundred Years of Solitude', 'Gabriel García Márquez'),
      book('OL2W', 'CIEN AÑOS DE SOLEDAD ', 'gabriel garcia marquez'),
      book('OL3W', 'Crónica de una muerte anunciada', 'Gabriel García Márquez'),
    ]
    expect(mergeResults(local, live).map(({ id }) => id)).toEqual(['OL1W', 'OL3W'])
  })

  it('keeps two books with the same title by different authors', () => {
    const both = [book('OL1W', 'Sombras', 'A'), book('OL2W', 'Sombras', 'B')]
    expect(mergeResults([], both)).toEqual(both)
  })
})

describe('searchBooks', () => {
  it('waits while the person types, and a new search cancels the one before', async () => {
    fetchMock.mockImplementation(async () => json({ docs: [] }))
    const first = new AbortController()
    const dropped = searchBooks('ki', first.signal)
    const rejected = expect(dropped).rejects.toMatchObject({ name: 'AbortError' })

    await vi.advanceTimersByTimeAsync(SEARCH_DELAY_MS - 1)
    first.abort()
    await rejected
    await vi.advanceTimersByTimeAsync(SEARCH_DELAY_MS)
    expect(fetchMock).not.toHaveBeenCalled()

    await search('king')
    expect(fetchMock).toHaveBeenCalledOnce()
    expect(String(fetchMock.mock.calls[0][0])).toContain('q=king')
  })

  it('asks for Spanish and uses the title and cover of the Spanish edition', async () => {
    fetchMock.mockResolvedValue(json({ docs: [LIVE_DOC] }))
    const { books, offline } = await search('apocalipsis')
    expect(String(fetchMock.mock.calls[0][0])).toContain('lang=es')
    expect(offline).toBe(false)
    expect(books).toEqual([
      {
        id: 'OL123W',
        title: 'Apocalipsis',
        authors: ['Stephen King'],
        coverUrl: 'https://covers.openlibrary.org/b/id/22-L.jpg?default=false',
        year: 1978,
        pages: 800,
      },
    ])
  })

  it('puts the catalogue first and leaves out what it already has', async () => {
    const carrie = { key: '/works/OL81626W', title: 'Carrie', author_name: ['Stephen King'] }
    fetchMock.mockResolvedValue(json({ docs: [carrie, LIVE_DOC] }))
    const { books } = await search('carrie')
    expect(books.map(({ id }) => id)).toEqual(['OL81626W', 'OL123W'])
  })

  it('skips a result with no key or title', async () => {
    fetchMock.mockResolvedValue(json({ docs: [{ title: 'Sin clave' }, { key: '/works/OL9W' }] }))
    expect((await search('zzz')).books).toEqual([])
  })

  it('falls back to the local catalogue, and says so, when the service fails', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'))
    const { books, offline } = await search('carrie')
    expect(offline).toBe(true)
    expect(books.map(({ title }) => title)).toEqual(['Carrie'])
  })

  it('does the same with a server error', async () => {
    fetchMock.mockResolvedValue(json({}, 503))
    expect((await search('carrie')).offline).toBe(true)
  })

  it('gives up on the service after 5 s', async () => {
    fetchMock.mockImplementation(hangingFetch)
    const pending = searchBooks('carrie', new AbortController().signal)
    await vi.advanceTimersByTimeAsync(SEARCH_DELAY_MS + REQUEST_TIMEOUT_MS - 1)
    expect(fetchMock.mock.calls[0][1]?.signal?.aborted).toBe(false)
    await vi.advanceTimersByTimeAsync(1)
    expect(await pending).toMatchObject({ offline: true })
  })

  it('rejects instead of falling back when the person moved on', async () => {
    fetchMock.mockImplementation(hangingFetch)
    const controller = new AbortController()
    const pending = searchBooks('carrie', controller.signal)
    const rejected = expect(pending).rejects.toMatchObject({ name: 'AbortError' })
    await vi.advanceTimersByTimeAsync(SEARCH_DELAY_MS)
    controller.abort()
    await rejected
  })

  it('finds an author by the start of a word when the service is down', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'))
    const { books } = await search('king')
    expect(books.length).toBeGreaterThan(0)
    expect(books.every(({ authors }) => authors.includes('Stephen King'))).toBe(true)
  })

  it('also finds books the person brought from the API', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'))
    useStore.getState().upsertBook({ id: 'OL5W', title: 'Un libro raro', authors: [] })
    expect((await search('libro raro')).books.map(({ id }) => id)).toEqual(['OL5W'])
  })
})

describe('searchBooks, how much there is', () => {
  it('says when Open Library has more than it sent', async () => {
    fetchMock.mockResolvedValue(json({ numFound: 295526, docs: [LIVE_DOC] }))
    expect((await search('king')).more).toBe(true)
  })

  it('says nothing when that is all there is', async () => {
    fetchMock.mockResolvedValue(json({ numFound: 1, docs: [LIVE_DOC] }))
    expect((await search('apocalipsis')).more).toBe(false)
  })

  it('does not promise more when the service is down', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'))
    expect((await search('carrie')).more).toBe(false)
  })
})

describe('saved answers', () => {
  it('keeps an answer, to give it back with no waiting', async () => {
    fetchMock.mockResolvedValue(json({ docs: [LIVE_DOC] }))
    const answer = await search('apocalipsis')
    expect(savedSearch('apocalipsis')).toEqual(answer)
    expect(savedSearch('otra')).toBeUndefined()
  })

  it('keeps an empty answer, which is an answer too', async () => {
    fetchMock.mockResolvedValue(json({ docs: [] }))
    await search('zzzz')
    expect(savedSearch('zzzz')?.books).toEqual([])
  })

  it('does not keep a search that failed, so trying again really tries', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'))
    await search('carrie')
    expect(savedSearch('carrie')).toBeUndefined()
  })

  it('drops the oldest one when there are too many', async () => {
    fetchMock.mockImplementation(async () => json({ docs: [] }))
    for (let index = 0; index <= 30; index += 1) await search(`busqueda ${index}`)
    expect(savedSearch('busqueda 0')).toBeUndefined()
    expect(savedSearch('busqueda 1')).toBeDefined()
    expect(savedSearch('busqueda 30')).toBeDefined()
  })

  it('forgets them all', async () => {
    fetchMock.mockImplementation(async () => json({ docs: [] }))
    await search('dune')
    forgetSearches()
    expect(savedSearch('dune')).toBeUndefined()
  })
})

describe('fetchDescription', () => {
  it('reads the text of the work, and asks for nothing else', async () => {
    fetchMock.mockResolvedValue(json({ description: { value: 'Una gripe.' } }))
    await expect(fetchDescription('OL9W')).resolves.toBe('Una gripe.')
    expect(fetchMock).toHaveBeenCalledOnce()
    expect(String(fetchMock.mock.calls[0][0])).toContain('/works/OL9W.json')
  })

  it('resolves to nothing when the work has none', async () => {
    fetchMock.mockResolvedValue(json({ title: 'Sin texto' }))
    await expect(fetchDescription('OL9W')).resolves.toBeUndefined()
  })

  it('resolves to nothing when the work does not exist', async () => {
    fetchMock.mockResolvedValue(json({}, 404))
    await expect(fetchDescription('OL9W')).resolves.toBeUndefined()
  })

  it('rejects when it cannot answer', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'))
    await expect(fetchDescription('OL9W')).rejects.toThrow('Failed to fetch')
  })
})

describe('fetchWork', () => {
  const WORK = {
    title: 'Apocalipsis',
    description: { value: 'Una gripe acaba con casi todos.' },
    covers: [-1, 33],
    first_publish_date: 'January 1978',
    authors: [{ author: { key: '/authors/OL1A' } }, { author: { key: '/authors/OL2A' } }],
  }

  function answerWith(routes: Record<string, () => Response | Promise<Response>>) {
    fetchMock.mockImplementation(async (url) => {
      const answer = routes[new URL(String(url)).pathname]
      return answer ? answer() : json({}, 404)
    })
  }

  it('builds the book from the work and its authors', async () => {
    answerWith({
      '/works/OL9W.json': () => json(WORK),
      '/authors/OL1A.json': () => json({ name: 'Stephen King' }),
      '/authors/OL2A.json': () => json({ name: 'Bernie Wrightson' }),
    })
    await expect(fetchWork('OL9W')).resolves.toEqual({
      id: 'OL9W',
      title: 'Apocalipsis',
      authors: ['Stephen King', 'Bernie Wrightson'],
      coverUrl: 'https://covers.openlibrary.org/b/id/33-L.jpg?default=false',
      description: 'Una gripe acaba con casi todos.',
      year: 1978,
    })
  })

  it('reads a description that comes as plain text', async () => {
    answerWith({ '/works/OL9W.json': () => json({ title: 'A', description: 'Texto' }) })
    await expect(fetchWork('OL9W')).resolves.toMatchObject({ description: 'Texto', authors: [] })
  })

  it('marks a work with no description as already asked', async () => {
    answerWith({ '/works/OL9W.json': () => json({ title: 'A' }) })
    await expect(fetchWork('OL9W')).resolves.toMatchObject({ description: '' })
  })

  it('keeps the book when an author does not load', async () => {
    answerWith({
      '/works/OL9W.json': () => json(WORK),
      '/authors/OL1A.json': () => Promise.reject(new TypeError('Failed to fetch')),
      '/authors/OL2A.json': () => json({ name: 'Bernie Wrightson' }),
    })
    await expect(fetchWork('OL9W')).resolves.toMatchObject({ authors: ['Bernie Wrightson'] })
  })

  it('resolves to null when the work does not exist', async () => {
    answerWith({})
    await expect(fetchWork('OL9W')).resolves.toBeNull()
  })

  it('does not ask for an id that cannot be a work', async () => {
    await expect(fetchWork('constructor')).resolves.toBeNull()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('rejects on a network failure, so the page can offer to retry', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'))
    await expect(fetchWork('OL9W')).rejects.toThrow('Failed to fetch')
  })

  it('rejects after 5 s without an answer', async () => {
    fetchMock.mockImplementation(hangingFetch)
    const rejected = expect(fetchWork('OL9W')).rejects.toMatchObject({ name: 'AbortError' })
    await vi.advanceTimersByTimeAsync(REQUEST_TIMEOUT_MS)
    await rejected
  })
})
