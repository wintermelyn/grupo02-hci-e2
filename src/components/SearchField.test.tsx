import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { SearchField } from './SearchField'

function Field() {
  const [value, setValue] = useState('')
  return <SearchField label="Buscar personas" value={value} onChange={setValue} />
}

const field = () => screen.getByRole('searchbox', { name: 'Buscar personas' })

describe('SearchField', () => {
  it('is named by its label and shows what can be searched', () => {
    render(
      <SearchField
        label="Buscar personas"
        value=""
        onChange={() => {}}
        placeholder="Nombre o @usuario"
      />,
    )
    expect(field()).toHaveAttribute('placeholder', 'Nombre o @usuario')
  })

  // The height of the Button it sits next to in a band. The input reaches over the border, so all
  // of the 44 px can be tapped, and -my-px keeps the field from growing to 46.
  it('measures 44 px, border included, and all of them can be tapped', () => {
    render(<SearchField label="Buscar personas" value="" onChange={() => {}} />)
    expect(field()).toHaveClass('min-h-11', '-my-px')
    expect(field().parentElement).toHaveClass('min-h-11', 'border')
  })

  it('is a pill, with a larger size for a screen that is about searching', () => {
    const { unmount } = render(<SearchField label="Buscar personas" value="" onChange={() => {}} />)
    expect(field().parentElement).toHaveClass('rounded-full')
    unmount()
    render(<SearchField label="Buscar personas" value="" onChange={() => {}} size="lg" />)
    expect(field().parentElement).toHaveClass('rounded-full', 'min-h-14')
    expect(field()).toHaveClass('min-h-11', 'text-lg')
  })

  it('reports each change', () => {
    const onChange = vi.fn()
    render(<SearchField label="Buscar personas" value="" onChange={onChange} />)
    fireEvent.change(field(), { target: { value: 'cam' } })
    expect(onChange).toHaveBeenCalledExactlyOnceWith('cam')
  })

  it('offers to clear only when there is text', () => {
    render(<Field />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    fireEvent.change(field(), { target: { value: 'cam' } })
    expect(screen.getByRole('button', { name: 'Borrar búsqueda' })).toHaveTextContent('Borrar')
  })

  it('clears and keeps the focus in the field, ready to type again', () => {
    render(<Field />)
    fireEvent.change(field(), { target: { value: 'cam' } })
    fireEvent.click(screen.getByRole('button', { name: 'Borrar búsqueda' }))
    expect(field()).toHaveValue('')
    expect(field()).toHaveFocus()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  // Filled at 44 px, a button would cover the edge of a 44 px field, so only what shows gets smaller.
  it('shows the button inside the edge of the field, with 44 px to touch', () => {
    const { unmount } = render(<SearchField label="Buscar" value="king" onChange={() => {}} />)
    const button = () => screen.getByRole('button', { name: 'Borrar búsqueda' })
    expect(button()).toHaveClass('min-h-8.5', 'mr-1', 'after:absolute')
    expect(button()).toHaveClass('after:-inset-y-[5px]', 'after:-right-1')
    unmount()
    render(<SearchField label="Buscar" value="king" onChange={() => {}} size="lg" />)
    expect(button()).toHaveClass('min-h-11')
    expect(button()).not.toHaveClass('after:absolute')
  })

  it('keeps the focus in the field while a button is pressed, so a long text stays put', () => {
    render(<SearchField label="Buscar" value="king" onChange={() => {}} onClose={() => {}} />)
    // fireEvent returns false when the default, here moving the focus, was prevented.
    expect(fireEvent.mouseDown(screen.getByRole('button', { name: 'Borrar búsqueda' }))).toBe(false)
    expect(fireEvent.mouseDown(screen.getByRole('button', { name: 'Cerrar búsqueda' }))).toBe(false)
  })

  describe('with a way out', () => {
    const closeButton = () => screen.getByRole('button', { name: 'Cerrar búsqueda' })

    it('offers it with the field empty, with a word next to the icon', () => {
      render(<SearchField label="Buscar" value="" onChange={() => {}} onClose={() => {}} />)
      expect(closeButton()).toHaveTextContent('Cerrar')
    })

    it('leaves one button on a phone and one on a computer, so there is room to type', () => {
      render(<SearchField label="Buscar" value="king" onChange={() => {}} onClose={() => {}} />)
      expect(closeButton()).toHaveClass('md:hidden')
      expect(screen.getByRole('button', { name: 'Borrar búsqueda' })).toHaveClass('max-md:hidden')
    })

    it('closes with the button and with Escape', () => {
      const onClose = vi.fn()
      render(<SearchField label="Buscar" value="" onChange={() => {}} onClose={onClose} />)
      fireEvent.click(closeButton())
      fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'Escape' })
      expect(onClose).toHaveBeenCalledTimes(2)
    })

    it('keeps Borrar on every width when the field has no way out', () => {
      render(<SearchField label="Buscar" value="king" onChange={() => {}} />)
      expect(screen.getByRole('button', { name: 'Borrar búsqueda' })).not.toHaveClass(
        'max-md:hidden',
      )
    })
  })
})
