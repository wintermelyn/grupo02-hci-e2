import { format } from 'date-fns'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { daysAgo, formatDate, parseDate, today } from './dates'

// vite.config.ts runs the tests with TZ=America/Santiago (UTC-3 in October). At 23:30 it is
// already the next day in UTC, which is exactly the case that UTC-based date code gets wrong.
const LATE_NIGHT_IN_CHILE = new Date(2026, 9, 27, 23, 30)
const ISO = 'yyyy-MM-dd'

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(LATE_NIGHT_IN_CHILE)
})

describe('test environment', () => {
  it('runs in Chile time and reproduces the UTC pitfalls', () => {
    expect(Intl.DateTimeFormat().resolvedOptions().timeZone).toBe('America/Santiago')
    expect(new Date().toISOString().slice(0, 10)).toBe('2026-10-28')
    expect(new Date('2026-10-27').getDate()).toBe(26)
  })
})

describe('today', () => {
  it('returns the local calendar date, not the UTC one', () => {
    expect(today()).toBe('2026-10-27')
    expect(today()).toBe(format(new Date(), ISO))
  })
})

describe('daysAgo', () => {
  it.each([
    [0, '2026-10-27'],
    [1, '2026-10-26'],
    [30, '2026-09-27'],
    // Chile moved its clocks forward at midnight on 2026-09-06, so that day starts at 01:00.
    [51, '2026-09-06'],
    [52, '2026-09-05'],
    [300, '2025-12-31'],
  ])('daysAgo(%i) is %s', (days, expected) => {
    expect(daysAgo(days)).toBe(expected)
  })

  it('matches today for 0 days', () => {
    expect(daysAgo(0)).toBe(today())
  })
})

describe('parseDate', () => {
  it('parses a calendar date as local midnight', () => {
    const date = parseDate('2026-10-27')
    expect([date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()]).toEqual([
      2026, 9, 27, 0,
    ])
  })

  it.each([
    '2026-10-27',
    '2026-01-01',
    '2025-12-31',
    '2024-02-29',
    // Daylight saving changes in Chile: midnight does not exist on 09-06; 04-04 has 23:00 twice.
    '2026-09-06',
    '2026-04-04',
    '2026-04-05',
  ])('round-trips %s', (iso) => {
    expect(format(parseDate(iso), ISO)).toBe(iso)
  })

  it('round-trips today() and daysAgo()', () => {
    expect(format(parseDate(today()), ISO)).toBe(today())
    expect(format(parseDate(daysAgo(51)), ISO)).toBe(daysAgo(51))
  })
})

describe('formatDate', () => {
  it('formats in Spanish', () => {
    expect(formatDate('2026-10-27')).toBe('27 de octubre de 2026')
    expect(formatDate('2026-09-06')).toBe('6 de septiembre de 2026')
  })
})
