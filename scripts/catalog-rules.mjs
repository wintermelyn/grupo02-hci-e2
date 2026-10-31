// The rules of seed-catalog.mjs that need no network: what a book must be to enter the catalog and
// what a description must be to be kept or translated.
import { AUTHOR_NAMES, EXCLUDED_AUTHORS, EXCLUDED_TITLES } from './catalog-lists.mjs'

const MAX_DESCRIPTION = 1500
// Below this, a cut would leave a sentence fragment rather than a description.
const MIN_CUT = 300
const MIN_DESCRIPTION = 80

/** Lowercase, no accents and no punctuation: the form two spellings of a text share. */
export const fold = (text) =>
  text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/&/g, ' y ')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()

// Reading aids and exercise books: they live next to the book they are about in Open Library.
const NOT_A_BOOK = [
  [/\b(summary|summaries|resumen|resúmenes|sinopsis)\b/i, 'resumen'],
  [
    /\b(key takeaways|analysis of|an analysis|análisis de|companion to|guide to reading)\b/i,
    'resumen',
  ],
  [
    /\b(study guide|guía(s)? de (estudio|lectura)|reader'?s guide|teacher'?s (guide|edition))\b/i,
    'guía de estudio',
  ],
  [
    /\b(sparknotes|spark notes|cliff'?s ?notes|barron'?s|york notes|shmoop|bookrags)\b/i,
    'guía de estudio',
  ],
  [
    /\b(workbook|work book|cuadernos? (de )?(ejercicios|trabajo|actividades)|activity book|exercise book)\b/i,
    'cuaderno de ejercicios',
  ],
  [
    /\b(colou?ring book|libro para colorear|para colorear|sticker book|journal:|planner|agenda \d{4})\b/i,
    'cuaderno de ejercicios',
  ],
  [
    /\b(box(ed)? set|boxset|estuche|trilog(y|[ií]a)|pack \d|omnibus|obras completas?|complete works|colecci[oó]n completa|\d+[- ]book)\b/i,
    'caja o recopilación de una misma obra',
  ],
]

const NOT_AN_AUTHOR =
  /\b(sparknotes|instaread|bookrags|cliffsnotes|readtrepreneur|quickread|summary)\b/i

/** Why a search result stays out, judging by its title and authors. */
export function dropReason({ title = '', author_name: authors = [], editions }) {
  if (authors.some((author) => NOT_AN_AUTHOR.test(author))) return 'guía de estudio'
  const excludedAuthor = EXCLUDED_AUTHORS[spaceInitials(authors[0] ?? '')]
  if (excludedAuthor) return excludedAuthor
  const spanish = editions?.docs?.[0]?.title ?? ''
  const titles = [title, spanish]
  if (EXCLUDED_TITLES.some((pattern) => titles.some((text) => pattern.test(text)))) {
    return 'propaganda de odio'
  }
  const found = NOT_A_BOOK.find(([pattern]) => titles.some((text) => pattern.test(text)))
  return found?.[1]
}

const ENGLISH_WORDS =
  /\b(the|of|and|to|in|for|with|my|your|how|from|on|at|an|is|are|you|why|what|when|who|new|life|story|book)\b/gi
const SPANISH_MARKS =
  /[áéíóúñ¿¡]|\b(el|la|los|las|un|una|unos|unas|de|del|y|en|que|por|para|con|sin|mi|tu|su|al|lo|es)\b/gi
const count = (text, pattern) => text.match(pattern)?.length ?? 0

/** The words a Spanish text writes in lowercase. */
export const lowercaseWords = (text) => text.match(/(?<![\p{L}\p{M}])\p{Ll}[\p{L}\p{M}]+/gu) ?? []

export const looksSpanish = (title) => count(title, SPANISH_MARKS) > 0
const looksEnglish = (title) => count(title, ENGLISH_WORDS) > count(title, SPANISH_MARKS)

const capitalize = (text) => text.charAt(0).toLocaleUpperCase('es') + text.slice(1)
const isAllCaps = (title) => title === title.toUpperCase() && /\p{L}{3}/u.test(title)

