import { render, screen } from '@testing-library/react'
import { Plus } from 'lucide-react'
import { describe, expect, it } from 'vitest'
import { Button, type ButtonVariant } from './Button'

const VARIANTS: ButtonVariant[] = ['primary', 'secondary', 'quiet', 'danger']

describe('Button', () => {
  it.each(VARIANTS)('is never white in %s, so it does not look like a field', (variant) => {
    render(<Button variant={variant}>Guardar</Button>)
    expect(screen.getByRole('button')).not.toHaveClass('bg-white')
  })

  it('gives the secondary a fill and an edge, which reaches 3:1 on the band', () => {
    render(<Button>Opciones</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-sand-deep', 'border-edge', 'text-ink')
  })

  it('goes one step darker under the cursor, and to ink only while its menu is open', () => {
    render(<Button>Opciones</Button>)
    const { classList } = screen.getByRole('button')
    expect(classList.contains('hover:bg-sand-dark')).toBe(true)
    expect(classList.contains('hover:bg-ink')).toBe(false)
    expect(classList.contains('aria-expanded:bg-ink')).toBe(true)
  })

  it('leaves the quiet without a fill at rest, and marks it while its menu is open', () => {
    render(<Button variant="quiet">Agregar o quitar</Button>)
    const { classList } = screen.getByRole('button')
    expect(classList.contains('bg-sand-deep')).toBe(false)
    expect(classList.contains('aria-expanded:bg-shell')).toBe(true)
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
