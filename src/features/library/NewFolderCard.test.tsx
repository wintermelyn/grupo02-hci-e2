import { act, fireEvent, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderApp } from '../../test/router'
import { state, stubAction } from '../../test/store'

const LIBRARY = '/biblioteca'
const main = () => within(screen.getByRole('main'))
const card = () => main().getByRole('button', { name: /Nueva carpeta/ })
const field = () => main().getByRole('textbox', { name: 'Nombre de la carpeta nueva' })
const create = () => main().getByRole('button', { name: 'Crear' })
const cancel = () => main().getByRole('button', { name: 'Cancelar' })

function write(value: string) {
  fireEvent.change(field(), { target: { value } })
}

describe('NewFolderCard', () => {
  it('is the last card of the board, also in Todos with books outside every folder', () => {
    renderApp(LIBRARY)
    const list = main().getAllByRole('list')[0]
    expect(within(list).getAllByRole('listitem').at(-1)).toContainElement(card())
  })

  it('only exists on the board', () => {
    renderApp(`${LIBRARY}?tag=want`)
    expect(main().queryByRole('button', { name: /Nueva carpeta/ })).not.toBeInTheDocument()
  })

  it('writes the name right there, with the focus in the field and no dialog', () => {
    renderApp(LIBRARY)
    const item = card().closest('li') as HTMLElement
    fireEvent.click(card())
    expect(item).toContainElement(field())
    expect(field()).toHaveFocus()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('takes the whole row on a phone in both states, so a long name can be read', () => {
    renderApp(LIBRARY)
    expect(card().closest('li')).toHaveClass('max-md:col-span-2')
    fireEvent.click(card())
    expect(field().closest('li')).toHaveClass('max-md:col-span-2')
  })

  it('keeps Crear and Cancelar clear of the bottom bar', () => {
    const scroll = vi.fn()
    Element.prototype.scrollIntoView = scroll
    renderApp(LIBRARY)
    fireEvent.click(card())
    expect(scroll).toHaveBeenCalledWith({ block: 'nearest' })
    expect(scroll.mock.contexts[0]).toHaveClass('scroll-mb-20')
    Reflect.deleteProperty(Element.prototype, 'scrollIntoView')
  })

  it('creates the folder with the name as written, and offers Deshacer', () => {
    renderApp(LIBRARY)
    fireEvent.click(card())
    write('  Para el verano  ')
    fireEvent.click(create())
    expect(state().folders.at(-1)?.name).toBe('Para el verano')
    expect(main().getByRole('link', { name: /Para el verano/ })).toHaveTextContent('0 libros')
    expect(screen.getByRole('button', { name: 'Deshacer' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Deshacer' }))
    expect(main().queryByRole('link', { name: /Para el verano/ })).not.toBeInTheDocument()
  })

  it('goes back to the card with the focus on it after creating', () => {
    renderApp(LIBRARY)
    fireEvent.click(card())
    write('Viajes')
    fireEvent.keyDown(field(), { key: 'Enter' })
    expect(card()).toHaveFocus()
  })

  it.each([
    ['Cancelar', () => fireEvent.click(cancel())],
    ['Escape', () => fireEvent.keyDown(field(), { key: 'Escape' })],
  ])('leaves without creating anything with %s, and starts empty next time', (_name, leave) => {
    const createFolder = stubAction('createFolder')
    renderApp(LIBRARY)
    fireEvent.click(card())
    write('Viajes')
    leave()
    expect(createFolder).not.toHaveBeenCalled()
    expect(card()).toHaveFocus()
    fireEvent.click(card())
    expect(field()).toHaveValue('')
  })

  it('keeps its name on screen, so the empty field says what it waits for', () => {
    renderApp(LIBRARY)
    fireEvent.click(card())
    expect(field().closest('li')).toHaveTextContent('Nueva carpeta')
  })

  it('does not scold an empty field, but keeps Crear disabled', () => {
    renderApp(LIBRARY)
    fireEvent.click(card())
    expect(create()).toBeDisabled()
    expect(main().queryByText('Escribe un nombre para la carpeta.')).not.toBeInTheDocument()
  })

  it('says why after Enter on an empty field', () => {
    const createFolder = stubAction('createFolder')
    renderApp(LIBRARY)
    fireEvent.click(card())
    fireEvent.keyDown(field(), { key: 'Enter' })
    expect(createFolder).not.toHaveBeenCalled()
    expect(main().getByText('Escribe un nombre para la carpeta.')).toBeInTheDocument()
    expect(field()).toHaveAttribute('aria-invalid', 'true')
  })

  it('applies the same limits as renaming: repeated names and 40 characters', () => {
    renderApp(LIBRARY)
    fireEvent.click(card())
    expect(field()).toHaveAttribute('maxlength', '40')
    write(' CIENCIA FICCIÓN ')
    expect(main().getByText('Ya tienes una carpeta con ese nombre.')).toBeInTheDocument()
    expect(create()).toBeDisabled()
    write('Ciencia')
    expect(create()).toBeEnabled()
  })

  it('names a folder after one deleted, without taking its address', () => {
    act(() => state().deleteFolder('regalos'))
    renderApp(LIBRARY)
    fireEvent.click(card())
    write('Regalos')
    fireEvent.click(create())
    expect(main().getByRole('link', { name: /Regalos/ })).toHaveAttribute(
      'href',
      '/biblioteca/carpeta/regalos',
    )
  })
})
