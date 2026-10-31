import { describe as group, expect, it } from 'vitest'
import {
  chooseEdition,
  cleanAuthors,
  cleanMarkup,
  cleanTitle,
  cutAtSentence,
  dedupeKeys,
  describe,
  detectLanguage,
  dropReason,
  lowercaseWords,
  sentenceCase,
  splitEvenly,
} from './catalog-rules.mjs'

const PARAGRAPH =
  'Una familia vive cien años en un pueblo que no aparece en los mapas, y cada generación repite los errores de la anterior sin saberlo. '

group('dropReason', () => {
  it.each([
    ['Summary of Atomic Habits', 'resumen'],
    ['SparkNotes: Hamlet', 'guía de estudio'],
    ['Guía de lectura de Rayuela', 'guía de estudio'],
    ['The Artist’s Way Workbook', 'cuaderno de ejercicios'],
    ['Harry Potter Boxed Set', 'caja o recopilación de una misma obra'],
  ])('leaves out %s', (title, reason) => {
    expect(dropReason({ title })).toBe(reason)
  })

  it('reads the title of the Spanish edition too', () => {
    const doc = {
      title: 'Rayuela',
      editions: { docs: [{ title: 'Rayuela: cuaderno de trabajo' }] },
    }
    expect(dropReason(doc)).toBe('cuaderno de ejercicios')
  })

  it('keeps a novel', () => {
    expect(dropReason({ title: 'The Hobbit', author_name: ['J. R. R. Tolkien'] })).toBeUndefined()
  })
})

group('cleanTitle', () => {
  it.each([
    ['El Hobbit (Spanish Edition)', 'El Hobbit'],
    ['El principito / The Little Prince', 'El principito'],
    ['The Little Prince / El principito', 'El principito'],
    ['EL NOMBRE DE LA ROSA', 'El nombre de la rosa'],
    ['La tregua: novela', 'La tregua'],
    ['La peste.', 'La peste'],
    ['Coraline (Ilustrada) / Coraline', 'Coraline'],
  ])('%s -> %s', (raw, title) => {
    expect(cleanTitle(raw)).toBe(title)
  })
})

group('chooseEdition', () => {
  const doc = { id: 'OL1W', title: 'The Plague', source: 'popular' }
  const edition = (title, covers, publishDate = '2000') => ({ title, covers, publishDate })

  it('takes the title most editions agree on and its covers first, newest first', () => {
    const chosen = chooseEdition(
      doc,
      [
        edition('Otra peste', [1]),
        edition('La peste', [2], '1990'),
        edition('La Peste', [3], '2010'),
      ],
      new Set(),
    )
    expect(chosen).toEqual({ title: 'La peste', covers: [3, 2, 1] })
  })

  it('counts a title without its article for the one with it', () => {
    const chosen = chooseEdition(
      doc,
      [edition('Peste', [1]), edition('Peste', [2]), edition('La peste', [3])],
      new Set(),
    )
    expect(chosen.title).toBe('La peste')
  })

  it('prefers the spelling with accents', () => {
    const chosen = chooseEdition(
      doc,
      [edition('Dias de perros', [1]), edition('Días de perros', [2])],
      new Set(),
    )
    expect(chosen.title).toBe('Días de perros')
  })

  it('ignores an edition in Catalan', () => {
    const chosen = chooseEdition(doc, [edition('Àlies Grace', [9])], new Set())
    expect(chosen.reason).toBe('sin edición en español')
  })

  it('prefers a translated title to the original one, even with fewer editions', () => {
    const meditations = { id: 'OL3W', title: 'Meditations', source: 'popular' }
    const chosen = chooseEdition(
      meditations,
      [edition('Meditations', [1]), edition('Meditations', [2]), edition('Meditaciones', [3])],
      new Set(),
    )
    expect(chosen.title).toBe('Meditaciones')
  })

  it('ignores an English edition with the wrong language', () => {
    const chosen = chooseEdition(doc, [edition('The Plague', [9])], new Set())
    expect(chosen.reason).toBe('sin edición en español')
  })

  it('needs a Spanish cover', () => {
    const chosen = chooseEdition(doc, [edition('La peste', [])], new Set())
    expect(chosen.reason).toBe('sin portada de edición en español')
  })

  it('distrusts a title equal to the original unless it was checked by hand', () => {
    const dune = { id: 'OL2W', title: 'Matilda', source: 'popular' }
    const editions = [edition('Matilda', [5])]
    expect(chooseEdition(dune, editions, new Set()).reason).toBe('sin título español confiable')
    expect(chooseEdition(dune, editions, new Set(['OL2W'])).title).toBe('Matilda')
  })
})

