import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { InlineConfirm } from './InlineConfirm'

function renderConfirm(oneLine?: boolean) {
  const onConfirm = vi.fn()
  const onCancel = vi.fn()
  render(
    <InlineConfirm
      title="Eliminar «Terror»"
      confirmLabel="Eliminar carpeta"
      onConfirm={onConfirm}
      onCancel={onCancel}
      oneLine={oneLine}
    >
      Los libros siguen en tu biblioteca.
    </InlineConfirm>,
  )
  return { onConfirm, onCancel }
}

describe('InlineConfirm', () => {
  it('asks in the page, without a dialog', () => {
    renderConfirm()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Eliminar «Terror»' })).toHaveTextContent(
      'Los libros siguen en tu biblioteca.',
    )
  })

  it('starts on Cancelar, so an extra Enter does not confirm', () => {
    renderConfirm()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toHaveFocus()
  })

  it('confirms only with the button that names the action', () => {
    const { onConfirm } = renderConfirm()
    expect(onConfirm).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar carpeta' }))
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('cancels with the button and with Escape', () => {
    const { onCancel } = renderConfirm()
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    fireEvent.keyDown(screen.getByRole('region'), { key: 'Escape' })
    expect(onCancel).toHaveBeenCalledTimes(2)
  })

  it('gives each text its line unless it is told to share one', () => {
    renderConfirm()
    expect(
      screen.getByRole('heading', { name: 'Eliminar «Terror»' }).parentElement,
    ).not.toHaveClass('md:flex')
  })

  it('shares one line from a tablet up, and only the title can be cut', () => {
    renderConfirm(true)
    const title = screen.getByRole('heading', { name: 'Eliminar «Terror»' })
    expect(title.parentElement).toHaveClass('md:flex', 'md:items-baseline')
    expect(title).toHaveClass('md:truncate', 'md:min-w-0')
    expect(screen.getByText('Los libros siguen en tu biblioteca.')).toHaveClass('md:shrink-0')
    expect(screen.getByRole('region')).toHaveClass('md:py-1.5')
  })
})
