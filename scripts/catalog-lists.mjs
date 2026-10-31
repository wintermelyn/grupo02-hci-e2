// The editorial decisions of seed-catalog.mjs, kept apart from the code so they can be read and
// changed by hand.

// The list of the most read books brings almost no Hispanic authors: none by Vargas Llosa, Cortázar
// or Bolaño. These are searched one by one. The quota is how many books of each one to keep, and
// `name` is how the author is written in the catalog.
export const HISPANIC_AUTHORS = [
  // Chile
  { name: 'Roberto Bolaño', quota: 3 },
  { name: 'Isabel Allende', quota: 2 },
  { name: 'Pablo Neruda', quota: 2 },
  { name: 'Gabriela Mistral', quota: 1 },
  { name: 'José Donoso', quota: 1 },
  { name: 'Luis Sepúlveda', quota: 2 },
  { name: 'Antonio Skármeta', quota: 1 },
  { name: 'María Luisa Bombal', quota: 1 },
  { name: 'Nicanor Parra', quota: 1 },
  { name: 'Vicente Huidobro', quota: 1 },
  { name: 'Alejandro Zambra', quota: 1 },
  { name: 'Pedro Lemebel', quota: 1 },
  { name: 'Hernán Rivera Letelier', quota: 1 },
  { name: 'Manuel Rojas', quota: 1 },
  { name: 'Alberto Blest Gana', quota: 1 },
  { name: 'Baldomero Lillo', quota: 1 },
  // Argentina y Uruguay
  { name: 'Julio Cortázar', quota: 4 },
  { name: 'Jorge Luis Borges', quota: 3 },
  { name: 'Ernesto Sabato', quota: 1 },
  { name: 'Adolfo Bioy Casares', quota: 1 },
  { name: 'Manuel Puig', quota: 1 },
  { name: 'Ricardo Piglia', quota: 1 },
  { name: 'Alejandra Pizarnik', quota: 1 },
  { name: 'Samanta Schweblin', quota: 1 },
  { name: 'Claudia Piñeiro', quota: 1 },
  { name: 'Selva Almada', quota: 1 },
  { name: 'José Hernández', quota: 1 },
  { name: 'Horacio Quiroga', quota: 1 },
  { name: 'Mario Benedetti', quota: 2 },
  { name: 'Eduardo Galeano', quota: 1 },
  { name: 'Juan Carlos Onetti', quota: 1 },
  // Perú, Colombia y Venezuela
  { name: 'Mario Vargas Llosa', quota: 6 },
  { name: 'José María Arguedas', quota: 1 },
  { name: 'Julio Ramón Ribeyro', quota: 1 },
  { name: 'César Vallejo', quota: 1 },
  { name: 'Alfredo Bryce Echenique', quota: 1 },
  { name: 'Gabriel García Márquez', quota: 3 },
  { name: 'Álvaro Mutis', quota: 1 },
  { name: 'Héctor Abad Faciolince', quota: 1 },
  { name: 'Laura Restrepo', quota: 1 },
  { name: 'Juan Gabriel Vásquez', quota: 1 },
  { name: 'Fernando Vallejo', quota: 1 },
  { name: 'Jorge Isaacs', quota: 1 },
  { name: 'José Eustasio Rivera', quota: 1 },
  { name: 'Rómulo Gallegos', quota: 1 },
  // México y Centroamérica
  { name: 'Octavio Paz', quota: 1 },
  { name: 'Carlos Fuentes', quota: 2 },
  { name: 'Laura Esquivel', quota: 1 },
  { name: 'Elena Poniatowska', quota: 1 },
  { name: 'Rosario Castellanos', quota: 1 },
  { name: 'Elena Garro', quota: 1 },
  { name: 'Juan José Arreola', quota: 1 },
  { name: 'Fernanda Melchor', quota: 1 },
  { name: 'Valeria Luiselli', quota: 1 },
  { name: 'Guadalupe Nettel', quota: 1 },
  { name: 'Sor Juana Inés de la Cruz', quota: 1 },
  { name: 'Augusto Monterroso', quota: 1 },
  { name: 'Miguel Ángel Asturias', quota: 1 },
  { name: 'Rubén Darío', quota: 1 },
  { name: 'Gioconda Belli', quota: 1 },
  // Caribe y Paraguay
  { name: 'Alejo Carpentier', quota: 1 },
  { name: 'Guillermo Cabrera Infante', quota: 1 },
  { name: 'José Lezama Lima', quota: 1 },
  { name: 'Reinaldo Arenas', quota: 1 },
  { name: 'Leonardo Padura', quota: 1 },
  { name: 'José Martí', quota: 1 },
  { name: 'Augusto Roa Bastos', quota: 1 },
  // España
  { name: 'Arturo Pérez-Reverte', quota: 2 },
  { name: 'Carlos Ruiz Zafón', quota: 2 },
  { name: 'Javier Marías', quota: 1 },
  { name: 'Almudena Grandes', quota: 1 },
  { name: 'Eduardo Mendoza', quota: 1 },
  { name: 'Javier Cercas', quota: 1 },
  { name: 'Manuel Vázquez Montalbán', quota: 1 },
  { name: 'Camilo José Cela', quota: 1 },
  { name: 'Miguel Delibes', quota: 1 },
  { name: 'Carmen Laforet', quota: 1 },
  { name: 'Ana María Matute', quota: 1 },
  { name: 'Federico García Lorca', quota: 2 },
  { name: 'Miguel de Unamuno', quota: 1 },
  { name: 'Benito Pérez Galdós', quota: 1 },
  { name: 'Antonio Machado', quota: 1 },
  { name: 'Gustavo Adolfo Bécquer', quota: 1 },
  { name: 'Rosa Montero', quota: 1 },
  { name: 'Dolores Redondo', quota: 1 },
  { name: 'María Dueñas', quota: 1 },
  { name: 'Ildefonso Falcones', quota: 1 },
  { name: 'Irene Vallejo', quota: 1 },
  { name: 'Fernando Aramburu', quota: 1 },
  { name: 'Enrique Vila-Matas', quota: 1 },
  { name: 'Lope de Vega', quota: 1 },
  { name: 'Pedro Calderón de la Barca', quota: 1 },
  { name: 'Fernando de Rojas', quota: 1 },
  { name: 'Pío Baroja', quota: 1 },
  { name: 'Ramón del Valle-Inclán', quota: 1 },
]

