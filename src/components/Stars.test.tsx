import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Stars } from './Stars'

describe('Stars', () => {
  it('describes the rating when only displayed', () => {
    render(<Stars value={4} />)
    expect(screen.getByRole('img', { name: '4 de 5 estrellas' })).toBeInTheDocument()
  })

  it('works as a radio group and can be cleared', () => {
    const onChange = vi.fn()
    const { rerender } = render(<Stars onChange={onChange} />)
    expect(screen.getByRole('group', { name: 'Puntaje' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('radio', { name: '3 estrellas' }))
    expect(onChange).toHaveBeenLastCalledWith(3)

    rerender(<Stars value={3} onChange={onChange} />)
    expect(screen.getByRole('radio', { name: '3 estrellas' })).toBeChecked()
    fireEvent.click(screen.getByRole('button', { name: 'Quitar puntaje' }))
    expect(onChange).toHaveBeenLastCalledWith(undefined)
  })
})
