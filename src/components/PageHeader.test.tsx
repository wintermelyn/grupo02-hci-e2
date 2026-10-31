import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithRouter } from '../test/router'
import { Button } from './Button'
import { PageHeader } from './PageHeader'

const wordmark = () => screen.getByText('Goodreads')
const header = () => screen.getByRole('banner')

describe('PageHeader', () => {
  it('shows the product name next to the title of a section', () => {
    renderWithRouter(<PageHeader title="Mis libros" />)
    expect(wordmark()).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'Mis libros' })).toBeInTheDocument()
  })

  it('keeps the product name in the row of the title when asked to, even with an action', () => {
    renderWithRouter(
      <PageHeader title="Mis libros" action={<Button compact>Buscar</Button>} wordmarkBeside />,
    )
    const row = screen.getByRole('heading', { level: 1 }).parentElement?.parentElement
      ?.parentElement
    expect(row).toContainElement(wordmark())
    expect(row).toContainElement(screen.getByRole('button', { name: 'Buscar' }))
  })

  it('puts the media before the title', () => {
    renderWithRouter(<PageHeader title="Camila Torres" media={<span>CT</span>} />)
    const media = screen.getByText('CT')
    const title = screen.getByRole('heading', { level: 1 })
    expect(media.compareDocumentPosition(title)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
  })

  // jsdom has no layout. Without this class, the margin of a child ends up outside the header.
  it('holds the margin of what it carries inside the header', () => {
    renderWithRouter(
      <PageHeader title="Amigos">
        <div className="mb-4">Campo</div>
      </PageHeader>,
    )
    expect(header()).toHaveClass('flow-root')
  })

  it('has nothing behind the title, which leads with its own size', () => {
    renderWithRouter(<PageHeader title="Mis libros" />)
    expect(header().className).not.toMatch(/bg-|full-bleed/)
    expect(screen.getByRole('heading', { level: 1 })).toHaveClass('page-title')
  })

  it('shows the product name only under lg, where there is no sidebar', () => {
    renderWithRouter(<PageHeader title="Mis libros" />)
    expect(wordmark().parentElement).toHaveClass('lg:hidden')
    expect(screen.getByText('prototipo')).toBeInTheDocument()
  })

  it('leaves no empty row from lg when only the product name goes above the title', () => {
    renderWithRouter(<PageHeader title="Terror" action={<Button>Opciones</Button>} />)
    expect(wordmark().parentElement?.parentElement).toHaveClass('lg:hidden')
  })

  it('keeps that row from lg when it also carries the way back', () => {
    renderWithRouter(<PageHeader title="Terror" backTo="/biblioteca" backLabel="Mis libros" />)
    expect(wordmark().parentElement?.parentElement).not.toHaveClass('lg:hidden')
  })

  it('stacks the product name when it shares the row with a title and an action', () => {
    renderWithRouter(
      <PageHeader title="Mis libros" action={<Button compact>Buscar</Button>} wordmarkBeside />,
    )
    expect(wordmark().parentElement).toHaveClass('flex-col')
  })

  it('lets an action cover the row of the title', () => {
    renderWithRouter(<PageHeader title="Terror" action={<Button>Buscar</Button>} />)
    const row = screen.getByRole('button', { name: 'Buscar' }).parentElement?.parentElement
    expect(row).toContainElement(screen.getByRole('heading', { level: 1 }))
    expect(row).toHaveClass('relative')
  })

  it('keeps the product name when there is an action, which goes with the title', () => {
    renderWithRouter(<PageHeader title="Terror" action={<Button>Opciones</Button>} />)
    expect(wordmark()).toBeInTheDocument()
    expect(within(header()).getByRole('button', { name: 'Opciones' })).toBeInTheDocument()
  })

  it('keeps the product name with a back link and an action, as on a phone-sized folder', () => {
    renderWithRouter(
      <PageHeader
        title="Terror"
        backTo="/biblioteca"
        backLabel="Mis libros"
        action={<Button>Opciones</Button>}
      />,
    )
    expect(wordmark()).toBeInTheDocument()
    expect(within(header()).getByRole('link', { name: 'Mis libros' })).toHaveAttribute(
      'href',
      '/biblioteca',
    )
    expect(within(header()).getByRole('button', { name: 'Opciones' })).toBeInTheDocument()
  })
})
