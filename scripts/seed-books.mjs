// Builds the preloaded catalog: src/data/books.json plus the covers in public/covers/.
// Run once with `node scripts/seed-books.mjs`; the output is committed so the app never
// depends on Open Library to start. Node 22, no dependencies beyond the project's prettier.
import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as prettier from 'prettier'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUTPUT_FILE = join(ROOT, 'src/data/books.json')
const COVERS_DIR = join(ROOT, 'public/covers')
// Spanish translations of Open Library's descriptions, by work key, with the source language.
const TRANSLATIONS_FILE = join(ROOT, 'scripts/translated-descriptions.json')

const SEARCH_URL = 'https://openlibrary.org/search.json'
const SEARCH_FIELDS = [
  'key',
  'title',
  'author_name',
  'first_publish_year',
  'number_of_pages_median',
  'cover_i',
  'editions',
  'editions.key',
  'editions.title',
  'editions.language',
  'editions.cover_i',
].join(',')

const REQUEST_DELAY_MS = 400
const REQUEST_TIMEOUT_MS = 15_000
const MAX_ATTEMPTS = 3
// Open Library asks scripts to identify themselves.
const HEADERS = { 'User-Agent': 'goodreads-e2-prototype/1.0 (university HCI course project)' }

// Queried with the original title and author; `id` pins the Open Library work when the search
// returns the wrong one. The order is the order of books.json.
const CATALOG = [
  // T1 book
  { title: 'The Man Who Mistook His Wife for a Hat', author: 'Oliver Sacks' },
  // Horror
  { title: 'It', author: 'Stephen King' },
  { title: 'The Shining', author: 'Stephen King' },
  { title: 'Pet Sematary', author: 'Stephen King' },
  { title: 'Carrie', author: 'Stephen King' },
  { title: 'Dracula', author: 'Bram Stoker' },
  { title: 'Frankenstein', author: 'Mary Shelley' },
  { title: 'The Haunting of Hill House', author: 'Shirley Jackson' },
  { title: 'Mexican Gothic', author: 'Silvia Moreno-Garcia', id: 'OL20759125W' },
  { title: 'Nuestra parte de noche', author: 'Mariana Enriquez' },
  { title: 'Las cosas que perdimos en el fuego', author: 'Mariana Enriquez' },
  { title: 'The Exorcist', author: 'William Peter Blatty' },
  // Novels
  { title: 'Cien años de soledad', author: 'Gabriel García Márquez' },
  { title: 'El amor en los tiempos del cólera', author: 'Gabriel García Márquez' },
  { title: 'Crónica de una muerte anunciada', author: 'Gabriel García Márquez' },
  { title: 'La casa de los espíritus', author: 'Isabel Allende' },
  { title: 'Rayuela', author: 'Julio Cortázar' },
  { title: 'Pedro Páramo', author: 'Juan Rulfo' },
  { title: 'La sombra del viento', author: 'Carlos Ruiz Zafón' },
  { title: 'Los detectives salvajes', author: 'Roberto Bolaño' },
  { title: 'El túnel', author: 'Ernesto Sabato' },
  { title: 'Ficciones', author: 'Jorge Luis Borges' },
  { title: 'Don Quijote', author: 'Miguel de Cervantes' },
  { title: 'Pride and Prejudice', author: 'Jane Austen' },
  { title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', id: 'OL166894W' },
  { title: 'The Metamorphosis', author: 'Franz Kafka', id: 'OL498556W' },
  { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
  { title: 'To Kill a Mockingbird', author: 'Harper Lee' },
  { title: 'Animal Farm', author: 'George Orwell' },
  { title: 'Le Petit Prince', author: 'Antoine de Saint-Exupéry' },
  { title: "Harry Potter and the Philosopher's Stone", author: 'J. K. Rowling' },
  // Science fiction
  { title: 'Nineteen Eighty-Four', author: 'George Orwell' },
  { title: 'Dune', author: 'Frank Herbert' },
  { title: 'Fahrenheit 451', author: 'Ray Bradbury' },
  { title: 'The Martian Chronicles', author: 'Ray Bradbury' },
  { title: 'Brave New World', author: 'Aldous Huxley' },
  { title: 'Foundation', author: 'Isaac Asimov' },
  { title: 'I, Robot', author: 'Isaac Asimov' },
  { title: 'Neuromancer', author: 'William Gibson' },
  { title: 'Do Androids Dream of Electric Sheep?', author: 'Philip K. Dick' },
  { title: "The Handmaid's Tale", author: 'Margaret Atwood' },
  { title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin' },
  { title: 'The Three-Body Problem', author: 'Liu Cixin', id: 'OL17267881W' },
  { title: 'Solaris', author: 'Stanisław Lem' },
  { title: 'The War of the Worlds', author: 'H. G. Wells' },
  // Non-fiction
  { title: 'Sapiens', author: 'Yuval Noah Harari' },
  { title: 'A Brief History of Time', author: 'Stephen Hawking' },
  { title: 'Cosmos', author: 'Carl Sagan' },
  { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman' },
  { title: "Man's Search for Meaning", author: 'Viktor E. Frankl', id: 'OL1268413W' },
  { title: 'Las venas abiertas de América Latina', author: 'Eduardo Galeano' },
  { title: 'The Diary of a Young Girl', author: 'Anne Frank', id: 'OL266178W' },
  { title: 'The Selfish Gene', author: 'Richard Dawkins' },
  { title: 'Atomic Habits', author: 'James Clear' },
]

// Manual fixes by work key, for titles or authors that come back in the original language or
// with edition noise ("Un mundo feliz / Brave New World").
const OVERRIDES = {
  // The cover of the first Spanish edition has a library barcode over the author's name.
  OL81613W: { coverId: 8179786 },
  OL81631W: { title: 'Cementerio de animales' },
  OL450063W: { title: 'Frankenstein o el moderno Prometeo' },
  OL274505W: { title: 'Cien años de soledad' },
  OL110971W: { title: 'Ficciones' },
  OL503666W: { title: 'Don Quijote de la Mancha', year: 1605 },
  OL66554W: { title: 'Orgullo y prejuicio' },
  OL166894W: { title: 'Crimen y castigo' },
  OL498556W: { title: 'La metamorfosis' },
  OL468431W: { title: 'El gran Gatsby', year: 1925 },
  OL3140822W: { title: 'Matar a un ruiseñor' },
  OL10263W: { title: 'El principito' },
  OL1168083W: { title: '1984' },
  OL893414W: { title: 'Dune' },
  OL46241W: { title: 'Yo, robot' },
  OL2172356W: { title: '¿Sueñan los androides con ovejas eléctricas?' },
  OL17267881W: { title: 'El problema de los tres cuerpos', authors: ['Liu Cixin'] },
  OL52114W: { year: 1898 },
  OL17075811W: { title: 'Sapiens. De animales a dioses' },
  OL1892617W: { title: 'Breve historia del tiempo' },
  OL15992072W: { title: 'Pensar rápido, pensar despacio' },
  OL1268413W: { title: 'El hombre en busca de sentido', authors: ['Viktor E. Frankl'] },
  OL1966488W: { title: 'El gen egoísta' },
  OL17930368W: { title: 'Hábitos atómicos' },
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function request(url) {
  for (let attempt = 1; ; attempt++) {
    try {
      const response = await fetch(url, {
        headers: HEADERS,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      })
      // A 404 is a final answer (e.g. a cover that does not exist), not a reason to retry.
      if (response.ok || response.status === 404) return response
      throw new Error(`HTTP ${response.status}`)
    } catch (error) {
      if (attempt === MAX_ATTEMPTS) throw new Error(`${url}: ${error.message}`)
      await sleep(REQUEST_DELAY_MS * 2 ** attempt)
    } finally {
      await sleep(REQUEST_DELAY_MS)
    }
  }
}

async function requestJson(url) {
  const response = await request(url)
  return response.ok ? response.json() : undefined
}

async function search(q) {
  const params = new URLSearchParams({ q, lang: 'es', limit: '1', fields: SEARCH_FIELDS })
  const result = await requestJson(`${SEARCH_URL}?${params}`)
  return result?.docs[0]
}

function workId(doc) {
  return doc.key.replace('/works/', '')
}

// Two steps because the search also filters editions by the query text: searching the original
// title would hide the Spanish editions, so the work is found first and then fetched by its key.
async function searchWork({ title, author, id }) {
  const workKey = id ?? (await search(`${title} ${author}`).then((doc) => doc && workId(doc)))
  return workKey ? search(`key:/works/${workKey}`) : undefined
}

// With lang=es Open Library ranks the Spanish edition first, but only when one exists.
function spanishEdition(doc) {
  const edition = doc.editions?.docs[0]
  return edition?.language?.includes('spa') ? edition : undefined
}

const SPANISH_WORDS = /\b(el|los|las|que|del|una|por|con|y|se)\b/gi
const ENGLISH_WORDS = /\b(the|and|of|is|with)\b/gi
const countMatches = (text, pattern) => text.match(pattern)?.length ?? 0

// The UI is in Spanish and many works only carry an English, French or Dutch description. Those
// are never shown in another language: they come from TRANSLATIONS_FILE, or the book has none.
function isSpanish(text) {
  const spanish = countMatches(text, SPANISH_WORDS)
  return spanish >= 3 && spanish > countMatches(text, ENGLISH_WORDS)
}

// Work descriptions are a string or { value }, written in Markdown, and often end with a list of
// source links. The app shows plain text.
function cleanDescription(raw) {
  const text = typeof raw === 'string' ? raw : raw?.value
  if (!text) return undefined
  const cleaned = text
    .split(/\n-{3,}|Also contained in:/)[0]
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*+([^*]+)\*+/g, '$1')
    .replace(/\r/g, '')
    .trim()
  return cleaned && isSpanish(cleaned) ? cleaned : undefined
}

async function fetchDescription(id) {
  const work = await requestJson(`https://openlibrary.org/works/${id}.json`)
  return cleanDescription(work?.description)
}

// A description that comes in Spanish wins: it needs no translation, so it carries no mark.
async function buildDescription(id, translations) {
  const description = await fetchDescription(id)
  if (description) return { description }
  const translation = translations[id]
  return translation ? { description: translation.description, descriptionTranslated: true } : {}
}

async function fileExists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

/** Returns the public URL of the cover, or undefined when Open Library has none. */
async function downloadCover(id, coverId) {
  if (!coverId) return undefined
  const file = join(COVERS_DIR, `${id}.jpg`)
  const publicUrl = `/covers/${id}.jpg`
  if (await fileExists(file)) return publicUrl
  const response = await request(
    `https://covers.openlibrary.org/b/id/${coverId}-L.jpg?default=false`,
  )
  if (!response.ok) return undefined
  await writeFile(file, Buffer.from(await response.arrayBuffer()))
  return publicUrl
}

async function buildBook(query, translations) {
  const doc = await searchWork(query)
  if (!doc) return undefined
  const id = workId(doc)
  const edition = spanishEdition(doc)
  const { coverId, ...fixes } = OVERRIDES[id] ?? {}
  const book = {
    id,
    title: edition?.title ?? doc.title,
    authors: doc.author_name ?? [query.author],
    coverUrl: await downloadCover(id, coverId ?? edition?.cover_i ?? doc.cover_i),
    ...(await buildDescription(id, translations)),
    // Open Library sometimes reports 0 for an unknown year.
    year: doc.first_publish_year || undefined,
    pages: doc.number_of_pages_median || undefined,
  }
  return { book: { ...book, ...fixes }, hasSpanishEdition: Boolean(edition) }
}

async function main() {
  await mkdir(COVERS_DIR, { recursive: true })
  const translations = JSON.parse(await readFile(TRANSLATIONS_FILE, 'utf8'))
  const books = []
  const problems = []

  for (const query of CATALOG) {
    const label = `${query.title} (${query.author})`
    const result = await buildBook(query, translations)
    if (!result) {
      problems.push(`not found: ${label}`)
      continue
    }
    const { book, hasSpanishEdition } = result
    if (books.some((existing) => existing.id === book.id)) {
      problems.push(`duplicate work ${book.id}: ${label}`)
      continue
    }
    if (!hasSpanishEdition) problems.push(`no Spanish edition: ${label} -> ${book.id}`)
    if (!book.coverUrl) problems.push(`no cover: ${label} -> ${book.id}`)
    books.push(book)
    console.log(`${book.id}  ${book.title}`)
  }

  // Open Library mixes composed and decomposed accents; decomposed ones break text search.
  const json = JSON.stringify(books, null, 2).normalize('NFC')
  const options = await prettier.resolveConfig(OUTPUT_FILE)
  await writeFile(OUTPUT_FILE, await prettier.format(json, { ...options, filepath: OUTPUT_FILE }))

  const withCover = books.filter((book) => book.coverUrl).length
  console.log(
    `\n${books.length}/${CATALOG.length} books, ${withCover} with cover -> ${OUTPUT_FILE}`,
  )
  for (const problem of problems) console.warn(`  ! ${problem}`)
  // Missing books would break the seed library, which references them by id.
  if (books.length < CATALOG.length) process.exitCode = 1
}

await main()
