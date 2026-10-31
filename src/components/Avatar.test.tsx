import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { users } from '../data/seedSocial'
import { contrast } from '../test/contrast'
import { Avatar } from './Avatar'

const MIN_TEXT_CONTRAST = 4.5
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

  it('takes the colour of the person', () => {
    render(<Avatar user={{ name: 'Alex Muñoz', avatarColor: '#123456' }} />)
    expect(screen.getByText('AM')).toHaveStyle({ backgroundColor: '#123456' })
  })

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
