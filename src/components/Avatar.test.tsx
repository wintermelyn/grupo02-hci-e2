import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { users } from '../data/seedSocial'
import { contrast } from '../test/contrast'
import { Avatar } from './Avatar'

const MIN_TEXT_CONTRAST = 4.5
// The backgrounds of the BookCover placeholder, without the ribbon's burgundy, which means active.
const PALETTE = ['#1e1915', '#2f4a78', '#6b3a63', '#85490f', '#5f564d']
const camilas = users.filter(({ name }) => name === 'Camila Torres')

describe('Avatar', () => {
  it('shows up to two initials, in uppercase', () => {
    render(<Avatar user={{ name: 'camila torres de la fuente', avatarColor: '#000000' }} />)
    expect(screen.getByText('CT')).toBeInTheDocument()
  })

  it('works with a single name', () => {
    render(<Avatar user={{ name: 'Ñuke', avatarColor: '#000000' }} />)
    expect(screen.getByText('Ñ')).toBeInTheDocument()
  })

  it('is decorative, because the name is always next to it', () => {
    render(<Avatar user={{ name: 'Alex Muñoz', avatarColor: '#000000' }} />)
    expect(screen.getByText('AM')).toHaveAttribute('aria-hidden', 'true')
  })

  it('has a size to go inside a line of text, with a line that lifts it from a tinted row', () => {
    render(<Avatar user={{ name: 'Alex Muñoz', avatarColor: '#000000' }} size="xs" />)
    expect(screen.getByText('AM')).toHaveClass('size-6', 'ring-1', 'ring-line')
  })

  it('takes the colour of the person', () => {
    render(<Avatar user={{ name: 'Alex Muñoz', avatarColor: '#1e1915' }} />)
    expect(screen.getByText('AM')).toHaveStyle({ backgroundColor: '#1e1915' })
  })

  it.each(users.map((user) => [user.name, user.avatarColor]))(
    'draws %s with a colour of the system',
    (_, colour) => {
      expect(PALETTE).toContain(colour)
    },
  )

  it('tells homonyms apart by colour, on top of their usernames', () => {
    expect(camilas).toHaveLength(2)
    expect(camilas[0].avatarColor).not.toBe(camilas[1].avatarColor)
  })

  it.each(users.map((user) => [user.name, user.avatarColor]))(
    'keeps the white initials of %s at 4.5:1 or more',
    (_, colour) => {
      expect(contrast(colour, '#ffffff')).toBeGreaterThanOrEqual(MIN_TEXT_CONTRAST)
    },
  )
})
