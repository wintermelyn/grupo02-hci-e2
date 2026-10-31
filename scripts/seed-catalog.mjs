// Grows the catalog past the 54 books of seed-books.mjs, which stay as they are: same id, data,
// cover and translation. The covers land in public/covers/ and what the app reads in public/catalog/;
// the steps in between are left in .claude/catalogo/, which is not committed.
//
//   node scripts/seed-catalog.mjs candidates   asks Open Library for the lists of books
//   node scripts/seed-catalog.mjs works        downloads each work and its Spanish editions
//   node scripts/seed-catalog.mjs select       applies the rules below; offline
//   node scripts/seed-catalog.mjs covers       downloads and shrinks the covers
//   node scripts/seed-catalog.mjs pending      writes libros.json and the files to translate
//   node scripts/seed-catalog.mjs translations adds traducidas-*.json to translated-descriptions.json
//   node scripts/seed-catalog.mjs publish      checks it all and writes public/catalog/
//
// Every answer from Open Library is kept in .claude/catalogo/, so a stage can run again without
// asking twice. Node 22 and ImageMagick (`magick`), which is the only tool that gets a cover down
// to 15 KB and still looks good.
import { execFile } from 'node:child_process'
import { access, mkdir, readdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { brotliCompressSync, gzipSync } from 'node:zlib'
import {
  BOOK_FIXES,
  EXCLUDED_WORKS,
  HISPANIC_AUTHORS,
  PASSED_OVER_WORKS,
  REJECTED_COVERS,
  UNTRANSLATED_TITLES,
} from './catalog-lists.mjs'
import {
  chooseEdition,
  cleanAuthors,
  dedupeKeys,
  describe,
  DESCRIPTION_GROUPS,
  descriptionGroup,
  detectLanguage,
  dropReason,
  fold,
  lowercaseWords,
  splitEvenly,
  translationProblems,
} from './catalog-rules.mjs'

const run = promisify(execFile)

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const BOOKS_FILE = join(ROOT, 'src/data/books.json')
const COVERS_DIR = join(ROOT, 'public/covers')
const WORK_DIR = join(ROOT, '.claude/catalogo')
const WORKS_DIR = join(WORK_DIR, 'obras')
const ORIGINAL_COVERS_DIR = join(WORK_DIR, 'portadas-originales')
const CANDIDATES_FILE = join(WORK_DIR, 'candidatos.json')
const SELECTED_FILE = join(WORK_DIR, 'seleccion.json')
const DROPPED_FILE = join(WORK_DIR, 'excluidos.json')
const COVERED_FILE = join(WORK_DIR, 'con-portada.json')
const MISSING_COVERS_FILE = join(WORK_DIR, 'sin-portada.json')
const BOOKS_OUT_FILE = join(WORK_DIR, 'libros.json')
const TRANSLATIONS_FILE = join(ROOT, 'scripts/translated-descriptions.json')
const COLOURS_FILE = join(ROOT, 'scripts/cover-colors.json')
const CATALOG_DIR = join(ROOT, 'public/catalog')

const API_URL = 'https://openlibrary.org'
const COVERS_URL = 'https://covers.openlibrary.org/b/id'
// Open Library lets an identified script make 3 requests per second.
const HEADERS = { 'User-Agent': 'goodreads-e2-prototype/1.0 (university HCI course project)' }
const WORKERS = 2
// Open Library does not limit covers asked for by id.
const COVER_WORKERS = 2
const REQUEST_DELAY_MS = 450
const SEARCH_TIMEOUT_MS = 120_000
const REQUEST_TIMEOUT_MS = 30_000
const MAX_ATTEMPTS = 5

const POPULAR_TARGET = 1000
// More than the target, because the rules leave out a good part of the list.
const POPULAR_PAGES = 2
const PAGE_SIZE = 1000
const WORKS_TO_FETCH = 1500
const HISPANIC_TRIES_PER_BOOK = 6
const EDITIONS_PAGE_SIZE = 1000
const MAX_EDITION_PAGES = 3
const PENDING_FILES = 6

// A cover has to be a book cover before it is shrunk: portrait, and not a flat placeholder.
const COVER_WIDTH = 300
const MAX_COVER_BYTES = 15_500
const COVER_QUALITIES = [68, 60, 52, 45, 38, 32, 26]
const MIN_ORIGINAL_WIDTH = 150
const MIN_ASPECT = 0.45
const MAX_ASPECT = 0.9
const MIN_CONTRAST = 0.04

const SEARCH_FIELDS = [
  'key',
  'title',
  'author_name',
  'first_publish_year',
  'number_of_pages_median',
  'cover_i',
  'readinglog_count',
  'editions',
  'editions.key',
  'editions.title',
  'editions.language',
  'editions.cover_i',
].join(',')

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function request(url, timeout = REQUEST_TIMEOUT_MS) {
  for (let attempt = 1; ; attempt++) {
    try {
      const response = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(timeout) })
      // A 404 is a final answer (e.g. a cover that does not exist), not a reason to retry.
      if (response.ok || response.status === 404) return response
      throw new Error(`HTTP ${response.status}`)
    } catch (error) {
      if (attempt === MAX_ATTEMPTS) throw new Error(`${url}: ${error.message}`)
      await sleep(REQUEST_DELAY_MS * 3 ** attempt)
    } finally {
      await sleep(REQUEST_DELAY_MS)
    }
  }
}