// Left out for what they are: the people who write erotica, or romance that sells on explicit sex.
// By Open Library's first author. Romance that only has an open door, such as Colleen Hoover or
// Sarah J. Maas, stays in.
export const EXCLUDED_AUTHORS = {
  'Ana Huang': 'erótica explícita',
  'Anaïs Nin': 'erótica explícita',
  'Chloe Walsh': 'erótica explícita',
  'E. L. James': 'erótica explícita',
  'Elle Kennedy': 'erótica explícita',
  'H. D. Carlton': 'erótica explícita',
  'Hannah Grace': 'erótica explícita',
  'Marquis de Sade': 'erótica explícita',
  'Navessa Allen': 'erótica explícita',
  'Pauline Réage': 'erótica explícita',
  'Penelope Douglas': 'erótica explícita',
  'Rachel Reid': 'erótica explícita',
  'Rina Kent': 'erótica explícita',
  'Scarlett St. Clair': 'erótica explícita',
}

// Hate propaganda, by title. None of these reached the lists of candidates, and they stay here so a
// new run with longer lists cannot let one in.
export const EXCLUDED_TITLES = [
  /mein kampf|mi lucha/i,
  /protocol(s|os) (of the elders|de los sabios)/i,
  /turner diaries|diarios de turner/i,
  /international jew|jud[ií]o internacional/i,
]

const EROTIC = 'erótica explícita'
const COLLECTION = 'caja o recopilación de una misma obra'
const NO_TITLE = 'sin título español confiable'

// Works left out on purpose, with the reason. Everything else that is out follows from a rule.
export const EXCLUDED_WORKS = {
  OL239940W: `${EROTIC}: Kama sutra`,
  OL77834W: `${EROTIC}: El rapto de la bella durmiente`,
  OL5738197W: `${EROTIC}: Ellas llegan primero`,
  OL3546951W: `${EROTIC}: Historia de O`,
  OL1174239W: `${EROTIC}: El placer del sexo`,
  OL19968136W: `${EROTIC}: Beautiful Bastard`,
  OL1167981W: `${COLLECTION}: 1984 y Rebelión en la granja`,
  OL262554W: `${COLLECTION}: todo Sherlock Holmes`,
  OL46390W: `${COLLECTION}: Trilogía de las Fundaciones`,
  OL15518787W: `${COLLECTION}: Trilogía Los juegos del hambre`,
  OL151411W: `${COLLECTION}: las dos Alicias`,
  OL70988W: `${COLLECTION}: Las crónicas de Narnia`,
  OL1740783W: 'otra versión de El hombre más rico de Babilonia, de otro autor',
  OL15353394W: 'texto escolar',
  OL20734329W: 'el servidor de portadas responde 503 a su única portada en español',
  OL16249171W: `${NO_TITLE}: Fairy Tales, de Andersen`,
  OL151515W: `${NO_TITLE}: la obra es la Poética y las ediciones, la Metafísica`,
  OL20465177W: `${NO_TITLE}: la edición está en gallego`,
  OL17710047W: `${NO_TITLE}: la edición está en portugués`,
  OL16585191W: `${NO_TITLE}: la edición está en portugués`,
  OL88707W: `${NO_TITLE}: la edición está en catalán`,
  OL72352W: `${NO_TITLE}: Goosebumps es la serie`,
  OL19743864W: `${NO_TITLE}: Entrada, de Front Desk`,
  OL16538128W: 'es de Borges, Bioy Casares y Silvina Ocampo; llegó por el prólogo de Cortázar',
}

// Passed over when picking a Hispanic author's books, so the quota goes to the book people look
// for: anthologies with an English title, children's verses, books far from what made them known.
export const PASSED_OVER_WORKS = new Set([
  'OL979616W', // Neruda, Poems
  'OL574336W', // Mistral, Poesía infantil
  'OL1730188W', // Parra, Emergency Poems
  'OL2226606W', // Pizarnik, a book named after her
  'OL16027025W', // Paz, Tiempo nublado
  'OL27058795W', // Villoro, El profesor Ziper
  'OL14944480W', // Bioy Casares, Historias de amor
  'OL857575W', // Vargas Llosa, Elogio de la madrastra: an erotic novel
  'OL468803W', // García Márquez, Memoria de mis putas tristes
  'OL741750W', // Benedetti, Cuentos
  'OL15967681W', // Mistral, Escritos políticos
  'OL15239164W', // Darío, Poesía erótica
  'OL32017147W', // Mistral, Doris, vida mía
  'OL574386W', // Mistral, Poems
  'OL1730176W', // Parra, Sermons and Homilies of the Christ of Elqui
  'OL29250454W', // Parra, Poemas ilustrados
  'OL872217W', // Fuentes, El espejo enterrado
  'OL28184942W', // Grandes, Todo va a mejorar
  'OL274550W', // García Márquez, Relato de un náufrago
])