const ARTICLE = /^(el|la|los|las|un|una|the|a|an)\s+/
const titleKey = (title) => fold(title).replace(ARTICLE, '')

// Spanish does not write these: the edition is in Catalan, Galician, Portuguese or French.
const OTHER_LANGUAGE =
  /[àèìòùâêîôûãõçïë\uFFFD]|\b(dels|amb|els|um|uma|não|jovens)\b|\b[ld]'|^(o|os|as)\s/i

const stripNotes = (title) =>
  title.replace(/\s*[([][^)\]]*[)\]]\s*$/g, '').replace(/\s*[([][^)\]]*[)\]]\s*$/g, '')

/** Takes the edition's noise off a title: "EL HOBBIT / The Hobbit (Spanish Edition)." */
export function cleanTitle(raw) {
  const title = stripNotes(raw.normalize('NFC').replace(/\s+/g, ' '))
  const part = title.split(/\s+[/=]\s+|\s*\/\s*/).find((piece) => !looksEnglish(piece)) ?? title
  const trimmed = stripNotes(part)
    .replace(/[:;]\s*(una\s+)?novela\s*$/i, '')
    .replace(/[\s.,:;/-]+$/, '')
    .trim()
  if (!isAllCaps(trimmed)) return trimmed
  return capitalize(trimmed.toLocaleLowerCase('es'))
}