async function requestJson(url, timeout) {
  const response = await request(url, timeout)
  return response.ok ? response.json() : undefined
}

async function exists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'))
const readSaved = async (path) => ((await exists(path)) ? readJson(path) : [])
const writeJson = (path, value) =>
  writeFile(path, `${JSON.stringify(value, null, 2).normalize('NFC')}\n`)

/** Runs the task over the items with a few workers, so a long list still respects the delay. */
async function forEach(items, task, workers = WORKERS) {
  let next = 0
  await Promise.all(
    Array.from({ length: workers }, async () => {
      while (next < items.length) {
        const index = next++
        await task(items[index], index)
      }
    }),
  )
}

async function search(params) {
  const query = new URLSearchParams({ lang: 'es', fields: SEARCH_FIELDS, ...params })
  const answer = await requestJson(`${API_URL}/search.json?${query}`, SEARCH_TIMEOUT_MS)
  return answer?.docs ?? []
}

const workId = (doc) => doc.key.replace('/works/', '')

async function fetchCandidates() {
  await mkdir(WORK_DIR, { recursive: true })
  const candidates = new Map()
  const add = (doc, source, extra = {}) => {
    const id = workId(doc)
    if (!candidates.has(id)) candidates.set(id, { ...doc, id, source, ...extra })
  }

  for (let page = 1; page <= POPULAR_PAGES; page++) {
    const docs = await search({
      q: 'language:spa',
      sort: 'readinglog',
      limit: String(PAGE_SIZE),
      page: String(page),
    })
    docs.forEach((doc) => add(doc, 'popular'))
    console.log(`popular, page ${page}: ${docs.length} docs`)
  }

  for (const { name, quota } of HISPANIC_AUTHORS) {
    const docs = await search({
      q: `author:"${name}" language:spa`,
      sort: 'readinglog',
      limit: String(Math.max(40, quota * 8)),
    })
    const own = docs.filter((doc) => doc.author_name?.some((author) => fold(author) === fold(name)))
    own.forEach((doc, rank) => add(doc, 'hispanic', { author: name, rank }))
    console.log(`${name}: ${own.length} of ${docs.length} docs`)
  }

  await writeJson(CANDIDATES_FILE, [...candidates.values()])
  console.log(`${candidates.size} candidates -> ${CANDIDATES_FILE}`)
}

const trimEdition = ({ key, title, subtitle, covers, publish_date, publishers, languages }) => ({
  key,
  title,
  subtitle,
  covers: covers?.filter((cover) => cover > 0),
  publishDate: publish_date,
  publishers,
  languages: languages?.map((language) => language.key.replace('/languages/', '')),
})