// Works whose Spanish title is the same as the original, checked by hand. Any other title that
// equals the original and does not read as Spanish is an English edition with the wrong language.
export const UNTRANSLATED_TITLES = new Set([
  'OL20577143W', // Ugly Love
  'OL20068530W', // Verity
  'OL627084W', // Lolita
  'OL81634W', // Misery
  'OL679358W', // Coraline
  'OL34774028W', // Powerless
  'OL2003465W', // Mindset
  'OL16085155W', // Steve Jobs
  'OL50548W', // Beloved
  'OL278022W', // Freakonomics
  'OL5720025W', // Eclipse
  'OL16793507W', // Drama
  'OL47292W', // Push
  'OL81603W', // Insomnia
  'OL16803752W', // Eleanor & Park
  'OL2897798W', // Watchmen
  'OL16282945W', // Cinder
  'OL81610W', // Cujo
  'OL679360W', // American Gods
  'OL81597W', // Cell
  'OL5969752W', // Crank
  'OL50567W', // Sula
  'OL16805415W', // Americanah
  'OL2895536W', // Carmilla
  'OL462007W', // Peter Pan
  'OL1963268W', // Hyperion
  'OL16820059W', // Mr. Mercedes
  'OL16804289W', // Inferno
  'OL17361140W', // Grit
  'OL38501W', // Snow Crash
  'OL716850W', // Gödel, Escher, Bach
  'OL81619W', // Christine
  'OL66218W', // Wicked
  'OL15833328W', // Stardust
  'OL1455042W', // Heidi
  'OL119421W', // Mindhunter
  'OL88877W', // Maurice
  'OL80763W', // Stormbreaker
  'OL20893680W', // Piranesi
  'OL453658W', // Mort
  'OL5819884W', // Brisingr
  'OL465952W', // Redwall
  'OL679333W', // Neverwhere
  'OL5738147W', // Elantris
  'OL3511459W', // Stoner
  'OL17837968W', // Artemis
  'OL35720357W', // Elon Musk
  'OL20867W', // Middlemarch
  'OL77100W', // Stargirl
  'OL483385W', // Stuart Little
  'OL1835957W', // Fun Home
  'OL20907281W', // Ready Player Two
  'OL15936512W', // Ready Player One
  'OL149119W', // Duma Key
  'OL2172454W', // Ubik
  'OL816259W', // Trainspotting
  'OL81622W', // Dolores Claiborne
  'OL6017245W', // No Logo
  'OL37826293W', // Nexus
  'OL20161633W', // Bunny
  'OL2628761W', // Sabriel
  'OL8755877W', // Fablehaven
  'OL262984W', // Papillon
  'OL17452055W', // Scarlet
  'OL17200W', // Shutter Island
  'OL23199W', // Cannery Row
  'OL19748577W', // Legendary
  'OL675834W', // Alias Grace
])

// Covers rejected after looking at all of them: Open Library has them on the wrong edition, or they
// are not a Spanish cover. The next cover of the work takes their place.
export const REJECTED_COVERS = new Set([
  8124082, // De ratones y hombres: contraportada
  8643982, // El espejismo de Dios: una página de texto
  7432390, // El mundo de Sofía: portada de Incesto, de Anaïs Nin
  9269910, // Los pilares de la tierra: inglés
  13303603, // Sula: portada de El secreto de McNally
  10829211, // Cómo suprimir las preocupaciones: inglés y chino
  13200092, // ¿Qué pasaría si...?: portada de Comer en torno a Madrid
  15120630, // La belleza es una herida: una página de texto
  13297187, // Alguien voló sobre el nido del cuco: portada de El jugador invisible
  105891, // La princesita: inglés
  13823731, // Elementos, de Euclides: portada genérica
  12639995, // La abadía de Northanger: inglés
  9503325, // Ingeniería del software: una página de texto
  3351060, // El patito feo: libro para colorear
  14988042, // Prometeo americano: inglés
  15255321, // El fin de la eternidad: inglés
  169, // Dr. Seuss ABC: inglés
  105811, // Noche de reyes: inglés
  14462663, // El emperador de todos los males: en blanco
  1260557, // Pigmalión: inglés
  9964465, // Obra poética completa: tela en blanco
  10036747, // Azul: portada de otra antología
  1048792, // Antología poética: portada de Poesía completa II
  261543, // La casa de Bernarda Alba: edición en inglés
  8689451, // Los pilares de la tierra: una página de texto
  12639993, // La abadía de Northanger: inglés
  14637486, // Prometeo americano: inglés
])

const ANCIENT = { year: null }

