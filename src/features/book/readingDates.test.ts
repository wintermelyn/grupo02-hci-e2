import { describe, expect, it } from 'vitest'
import { daysAgo, today } from '../../lib/dates'
import { readingDatesProblem } from './readingDates'

const tomorrow = daysAgo(-1)

describe('readingDatesProblem', () => {
  it('accepts a reading in the past and one that started and ended today', () => {
    expect(readingDatesProblem(daysAgo(12), daysAgo(2))).toBeUndefined()
    expect(readingDatesProblem(today(), today())).toBeUndefined()
  })

  it('asks for both dates', () => {
    expect(readingDatesProblem('', today())).toBe('Completa las dos fechas.')
    expect(readingDatesProblem(today(), '')).toBe('Completa las dos fechas.')
  })

  it('rejects future dates', () => {
    expect(readingDatesProblem(daysAgo(2), tomorrow)).toBe('Las fechas no pueden ser futuras.')
    expect(readingDatesProblem(tomorrow, tomorrow)).toBe('Las fechas no pueden ser futuras.')
  })

  it('rejects an end before the start', () => {
    expect(readingDatesProblem(daysAgo(2), daysAgo(3))).toBe(
      'El fin no puede ser anterior al inicio.',
    )
  })
})