const WORD = /(\p{L}[\p{L}\p{M}'’-]*)|([.:?!¡¿]+)/gu
const HAS_ACCENT = /[áéíóúü]/i
// "Dias" becomes "Días" only if the accented form clearly wins: "como" and "cómo" both exist.
const ACCENT_MARGIN = 3

/**
 * Writes a title the way Spanish does. Open Library often uses English capitals ("Reina de
 * Sombras") or drops accents and eñes ("El senor de los anillos"). A capital word counts as a name
 * unless the vocabulary, a Map of the words seen in lowercase in Spanish text with their counts,
 * has it.
 */
export function sentenceCase(title, vocabulary) {
  const forms = new Map()
  for (const [word, times] of vocabulary) {
    const key = fold(word)
    if (times > (forms.get(key)?.times ?? 0)) forms.set(key, { word, times })
  }
  let afterBreak = true
  return capitalize(
    title.replace(WORD, (match, word) => {
      if (!word) {
        afterBreak = true
        return match
      }
      const first = afterBreak
      afterBreak = false
      const lower = word.toLocaleLowerCase('es')
      const known = forms.get(fold(lower))
      const accented =
        !HAS_ACCENT.test(lower) &&
        known &&
        known.word !== lower &&
        (HAS_ACCENT.test(known.word) || known.word.includes('ñ')) &&
        known.times > (vocabulary.get(lower) ?? 0) * ACCENT_MARGIN
      const form = accented ? known.word : lower
      const isCapital = /^\p{Lu}/u.test(word)
      const isName = isCapital && !vocabulary.has(form)
      if (isName) return accented ? capitalize(form) : word
      if (word === word.toUpperCase() && word.length > 1 && !accented) return word
      return first && isCapital ? capitalize(form) : form
    }),
  )
}

const capitalWords = (title) => count(title.slice(1), /\b\p{Lu}/gu)
const yearOf = ({ publishDate }) => Number(publishDate?.match(/\d{4}/)?.[0] ?? 0)

const leadingArticle = (title) => (ARTICLE.test(fold(title)) ? 1 : 0)
const accents = (title) => count(title, /[áéíóúñü¿¡]/gi)
// The spelling of a title that loses the least: article, accents, then the fewest capitals.
const betterSpelling = (a, b) =>
  leadingArticle(b.clean) - leadingArticle(a.clean) ||
  accents(b.clean) - accents(a.clean) ||
  capitalWords(a.clean) - capitalWords(b.clean)

/**
 * The Spanish title that most editions agree on, and the covers of the Spanish editions, the ones
 * with that title and the newest first. An edition with a title in another language has its
 * language wrong, so it does not vote and its cover is not used. Publishers often sort a title
 * without its article, so "Arte de la guerra" counts for "El arte de la guerra".
 */
export function chooseEdition(doc, editions, untranslated, fixes = {}, vocabulary = new Map()) {
  const fromSearch = doc.editions?.docs?.[0]
  const all = [
    ...editions,
    ...(fromSearch?.language?.includes('spa')
      ? [{ title: fromSearch.title, covers: fromSearch.cover_i ? [fromSearch.cover_i] : [] }]
      : []),
  ]
  const usable = all
    .filter((edition) => edition.title)
    .map((edition) => ({ ...edition, clean: cleanTitle(edition.title) }))
    .filter(({ clean }) => clean && !looksEnglish(clean) && !OTHER_LANGUAGE.test(clean))
  if (!usable.length && !fixes.title) return { reason: 'sin edición en español' }

  const isChecked = doc.source === 'hispanic' || untranslated.has(doc.id)
  const isOriginal = (key) => key === titleKey(doc.title) && !isChecked
  const groups = Map.groupBy(usable, (edition) => titleKey(edition.clean))
  const ranked = [...groups].sort(
    ([keyA, a], [keyB, b]) => isOriginal(keyA) - isOriginal(keyB) || b.length - a.length,
  )
  const pinned = fixes.title && ranked.find(([key]) => key === titleKey(fixes.title))
  const [winnerKey, winner = []] = pinned ?? ranked[0] ?? []
  const title = winner.toSorted(betterSpelling)[0]?.clean

  if (!fixes.title && isOriginal(winnerKey) && !looksSpanish(title)) {
    return { reason: 'sin título español confiable' }
  }

  const newestFirst = (a, b) => yearOf(b) - yearOf(a)
  const covers = [
    ...winner.toSorted(newestFirst),
    ...usable.filter((edition) => !winner.includes(edition)).toSorted(newestFirst),
  ].flatMap((edition) => edition.covers ?? [])
  const unique = [...new Set(covers)]
  if (!unique.length) return { reason: 'sin portada de edición en español' }
  // A checked title keeps the capitals of the original: "American Gods".
  const isSameAsOriginal = title && fold(title) === fold(doc.title)
  const keepsOriginal = isSameAsOriginal && untranslated.has(doc.id)
  const finalTitle = keepsOriginal ? doc.title : title && sentenceCase(title, vocabulary)
  return { title: finalTitle, covers: unique }
}

const spaceInitials = (name) =>
  name
    .normalize('NFC')
    .replace(/\s+/g, ' ')
    .replace(/\b(\p{Lu})\.(?=\p{Lu})/gu, '$1. ')
    .trim()

/**
 * The first author, written one way so the app counts one person once. Open Library also lists
 * translators and illustrators as authors; real co-authors go in BOOK_FIXES.
 */
export function cleanAuthors(names = [], canonical) {
  const name = spaceInitials(canonical ?? names[0] ?? '')
  return name ? [AUTHOR_NAMES[fold(name)] ?? name] : []
}

/** Two works by the same author with one of these in common are the same book. */
export function dedupeKeys(title, authors, originalTitle) {
  const surname = fold(authors[0] ?? '')
    .split(' ')
    .pop()
  const keys = [`${surname}|${titleKey(title)}`]
  if (originalTitle) keys.push(`${surname}|${titleKey(originalTitle)}`)
  return keys
}

// Open Library keeps its descriptions in Markdown, and a few in HTML. Same cleaning as
// descriptionOf in src/lib/openlibrary.ts, which a script cannot import.
const OTHER_EDITIONS_RULE = /^\s*-{3,}\s*$/m
const LINK_DEFINITION = /^\s*\[[^\]]+\]:.*$/gm
const LINK_TO_THE_SOURCE = /\(?\[source\](?:\[[^\]]*\]|\([^)]*\))\)?/gi
const LINK = /\[((?:[^[\]]|\[[^\]]*\])*)\](?:\[[^\]]*\]|\([^)]*\))/g
const BARE_LINK = /\(?(?:https?:\/\/|www\.)[^\s)]*\)?/gi
const HTML_TAG = /<\/?[a-z][^>]*>/gi
const EMPHASIS = /\*+/g
const ESCAPED = /\\([\\[\]()*_-])/g

