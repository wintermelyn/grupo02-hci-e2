import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { BottomSheet } from './BottomSheet'

function renderSheet(open: boolean, onClose = vi.fn()) {
  const sheet = (isOpen: boolean) => (
    <BottomSheet open={isOpen} onClose={onClose} title="Mover a…" footer={<button>Mover</button>}>
      <p>Carpetas</p>
    </BottomSheet>
  )
  const { rerender } = render(sheet(open))
  return { onClose, rerender: (isOpen: boolean) => rerender(sheet(isOpen)) }
}

describe('BottomSheet', () => {
  it('opens as a dialog named by its title, with its content and footer', () => {
    renderSheet(true)
    const dialog = screen.getByRole('dialog', { name: 'Mover a…' })
    expect(dialog).toHaveAttribute('open')
    expect(screen.getByText('Carpetas')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Mover' })).toBeInTheDocument()
  })

  it('asks the parent to close with Cerrar', () => {
    const { onClose } = renderSheet(true)
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar' }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('asks the parent to close on Escape, and stays open until it does', () => {
    const { onClose } = renderSheet(true)
    const dialog = screen.getByRole('dialog', { name: 'Mover a…' })
    // Escape fires "cancel" on a modal dialog; jsdom has no keyboard handling for it.
    const escape = new Event('cancel', { cancelable: true })
    fireEvent(dialog, escape)
    expect(onClose).toHaveBeenCalledOnce()
    expect(escape.defaultPrevented).toBe(true)
    expect(dialog).toHaveAttribute('open')
  })

  it('asks the parent to close when the dialog is closed directly', () => {
    const { onClose } = renderSheet(true)
    const dialog = screen.getByRole<HTMLDialogElement>('dialog', { name: 'Mover a…' })
    dialog.close()
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('closes and unmounts its content when open becomes false', () => {
    const { onClose, rerender } = renderSheet(true)
    const dialog = screen.getByRole('dialog', { name: 'Mover a…' })
    rerender(false)
    expect(dialog).not.toHaveAttribute('open')
    expect(screen.queryByText('Carpetas')).not.toBeInTheDocument()
    expect(onClose).not.toHaveBeenCalled()
  })
})
