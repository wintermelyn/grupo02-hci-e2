import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'
import { describe, expect, it } from 'vitest'
import { DESCRIPTION_GROUPS as APP_GROUPS, descriptionGroup as appGroup } from '../src/lib/catalog'
import { BOOK_FIXES } from './catalog-lists.mjs'
import { DESCRIPTION_GROUPS, descriptionGroup, translationProblems } from './catalog-rules.mjs'

const ROOT = join(import.meta.dirname, '..')
const read = (path) => readFileSync(join(ROOT, path))
const readJson = (path) => JSON.parse(read(path))

const seeds = readJson('src/data/books.json')
const rows = readJson('public/catalog/index.json')
const translations = readJson('scripts/translated-descriptions.json')
const groups = Array.from({ length: DESCRIPTION_GROUPS }, (_, group) =>
  readJson(`public/catalog/descriptions/${group}.json`),
)
const texts = Object.assign({}, ...groups)

/** What a browser gets from a host that compresses, as Vercel does. */
const compressed = (path) => gzipSync(read(path), { level: 9 }).length

describe('the published catalog', () => {
  it('has every book of the app and the rest of the list, once', () => {
    const ids = rows.map(([id]) => id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids).toEqual(expect.arrayContaining(seeds.map(({ id }) => id)))
    expect(ids.length).toBeGreaterThan(1000)
  })

  it('has a title, an author and a cover for each book', () => {
    for (const [id, title, authors] of rows) {
      expect(title).not.toBe('')
      expect(authors.length).toBeGreaterThan(0)
      expect(existsSync(join(ROOT, `public/covers/${id}.jpg`))).toBe(true)
    }
  })

  it('stays light: the index under 40 KB compressed, a group around 20 KB', () => {
    expect(compressed('public/catalog/index.json')).toBeLessThan(40_000)
    for (let group = 0; group < DESCRIPTION_GROUPS; group += 1) {
      expect(compressed(`public/catalog/descriptions/${group}.json`)).toBeLessThan(25_000)
    }
  })

  it('finds a book in the same file from the script and from the app', () => {
    expect(APP_GROUPS).toBe(DESCRIPTION_GROUPS)
    expect(readdirSync(join(ROOT, 'public/catalog/descriptions'))).toHaveLength(DESCRIPTION_GROUPS)
    groups.forEach((group, index) => {
      for (const id of Object.keys(group)) {
        expect(descriptionGroup(id)).toBe(index)
        expect(appGroup(id)).toBe(index)
      }
    })
  })

  it('leaves the 54 books out of the files, as their text comes in the bundle', () => {
    for (const { id } of seeds) expect(texts[id]).toBeUndefined()
  })

  it('marks every translation and nothing else', () => {
    for (const [id, { description, descriptionTranslated }] of Object.entries(texts)) {
      expect(description).not.toBe('')
      expect(descriptionTranslated, id).toBe(translations[id] ? true : undefined)
      if (translations[id]) expect(description).toBe(translations[id].description)
    }
  })

  it('has a translation that is ready to be read for every text that needed one', () => {
    for (const [id, { description }] of Object.entries(translations)) {
      expect(translationProblems(description), id).toEqual([])
    }
  })

  it('has no text for the books marked to go without one', () => {
    for (const [id, fixes] of Object.entries(BOOK_FIXES)) {
      if (fixes.noDescription) expect(texts[id], id).toBeUndefined()
    }
  })

  it('has no link to Open Library or to any other site', () => {
    for (const { description } of Object.values(texts)) {
      expect(description).not.toMatch(/https?:|openlibrary/i)
    }
  })
})