const HEADING_MARKS = /^#+\s*|\s*#+$/gm
const LIST_MARKS = /^\s*[-•*]\s+/gm
const LABEL =
  /^(?:[\w-]+-language description|kurzbeschreibung|(?:zitat )?klappentext|analyse|synopsis|sinopsis|summary|description|descripción|résumé|available under a creative commons[^:]*)\s*(?:[:.-]\s*|\n+|\s{2,})/i
// Catalog records quote the book and cite where the quote comes from: "A novel about..."--Kirkus.
const SOURCE_AT_THE_END =
  /\s*(?:"?\s*--\s*(?:cover|front flap|back cover|adapted from|from the|jacket)[^\n]*|\s\(résumé par[^)]*\)|\spdf)$/i
const CITATION = /^"([\s\S]+?)"\s*--.*$/

/** The first stretch that has something to say: a rule can also come right after a tagline. */
const beforeOtherEditions = (text) => {
  const parts = text.split(OTHER_EDITIONS_RULE)
  return parts.find((part) => part.trim().length >= MIN_DESCRIPTION) ?? parts[0]
}

// Invisible, and left by the page a text was copied from. A search would stumble on them.
const HIDDEN_CHARACTERS = /[\u00ad\u200b]/g

export function cleanMarkup(text) {
  const plain = text.replace(HIDDEN_CHARACTERS, '').replace(/\r\n?/g, '\n')
  return beforeOtherEditions(plain.replace(HEADING_MARKS, ''))
    .split(/Also contained in:/)[0]
    .replace(HTML_TAG, '')
    .replace(LINK_DEFINITION, '')
    .replace(LINK_TO_THE_SOURCE, '')
    .replace(LINK, '$1')
    .replace(BARE_LINK, '')
    .replace(EMPHASIS, '')
    .replace(ESCAPED, '$1')
    .replace(LIST_MARKS, '')
    .replace(/^[ \t]+|[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .replace(LABEL, '')
    .replace(CITATION, '$1')
    .replace(SOURCE_AT_THE_END, '')
}

// A sentence about the edition in hand, not about the book.
const EDITION_NOTES = [
  /\b(this|the present|our|new|revised|updated|illustrated|annotated|unabridged|abridged|kindle|paperback|hardcover|anniversary|special|collector'?s|deluxe|mass market|critical|commemorative|facsimile|ebook|e-book)\b[^.]*\bedition\b/i,
  /\bedition (of|includes|contains|features|has)\b/i,
  /\bISBN\b/,
  /\b(includes?|contains?|features?|with) (an? |the )?(new |brand-new |exclusive |special |original )?(introduction|foreword|afterword|preface|excerpt|bonus|reading group|discussion|illustrations|appendix|appendices|notes|bibliography)\b/i,
  /\b(introduction|foreword|afterword|preface) by\b/i,
  /\b(translated|edited|illustrated|introduced|annotated|abridged|adapted) (from [^.]* )?by\b/i,
  /\b(wikipedia|goodreads|hard ?cover|paperback|please note|e-?book extras?|creative commons)\b/i,
  /\b(reprint of|the ebook can be found)\b/i,
  /\b(esta|la presente|nueva|nuestra) edición\b/i,
  /\bedición (revisada|ampliada|conmemorativa|especial|ilustrada|anotada|de bolsillo|crítica|bilingüe|definitiva|limitada)\b/i,
  /\b(prólogo|introducción|epílogo|traducción|notas|edición|ilustraciones) (de|a cargo de|por)\s+\p{Lu}/iu,
  /\bincluye (un |una |el |la )?(nuevo |nueva )?(prólogo|introducción|epílogo|apéndice|notas|bibliografía)\b/i,
  /^(preceded by|followed by|source|sources|fuente|fuentes|note|nota|librarian|alternate cover|alternative cover|see also|véase|published by|publisher|editorial|copyright|contents|contains|índice|back cover|contraportada|solapa|from the (publisher|back cover|dust jacket|book jacket)|\(?source)\b/i,
]

// "Dr." or "J." end with a dot and do not end a sentence.
const SENTENCE_BREAK =
  /(?<=[.!?…]["»”)']?)(?<!\b\p{Lu}\.)(?<!\b(?:Dr|Dra|Sr|Sra|Mr|Mrs|Ms|St)\.)\s+(?=["«“¿¡(]?\p{Lu})/u

function dropEditionNotes(text) {
  return text
    .split('\n')
    .map((line) =>
      line
        .split(SENTENCE_BREAK)
        .filter((sentence) => !EDITION_NOTES.some((note) => note.test(sentence)))
        .join(' '),
    )
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

const ABBREVIATION =
  /(?:\b\p{L}|\b(?:Dr|Dra|Sr|Sra|Mr|Mrs|Ms|St|Sto|Sta|Prof|vs|etc|No|Vol|pp|Ed))\.$/u

/** Whole sentences up to the limit. Undefined when no sentence fits. */
export function cutAtSentence(text, max = MAX_DESCRIPTION) {
  if (text.length <= max) return text
  const head = text.slice(0, max)
  const ends = [...head.matchAll(/[.!?…]["»”)']*(?=\s)/gu)]
  for (const end of ends.toReversed()) {
    const stop = end.index + end[0].length
    if (stop < MIN_CUT) break
    if (!ABBREVIATION.test(head.slice(Math.max(0, stop - 6), stop))) {
      return head.slice(0, stop).trim()
    }
  }
  return undefined
}

const STOP_WORDS = {
  es: 'el la los las un una del que en por para con se su sus es no como más pero al lo esta este sobre entre cuando también ha fue son',
  en: 'the of and to in that is was for with his her he she it as on by this are from at be an which who their has have about into but not they one all him its after when had were been you your can will would what there',
  fr: 'le la les des du et que en une un dans pour qui sur par est au aux avec ce cette sa son ses plus ne pas il elle',
  pt: 'os as um uma do da dos das que em no na para com por não mais ao se seu sua como foi são ele ela',
  de: 'der die das und ein eine ist nicht mit von zu den dem des auf für sich auch als im es er sie wird',
  it: 'il lo la gli le un una di del della che in per con non si come più ma sono nel alla dei',
  nl: 'de het een van en in is dat op te zijn met voor niet aan er om ook als bij door naar',
  pl: 'i w na z do się nie że to jest o od po jak ale za przez dla oraz ich jego tym',
  sv: 'och att det som en av för på är med den till har inte om ett men de sig',
  id: 'yang di dan dari itu dengan untuk pada dalam ini tidak akan ke oleh sebagai',
}
const STOP_SETS = Object.entries(STOP_WORDS).map(([language, words]) => [
  language,
  new Set(words.split(' ')),
])
// Japanese also uses Han characters, so a little kana is enough to tell it from Chinese.
const SCRIPTS = [
  ['ja', /[\p{Script=Hiragana}\p{Script=Katakana}]/gu, 0.05],
  ['ru', /\p{Script=Cyrillic}/gu, 0.2],
  ['zh', /\p{Script=Han}/gu, 0.2],
  ['ko', /\p{Script=Hangul}/gu, 0.2],
  ['ar', /\p{Script=Arabic}/gu, 0.2],
  ['el', /\p{Script=Greek}/gu, 0.2],
]

/** The language of a text, by its commonest words: a code, or undefined when it cannot tell. */
export function detectLanguage(text) {
  const script = SCRIPTS.find(([, pattern, share]) => count(text, pattern) > text.length * share)
  if (script) return script[0]
  const words = text.toLowerCase().match(/\p{L}+/gu) ?? []
  const scores = STOP_SETS.map(([language, stop]) => [
    language,
    words.filter((word) => stop.has(word)).length,
  ]).sort((a, b) => b[1] - a[1])
  return scores[0][1] >= 3 ? scores[0][0] : undefined
}

// Most lines start like a table of contents.
const isContents = (text) => {
  const lines = text.split('\n').filter(Boolean)
  const items = lines.filter((line) =>
    /^(chapter|cap[ií]tulo|part|parte|book|libro|vol)\b/i.test(line),
  )
  return lines.length >= 4 && items.length / lines.length > 0.5
}

// A reader's opinion, which Open Library lets anyone write. A description never says "I".
const READER_OPINION =
  /\b(i (loved|liked|enjoyed|recommend) (this|the) book|my favou?rite book|best book ever|(great|good|fantastic|amazing|awesome) book|este libro me|me encant[oó] este)\b/i

/** What a work's description becomes: { description, language } or { reason } when it has none. */
export function describe(raw, rejected) {
  if (rejected) return { reason: 'habla de otro libro o es basura' }
  const text = typeof raw === 'string' ? raw : raw?.value
  if (!text) return { reason: 'la obra no trae' }
  const clean = dropEditionNotes(cleanMarkup(text))
  if (clean.length < MIN_DESCRIPTION) return { reason: 'demasiado corta' }
  if (isContents(clean)) return { reason: 'es un índice' }
  if (READER_OPINION.test(clean)) return { reason: 'es la opinión de un lector' }
  const description = cutAtSentence(clean)
  if (!description) return { reason: 'sin un punto donde cortarla' }
  const language = detectLanguage(description)
  if (!language) return { reason: 'no se reconoce el idioma' }
  return { description, language }
}

/** Same number of items in each part, and about the same amount of text. */
export function splitEvenly(items, parts) {
  const capacity = Math.ceil(items.length / parts)
  const groups = Array.from({ length: parts }, () => ({ items: [], size: 0 }))
  for (const item of items.toSorted((a, b) => b.description.length - a.description.length)) {
    const open = groups.filter((group) => group.items.length < capacity)
    const lightest = open.reduce((best, group) => (group.size < best.size ? group : best))
    lightest.items.push(item)
    lightest.size += item.description.length
  }
  return groups.map((group) => group.items)
}

// As many files as it takes for each to weigh about 20 KB compressed. src/lib/catalog.ts has the
// same number, because it finds a book's file with no list to read, and a test compares them.
export const DESCRIPTION_GROUPS = 16

/** The file of a book's description, worked out from its id alone. */
export const descriptionGroup = (id) => Number(id.match(/\d+/)[0]) % DESCRIPTION_GROUPS

// English titles of other books are fine inside a Spanish sentence, so one or two words mean nothing.
const ENGLISH_MARKS = new Set(
  'the of and with that this from his her was were which who their they have has had into about after when would what there for'.split(
    ' ',
  ),
)
const MIN_ENGLISH_WORDS = 4
const MIN_ENGLISH_SHARE = 0.25
const MARKDOWN = /\*\*|__|^#{1,6}\s|^>\s?|\]\(|\]\[|`/m
const LINK_IN_TEXT = /https?:|www\.|\.(?:com|org|net)\b/i
const SOURCE_NOTE = /\[\d+\]|\b(?:Back cover|Jacket flap|Container|Publisher)\b|\s--\s/

function hasEnglishSentence(text) {
  return text.split(/(?<=[.!?…»])\s+/).some((sentence) => {
    const words = sentence.toLowerCase().match(/\p{L}+/gu) ?? []
    const english = words.filter((word) => ENGLISH_MARKS.has(word)).length
    return english >= MIN_ENGLISH_WORDS && english / words.length >= MIN_ENGLISH_SHARE
  })
}

/** What a translation still carries from its source. An empty list means it can be published. */
export function translationProblems(text) {
  return [
    (detectLanguage(text) === 'en' || hasEnglishSentence(text)) && 'inglés',
    MARKDOWN.test(text) && 'Markdown',
    LINK_IN_TEXT.test(text) && 'enlace',
    SOURCE_NOTE.test(text) && 'nota de la fuente',
  ].filter(Boolean)
}
