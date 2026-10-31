// Builds src/data/coverColors.json: the dominant colour of each cover in public/covers/, which
// src/lib/coverTone.ts darkens into the background of a card. The output is committed, so the app
// decodes no images.
//
//   node scripts/cover-colors.mjs         adds the covers that have no colour yet
//   node scripts/cover-colors.mjs --all   works out every cover again
//
// A cover that already has a colour keeps it, so a new book does not repaint the cards of the rest.
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import jpeg from 'jpeg-js'
import * as prettier from 'prettier'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const COVERS_DIR = join(ROOT, 'public/covers')
const OUTPUT_FILE = join(ROOT, 'src/data/coverColors.json')

/** The cover is averaged into these cells, in its own 2:3 shape, which drops the grain of a photo. */
const GRID_COLUMNS = 32
const GRID_ROWS = 48
const HUE_SECTORS = 18
// Grey, black and white say nothing about a cover: paper, type and shadows all look like that.
const MIN_SATURATION = 0.3
const MIN_LIGHTNESS = 0.1
const MAX_LIGHTNESS = 0.85
/** Below this share of coloured cells the cover has no colour of its own, and gets null. */
const MIN_COLOURED_SHARE = 0.02

/** Averages the image into cells, each an [r, g, b] in 0–255. */
function shrink({ width, height, data }) {
  const sums = Array.from({ length: GRID_COLUMNS * GRID_ROWS }, () => [0, 0, 0, 0])
  for (let y = 0; y < height; y++) {
    const row = Math.floor((y * GRID_ROWS) / height)
    for (let x = 0; x < width; x++) {
      const cell = sums[row * GRID_COLUMNS + Math.floor((x * GRID_COLUMNS) / width)]
      const pixel = (y * width + x) * 4
      cell[0] += data[pixel]
      cell[1] += data[pixel + 1]
      cell[2] += data[pixel + 2]
      cell[3] += 1
    }
  }
  return sums.map(([r, g, b, count]) => [r / count, g / count, b / count])
}

function toHsl([r, g, b]) {
  const [nr, ng, nb] = [r / 255, g / 255, b / 255]
  const max = Math.max(nr, ng, nb)
  const min = Math.min(nr, ng, nb)
  const lightness = (max + min) / 2
  const range = max - min
  if (range === 0) return { hue: 0, saturation: 0, lightness }
  const saturation = lightness > 0.5 ? range / (2 - max - min) : range / (max + min)
  const sector =
    max === nr
      ? ((ng - nb) / range + 6) % 6
      : max === ng
        ? (nb - nr) / range + 2
        : (nr - ng) / range + 4
  return { hue: sector * 60, saturation, lightness }
}

const toHex = (rgb) =>
  rgb.map((channel) => Math.round(channel).toString(16).padStart(2, '0')).join('')

/**
 * The most vivid cell of the hue that weighs the most, counting vivid cells more. Null for a cover
 * with almost no colour, which coverTone then shows in the tone of ink.
 */
function dominantColour(cells) {
  const coloured = cells
    .map((rgb) => ({ rgb, ...toHsl(rgb) }))
    .filter(
      ({ saturation, lightness }) =>
        saturation >= MIN_SATURATION && lightness >= MIN_LIGHTNESS && lightness <= MAX_LIGHTNESS,
    )
  if (coloured.length / cells.length < MIN_COLOURED_SHARE) return null

  const sectors = Array.from({ length: HUE_SECTORS }, () => ({ weight: 0, cells: [] }))
  for (const cell of coloured) {
    const sector = sectors[Math.floor(cell.hue / (360 / HUE_SECTORS)) % HUE_SECTORS]
    sector.weight += cell.saturation ** 2
    sector.cells.push(cell)
  }
  const strongest = sectors.reduce((best, sector) => (sector.weight > best.weight ? sector : best))
  const mostVivid = strongest.cells.reduce((best, cell) =>
    cell.saturation > best.saturation ? cell : best,
  )
  return toHex(mostVivid.rgb)
}

async function readSaved() {
  try {
    return JSON.parse(await readFile(OUTPUT_FILE, 'utf-8'))
  } catch {
    return {}
  }
}

const saved = process.argv.includes('--all') ? {} : await readSaved()
const files = (await readdir(COVERS_DIR)).filter((file) => file.endsWith('.jpg')).sort()
const colours = {}
let added = 0
for (const file of files) {
  const id = basename(file, '.jpg')
  if (id in saved) {
    colours[id] = saved[id]
    continue
  }
  const image = jpeg.decode(await readFile(join(COVERS_DIR, file)), { maxMemoryUsageInMB: 1024 })
  colours[id] = dominantColour(shrink(image))
  added += 1
}

const options = await prettier.resolveConfig(OUTPUT_FILE)
await writeFile(
  OUTPUT_FILE,
  await prettier.format(JSON.stringify(colours), { ...options, filepath: OUTPUT_FILE }),
)
console.log(`${files.length} portadas, ${added} calculadas.`)