group('sentenceCase', () => {
  const vocabulary = new Map([
    ['reina', 5],
    ['sombras', 5],
    ['trono', 5],
    ['piedra', 5],
    ['señor', 9],
    ['días', 9],
    ['como', 50],
    ['cómo', 20],
  ])

  it('lowers the common words and keeps the first word and the names', () => {
    expect(sentenceCase('Reina de Sombras', vocabulary)).toBe('Reina de sombras')
    expect(sentenceCase('Harry Potter y la Piedra', vocabulary)).toBe('Harry Potter y la piedra')
  })

  it('keeps the capital after a colon', () => {
    expect(sentenceCase('Sombras: Reina de Trono', vocabulary)).toBe('Sombras: Reina de trono')
  })

  it('gives back the accents and eñes that clearly belong', () => {
    expect(sentenceCase('El senor de los Dias', vocabulary)).toBe('El señor de los días')
    expect(sentenceCase('Hoy como', vocabulary)).toBe('Hoy como')
  })

  it('capitalizes the first letter', () => {
    expect(sentenceCase('arte de la guerra', vocabulary)).toBe('Arte de la guerra')
  })

  it('reads the lowercase words of a text', () => {
    expect(lowercaseWords('La reina de Sombras huyó, sin él')).toEqual([
      'reina',
      'de',
      'huyó',
      'sin',
      'él',
    ])
  })
})

group('cleanAuthors', () => {
  it('writes initials one way', () => {
    expect(cleanAuthors(['J.K. Rowling'])).toEqual(['J. K. Rowling'])
  })

  it('uses the listed spelling of a searched author', () => {
    expect(cleanAuthors(['Julio Cortazar'], 'Julio Cortázar')).toEqual(['Julio Cortázar'])
  })

  it('leaves translators out', () => {
    expect(cleanAuthors(['John Green', 'Noemí Risco'])).toEqual(['John Green'])
  })
})

group('dedupeKeys', () => {
  it('finds the same book across capitalization, accents and articles', () => {
    expect(dedupeKeys('El Túnel', ['Ernesto Sábato'])).toEqual(
      dedupeKeys('Tunel', ['Ernesto Sabato']),
    )
  })

  it('does not mix up two authors with one title', () => {
    expect(dedupeKeys('Cosmos', ['Carl Sagan'])).not.toEqual(
      dedupeKeys('Cosmos', ['Witold Gombrowicz']),
    )
  })
})

group('cleanMarkup', () => {
  it('leaves plain text, as descriptionOf does', () => {
    const text =
      '**Una** [novela](http://x.org) de <i>misterio</i>\\-.\r\n\r\n----------\r\nOther editions'
    expect(cleanMarkup(text)).toBe('Una novela de misterio-.')
  })
})

group('cleanMarkup, what descriptionOf does not need', () => {
  it('takes the headings and list marks off', () => {
    expect(cleanMarkup('## Título ##\n- Una cosa\n- Otra')).toBe('Título\nUna cosa\nOtra')
  })

  it('keeps reading when the rule comes right after a tagline', () => {
    const body = 'x'.repeat(100)
    expect(cleanMarkup(`Una frase.\n----------\n${body}`)).toBe(body)
  })

  it('takes the source off the end', () => {
    expect(cleanMarkup('Una novela de misterio. --adapted from jacket')).toBe(
      'Una novela de misterio.',
    )
  })

  it('takes the label off the start', () => {
    expect(cleanMarkup('German-language description: Greg hat es eilig')).toBe('Greg hat es eilig')
  })
})

