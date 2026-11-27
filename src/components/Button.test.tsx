import { render, screen } from '@testing-library/react'
import { Plus } from 'lucide-react'
import { describe, expect, it } from 'vitest'
import { Button, type ButtonVariant } from './Button'

const VARIANTS: ButtonVariant[] = ['primary', 'secondary', 'quiet', 'subtle', 'danger']

describe('Button', () => {
  it.each(VARIANTS)('is never white in %s, so it does not look like a field', (variant) => {
    render(<Button variant={variant}>Guardar</Button>)
    expect(screen.getByRole('button')).not.toHaveClass('bg-white')
  })

  it.each(VARIANTS)('is a pill in %s', (variant) => {
    render(<Button variant={variant}>Guardar</Button>)
    expect(screen.getByRole('button')).toHaveClass('rounded-full')
  })

  it('draws the secondary with an edge that reaches 3:1, and leaves the fill to the primary', () => {
    render(<Button>Opciones</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('border-edge', 'text-ink')
    expect(button.className).not.toMatch(/(^|\s)bg-/)
  })

  it('takes a fill under the cursor, and goes to ink only while its menu is open', () => {
    render(<Button>Opciones</Button>)
    const { classList } = screen.getByRole('button')
    expect(classList.contains('hover:bg-sand')).toBe(true)
    expect(classList.contains('hover:bg-ink')).toBe(false)
    expect(classList.contains('aria-expanded:bg-ink')).toBe(true)
  })

  it('leaves the quiet without edge or fill at rest, and marks it while its menu is open', () => {
    render(<Button variant="quiet">Agregar o quitar</Button>)
    const button = screen.getByRole('button')
    expect(button).not.toHaveClass('border')
    expect(button.className).not.toMatch(/(^|\s)bg-/)
    expect(button.classList.contains('aria-expanded:bg-sand')).toBe(true)
  })

  it('draws the subtle lighter than the quiet at rest, and in ink under the cursor and with focus', () => {
    render(<Button variant="subtle">Quitar de Mis libros</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('font-medium', 'text-muted')
    expect(button).not.toHaveClass('font-semibold', 'text-ink')
    expect(button.className).not.toMatch(/(^|\s)bg-/)
    for (const name of [
      'hover:bg-sand',
      'hover:text-ink',
      'focus-visible:bg-sand',
      'focus-visible:text-ink',
    ])
      expect(button.classList.contains(name)).toBe(true)
    expect(button.className).not.toMatch(/danger/)
  })

  it('keeps the weight of the control in every other variant', () => {
    render(<Button variant="quiet">Elegir carpetas</Button>)
    expect(screen.getByRole('button')).toHaveClass('font-semibold')
  })

  it('is 44 px tall at every size, also compact', () => {
    render(<Button compact>Cancelar</Button>)
    expect(screen.getByRole('button')).toHaveClass('min-h-11')
  })

  it('always keeps its text next to the icon, which screen readers skip', () => {
    render(<Button icon={Plus}>Agregar</Button>)
    const button = screen.getByRole('button', { name: 'Agregar' })
    expect(button.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('does not submit a form by default', () => {
    render(<Button>Agregar</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })
})
