import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithRouter } from '../../test/router'
import { state } from '../../test/store'
import { LeaveLibrary } from './LeaveLibrary'

describe('LeaveLibrary', () => {
  it('asks before taking the book out', () => {
    const carrie = state().library.OL81626W
    renderWithRouter(<LeaveLibrary book={state().getBook(carrie.bookId)!} entry={carrie} />)
    fireEvent.click(screen.getByRole('button', { name: 'Quitar de Mis libros: «Carrie»' }))
    expect(state().library).toHaveProperty(carrie.bookId)
    expect(screen.getByRole('region', { name: '¿Quitar «Carrie» de Mis libros?' })).toBeVisible()
    fireEvent.click(screen.getByRole('button', { name: 'Quitar de Mis libros' }))
    expect(state().library).not.toHaveProperty(carrie.bookId)
  })
})