async function fetchSpanishEditions(id) {
  const editions = []
  for (let page = 0; page < MAX_EDITION_PAGES; page++) {
    const offset = page * EDITIONS_PAGE_SIZE
    const answer = await requestJson(
      `${API_URL}/works/${id}/editions.json?limit=${EDITIONS_PAGE_SIZE}&offset=${offset}`,
    )
    const entries = answer?.entries ?? []
    editions.push(...entries.map(trimEdition))
    if (entries.length < EDITIONS_PAGE_SIZE) break
  }
  return editions.filter((edition) => edition.languages?.includes('spa'))
}

async function fetchWorks() {
  const known = new Set((await readJson(BOOKS_FILE)).map((book) => book.id))
  const wanted = (doc, index) => {
    if (doc.source === 'popular') return index < WORKS_TO_FETCH
    const { quota } = HISPANIC_AUTHORS.find((author) => author.name === doc.author)
    return doc.rank < quota * HISPANIC_TRIES_PER_BOOK
  }
  const candidates = (await readJson(CANDIDATES_FILE)).filter(
    (doc, index) => !known.has(doc.id) && !dropReason(doc) && wanted(doc, index),
  )
  await mkdir(WORKS_DIR, { recursive: true })
  let done = 0
  await forEach(candidates, async (doc) => {
    const file = join(WORKS_DIR, `${doc.id}.json`)
    if (!(await exists(file))) {
      const work = await requestJson(`${API_URL}/works/${doc.id}.json`)
      const editions = await fetchSpanishEditions(doc.id)
      await writeJson(file, {
        title: work?.title,
        description: work?.description,
        firstPublishDate: work?.first_publish_date,
        editions,
      })
    }
    done += 1
    if (done % 50 === 0) console.log(`${done}/${candidates.length}`)
  })
  console.log(`${candidates.length} works -> ${WORKS_DIR}`)
}

/** How many times the Spanish descriptions at hand write each word in lowercase. */
async function spanishVocabulary(current, candidates) {
  const vocabulary = new Map()
  const addText = (text) => {
    for (const word of lowercaseWords(text)) vocabulary.set(word, (vocabulary.get(word) ?? 0) + 1)
  }
  for (const book of current) addText(book.description ?? '')
  for (const { id } of candidates) {
    const file = join(WORKS_DIR, `${id}.json`)
    if (!(await exists(file))) continue
    const { description, editions } = await readJson(file)
    const text = typeof description === 'string' ? description : description?.value
    if (text && detectLanguage(text) === 'es') addText(text)
    for (const edition of editions) addText(edition.title ?? '')
  }
  return vocabulary
}

