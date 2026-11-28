import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TagFilter } from './TagFilter'

const COUNTS = { all: 34, want: 17, owned: 5, reading: 2, read: 1 }

describe('TagFilter', () => {
  it('has Todos and the four tags, in order, each with its count', () => {
    render(<TagFilter value="all" counts={COUNTS} onChange={vi.fn()} />)
    expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual([
      '34Todos',
      '17Lo quiero',
      '5Lo tengo',
      '2Leyendo',
      '1Leído',
    ])
  })

  it('names each button with its label and count, in singular when there is one', () => {
    render(<TagFilter value="all" counts={COUNTS} onChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Lo quiero: 17 libros' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Leído: 1 libro' })).toBeInTheDocument()
  })

  it('marks only the active button', () => {
    render(<TagFilter value="owned" counts={COUNTS} onChange={vi.fn()} />)
    const pressed = screen.getByRole('button', { pressed: true })
    expect(pressed).toHaveTextContent('Lo tengo')
    expect(screen.getAllByRole('button', { pressed: false })).toHaveLength(4)
  })

  it('reports the chosen value', () => {
    const onChange = vi.fn()
    render(<TagFilter value="all" counts={COUNTS} onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: /^Leyendo/ }))
    expect(onChange).toHaveBeenCalledExactlyOnceWith('reading')
  })
})
