import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TextField } from './TextField'

function setup(problem?: string) {
  const props = { onChange: vi.fn(), onSubmit: vi.fn(), onCancel: vi.fn() }
  render(<TextField label="Nombre" value="Terror" problem={problem} maxLength={40} {...props} />)
  return { ...props, field: screen.getByRole('textbox', { name: 'Nombre' }) }
}

describe('TextField', () => {
  it('starts focused with its text selected, so typing replaces it', () => {
    const { field } = setup()
    expect(field).toHaveFocus()
    expect((field as HTMLInputElement).selectionEnd).toBe('Terror'.length)
  })

  it('reports each change and keeps the limit', () => {
    const { field, onChange } = setup()
    fireEvent.change(field, { target: { value: 'Horror' } })
    expect(onChange).toHaveBeenCalledWith('Horror')
    expect(field).toHaveAttribute('maxlength', '40')
  })

  it('submits with Enter and cancels with Escape', () => {
    const { field, onSubmit, onCancel } = setup()
    fireEvent.keyDown(field, { key: 'Enter' })
    expect(onSubmit).toHaveBeenCalledOnce()
    fireEvent.keyDown(field, { key: 'Escape' })
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('keeps Enter from clicking the button that takes the focus after saving', () => {
    const { field } = setup()
    // fireEvent returns false when the default action was prevented.
    expect(fireEvent.keyDown(field, { key: 'Enter' })).toBe(false)
  })

  it('says why the value cannot be saved', () => {
    const { field } = setup('Ya tienes una carpeta con ese nombre.')
    expect(field).toBeInvalid()
    expect(field).toHaveAccessibleDescription('Ya tienes una carpeta con ese nombre.')
  })
})
