import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { RailArrow } from './RailArrow'
import { useRail } from './useRail'

function Rail({ onOpen }: { onOpen?: () => void }) {
  const { ref, canGoBack, canGoForward, advance, railProps } = useRail<HTMLUListElement>()
  return (
    <>
      <ul ref={ref} {...railProps} aria-label="Riel">
        {['Uno', 'Dos', 'Tres'].map((name) => (
          <li key={name}>
            <a href={`#${name}`} onClick={onOpen}>
              {name}
            </a>
          </li>
        ))}
      </ul>
      <RailArrow direction="back" label="Atrás" onClick={() => advance(-1)} visible={canGoBack} />
      <RailArrow
        direction="forward"
        label="Adelante"
        onClick={() => advance(1)}
        visible={canGoForward}
      />
    </>
  )
}

const rail = () => screen.getByRole('list', { name: 'Riel' })
const back = () => screen.getByRole('button', { name: 'Atrás', hidden: true })
const forward = () => screen.getByRole('button', { name: 'Adelante', hidden: true })

// jsdom has no layout: these are the measures a browser would report.
function setMeasures({ client = 300, scroll = 900, left = 0 }) {
  Object.defineProperty(rail(), 'clientWidth', { configurable: true, value: client })
  Object.defineProperty(rail(), 'scrollWidth', { configurable: true, value: scroll })
  rail().scrollLeft = left
  fireEvent.scroll(rail())
}

function dragBy(distance: number) {
  fireEvent.pointerDown(rail(), { pointerType: 'mouse', button: 0, clientX: 300, pointerId: 1 })
  fireEvent.pointerMove(rail(), { clientX: 300 + distance })
}

describe('useRail', () => {
  beforeEach(() => {
    Element.prototype.scrollBy = vi.fn()
    Element.prototype.setPointerCapture = vi.fn()
  })

  it('offers each way only while there is something there', () => {
    render(<Rail />)
    setMeasures({ left: 0 })
    expect(back()).toBeDisabled()
    expect(forward()).toBeEnabled()

    setMeasures({ left: 300 })
    expect(back()).toBeEnabled()
    expect(forward()).toBeEnabled()

    setMeasures({ left: 600 })
    expect(back()).toBeEnabled()
    expect(forward()).toBeDisabled()
  })

  it('offers neither way when everything fits', () => {
    render(<Rail />)
    setMeasures({ client: 900, scroll: 900 })
    expect(back()).toBeDisabled()
    expect(forward()).toBeDisabled()
  })

  it('moves most of a page, and never less than two covers', () => {
    render(<Rail />)
    setMeasures({ client: 1000, scroll: 3000 })
    fireEvent.click(forward())
    expect(rail().scrollBy).toHaveBeenLastCalledWith({ left: 800, behavior: 'smooth' })

    setMeasures({ client: 200, scroll: 3000, left: 400 })
    fireEvent.click(back())
    expect(rail().scrollBy).toHaveBeenLastCalledWith({ left: -200, behavior: 'smooth' })
  })

  it('jumps instead of gliding when the person asks for less movement', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }))
    render(<Rail />)
    setMeasures({})
    fireEvent.click(forward())
    expect(rail().scrollBy).toHaveBeenLastCalledWith({ left: 240, behavior: 'auto' })
    vi.unstubAllGlobals()
  })

  it('follows a mouse drag, and marks the rail so the snap points let go', () => {
    render(<Rail />)
    setMeasures({ left: 100 })
    dragBy(-40)
    expect(rail().scrollLeft).toBe(140)
    expect(rail()).toHaveAttribute('data-dragging', 'true')
    fireEvent.pointerUp(rail())
    expect(rail()).not.toHaveAttribute('data-dragging')
  })

  it('leaves a small movement as a click', () => {
    const onOpen = vi.fn()
    render(<Rail onOpen={onOpen} />)
    setMeasures({ left: 100 })
    dragBy(-4)
    expect(rail().scrollLeft).toBe(100)
    fireEvent.pointerUp(rail())
    fireEvent.click(screen.getByRole('link', { name: 'Uno' }))
    expect(onOpen).toHaveBeenCalledOnce()
  })

  it('does not open the book left under the cursor after a drag', () => {
    vi.useFakeTimers()
    const onOpen = vi.fn()
    render(<Rail onOpen={onOpen} />)
    setMeasures({})
    dragBy(-40)
    fireEvent.pointerUp(rail())
    fireEvent.click(screen.getByRole('link', { name: 'Dos' }))
    expect(onOpen).not.toHaveBeenCalled()

    act(() => {
      vi.runAllTimers()
    })
    fireEvent.click(screen.getByRole('link', { name: 'Dos' }))
    expect(onOpen).toHaveBeenCalledOnce()
  })

  it('leaves the finger to the browser', () => {
    render(<Rail />)
    setMeasures({ left: 100 })
    fireEvent.pointerDown(rail(), { pointerType: 'touch', button: 0, clientX: 300, pointerId: 1 })
    fireEvent.pointerMove(rail(), { clientX: 200 })
    expect(rail().scrollLeft).toBe(100)
  })

  it('goes between books with the arrow keys and stops at the ends', () => {
    render(<Rail />)
    const [first, second] = screen.getAllByRole('link')
    first.focus()
    fireEvent.keyDown(first, { key: 'ArrowRight' })
    expect(second).toHaveFocus()
    fireEvent.keyDown(second, { key: 'ArrowLeft' })
    expect(first).toHaveFocus()
    fireEvent.keyDown(first, { key: 'ArrowLeft' })
    expect(first).toHaveFocus()
  })
})
