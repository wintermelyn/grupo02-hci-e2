import { fireEvent, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { currentLocation, renderWithRouter } from '../test/router'
import { state, stubAction } from '../test/store'
import type { Book } from '../types'
import { StatusControl } from './StatusControl'

const book: Book = { id: 'OL0000001W', title: 'Libro de prueba', authors: ['Autora'] }
const status = () => state().library[book.id]?.status
const option = (name: string) => screen.getByRole('button', { name })

function renderControl(onRequestFinish?: () => void) {
  renderWithRouter(<StatusControl bookId={book.id} onRequestFinish={onRequestFinish} />)
}

beforeEach(() => {
  state().upsertBook(book)
})

describe('StatusControl', () => {
  it('names the group after the book and starts with nothing pressed', () => {
    renderControl()
    expect(screen.getByRole('group', { name: 'Estado de «Libro de prueba»' })).toBeInTheDocument()
    for (const name of ['Quiero', 'Leyendo', 'Leído']) {
      expect(option(name)).toHaveAttribute('aria-pressed', 'false')
    }
  })

  it('sets Quiero and Leyendo directly', () => {
    renderControl()
    fireEvent.click(option('Leyendo'))
    expect(status()).toBe('reading')
    expect(option('Leyendo')).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(option('Quiero'))
    expect(status()).toBe('want')
  })

  it('calls onRequestFinish, not setStatus, for Leído', () => {
    const setStatus = stubAction('setStatus')
    const onRequestFinish = vi.fn()
    renderControl(onRequestFinish)
    fireEvent.click(option('Leído'))
    expect(onRequestFinish).toHaveBeenCalledOnce()
    expect(setStatus).not.toHaveBeenCalled()
    expect(currentLocation()).toBe('/')
  })

  it('opens the finish panel by default, without setting the status', () => {
    const setStatus = stubAction('setStatus')
    renderControl()
    fireEvent.click(option('Leído'))
    expect(currentLocation()).toBe(`/libro/${book.id}?accion=terminar`)
    expect(setStatus).not.toHaveBeenCalled()
  })
})
