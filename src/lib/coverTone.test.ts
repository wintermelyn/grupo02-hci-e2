import { describe, expect, it } from 'vitest'
import books from '../data/books.json'
import coverColors from '../data/coverColors.json'
import { contrast } from '../test/contrast'
import { coverTone } from './coverTone'

const colours = coverColors as Record<string, string | null>
const WHITE = '#ffffff'

function toHex(tone: string): string {
  const channels = tone.match(/\d+/g)?.map(Number) ?? []
  return `#${channels.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`
}

/** White at this opacity over the tone, which is how secondary text is written on a card. */
function whiteOver(hex: string, opacity: number): string {
  const channels = [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16))
  const mixed = channels.map((channel) => Math.round(channel + (255 - channel) * opacity))
  return `#${mixed.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`
}

describe('coverTone', () => {
  it('has a colour, or says it has none, for each book of the catalog', () => {
    expect(Object.keys(colours).sort()).toEqual(books.map(({ id }) => id).sort())
  })

  it.each(books.map(({ id }) => id))('keeps white text on %s at 8.5:1 or more', (id) => {
    expect(contrast(toHex(coverTone({ id })), WHITE)).toBeGreaterThanOrEqual(8.5)
  })

  it.each(books.map(({ id }) => id))('keeps its secondary text on %s at 4.5:1 or more', (id) => {
    const tone = toHex(coverTone({ id }))
    expect(contrast(tone, whiteOver(tone, 0.88))).toBeGreaterThanOrEqual(4.5)
  })

  it('gives a cover with no colour the tone of ink, without inventing a hue', () => {
    expect(colours.OL110971W).toBeNull()
    expect(coverTone({ id: 'OL110971W' })).toBe('rgb(50 43 38)')
  })

  it('gives a book kept from an older version, which has no colour, that same tone', () => {
    expect(coverTone({ id: 'OL0000000W' })).toBe('rgb(50 43 38)')
  })

  it('uses the colour that a book of the catalog brings with it', () => {
    const tone = coverTone({ id: 'OL0000000W', coverColor: '2c6fb0' })
    expect(tone).not.toBe('rgb(50 43 38)')
    expect(contrast(toHex(tone), WHITE)).toBeGreaterThanOrEqual(8.5)
  })

  it('leaves indigo and olive out: a blue stays blue and a yellow goes amber', () => {
    const channels = (id: string) => coverTone({ id }).match(/\d+/g)?.map(Number) ?? []
    const [blueRed, , blueBlue] = channels('OL10263W')
    expect(blueBlue).toBeGreaterThan(blueRed)
    const [amberRed, amberGreen, amberBlue] = channels('OL109524W')
    expect(amberRed).toBeGreaterThan(amberGreen)
    expect(amberGreen).toBeGreaterThan(amberBlue)
  })

  it('always gives a colour the browser can read', () => {
    expect(coverTone(books[0])).toMatch(/^rgb\(\d+ \d+ \d+\)$/)
  })
})