async function selectBooks() {
  const current = await readJson(BOOKS_FILE)
  const knownIds = new Set(current.map((book) => book.id))
  const seen = new Map()
  for (const book of current) {
    for (const key of dedupeKeys(book.title, book.authors)) seen.set(key, book.id)
  }
  const candidates = await readJson(CANDIDATES_FILE)
  const dropped = []
  const drop = (doc, reason) => dropped.push({ id: doc.id, title: doc.title, reason })

  const vocabulary = await spanishVocabulary(current, candidates)
  // Found by the covers stage. Running select again lets the next books on the lists take their place.
  const noCover = new Set((await readSaved(MISSING_COVERS_FILE)).map(({ id }) => id))

  const selected = []
  let popular = 0
  const hispanicCount = new Map()

  // The popular list first, so a popular book that is also by a listed author counts as popular.
  const ordered = [
    ...candidates.filter((doc) => doc.source === 'popular'),
    ...candidates.filter((doc) => doc.source === 'hispanic'),
  ]
  for (const doc of ordered) {
    if (knownIds.has(doc.id)) continue
    const isPopular = doc.source === 'popular'
    if (isPopular && popular >= POPULAR_TARGET) continue
    const quota = HISPANIC_AUTHORS.find((author) => author.name === doc.author)?.quota ?? 0
    if (!isPopular && (hispanicCount.get(doc.author) ?? 0) >= quota) continue

    if (!isPopular && PASSED_OVER_WORKS.has(doc.id)) continue
    if (EXCLUDED_WORKS[doc.id]) {
      drop(doc, EXCLUDED_WORKS[doc.id])
      continue
    }
    const reason = dropReason(doc)
    if (reason) {
      drop(doc, reason)
      continue
    }
    if (noCover.has(doc.id)) {
      drop(doc, 'sin portada de edición en español')
      continue
    }
    const file = join(WORKS_DIR, `${doc.id}.json`)
    if (!(await exists(file))) {
      drop(doc, 'no se bajó la obra')
      continue
    }
    const work = await readJson(file)
    const fixes = BOOK_FIXES[doc.id] ?? {}
    const edition = chooseEdition(doc, work.editions, UNTRANSLATED_TITLES, fixes, vocabulary)
    if (edition.reason) {
      drop(doc, edition.reason)
      continue
    }
    const authors = fixes.authors ?? cleanAuthors(doc.author_name, doc.author)
    const title = fixes.title ?? edition.title
    const keys = dedupeKeys(title, authors, doc.title)
    const twin = keys.map((key) => seen.get(key)).find(Boolean)
    if (twin) {
      drop(doc, `misma obra que ${twin}`)
      continue
    }
    keys.forEach((key) => seen.set(key, doc.id))
    selected.push({
      id: doc.id,
      source: doc.source,
      title,
      originalTitle: doc.title,
      authors,
      year: 'year' in fixes ? (fixes.year ?? undefined) : doc.first_publish_year || undefined,
      pages: doc.number_of_pages_median || undefined,
      covers: fixes.coverId ? [fixes.coverId] : edition.covers,
      spanishEditions: work.editions.length,
      description: work.description,
    })
    if (isPopular) popular += 1
    else hispanicCount.set(doc.author, (hispanicCount.get(doc.author) ?? 0) + 1)
  }
  await writeJson(SELECTED_FILE, selected)
  await writeJson(DROPPED_FILE, dropped)
  console.log(
    `${selected.length} selected (${popular} popular, ${selected.length - popular} hispanic), ` +
      `${dropped.length} dropped`,
  )
}

async function inspectCover(file) {
  const { stdout } = await run('magick', [
    'identify',
    '-format',
    '%w %h %[fx:standard_deviation]\n',
    `${file}[0]`,
  ])
  const [width, height, contrast] = stdout.trim().split(' ').map(Number)
  return { width, height, contrast }
}

async function downloadOriginal(coverId) {
  const file = join(ORIGINAL_COVERS_DIR, `${coverId}.jpg`)
  if (await exists(file)) return file
  const response = await request(`${COVERS_URL}/${coverId}-L.jpg?default=false`)
  if (!response.ok) return undefined
  await writeFile(file, Buffer.from(await response.arrayBuffer()))
  return file
}

/** The highest quality that fits; a cover full of detail ends at the lowest one. */
async function shrinkCover(source, target) {
  const scratch = `${target}.tmp.jpg`
  for (const quality of COVER_QUALITIES) {
    await run('magick', [
      `${source}[0]`,
      '-auto-orient',
      '-colorspace',
      'sRGB',
      '-resize',
      `${COVER_WIDTH}x>`,
      '-strip',
      '-sampling-factor',
      '4:2:0',
      '-interlace',
      'JPEG',
      '-quality',
      String(quality),
      scratch,
    ])
    if ((await stat(scratch)).size <= MAX_COVER_BYTES) break
  }
  await rename(scratch, target)
}

const isCoverShape = ({ width, height, contrast }) =>
  width >= MIN_ORIGINAL_WIDTH &&
  width / height >= MIN_ASPECT &&
  width / height <= MAX_ASPECT &&
  contrast >= MIN_CONTRAST

/** The first cover of the Spanish editions that looks like a cover. */
async function firstGoodCover(book) {
  let lastError
  for (const coverId of book.covers.filter((cover) => !REJECTED_COVERS.has(cover))) {
    try {
      const file = await downloadOriginal(coverId)
      if (file && isCoverShape(await inspectCover(file))) return { coverId, file }
    } catch (error) {
      lastError = error
    }
  }
  if (lastError) throw lastError
  return undefined
}

