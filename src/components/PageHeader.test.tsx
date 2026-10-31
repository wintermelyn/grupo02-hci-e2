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