// Fixes by work key, after reading the whole list: title, authors, year (null for a work too old
// for the year to mean anything), coverId, and noDescription for a description that talks about
// another book or is junk. Open Library's year is that of its oldest edition on record, which is
// often a placeholder such as 1900 or 2000; the ones here are the real first editions.
export const BOOK_FIXES = {
  OL18020194W: { year: 2016 },
  OL20875338W: { title: 'Culpa tuya' },
  OL2010879W: { year: 1997 },
  OL17590212W: { title: 'El sutil arte de que (casi todo) te importe un carajo' },
  OL18108064W: { title: 'No me puedes lastimar' },
  OL20234863W: { year: 2016 },
  OL244537W: ANCIENT,
  OL27482W: { title: 'El hobbit' },
  OL17370186W: { year: 2015 },
  OL273184W: { title: 'El inversor inteligente' },
  OL21177W: { year: 1847 },
  OL16142094W: { year: 2012 },
  OL45846W: { title: 'Matilda' },
  OL29983W: { year: 1868 },
  OL3335245W: { year: 1951 },
  OL1317211W: ANCIENT,
  OL5819456W: { year: 2005 },
  OL17732W: { authors: ['Varios autores'], year: null },
  OL17797857W: { year: 2017 },
  OL19744000W: { authors: ['Ichiro Kishimi', 'Fumitake Koga'] },
  OL1865528W: { year: 1963 },
  OL116250W: { year: 1998 },
  OL1089297W: { year: 1532 },
  OL52266W: { year: 1897 },
  OL102749W: { title: 'Moby Dick' },
  OL9170454W: { title: 'Hamlet' },
  OL1906484W: { year: 1959 },
  OL263458W: { title: 'Los hombres son de Marte, las mujeres son de Venus' },
  OL1812933W: { title: 'American Psycho' },
  OL2392324W: { title: '¡Tráguese ese sapo!' },
  OL1095427W: { title: 'Jane Eyre' },
  OL17360811W: { authors: ['Jack Thorne', 'J. K. Rowling', 'John Tiffany'], year: 2016 },
  OL16215950W: { title: 'Deja de ser tú' },
  OL81632W: { title: "El misterio de Salem's Lot", year: 1975 },
  OL46881W: { title: 'Parque Jurásico' },
  OL24156W: { title: 'El extraño caso del Dr. Jekyll y Mr. Hyde', year: 1886 },
  OL36287W: { year: 1844 },
  OL5682519W: { title: 'Diario de Greg 4: Días de perros', year: 2009 },
  OL17603394W: { title: 'Diario de Greg 11: ¡A toda marcha!', year: 2016 },
  OL16224122W: { title: 'Diario de Greg 6: ¡Atrapados en la nieve!', year: 2011 },
  OL17267509W: { title: 'Diario de Greg 10: Vieja escuela', year: 2015 },
  OL24617382W: { title: 'Diario de Greg 16: El número 1', year: 2021 },
  OL27816605W: { title: 'Diario de Greg 17: Dando la nota', year: 2022 },
  OL15110516W: { title: 'Diario de Greg 2: La ley de Rodrick', year: 2008 },
  OL15505465W: { title: 'Diario de Greg 3: ¡Esto es el colmo!', year: 2009 },
  OL15192743W: { title: 'Diario de Greg 5: La cruda realidad', year: 2010 },
  OL16797312W: { title: 'Diario de Greg 7: Tres no es compañía', year: 2012 },
  OL16810620W: { title: 'Diario de Greg 8: Mala suerte', year: 2013 },
  OL17076678W: { title: 'Diario de Greg 9: El arduo viaje', year: 2014 },
  OL8193465W: { year: 1859 },
  OL492640W: { title: 'La batalla del laberinto', year: 2008 },
  OL15270622W: { title: 'El último héroe del Olimpo' },
  OL17054790W: { title: 'Los dioses griegos de Percy Jackson', year: 2014 },
  OL5819895W: { title: 'Eragon', year: 2002 },
  OL5819886W: { title: 'Eldest' },
  OL5738148W: { year: 2006 },
  OL18417W: { year: 1900 },
  OL17864836W: { title: 'Cadáver exquisito', year: 2017 },
  OL98459W: { year: 1969 },
  OL258902W: { title: 'Macbeth', year: 1606 },
  OL61982W: ANCIENT,
  OL81628W: { title: 'La torre oscura I: El pistolero', year: 1982 },
  OL81616W: { title: 'La torre oscura II: La llegada de los tres' },
  OL81625W: { title: 'La torre oscura III: Las tierras baldías' },
  OL81615W: { title: 'La torre oscura IV: La bola de cristal' },
  OL149200W: { title: 'La torre oscura VI: La canción de Susannah', year: 2004 },
  OL81600W: { title: 'La torre oscura VII: La torre oscura', year: 2004 },
  OL267096W: { title: 'Ana Karénina', year: 1877 },
  OL80021W: { title: 'Yo sé por qué canta el pájaro enjaulado' },
  OL872932W: { title: 'Siddhartha' },
  OL66513W: { title: 'Emma' },
  OL509183W: { title: '¡Habla!' },
  OL453936W: { authors: ['Terry Pratchett', 'Neil Gaiman'] },
  OL53919W: { year: 1876 },
  OL15473892W: { title: 'MBA personal' },
  OL455305W: { year: 1850 },
  OL24034W: { title: 'La isla del tesoro', year: 1883 },
  OL15130687W: { title: 'Química' },
  OL468658W: { title: 'Gracias a Winn-Dixie' },
  OL17793648W: { title: "Five Nights at Freddy's: Los ojos de plata", year: 2015 },
  OL8455255W: { title: 'Cazadores de sombras 1: Ciudad de hueso' },
  OL15701782W: { title: 'Cazadores de sombras 4: Ciudad de los ángeles caídos' },
  OL27495W: { title: 'El Silmarillion' },
  OL1846074W: { title: '¿Quién cuenta las estrellas?', year: 1989 },
  OL77826W: { year: 1976 },
  OL3946622W: { year: 1645 },
  OL15358691W: { title: 'El camino de los reyes' },
  OL20029303W: { title: 'Este dolor no es mío' },
  OL11999891W: { title: 'Criadas y señoras' },
  OL17059943W: { title: 'La sangre del Olimpo', year: 2014 },
  OL8193478W: { title: 'Oliver Twist', year: 1838 },
  OL32195W: { year: 2000 },
  OL498463W: { year: 1925 },
  OL1230715W: { title: 'La peste', year: 1947 },
  OL8464993W: { title: 'El vizconde que me amó' },
  OL166952W: { title: 'Noches blancas' },
  OL45499W: { title: 'Tao Te Ching', year: null },
  OL16002468W: { title: '22/11/63', year: 2011 },
  OL71042W: { title: 'El sobrino del mago' },
  OL5720022W: { year: 2008 },
  OL66544W: { title: 'Persuasión', year: 1817 },
  OL71056W: { title: 'Mero cristianismo' },
  OL20600W: { title: 'Los viajes de Gulliver' },
  OL17618370W: { title: 'Código limpio' },
  OL51831W: ANCIENT,
  OL17116910W: { year: 2015 },
  OL1636262W: { title: 'La caseta mágica' },
  OL16793865W: { title: 'Un hombre llamado Ove' },
  OL16809803W: { title: 'El jilguero' },
  OL893461W: { title: 'El mesías de Dune' },
  OL267171W: { title: 'Guerra y paz', year: 1869 },
  OL93227W: { title: 'Infierno', year: 1320 },
  OL554608W: { title: 'Te doy mi corazón' },
  OL676009W: { title: 'El maestro y Margarita' },
  OL16489931W: { title: 'Roba como un artista' },
  OL262496W: { title: 'Estudio en escarlata' },
  OL81294W: { year: 1920 },
  OL81608W: { year: 1978 },
  OL9290241W: { title: 'Las 33 estrategias de la guerra' },
  OL5749849W: { title: 'Blink', year: 2005 },
  OL1815443W: { title: 'Autobiografía de Malcolm X' },
  OL731644W: { year: 1957 },
  OL26460746W: { title: 'El cuento de Perico, el conejo travieso', year: 1902 },
  OL45089W: { title: 'Robinson Crusoe', year: 1719 },
  OL5962664W: { year: 2002 },
  OL86318W: { year: 1922 },
  OL17365W: { title: '2001: Una odisea espacial' },
  OL20640195W: { title: 'Escalofríos de Fazbear 1: La alberca de pelotas' },
  OL28570037W: { title: 'El viento en los sauces' },
  OL362702W: { title: 'Julio César', year: 1599 },
  OL1833989W: { year: 1910 },
  OL24327739W: { title: 'Save Me' },
  OL1230631W: { year: 1956 },
  OL1063338W: { title: 'Cómo suprimir las preocupaciones y disfrutar de la vida', year: 1948 },
  OL21208765W: { title: 'El niño, el topo, el zorro y el caballo' },
  OL827357W: { title: 'Zen y el arte del mantenimiento de la motocicleta' },
  OL1230601W: { title: 'El mito de Sísifo' },
  OL7938488W: { title: 'Biología molecular de la célula' },
  OL262460W: { year: 1912 },
  OL17095301W: { title: '¿Qué pasaría si...?', year: 2014 },
  OL17878702W: { year: 2017 },
  OL547172W: { title: 'Traición' },
  OL151406W: { title: 'Alicia a través del espejo', year: 1871 },
  OL50283W: { title: 'La otra historia de los Estados Unidos' },
  OL115602W: { title: 'Me llamo Bud, no Buddy', year: 1999 },
  OL476641W: { title: 'Winnie the Pooh' },
  OL100672W: { title: 'Cándido, o el optimismo', year: 1759 },
  OL4794651W: { title: 'El juego de la vida y cómo jugarlo' },
  OL3243765W: { title: 'La casa en Mango Street' },
  OL151632W: ANCIENT,
  OL19715138W: { title: 'Al cerrar la puerta' },
  OL84919W: { title: 'El tesoro de Alejandría' },
  OL3126628W: { title: 'Mercury y yo' },
  OL893707W: { title: 'Madame Bovary' },
  OL98130W: { title: 'Así habló Zaratustra' },
  OL7966118W: { title: 'La perla' },
  OL1826387W: { title: 'Matemáticas para administración y economía' },
  OL17319838W: { title: 'Todos deberíamos ser feministas' },
  OL953162W: { title: 'Como agua para chocolate' },
  OL41081W: { title: 'El cuervo' },
  OL34735956W: { title: '¿Quién eres tú y qué haces aquí? El libro de iO' },
  OL69630W: { title: 'La princesita' },
  OL46900W: { title: 'Punto crítico' },
  OL46309W: { title: 'Segunda Fundación' },
  OL5738150W: { title: 'El pozo de la ascensión' },
  OL28319W: { title: 'Las poseídas de Stepford' },
  OL5725956W: { title: 'Artemis Fowl' },
  OL20650912W: { title: 'Casa de tierra y sangre' },
  OL66534W: { title: 'La abadía de Northanger' },
  OL8273964W: { title: 'Ética a Nicómaco', year: null },
  OL16247898W: { title: 'Política', year: null },
  OL15292640W: { title: 'Las metamorfosis', year: null },
  OL39360W: { title: 'Orlando' },
  OL17334243W: { title: 'La vegetariana' },
  OL20406W: { title: 'Cómo entrenar a tu dragón' },
  OL1161171W: { title: 'La náusea' },
  OL59704W: { title: 'La Luna es una cruel amante' },
  OL27776452W: { title: 'La importancia de llamarse Ernesto', year: 1895 },
  OL20846121W: { title: 'Ultralearning' },
  OL34758325W: { authors: ['Alba González'] },
  OL1974548W: { title: 'Mal de altura' },
  OL72434W: { title: '¡Sonríe y muérete!' },
  OL7988545W: { title: 'Las ruinas de Gorlan', year: 2004 },
  OL76972W: { title: 'La tapadera' },
  OL3951517W: { title: 'Las vírgenes suicidas' },
  OL52456W: { year: 1808 },
  OL152161W: { title: 'La cabaña del tío Tom', year: 1852 },
  OL111597W: { year: 2001 },
  OL40875W: { year: 2005 },
  OL15155002W: { title: 'El patito feo', year: 1843 },
  OL15678068W: ANCIENT,
  OL8662242W: { title: 'David Copperfield', year: 1850 },
  OL1548597W: { title: 'De la naturaleza de las cosas', year: null },
  OL99541W: { title: 'El castillo encantado' },
  OL176092W: { year: 1868 },
  OL176045W: { year: 1859 },
  OL259026W: { title: 'El rey Lear' },
  OL21214534W: { year: 2013 },
  OL17346434W: { title: 'La vida secreta de la mente', year: 2015 },
  OL14872925W: { title: 'Pippi Calzaslargas' },
  OL41059W: { year: 1843 },
  OL3800761W: { year: 1929 },
  OL1622789W: { title: 'Noli me tangere', year: 1887 },
  OL1905682W: { title: 'Prometeo americano', authors: ['Kai Bird', 'Martin J. Sherwin'] },
  OL832133W: { year: 1989 },
  OL872724W: { title: 'El juego de los abalorios' },
  OL13268171W: { title: 'Naruto 33: ¡Misión de alto secreto!' },
  OL50231W: { year: 2007 },
  OL50564W: { year: 1977 },
  OL261196W: { title: '¡Oh, cuán lejos llegarás!' },
  OL17357665W: { title: 'Hillbilly, una elegía rural' },
  OL449277W: { year: 1970 },
  OL7497934W: { title: 'Cómo vivir 365 días al año' },
  OL29317518W: { year: 1948 },
  OL17209694W: { year: null },
  OL272388W: { title: 'Archipiélago Gulag' },
  OL274433W: { year: 1922 },
  OL1980945W: { year: 1939 },
  OL362695W: { year: 1623 },
  OL362694W: { year: 1623 },
  OL362698W: { title: 'Como gustéis', year: 1623 },
  OL21747086W: { title: 'La semilla del diablo', year: 1967 },
  OL15455841W: { title: 'Inquebrantable' },
  OL73410W: { authors: ['Margaret Weis', 'Tracy Hickman'] },
  OL1066524W: { title: 'Pigmalión' },
  OL51948W: ANCIENT,
  OL51815W: ANCIENT,
  OL1905263W: { title: 'Eva Luna' },
  OL2163628W: { title: 'Dirk Gently, agencia de investigaciones holísticas' },
  OL8215661W: { title: 'One Piece 1' },
  OL480105W: { title: 'Noche en la isla' },
  OL26459W: { title: 'El último unicornio' },
  OL16825084W: { year: 2014 },
  OL471990W: { title: 'El espejo se rajó de parte a parte' },
  OL81604W: { title: 'Pesadillas y alucinaciones' },
  OL15371369W: { year: 2010 },
  OL472542W: { title: 'El secreto de Chimneys' },
  OL84924W: { title: 'Pánico en la Casa Blanca' },
  OL152268W: { year: 1936 },
  OL15190422W: { title: 'El niño que domó el viento' },
  OL584333W: { title: 'Buenos días, tristeza' },
  OL7180368W: { year: 1353 },
  OL106813W: { title: 'Patrañas que me contó mi profe' },
  OL46347W: { title: 'Fundación y Tierra' },
  OL15968W: { title: 'Del arte de la guerra', year: 1521 },
  OL82548W: { title: 'Harry Potter y la Orden del Fénix' },
  OL4617640W: { authors: ['Brian W. Kernighan', 'Dennis M. Ritchie'] },
  OL16568759W: { authors: ['Daron Acemoglu', 'James A. Robinson'] },
  OL19714233W: { authors: ['Héctor García', 'Francesc Miralles'] },
  OL629052W: { authors: ['Karl Marx', 'Friedrich Engels'] },
  OL4275330W: { authors: ['Vicki Robin', 'Joe Dominguez'] },
  OL553866W: { authors: ['Adele Faber', 'Elaine Mazlish'] },
  OL7924103W: { title: 'La rueda del tiempo: El ojo del mundo' },
  OL381550W: { title: 'La isla del Dr. Moreau' },
  OL71072W: { title: 'Cartas del diablo a su sobrino' },
  OL2746369W: { year: 1980 },
  OL81602W: { year: 1984 },
  OL86343W: { title: 'Retrato del artista adolescente', year: 1916 },
  OL17448W: { year: 1885 },
  OL262505W: { title: 'El valle del miedo' },
  OL2163649W: { title: 'Guía del autoestopista galáctico' },
  OL2680142W: { title: 'El camino del hombre superior' },
  OL14856321W: { title: 'El camino del artista' },
  OL16810944W: { title: 'La escuela del bien y del mal', year: 2013 },
  OL28800651W: { title: 'Las 8 reglas del amor' },
  OL99509W: { year: 1906 },
  OL18819818W: { title: 'Rompe la barrera del no' },
  OL284009W: { title: 'Ingeniería del software' },
  OL42746W: { title: 'El reino de Kensuke' },
  OL471943W: { year: 1953 },
  OL471576W: { title: 'Asesinato en el Orient Express' },
  OL81607W: { title: 'La tienda' },
  OL45884W: { title: 'Los cretinos' },
  OL228702W: { title: 'La habitación de Giovanni' },
  OL62073W: { title: 'Juan Salvador Gaviota' },
  OL81614W: { title: 'El retrato de Rose Madder' },
  OL2941508W: { title: 'La vida secreta de las abejas' },
  OL1970691W: { title: 'Redes de computadoras' },
  OL16813053W: { title: 'Palabras radiantes' },
  OL25344431W: { title: 'Lecciones de química' },
  OL2018966W: { title: 'Comunicación no violenta' },
  OL158041W: { title: 'Miedo y asco en Las Vegas' },
  OL20129837W: { title: 'Los testamentos' },
  OL17190366W: { title: 'Érase una vez una princesa algo desafortunada' },
  OL17081974W: { title: 'El crossover' },
  OL52955W: { title: 'El inductor' },
  OL95157W: { title: 'El hombre y sus símbolos' },
  OL261169W: { title: '¡Cómo el Grinch robó la Navidad!' },
  OL31157W: { title: 'Los códigos secretos' },
  OL20793817W: { title: 'Gente ansiosa' },
  OL471895W: { title: 'Muerte en la vicaría' },
  OL77609W: { title: 'Ser y tiempo' },
  OL20197660W: { title: 'La novena casa' },
  OL25682966W: { title: 'Psicología oscura y manipulación' },
  OL19659659W: { title: 'Club de cómics de Supergatito' },
  OL114723W: { title: 'Por la gran cuchara de cuerno' },
  OL4658246W: { title: 'Regreso al Edén' },
  OL268217W: { title: '¿Estás ahí, Dios? Soy yo, Margaret' },
  OL43426400W: { title: 'Amanecer en la cosecha' },
  OL14917748W: { title: 'La cúpula' },
  OL16915199W: { title: 'La élite' },
  OL76837W: { title: 'El código Da Vinci' },
  OL627084W: { year: 1955 },
  OL16805415W: { year: 2013 },
  OL20867W: { year: 1871 },
  OL1835957W: { year: 2006 },
  OL5819884W: { year: 2008 },
  OL27455W: { title: 'El retorno del rey', year: 1955 },
  OL13703833W: ANCIENT,
  OL16820059W: { year: 2014 },
  OL81634W: { year: 1987 },
  OL5720025W: { year: 2007 },
  OL16282945W: { year: 2012 },
  OL2625412W: { year: 1994 },
  OL2965102W: { year: 2003 },
  OL15723140W: { year: 1963 },
  OL527383W: { year: 1928 },
  OL14908941W: { noDescription: true },
  OL5819962W: { year: 2009, noDescription: true },
  OL17356842W: { noDescription: true },
  OL277730W: { title: 'El despertar', noDescription: true },
  OL2626638W: { title: 'Cántico por Leibowitz', noDescription: true },
  OL262463W: { noDescription: true },
  OL262426W: { noDescription: true },
  OL276963W: { noDescription: true },
  OL857568W: { noDescription: true },
  OL7967812W: {
    title: 'Picnic extraterrestre',
    authors: ['Arkadi Strugatski', 'Borís Strugatski'],
    noDescription: true,
  },
  OL61981W: { year: null, noDescription: true },
  OL912133W: { noDescription: true },
  OL7924208W: { title: 'La rueda del tiempo 6: El señor del caos' },
  OL17410022W: { year: 2014 },
  // Hispanic authors.
  OL8253141W: { year: 1888 },
  OL990924W: { title: 'Antología poética', year: null },
  OL24822235W: { year: 1922 },
  OL1730157W: { title: 'Chistes parra desorientar a la policía poesía' },
  OL477470W: { title: 'El obsceno pájaro de la noche', year: 1970 },
  OL8061453W: { year: 1966 },
  OL7976377W: { title: 'Patagonia Express' },
  OL2084284W: { year: 1931 },
  OL9103353W: { title: 'Santa María de las flores negras', year: 2002 },
  OL1214835W: { year: 1862 },
  OL13387626W: { title: 'Subterra', year: 1904 },
  OL20760166W: { year: 2018 },
  OL8705203W: { year: 1872 },
  OL830718W: { year: 1917 },
  OL468850W: { title: 'Del amor y otros demonios' },
  OL953835W: { title: 'Empresas y tribulaciones de Maqroll el Gaviero' },
  OL9199287W: { title: 'El olvido que seremos', year: 2006 },
  OL2421156W: { title: 'La virgen de los sicarios', year: 1994 },
  OL2854179W: { year: 1867 },
  OL872224W: { title: 'La muerte de Artemio Cruz' },
  OL1752050W: { title: 'Balún Canán' },
  OL938588W: { title: 'El Señor Presidente', year: 1946 },
  OL858784W: { title: 'Versos sencillos', year: 1891 },
  OL34305156W: { year: 1960 },
  OL992605W: { title: 'Los mares del Sur' },
  OL8046305W: { title: 'La colmena', year: 1951 },
  OL23311241W: { year: 1993 },
  OL17082251W: { title: 'La casa de Bernarda Alba', year: 1945 },
  OL722547W: { year: 1933 },
  OL503616W: { title: 'San Manuel Bueno, mártir', year: 1931 },
  OL815454W: { title: 'Doña Perfecta', year: 1876 },
  OL815453W: { year: 1878 },
  OL629345W: { year: 1871 },
  OL28774526W: { title: 'Esperando al diluvio' },
  OL914527W: { title: 'Fuente Ovejuna', year: 1619 },
  OL10341558W: { year: 1636 },
  OL938934W: { title: 'La Celestina', year: 1499 },
  OL29257801W: { title: 'Lanchas en la bahía', year: 1932 },
  OL857552W: { title: 'Conversación en La Catedral' },
  OL2226600W: { title: 'Poesía completa' },
  OL722550W: { title: 'Poesía completa I', year: null },
  OL503529W: { year: 1913 },
  OL990923W: { year: 1919 },
  OL10365273W: { year: 1961 },
  OL15855832W: { year: 1973 },
  OL580014W: { year: 1949 },
  OL26419966W: { title: 'Luces de bohemia', year: 1920 },
}