async function fetchCovers() {
  await mkdir(ORIGINAL_COVERS_DIR, { recursive: true })
  await mkdir(COVERS_DIR, { recursive: true })
  const current = new Set((await readJson(BOOKS_FILE)).map((book) => book.id))
  const selected = await readJson(SELECTED_FILE)
  const covered = []
  const missing = await readSaved(MISSING_COVERS_FILE)
  const failed = []
  let done = 0
  await forEach(
    selected,
    async (book) => {
      if (current.has(book.id)) throw new Error(`${book.id} is one of the 54 books`)
      try {
        const cover = await firstGoodCover(book)
        if (cover) {
          await shrinkCover(cover.file, join(COVERS_DIR, `${book.id}.jpg`))
          covered.push({ ...book, coverId: cover.coverId })
        } else {
          const reason = 'sin portada de edición en español'
          missing.push({ id: book.id, title: book.title, reason })
        }
      } catch (error) {
        // The covers server has bad minutes. Not having answered does not mean there is no cover.
        failed.push(`${book.id}: ${error.message}`)
      }
      done += 1
      if (done % 50 === 0) console.log(`${done}/${selected.length}`)
    },
    COVER_WORKERS,
  )
  if (failed.length) {
    console.error(failed.join('\n'))
    console.error(`${failed.length} covers did not download. Run this stage again.`)
    process.exitCode = 1
    return
  }
  // A stage that ran before may have left the cover of a book that is no longer in.
  const kept = new Set([...current, ...selected.map(({ id }) => id)])
  for (const file of await readdir(COVERS_DIR)) {
    if (!kept.has(basename(file, '.jpg'))) await rm(join(COVERS_DIR, file))
  }
  const order = new Map(selected.map((book, index) => [book.id, index]))
  covered.sort((a, b) => order.get(a.id) - order.get(b.id))
  await writeJson(COVERED_FILE, covered)
  await writeJson(MISSING_COVERS_FILE, missing)
  console.log(`${covered.length} with cover, ${missing.length} without`)
}

async function writePending() {
  const covered = await readJson(COVERED_FILE)
  const books = []
  const pending = []
  const report = { spanish: 0, toTranslate: 0, none: {} }
  for (const { id, title, authors, year, pages, description: raw } of covered) {
    const fixes = BOOK_FIXES[id] ?? {}
    const { description, language, reason } = describe(
      fixes.description ?? raw,
      fixes.noDescription,
    )
    books.push({
      id,
      title: fixes.title ?? title,
      authors,
      coverUrl: `/covers/${id}.jpg`,
      ...(language === 'es' ? { description } : {}),
      year: 'year' in fixes ? (fixes.year ?? undefined) : year,
      pages,
    })
    if (language === 'es') report.spanish += 1
    else if (description) {
      report.toTranslate += 1
      pending.push({ id, title, authors, description, sourceLanguage: language })
    } else report.none[reason] = (report.none[reason] ?? 0) + 1
  }
  await writeJson(BOOKS_OUT_FILE, books)
  const parts = splitEvenly(pending, PENDING_FILES)
  await Promise.all(
    parts.map((part, index) => writeJson(join(WORK_DIR, `pendientes-${index + 1}.json`), part)),
  )
  console.log(`${books.length} books -> ${BOOKS_OUT_FILE}`, report)
  console.log('pending files:', parts.map((part) => part.length).join(', '))
}

async function readPending() {
  const parts = await Promise.all(
    Array.from({ length: PENDING_FILES }, (_, index) =>
      readJson(join(WORK_DIR, `pendientes-${index + 1}.json`)),
    ),
  )
  return parts.flat()
}

/**
 * An entry already in the file stays, so a correction made there survives another run. The first
 * file wins when two of them translated the same book, and null means the text was left out on
 * purpose: its book goes in BOOK_FIXES with noDescription.
 */
