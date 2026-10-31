import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { stubCatalog } from '../test/catalog'
import {
  DESCRIPTION_GROUPS,
  descriptionGroup,
  isWorkId,
  useCatalog,
  useCatalogBook,
  useDescription,
} from './catalog'

const settle = () => act(async () => undefined)

describe('useCatalog', () => {
  it('turns the rows of the index into books, with their cover and no empty fields', async () => {
    stubCatalog({ books: [{ id: 'OL1W', title: 'Uno', authors: ['Ana'], year: 1999, pages: 10 }] })
    const { result } = renderHook(() => useCatalog())
    expect(result.current.status).toBe('loading')
    await settle()
    expect(result.current.status).toBe('ready')
    expect(result.current.books).toEqual([
      {
        id: 'OL1W',
        title: 'Uno',
        authors: ['Ana'],
        coverUrl: '/covers/OL1W.jpg',
        year: 1999,
        pages: 10,
      },
    ])
  })

  it('keeps the order of the file', async () => {
    stubCatalog({ books: [{ id: 'OL2W' }, { id: 'OL1W' }] })
    const { result } = renderHook(() => useCatalog())
    await settle()
    expect(result.current.books.map(({ id }) => id)).toEqual(['OL2W', 'OL1W'])
  })

  it('brings the colour of the cover, when it has one', async () => {
    stubCatalog({ books: [{ id: 'OL1W', coverColor: 'a1b2c3' }] })
    const { result } = renderHook(() => useCatalog())
    await settle()
    expect(result.current.books[0].coverColor).toBe('a1b2c3')
  })

  it('downloads it once, however many things ask for it', async () => {
    const files = stubCatalog()
    renderHook(() => [useCatalog(), useCatalog()])
    await settle()
    renderHook(() => useCatalog())
    await settle()
    expect(files).toHaveBeenCalledOnce()
  })

  it('asks for nothing when it is off', () => {
    const files = stubCatalog()
    const { result } = renderHook(() => useCatalog({ off: true }))
    expect(result.current.status).toBe('ready')
    expect(files).not.toHaveBeenCalled()
  })

  it('fails with a file that is not there, and tries again on request', async () => {
    const files = stubCatalog({ failing: [/index/] })
    const { result } = renderHook(() => useCatalog())
    await settle()
    expect(result.current.status).toBe('failed')
    expect(files).toHaveBeenCalledOnce()

    stubCatalog({ books: [{ id: 'OL1W' }] })
    act(() => result.current.retry())
    expect(result.current.status).toBe('loading')
    await settle()
    expect(result.current.books).toHaveLength(1)
  })

  it.each([
    ['an error from the server', new Response('', { status: 500 })],
    ['the page of the app instead of the file', new Response('<!doctype html>')],
  ])('takes %s for a failure', async (_, response) => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => response),
    )
    const { result } = renderHook(() => useCatalog())
    await settle()
    expect(result.current.status).toBe('failed')
  })
})

describe('useCatalogBook', () => {
  it('finds nothing and asks for nothing until the catalog is there', async () => {
    const files = stubCatalog({ books: [{ id: 'OL1W' }] })
    const book = renderHook(() => useCatalogBook('OL1W'))
    expect(book.result.current).toBeUndefined()
    expect(files).not.toHaveBeenCalled()

    renderHook(() => useCatalog())
    await settle()
    expect(book.result.current?.id).toBe('OL1W')
  })

  it('finds nothing for a book that is not in it', async () => {
    stubCatalog({ books: [{ id: 'OL1W' }] })
    renderHook(() => useCatalog())
    await settle()
    expect(renderHook(() => useCatalogBook('OL2W')).result.current).toBeUndefined()
  })
})

describe('useDescription', () => {
  const texts = { OL16W: { description: 'Texto', descriptionTranslated: true } }

  it('downloads the file of the group of the book and finds its text there', async () => {
    const files = stubCatalog({ texts })
    const { result } = renderHook(() => useDescription('OL16W'))
    expect(result.current.status).toBe('loading')
    await settle()
    expect(result.current).toMatchObject({ status: 'ready', text: texts.OL16W })
    expect(files.mock.calls[0][0]).toBe(`/catalog/descriptions/${16 % DESCRIPTION_GROUPS}.json`)
  })

  it('shares the download with every book of the group', async () => {
    const files = stubCatalog({ texts })
    const other = `OL${16 + DESCRIPTION_GROUPS}W`
    renderHook(() => useDescription('OL16W'))
    await settle()
    const { result } = renderHook(() => useDescription(other))
    expect(result.current.status).toBe('ready')
    expect(result.current.text).toBeUndefined()
    expect(files).toHaveBeenCalledOnce()
  })

  it('asks for nothing without a book', () => {
    const files = stubCatalog()
    expect(renderHook(() => useDescription(undefined)).result.current.status).toBe('ready')
    expect(files).not.toHaveBeenCalled()
  })

  it('follows the book when it changes', async () => {
    stubCatalog({ texts })
    const { result, rerender } = renderHook(({ id }) => useDescription(id), {
      initialProps: { id: 'OL16W' },
    })
    await settle()
    rerender({ id: 'OL17W' })
    expect(result.current.status).toBe('loading')
    expect(result.current.text).toBeUndefined()
    await settle()
  })
})

describe('ids', () => {
  it('tells what can be a book', () => {
    expect(isWorkId('OL45804W')).toBe(true)
    expect(isWorkId('constructor')).toBe(false)
    expect(isWorkId('OL45804M')).toBe(false)
  })

  it('works out the group from the id alone', () => {
    expect(descriptionGroup('OL45804W')).toBe(45804 % DESCRIPTION_GROUPS)
  })
})
