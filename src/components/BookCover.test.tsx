import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BookCover } from './BookCover'

const book = { id: 'OL1W', title: 'El libro', coverUrl: '/covers/OL1W.jpg' }
const ribbonOf = (container: HTMLElement) => container.querySelector('.ribbon')

describe('BookCover', () => {
  it('falls back to the initials when the image fails', () => {
    const { container } = render(<BookCover book={book} />)
    fireEvent.error(container.querySelector('img') as HTMLImageElement)
    expect(container.querySelector('img')).not.toBeInTheDocument()
    expect(container).toHaveTextContent('EL')
  })

  it('takes the real shape of a large cover once it loads', () => {
    const { container } = render(<BookCover book={book} size="lg" />)
    const image = container.querySelector('img') as HTMLImageElement
    Object.defineProperties(image, {
      naturalWidth: { value: 200 },
      naturalHeight: { value: 400 },
    })
    fireEvent.load(image)
    expect(image.parentElement).toHaveStyle({ aspectRatio: '0.5', width: '75%' })
  })

  it('shows no ribbon for a book without a status', () => {
    const { container } = render(<BookCover book={book} />)
    expect(ribbonOf(container)).not.toBeInTheDocument()
  })

  it('shows the ribbon of the status, without animating it on load', () => {
    const { container } = render(<BookCover book={book} status="reading" />)
    expect(ribbonOf(container)).toHaveClass('bg-reading')
    expect(ribbonOf(container)).not.toHaveClass('animate-ribbon-in')
  })

  it('animates the new ribbon only when the status changes', () => {
    const { container, rerender } = render(<BookCover book={book} status="reading" />)
    rerender(<BookCover book={book} status="read" />)
    expect(ribbonOf(container)).toHaveClass('bg-read', 'animate-ribbon-in')
  })
})