// How an author is written in the catalog, by the name Open Library gives, folded: lowercase and
// without accents. In Spanish when the name has a settled Spanish form, as in the 54 books.
export const AUTHOR_NAMES = {
  'fyodor dostoevsky': 'Fiódor Dostoievski',
  'leo tolstoy': 'León Tolstói',
  'лев толстои': 'León Tolstói',
  'marcus aurelius': 'Marco Aurelio',
  'niccolo machiavelli': 'Nicolás Maquiavelo',
  plato: 'Platón',
  aristotle: 'Aristóteles',
  ovid: 'Ovidio',
  homer: 'Homero',
  ομηρος: 'Homero',
  ηροδοτος: 'Heródoto',
  'titus lucretius carus': 'Lucrecio',
  老子: 'Lao Tse',
  'miyamoto musashi': 'Miyamoto Musashi',
  '孙武 sun tzu': 'Sun Tzu',
  川口俊和: 'Toshikazu Kawaguchi',
  村上春樹: 'Haruki Murakami',
  刘慈欣: 'Liu Cixin',
  '太宰 治': 'Osamu Dazai',
  尾田栄一郎: 'Eiichiro Oda',
  あすまきよひこ: 'Kiyohiko Azuma',
  'михаил афанасьевич булгаков': 'Mijaíl Bulgákov',
  'евгении иванович замятин': 'Yevgueni Zamiatin',
  'александр солженицын': 'Aleksandr Solzhenitsyn',
  'аркадии стругацкии': 'Arkadi Strugatski',
  'yogananda paramahansa': 'Paramahansa Yogananda',
  'robin s sharma': 'Robin Sharma',
  'david joseph schwartz': 'David J. Schwartz',
  'neil alexander campbell': 'Neil A. Campbell',
  'robert lawrence stine': 'R. L. Stine',
  'lucy maud montgomery': 'L. M. Montgomery',
  'lisa jane smith': 'L. J. Smith',
  'jerome klapka jerome': 'Jerome K. Jerome',
  'richard phillips feynman': 'Richard P. Feynman',
  'gilbert keith chesterton': 'G. K. Chesterton',
  'francis weston sears': 'Francis W. Sears',
  'ichiro kishimi': 'Ichiro Kishimi',
  'tui sutherland': 'Tui T. Sutherland',
  'iain banks': 'Iain M. Banks',
  'kelly regan barnhill': 'Kelly Barnhill',
  'laura joffe numeroff': 'Laura Numeroff',
  'margery williams bianco': 'Margery Williams',
  'richard yancey': 'Rick Yancey',
  'mihaly csikszentmihalyi': 'Mihály Csíkszentmihályi',
  'antoine de saint exupery': 'Antoine de Saint-Exupéry',
  bible: 'Varios autores',
  euclid: 'Euclides',
  'edwin abbott abbott': 'Edwin A. Abbott',
  'scott o dell': "Scott O'Dell",
}