async function mergeTranslations() {
  const merged = await readJson(TRANSLATIONS_FILE)
  const pending = new Map((await readPending()).map((book) => [book.id, book]))
  const files = (await readdir(WORK_DIR)).filter((file) => /^traducidas-.*\.json$/.test(file))
  for (const file of files.toSorted()) {
    for (const [id, description] of Object.entries(await readJson(join(WORK_DIR, file)))) {
      const book = pending.get(id)
      if (!description || !book || merged[id]) continue
      merged[id] = { sourceLanguage: book.sourceLanguage, description }
    }
  }
  const sorted = Object.keys(merged).toSorted()
  await writeJson(TRANSLATIONS_FILE, Object.fromEntries(sorted.map((id) => [id, merged[id]])))
  console.log(`${sorted.length} translations -> ${TRANSLATIONS_FILE}`)
}

/** Stops at the first run with a book left to translate or a text that is not ready to be shown. */
async function checkTranslations(translations) {
  const missing = (await readPending()).filter(({ id }) => !translations[id]).map(({ id }) => id)
  const problems = Object.entries(translations).flatMap(([id, { description }]) => {
    const found = translationProblems(description)
    return found.length > 0 ? [`${id}: ${found.join(', ')}`] : []
  })
  if (missing.length > 0 || problems.length > 0) {
    throw new Error(`Sin traducir: ${missing.join(' ')}\nPor corregir:\n${problems.join('\n')}`)
  }
}

const bytes = (text) => ({
  raw: Buffer.byteLength(text),
  gzip: gzipSync(text, { level: 9 }).length,
  brotli: brotliCompressSync(text).length,
})

/** The most read first, so a search shows them before the rest of the books that match it. */
async function writeIndex(books) {
  const reads = new Map(
    (await readJson(CANDIDATES_FILE)).map(({ id, readinglog_count: count }) => [id, count ?? 0]),
  )
  const colours = await readJson(COLOURS_FILE)
  const rows = books
    .toSorted((a, b) => (reads.get(b.id) ?? 0) - (reads.get(a.id) ?? 0))
    .map(({ id, title, authors, year, pages }) => [
      id,
      title,
      authors,
      year ?? null,
      pages ?? null,
      colours[id] ?? null,
    ])
  const text = JSON.stringify(rows)
  await writeFile(join(CATALOG_DIR, 'index.json'), text)
  console.log('index', rows.length, bytes(text))
}

/** The 54 books keep their text in books.json, so only the rest needs a file. */
async function writeDescriptions(books, translations) {
  const groups = Array.from({ length: DESCRIPTION_GROUPS }, () => ({}))
  for (const { id, description } of books) {
    const translated = translations[id]?.description
    const text = description ?? translated
    if (!text) continue
    groups[descriptionGroup(id)][id] = translated
      ? { description: text, descriptionTranslated: true }
      : { description: text }
  }
  await mkdir(join(CATALOG_DIR, 'descriptions'), { recursive: true })
  const sizes = await Promise.all(
    groups.map(async (group, index) => {
      const text = JSON.stringify(group)
      await writeFile(join(CATALOG_DIR, 'descriptions', `${index}.json`), text)
      return bytes(text).gzip
    }),
  )
  console.log('descriptions', groups.flatMap(Object.keys).length, 'gzip per group', sizes.join(' '))
}

async function publishCatalog() {
  const translations = await readJson(TRANSLATIONS_FILE)
  await checkTranslations(translations)
  const seeds = await readJson(BOOKS_FILE)
  const books = await readJson(BOOKS_OUT_FILE)
  await rm(CATALOG_DIR, { recursive: true, force: true })
  await mkdir(CATALOG_DIR, { recursive: true })
  await writeIndex([...seeds, ...books])
  await writeDescriptions(books, translations)
}

const STAGES = {
  candidates: fetchCandidates,
  works: fetchWorks,
  select: selectBooks,
  covers: fetchCovers,
  pending: writePending,
  translations: mergeTranslations,
  publish: publishCatalog,
}

const stage = STAGES[process.argv[2]]
if (!stage) {
  console.error(`Usage: node scripts/seed-catalog.mjs ${Object.keys(STAGES).join('|')}`)
  process.exitCode = 1
} else {
  await stage()
}
