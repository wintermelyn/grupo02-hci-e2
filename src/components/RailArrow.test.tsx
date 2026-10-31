import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { RailArrow } from './RailArrow'

const arrow = () => screen.getByRole('button', { name: 'Ver más libros' })

describe('RailArrow', () => {
  it('has a name, although on screen it is only an icon', () => {
    render(<RailArrow direction="forward" label="Ver más libros" onClick={vi.fn()} visible />)
    expect(arrow().querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('moves the rail when pressed', () => {
    const onClick = vi.fn()
    render(<RailArrow direction="forward" label="Ver más libros" onClick={onClick} visible />)
    fireEvent.click(arrow())
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('stays out of the tab order and away from touch', () => {
    render(<RailArrow direction="back" label="Ver más libros" onClick={vi.fn()} visible />)
    expect(arrow()).toHaveAttribute('tabindex', '-1')
    expect(arrow()).toHaveClass('pointer-coarse:hidden')
  })

  it('measures more than the 44 px of a control', () => {
    render(<RailArrow direction="back" label="Ver más libros" onClick={vi.fn()} visible />)
    expect(arrow()).toHaveClass('size-12')
  })

  it('goes away at the end of the rail, where it has nothing to do', () => {
    const onClick = vi.fn()
    render(
      <RailArrow direction="forward" label="Ver más libros" onClick={onClick} visible={false} />,
    )
    expect(arrow()).toBeDisabled()
    expect(arrow()).toHaveClass('opacity-0', 'pointer-events-none')
    fireEvent.click(arrow())
    expect(onClick).not.toHaveBeenCalled()
  })
})
