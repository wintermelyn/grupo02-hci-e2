import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TOAST_DURATION_MS } from '../store/coreSlice'
import { state } from '../test/store'
import { Toast } from './Toast'

beforeEach(() => {
  vi.useFakeTimers()
})

describe('Toast', () => {
  it('announces the message in a live region and hides it after the timeout', () => {
    render(<Toast />)
    act(() => state().showToast('Hola'))
    expect(screen.getByRole('status')).toHaveTextContent('Hola')
    expect(screen.queryByRole('button', { name: 'Deshacer' })).not.toBeInTheDocument()
    act(() => vi.advanceTimersByTime(TOAST_DURATION_MS))
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })

  it('keeps Deshacer on screen with a long name without spaces', () => {
    render(<Toast />)
    act(() => state().commit('M'.repeat(60), () => ({})))
    expect(screen.getByText('M'.repeat(60))).toHaveClass('min-w-0', 'wrap-anywhere')
  })

  describe('with a menu open', () => {
    const undoButton = () => screen.queryByRole('button', { name: 'Deshacer' })

    it('goes under the menu, which keeps its taps', () => {
      render(<Toast />)
      expect(screen.getByRole('status')).toHaveClass('z-45')
    })

    it('keeps Deshacer until the menu closes, and then gets its full time', () => {
      render(<Toast />)
      act(() => state().commit('Libro movido', () => ({})))
      act(() => state().setMenuOpen(true))
      act(() => vi.advanceTimersByTime(TOAST_DURATION_MS * 2))
      expect(undoButton()).toBeInTheDocument()

      act(() => state().setMenuOpen(false))
      act(() => vi.advanceTimersByTime(TOAST_DURATION_MS - 1))
      expect(undoButton()).toBeInTheDocument()
      act(() => vi.advanceTimersByTime(1))
      expect(undoButton()).not.toBeInTheDocument()
    })

    it('waits as well if it arrives with the menu already open', () => {
      render(<Toast />)
      act(() => state().setMenuOpen(true))
      act(() => state().commit('Libro movido', () => ({})))
      act(() => vi.advanceTimersByTime(TOAST_DURATION_MS * 2))
      expect(undoButton()).toBeInTheDocument()
      act(() => state().setMenuOpen(false))
    })

    it('does not let the menu end what the mouse is holding', () => {
      render(<Toast />)
      act(() => state().commit('Libro movido', () => ({})))
      fireEvent.pointerEnter(undoButton()!.parentElement!, { pointerType: 'mouse' })
      act(() => state().setMenuOpen(true))
      act(() => state().setMenuOpen(false))
      act(() => vi.advanceTimersByTime(TOAST_DURATION_MS * 2))
      expect(undoButton()).toBeInTheDocument()
    })
  })

  it('undoes the last library change', () => {
    const before = state().library
    render(<Toast />)
    act(() => state().commit('Libros quitados', () => ({ library: {} })))
    fireEvent.click(screen.getByRole('button', { name: 'Deshacer' }))
    expect(state().library).toBe(before)
    expect(screen.getByRole('status')).toHaveTextContent('Cambio deshecho')
  })

  it('returns focus to where it was before Deshacer, which disappears with the toast', () => {
    render(
      <>
        <button>Tag</button>
        <Toast />
      </>,
    )
    act(() => state().commit('Libros quitados', () => ({ library: {} })))
    const trigger = screen.getByRole('button', { name: 'Tag' })
    const undoButton = screen.getByRole('button', { name: 'Deshacer' })
    trigger.focus()
    act(() => undoButton.focus())
    fireEvent.click(undoButton)
    expect(trigger).toHaveFocus()
  })

  it('does not move the page to give the focus back', () => {
    render(
      <>
        <button>Tag</button>
        <Toast />
      </>,
    )
    act(() => state().commit('Libros quitados', () => ({ library: {} })))
    const trigger = screen.getByRole('button', { name: 'Tag' })
    const undoButton = screen.getByRole('button', { name: 'Deshacer' })
    trigger.focus()
    act(() => undoButton.focus())
    const focus = vi.spyOn(trigger, 'focus')
    fireEvent.click(undoButton)
    expect(focus).toHaveBeenCalledExactlyOnceWith({ preventScroll: true })
  })

  describe('when an action asks it to take the focus', () => {
    function renderFocusedToast() {
      render(
        <>
          <button>Contenido</button>
          <Toast />
        </>,
      )
      const content = screen.getByRole('button', { name: 'Contenido' })
      content.focus()
      act(() => {
        state().commit('Libros quitados', () => ({ library: {} }))
        state().focusToast()
      })
      return { content, undoButton: screen.getByRole('button', { name: 'Deshacer' }) }
    }

    it('takes the focus to Deshacer, which stops the timer', () => {
      const { undoButton } = renderFocusedToast()
      expect(undoButton).toHaveFocus()
      act(() => vi.advanceTimersByTime(TOAST_DURATION_MS * 2))
      expect(undoButton).toBeInTheDocument()
    })

    it('goes back to the content with Deshacer', () => {
      const { content, undoButton } = renderFocusedToast()
      fireEvent.click(undoButton)
      expect(content).toHaveFocus()
    })

    it('goes back to the content with Tab, and then leaves on its own', () => {
      const { content, undoButton } = renderFocusedToast()
      fireEvent.keyDown(undoButton, { key: 'Tab' })
      expect(content).toHaveFocus()
      act(() => vi.advanceTimersByTime(TOAST_DURATION_MS))
      expect(screen.getByRole('status')).toBeEmptyDOMElement()
    })

    it('does not take a held Enter as a click', () => {
      const { undoButton } = renderFocusedToast()
      // fireEvent answers false when the default action of the key was prevented.
      expect(fireEvent.keyDown(undoButton, { key: 'Enter', repeat: true })).toBe(false)
      expect(fireEvent.keyDown(undoButton, { key: 'Enter' })).toBe(true)
    })
  })

  it('does nothing when asked to take the focus without a toast', () => {
    render(<Toast />)
    act(() => state().focusToast())
    expect(state().toast).toBeNull()
  })

  it('leaves Tab alone when the keyboard came on its own', () => {
    render(<Toast />)
    act(() => state().commit('Libros quitados', () => ({ library: {} })))
    const undoButton = screen.getByRole('button', { name: 'Deshacer' })
    expect(undoButton).not.toHaveFocus()
    act(() => undoButton.focus())
    expect(fireEvent.keyDown(undoButton, { key: 'Tab' })).toBe(true)
  })

  it('waits while the toast is hovered, then gives the full time again', () => {
    render(<Toast />)
    act(() => state().commit('Libros quitados', () => ({ library: {} })))
    const undoButton = screen.getByRole('button', { name: 'Deshacer' })
    fireEvent.pointerEnter(undoButton, { pointerType: 'mouse' })
    act(() => vi.advanceTimersByTime(TOAST_DURATION_MS * 2))
    expect(undoButton).toBeInTheDocument()

    fireEvent.pointerLeave(undoButton, { pointerType: 'mouse' })
    act(() => vi.advanceTimersByTime(TOAST_DURATION_MS - 1))
    expect(undoButton).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(1))
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })

  it('still hides after the timeout when a tap enters it, which never sends pointerleave', () => {
    render(<Toast />)
    act(() => state().commit('Libros quitados', () => ({ library: {} })))
    const undoButton = screen.getByRole('button', { name: 'Deshacer' })
    // A tap: pointerenter from the finger, then the browser's compatibility mouseenter.
    fireEvent.pointerEnter(undoButton, { pointerType: 'touch' })
    fireEvent.mouseEnter(undoButton)
    act(() => vi.advanceTimersByTime(TOAST_DURATION_MS))
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
    expect(state().undoSnapshot).toBeNull()
  })

  it('waits while Deshacer has keyboard focus, even after the mouse leaves', () => {
    render(<Toast />)
    act(() => state().commit('Libros quitados', () => ({ library: {} })))
    const undoButton = screen.getByRole('button', { name: 'Deshacer' })
    act(() => undoButton.focus())
    fireEvent.pointerEnter(undoButton, { pointerType: 'mouse' })
    fireEvent.pointerLeave(undoButton, { pointerType: 'mouse' })
    act(() => vi.advanceTimersByTime(TOAST_DURATION_MS * 2))
    expect(undoButton).toBeInTheDocument()

    act(() => undoButton.blur())
    act(() => vi.advanceTimersByTime(TOAST_DURATION_MS))
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })
})
