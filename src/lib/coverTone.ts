import coverColors from '../data/coverColors.json'

type Triplet = [number, number, number]

/** White over the tone. Its 88 % version, for secondary text, still clears 4.5:1 with room. */
const MIN_WHITE_CONTRAST = 8.5
/** For a cover with no colour of its own: forcing saturation on it would invent a hue. */
const NO_COLOUR_TONE = 'rgb(50 43 38)'
const START_LIGHTNESS = 0.42
const LAST_LIGHTNESS = 0.05
const LIGHTNESS_STEP = 0.01
const MIN_SATURATION = 0.5
const MAX_SATURATION = 0.82

const toTriplet = (hex: string): Triplet => [
  parseInt(hex.slice(0, 2), 16),
  parseInt(hex.slice(2, 4), 16),
  parseInt(hex.slice(4, 6), 16),
]

function toHsl([r, g, b]: Triplet): Triplet {
  const [red, green, blue] = [r / 255, g / 255, b / 255]
  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  const lightness = (max + min) / 2
  if (max === min) return [0, 0, lightness]
  const range = max - min
  const saturation = lightness > 0.5 ? range / (2 - max - min) : range / (max + min)
  const sector =
    max === red
      ? (green - blue) / range + (green < blue ? 6 : 0)
      : max === green
        ? (blue - red) / range + 2
        : (red - green) / range + 4
  return [sector * 60, saturation, lightness]
}

function toRgb([hue, saturation, lightness]: Triplet): Triplet {
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation
  const second = chroma * (1 - Math.abs(((hue / 60) % 2) - 1))
  const base = lightness - chroma / 2
  const sectors: Triplet[] = [
    [chroma, second, 0],
    [second, chroma, 0],
    [0, chroma, second],
    [0, second, chroma],
    [second, 0, chroma],
    [chroma, 0, second],
  ]
  const [r, g, b] = sectors[Math.floor(hue / 60) % sectors.length]
  return [r, g, b].map((channel) => Math.round((channel + base) * 255)) as Triplet
}

function linear(channel: number): number {
  const value = channel / 255
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
}

function whiteContrast([r, g, b]: Triplet): number {
  return 1.05 / (0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b) + 0.05)
}

/** Blues that drift to indigo stay blue, and yellows, which turn olive when dark, go amber. */
function friendlyHue(hue: number): number {
  if (hue > 232 && hue < 300) return 226
  if (hue > 40 && hue < 78) return 33
  return hue
}

const css = ([r, g, b]: Triplet) => `rgb(${r} ${g} ${b})`

/**
 * The tone of a cover, darkened until white text passes 8.5:1: the background of a card that carries
 * that cover. Under a book or a list of them only, never as a tint behind text on paper.
 */
export function coverTone(bookId: string): string {
  const hex = (coverColors as Record<string, string | null>)[bookId]
  if (!hex) return NO_COLOUR_TONE
  const [rawHue, rawSaturation] = toHsl(toTriplet(hex))
  const hue = friendlyHue(rawHue)
  const saturation = Math.min(Math.max(rawSaturation, MIN_SATURATION), MAX_SATURATION)
  for (let lightness = START_LIGHTNESS; lightness > LAST_LIGHTNESS; lightness -= LIGHTNESS_STEP) {
    const rgb = toRgb([hue, saturation, lightness])
    if (whiteContrast(rgb) >= MIN_WHITE_CONTRAST) return css(rgb)
  }
  return css(toRgb([hue, saturation, 0.1]))
}
