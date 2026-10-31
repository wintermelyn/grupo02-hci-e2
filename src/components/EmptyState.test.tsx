import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('breaks a long word of the title and the description, so both stay inside the block', () => {
    render(<EmptyState title={'M'.repeat(60)} description={'N'.repeat(60)} />)
    expect(screen.getByRole('heading')).toHaveClass('wrap-anywhere')
    expect(screen.getByText('N'.repeat(60))).toHaveClass('wrap-anywhere')
  })
})