group('cutAtSentence', () => {
  it('returns a short text as it is', () => {
    expect(cutAtSentence(PARAGRAPH)).toBe(PARAGRAPH)
  })

  it('cuts at a full stop, within the limit', () => {
    const cut = cutAtSentence(PARAGRAPH.repeat(20))
    expect(cut.length).toBeLessThanOrEqual(1500)
    expect(cut.endsWith('.')).toBe(true)
  })

  it('does not stop at an initial', () => {
    const text = `${'a'.repeat(400)}. Lo escribió J. ${'b'.repeat(1200)}`
    expect(cutAtSentence(text, 500)).toBe(`${'a'.repeat(400)}.`)
  })

  it('gives up when no sentence fits', () => {
    expect(cutAtSentence('a '.repeat(1000))).toBeUndefined()
  })
})

group('detectLanguage', () => {
  it.each([
    ['es', 'La novela cuenta la historia de una mujer que vuelve a su casa en el sur.'],
    ['en', 'The novel tells the story of a woman who returns to her home in the south.'],
    ['fr', 'Le roman raconte une histoire dans la ville et les enfants qui sont avec elle.'],
    ['pt', 'O romance conta a história de uma mulher que volta para sua casa no sul do país.'],
    ['ru', 'Роман рассказывает историю женщины, которая возвращается домой на юг страны.'],
    [
      'en',
      'It is the year 1327. Franciscans in an Italian abbey are suspected of heresy, but one brother is not.',
    ],
    ['ja', 'とある街の、とある喫茶店のとある座席には不思議な都市伝説があった'],
    [
      'pl',
      'Pozycja, która przedstawia początki historii i się nie kończy, to jest o tym jak w lesie żyją.',
    ],
  ])('%s', (language, text) => {
    expect(detectLanguage(text)).toBe(language)
  })
})

group('describe', () => {
  it('keeps a Spanish description and marks another language for translation', () => {
    expect(describe(PARAGRAPH).language).toBe('es')
    const english =
      'A family lives for a hundred years in a town that is not on any of the maps of the country.'
    expect(describe({ value: english })).toEqual({ description: english, language: 'en' })
  })

  it('takes the notes about the edition out', () => {
    const text = `${PARAGRAPH}Esta edición incluye un prólogo inédito.\n\nISBN 9781234567890.`
    expect(describe(text).description).toBe(PARAGRAPH.trim())
  })

  it('does not take an initial for the end of a sentence', () => {
    const text = `${PARAGRAPH}Es el clásico de Barbara W. Tuchman, con una nueva edición revisada.`
    expect(describe(text).description).toBe(PARAGRAPH.trim())
  })

  it('says why a work ends up without one', () => {
    expect(describe(undefined).reason).toBe('la obra no trae')
    expect(describe('Muy corta.').reason).toBe('demasiado corta')
    expect(describe(PARAGRAPH, true).reason).toBe('habla de otro libro o es basura')
    expect(
      describe(`${'Capítulo de prueba bastante largo, con su nombre\n'.repeat(5)}`).reason,
    ).toBe('es un índice')
    expect(describe(`Best book ever, I loved it. ${PARAGRAPH}`).reason).toBe(
      'es la opinión de un lector',
    )
  })
})

group('splitEvenly', () => {
  it('gives every part the same number of items and about the same text', () => {
    const items = Array.from({ length: 60 }, (_, index) => ({
      description: 'x'.repeat(index + 1),
    }))
    const parts = splitEvenly(items, 6)
    const sizes = parts.map((part) =>
      part.reduce((sum, { description }) => sum + description.length, 0),
    )
    expect(parts.map((part) => part.length)).toEqual([10, 10, 10, 10, 10, 10])
    expect(Math.max(...sizes) / Math.min(...sizes)).toBeLessThan(1.1)
  })
})
