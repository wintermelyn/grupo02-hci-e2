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
})
