import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AnchoredMenu, type AnchoredMenuProps } from './AnchoredMenu'

const onSelect = vi.fn()

const OPTIONS = [
  { id: 'a', label: 'Uno', checked: false, onSelect },
  { id: 'b', label: 'Dos', checked: true, onSelect },
  { id: 'c', label: 'Tres', checked: false, onSelect },
]

function Menu(props: Partial<AnchoredMenuProps>) {
  return (
    <AnchoredMenu
      label="Elegir"
      options={OPTIONS}
      trigger={(triggerProps) => <button {...triggerProps}>Abrir</button>}
      {...props}
    />
  )
}

const trigger = () => screen.getByRole('button', { name: 'Abrir' })
const open = () => fireEvent.click(trigger())
const key = (name: string) => fireEvent.keyDown(document.activeElement as Element, { key: name })
const menu = () => screen.queryByRole('menu', { name: 'Elegir' })
const radio = (name: string) => screen.getByRole('menuitemradio', { name })

afterEach(() => {
  onSelect.mockClear()
})

describe('AnchoredMenu', () => {
  it('sets commands apart from the options, in the same keyboard order', () => {
    const onRemove = vi.fn()
    render(
      <Menu actions={[{ id: 'x', label: 'Quitar', detail: 'Pierdes algo', onSelect: onRemove }]} />,
    )
    open()
    key('End')
    const action = screen.getByRole('menuitem', { name: /^Quitar/ })
    expect(action).toHaveFocus()
    fireEvent.click(action)
    expect(onRemove).toHaveBeenCalledOnce()
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('stays closed until the control opens it, and tells the control what it opens', () => {
    render(<Menu />)
    expect(menu()).not.toBeInTheDocument()
    expect(trigger()).toHaveAttribute('aria-haspopup', 'menu')
    expect(trigger()).toHaveAttribute('aria-expanded', 'false')
    open()
    expect(menu()).toBeInTheDocument()
    expect(trigger()).toHaveAttribute('aria-expanded', 'true')
  })

  it('applies the option, closes and gives the focus back to the control', () => {
    render(<Menu />)
    open()
    fireEvent.click(radio('Tres'))
    expect(onSelect).toHaveBeenCalledOnce()
    expect(menu()).not.toBeInTheDocument()
    expect(trigger()).toHaveFocus()
  })

  it('says in words which option is on, outside the name of the option', () => {
    render(<Menu checkedLabel="Agregado" />)
    open()
    expect(radio('Dos')).toBeChecked()
    expect(radio('Dos')).toHaveTextContent('Agregado')
    expect(radio('Uno')).not.toHaveTextContent('Agregado')
  })

  it('offers several options at once as checkboxes', () => {
    render(<Menu kind="checkbox" options={OPTIONS.map((o) => ({ ...o, checked: true }))} />)
    open()
    expect(screen.getAllByRole('menuitemcheckbox', { checked: true })).toHaveLength(3)
  })

  it('offers commands, which are never checked', () => {
    render(<Menu kind="action" options={[{ id: 'a', label: 'Renombrar', onSelect }]} />)
    open()
    expect(screen.getByRole('menuitem', { name: 'Renombrar' })).not.toHaveAttribute('aria-checked')
  })

  it('closes with a click outside, without applying anything', () => {
    render(<Menu />)
    open()
    fireEvent.pointerDown(document.body)
    expect(menu()).not.toBeInTheDocument()
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('closes with a second click on the control, but not with a double tap', () => {
    render(<Menu />)
    open()
    fireEvent.click(trigger(), { detail: 2 })
    expect(menu()).toBeInTheDocument()
    fireEvent.click(trigger(), { detail: 1 })
    expect(menu()).not.toBeInTheDocument()
  })

  it('closes when resetKey changes, instead of showing up for something else', () => {
    function Switcher() {
      const [book, setBook] = useState('uno')
      return (
        <>
          <button onClick={() => setBook('dos')}>Otro</button>
          <Menu resetKey={book} />
        </>
      )
    }
    render(<Switcher />)
    open()
    fireEvent.click(screen.getByRole('button', { name: 'Otro' }))
    expect(menu()).not.toBeInTheDocument()
  })

  it('does not let the second click of a double tap reach what was behind', () => {
    const behind = vi.fn()
    render(
      <>
        <Menu />
        <button onClick={behind}>Detrás</button>
      </>,
    )
    open()
    fireEvent.click(radio('Uno'))
    fireEvent.click(screen.getByRole('button', { name: 'Detrás' }), { detail: 2 })
    expect(behind).not.toHaveBeenCalled()
  })
})

describe('AnchoredMenu with the keyboard', () => {
  it('starts on the current option and moves with the arrows, wrapping around', () => {
    render(<Menu />)
    open()
    expect(radio('Dos')).toHaveFocus()
    key('ArrowDown')
    expect(radio('Tres')).toHaveFocus()
    key('ArrowDown')
    expect(radio('Uno')).toHaveFocus()
    key('ArrowUp')
    expect(radio('Tres')).toHaveFocus()
  })

  it('starts on the first option when none is on', () => {
    render(<Menu options={OPTIONS.map((option) => ({ ...option, checked: false }))} />)
    open()
    expect(radio('Uno')).toHaveFocus()
  })

  it('starts on the first option of checkboxes, so Enter does not take off the one that is on', () => {
    render(<Menu kind="checkbox" />)
    open()
    expect(screen.getByRole('menuitemcheckbox', { name: 'Uno' })).toHaveFocus()
    expect(screen.getByRole('menuitemcheckbox', { name: 'Dos' })).toBeChecked()
  })

  it('jumps to the ends with Home and End', () => {
    render(<Menu />)
    open()
    key('Home')
    expect(radio('Uno')).toHaveFocus()
    key('End')
    expect(radio('Tres')).toHaveFocus()
  })

  it('opens with the arrows, ArrowUp on the last option', () => {
    render(<Menu />)
    trigger().focus()
    key('ArrowUp')
    expect(radio('Tres')).toHaveFocus()
  })

  it('closes with Escape and gives the focus back', () => {
    render(<Menu />)
    open()
    key('Escape')
    expect(menu()).not.toBeInTheDocument()
    expect(trigger()).toHaveFocus()
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('closes with Tab, letting the focus move on', () => {
    render(<Menu />)
    open()
    key('Tab')
    expect(menu()).not.toBeInTheDocument()
  })
})

describe('AnchoredMenu placement', () => {
  const MENU_HEIGHT = 204

  function layout({ top, pageHeight }: { top: number; pageHeight: number }) {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      top,
      bottom: top + 52,
    } as DOMRect)
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(MENU_HEIGHT)
    vi.spyOn(document.documentElement, 'scrollHeight', 'get').mockReturnValue(pageHeight)
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(600)
    window.scrollBy = vi.fn()
  }

  it('opens below when it fits, without moving the page', () => {
    layout({ top: 100, pageHeight: 600 })
    render(<Menu />)
    open()
    expect(menu()).toHaveClass('top-full')
    expect(window.scrollBy).not.toHaveBeenCalled()
  })

  it('scrolls the page first when it does not fit below', () => {
    layout({ top: 500, pageHeight: 1200 })
    render(<Menu />)
    open()
    expect(menu()).toHaveClass('top-full')
    expect(window.scrollBy).toHaveBeenCalledOnce()
  })

  it('opens above only when the page cannot scroll', () => {
    layout({ top: 500, pageHeight: 600 })
    render(<Menu />)
    open()
    expect(menu()).toHaveClass('bottom-full')
  })
})
