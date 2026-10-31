/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import type { ReadingStatus } from '../types'
import { STATUS_ICONS, STATUS_RIBBON, STATUS_TEXT } from './statusStyles'

const STATUSES: ReadingStatus[] = ['want', 'owned', 'reading', 'read']
// The surfaces a tag or a text colour can sit on.
const SURFACES = ['white', 'paper', 'shell', 'sand']
const MIN_TEXT_CONTRAST = 4.5
// Read from disk: Vitest replaces imported CSS, even with ?raw, by an empty string.
const css = readFileSync('src/index.css', 'utf-8')

function token(name: string): string {
  const match = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-f]{6})`, 'i'))
  if (!match) throw new Error(`index.css needs a hex --color-${name}`)
  return match[1]
}

// WCAG relative luminance: https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
function luminance(hex: string): number {
  const channels = [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16) / 255)
  const [r, g, b] = channels.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  )
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (light + 0.05) / (dark + 0.05)
}

describe('status styles', () => {
  it.each([...STATUSES, 'ink', 'muted', 'danger'])(
    '%s reads at 4.5:1 or more everywhere',
    (name) => {
      for (const surface of SURFACES) {
        expect(contrast(token(name), token(surface))).toBeGreaterThanOrEqual(MIN_TEXT_CONTRAST)
      }
    },
  )

  it('keeps white text at 4.5:1 or more on the filled buttons', () => {
    for (const fill of ['ink', 'danger']) {
      expect(contrast(token(fill), token('white'))).toBeGreaterThanOrEqual(MIN_TEXT_CONTRAST)
    }
  })

  it('gives each tag its own colour and icon, so colour is never the only difference', () => {
    expect(new Set(STATUSES.map(token)).size).toBe(STATUSES.length)
    expect(new Set(STATUSES.map((status) => STATUS_ICONS[status])).size).toBe(STATUSES.length)
    expect(new Set(STATUSES.map((status) => STATUS_TEXT[status])).size).toBe(STATUSES.length)
    expect(new Set(STATUSES.map((status) => STATUS_RIBBON[status])).size).toBe(STATUSES.length)
  })
})
