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

const NO_TEXT = 'sin descripción: la obra no trae'
const TOO_SHORT = 'sin descripción: la que trae es demasiado corta'
const OPINION = 'sin descripción: la que trae es la opinión de un lector'
const UNKNOWN_LANGUAGE = 'sin descripción: no se reconoce el idioma de la que trae'
const TEXT_NOT_ABOUT_IT =
  'sin descripción: el texto habla de otro libro, o de la edición, y no de este'
const ONLY_AUDIO_COVER =
  'solo tiene la portada de un audiolibro: no hay otra edición en español con portada'
const SMALL_COVER =
  'portada de audiolibro: la otra edición en español tiene una de 128 px, y el mínimo es 150'

// Taken out of the published catalog, with the reason: its owner decided that a new book needs a
// description. They leave at the end of select, so each keeps its place on the lists and its twin
// stays out, and no book comes in without its cover and translation. The 54 books are never here.
export const REMOVED_WORKS = {
  OL55806W: TOO_SHORT, // El poder de la mente subconsciente
  OL5819962W: TEXT_NOT_ABOUT_IT, // El verano en que me enamoré
  OL17732W: TEXT_NOT_ABOUT_IT, // Santa Biblia
  OL15719630W: TEXT_NOT_ABOUT_IT, // Divergente
  OL19665926W: NO_TEXT, // El club de las 5 de la mañana
  OL45885W: OPINION, // El gran gigante bonachón
  OL41495W: TEXT_NOT_ABOUT_IT, // Una arruga en el tiempo
  OL14908941W: TEXT_NOT_ABOUT_IT, // Sinsajo
  OL45809W: OPINION, // James y el melocotón gigante
  OL307247W: NO_TEXT, // Tierra humana
  OL265501W: OPINION, // En territorio salvaje
  OL24456878W: NO_TEXT, // Psicología oscura
  OL32466W: TOO_SHORT, // Una canción de Navidad
  OL166952W: NO_TEXT, // Noches blancas
  OL45499W: TEXT_NOT_ABOUT_IT, // Tao Te Ching
  OL61981W: TEXT_NOT_ABOUT_IT, // La Ilíada
  OL17076301W: NO_TEXT, // Hable como en TED
  OL17618370W: NO_TEXT, // Código limpio
  OL277730W: TEXT_NOT_ABOUT_IT, // El despertar
  OL2897798W: TEXT_NOT_ABOUT_IT, // Watchmen
  OL31111W: NO_TEXT, // Todo sobre el amor
  OL487444W: NO_TEXT, // Cómo leer un libro
  OL2772007W: TOO_SHORT, // El papel pintado amarillo
  OL28800651W: NO_TEXT, // Las 8 reglas del amor
  OL5731538W: TOO_SHORT, // La flor púrpura
  OL362702W: TEXT_NOT_ABOUT_IT, // Julio César
  OL24327739W: NO_TEXT, // Save Me
  OL21208765W: NO_TEXT, // El niño, el topo, el zorro y el caballo
  OL262463W: TEXT_NOT_ABOUT_IT, // Las memorias de Sherlock Holmes
  OL27023502W: NO_TEXT, // La disciplina marcará tu destino
  OL27696982W: TEXT_NOT_ABOUT_IT, // La profecía
  OL17356842W: TEXT_NOT_ABOUT_IT, // La espada de cristal
  OL151632W: TEXT_NOT_ABOUT_IT, // Física
  OL1984422W: TEXT_NOT_ABOUT_IT, // Física para la ciencia y la tecnología
  OL258850W: TEXT_NOT_ABOUT_IT, // Otelo
  OL1826387W: NO_TEXT, // Matemáticas para administración y economía
  OL7966118W: TOO_SHORT, // La perla
  OL17319838W: TOO_SHORT, // Todos deberíamos ser feministas
  OL34735956W: NO_TEXT, // ¿Quién eres tú y qué haces aquí? El libro de iO
  OL17641518W: NO_TEXT, // Homo deus
  OL453658W: TOO_SHORT, // Mort
  OL2626638W: TEXT_NOT_ABOUT_IT, // Cántico por Leibowitz
  OL71078W: TOO_SHORT, // La silla de plata
  OL16247898W: TEXT_NOT_ABOUT_IT, // Política
  OL20196354W: NO_TEXT, // Si lo crees, lo creas
  OL17334243W: TOO_SHORT, // La vegetariana
  OL20875537W: NO_TEXT, // Nosotros en la luna
  OL262426W: TEXT_NOT_ABOUT_IT, // El archivo de Sherlock Holmes
  OL34758325W: NO_TEXT, // Una vida sin salud mental
  OL24354365W: NO_TEXT, // ¿Qué te pasó?
  OL34744532W: NO_TEXT, // Fabricante de lágrimas
  OL3951517W: TEXT_NOT_ABOUT_IT, // Las vírgenes suicidas
  OL52456W: TEXT_NOT_ABOUT_IT, // Fausto
  OL1901436W: NO_TEXT, // Tus zonas erróneas
  OL15155002W: TOO_SHORT, // El patito feo
  OL17795612W: NO_TEXT, // Los secretos de la mente millonaria
  OL1929420W: TOO_SHORT, // Padres que odian
  OL21214534W: NO_TEXT, // Solo una cosa
  OL277761W: TOO_SHORT, // Conflicto
  OL471940W: TEXT_NOT_ABOUT_IT, // Poirot investiga
  OL5727666W: NO_TEXT, // Practicando el poder del ahora
  OL362706W: TEXT_NOT_ABOUT_IT, // Los sonetos
  OL22670634W: NO_TEXT, // Sin amor
  OL497483W: NO_TEXT, // La guerra del arte
  OL655908W: TOO_SHORT, // Era la víspera de Navidad
  OL21676651W: NO_TEXT, // El reino de los malditos
  OL2636675W: NO_TEXT, // El arco iris de gravedad
  OL8369445W: TOO_SHORT, // Las mentiras de Locke Lamora
  OL20142280W: NO_TEXT, // Cómo hacer que te pasen cosas buenas
  OL25682966W: NO_TEXT, // Psicología oscura y manipulación
  OL29317518W: NO_TEXT, // Indigno de ser humano
  OL7497934W: NO_TEXT, // Cómo vivir 365 días al año
  OL4797379W: NO_TEXT, // Física universitaria
  OL7967812W: TEXT_NOT_ABOUT_IT, // Picnic extraterrestre
  OL17423096W: TOO_SHORT, // Alas de fuego 2. La heredera perdida
  OL51948W: TEXT_NOT_ABOUT_IT, // Apología de Sócrates
  OL8215661W: NO_TEXT, // One Piece 1
  OL453660W: UNKNOWN_LANGUAGE, // Brujerías
  OL57249W: TOO_SHORT, // Química orgánica
  OL28124W: NO_TEXT, // Las 21 leyes irrefutables del liderazgo
  OL23731758W: NO_TEXT, // Todo lo que nunca fuimos
  OL3259254W: TOO_SHORT, // La estructura de las revoluciones científicas
  OL263676W: NO_TEXT, // Cuando todo se derrumba
  OL1929398W: NO_TEXT, // Chantaje emocional
  OL24822235W: NO_TEXT, // Desolación
  OL8061453W: NO_TEXT, // El lugar sin límites
  OL2863217W: NO_TEXT, // La última niebla
  OL1730157W: NO_TEXT, // Chistes parra desorientar a la policía poesía
  OL2084284W: NO_TEXT, // Altazor
  OL11877394W: NO_TEXT, // Bonsái
  OL9114268W: NO_TEXT, // Tengo miedo torero
  OL9103353W: NO_TEXT, // Santa María de las flores negras
  OL13387626W: NO_TEXT, // Subterra
  OL276963W: TEXT_NOT_ABOUT_IT, // Final del juego
  OL8971525W: NO_TEXT, // Bestiario
  OL2056316W: NO_TEXT, // Plata quemada
  OL2226600W: NO_TEXT, // Poesía completa
  OL830718W: NO_TEXT, // Cuentos de amor, de locura y de muerte
  OL8693149W: TOO_SHORT, // El amor, las mujeres y la vida
  OL914913W: NO_TEXT, // Los ríos profundos
  OL15855832W: NO_TEXT, // La palabra del mudo
  OL990924W: TOO_SHORT, // Antología poética
  OL953872W: NO_TEXT, // La última escala del tramp steamer
  OL9199287W: NO_TEXT, // El olvido que seremos
  OL2421156W: TEXT_NOT_ABOUT_IT, // La virgen de los sicarios
  OL2854179W: TOO_SHORT, // María
  OL1933249W: NO_TEXT, // La vorágine
  OL1277046W: NO_TEXT, // Doña Bárbara
  OL743255W: NO_TEXT, // El laberinto de la soledad
  OL677320W: NO_TEXT, // Los recuerdos del porvenir
  OL700567W: NO_TEXT, // Confabulario
  OL938588W: TEXT_NOT_ABOUT_IT, // El Señor Presidente
  OL8253141W: NO_TEXT, // Azul
  OL17788687W: TOO_SHORT, // El hombre que amaba a los perros
  OL34305156W: NO_TEXT, // Hijo de hombre
  OL857568W: TEXT_NOT_ABOUT_IT, // El club Dumas
  OL23311241W: NO_TEXT, // Luciérnagas
  OL815454W: TEXT_NOT_ABOUT_IT, // Doña Perfecta
  OL1344055W: NO_TEXT, // Poesías completas
  OL629345W: NO_TEXT, // Rimas y leyendas
  OL28774526W: NO_TEXT, // Esperando al diluvio
  OL2223951W: NO_TEXT, // La catedral del mar
  OL20168133W: ONLY_AUDIO_COVER, // Por qué dormimos
  OL76836W: SMALL_COVER, // La fortaleza digital
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
  11611972, // Prohibido nacer: marco de audiolibro
  11372897, // Hijo dorado: marco de audiolibro
  2129975, // Los 7 hábitos de la gente altamente efectiva: audiolibro de FonoLibro
  3062539, // Blink: audiolibro de FonoLibro
])

const ANCIENT = { year: null }

// Fixes by work key, after reading the whole list: title, authors, year (null for a work too old
// for the year to mean anything), coverId, and noDescription for a description that talks about
// another book or is junk. Open Library's year is that of its oldest edition on record, which is
// often a placeholder such as 1900 or 2000; the ones here are the real first editions.
export const BOOK_FIXES = {
  OL18020194W: { year: 2016 },
  OL20875338W: { title: 'Culpa tuya', year: 2017 },
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
  OL17732W: { authors: ['Varios autores'], year: null, noDescription: true },
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
  OL61982W: { ...ANCIENT, title: 'La Odisea' },
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
  OL45499W: { title: 'Tao Te Ching', year: null, noDescription: true },
  OL16002468W: { title: '22/11/63', year: 2011 },
  OL71042W: { title: 'El sobrino del mago' },
  OL5720022W: { year: 2008 },
  OL66544W: { title: 'Persuasión', year: 1817 },
  OL71056W: { title: 'Mero cristianismo' },
  OL20600W: { title: 'Los viajes de Gulliver' },
  OL17618370W: { title: 'Código limpio' },
  OL51831W: { ...ANCIENT, title: 'La República' },
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
  OL1815443W: {
    title: 'Autobiografía de Malcolm X',
    description:
      'Autobiografía del líder religioso y activista afroamericano nacido Malcolm Little, publicada en 1965. Escrita por Alex Haley, que hizo extensas entrevistas grabadas a Malcolm X antes de su asesinato, el libro se convirtió en un clásico sobre la experiencia afroamericana.\n\nContada en primera persona con la voz de Malcolm X, con contenido y narración añadidos por Alex Haley, relata su extraordinaria transformación: de niño cuyo padre fue asesinado por racistas blancos a joven estafador y traficante de drogas en Harlem, de erudito autodidacta en la cárcel a destacado líder y ministro de la Nación del Islam y, finalmente, a un hombre transformado por su viaje a África y a La Meca y amenazado por los líderes de esa misma organización.\n\nA través de una vida de pasión y lucha, Malcolm X se convirtió en una de las figuras más influyentes del siglo XX. Aquí, el hombre que se hacía llamar «el negro más enojado de Estados Unidos» relata cómo su conversión al islam lo ayudó a enfrentar su ira y a reconocer la hermandad de toda la humanidad.',
  },
  OL731644W: { year: 1957 },
  OL26460746W: { title: 'El cuento de Perico, el conejo travieso', year: 1902 },
  OL45089W: { title: 'Robinson Crusoe', year: 1719 },
  OL5962664W: { year: 2002 },
  OL86318W: { year: 1922 },
  OL17365W: { title: '2001: Una odisea espacial' },
  OL20640195W: { title: 'Escalofríos de Fazbear 1: La alberca de pelotas' },
  OL28570037W: { title: 'El viento en los sauces' },
  OL362702W: { title: 'Julio César', year: 1599, noDescription: true },
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
  OL476641W: { title: 'Winnie the Pooh', year: 1926 },
  OL100672W: { title: 'Cándido, o el optimismo', year: 1759 },
  OL4794651W: { title: 'El juego de la vida y cómo jugarlo' },
  OL3243765W: { title: 'La casa en Mango Street' },
  OL151632W: { ...ANCIENT, noDescription: true },
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
  OL16247898W: { title: 'Política', year: null, noDescription: true },
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
  OL3951517W: { title: 'Las vírgenes suicidas', noDescription: true },
  OL52456W: { year: 1808, noDescription: true },
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
  OL51948W: { ...ANCIENT, noDescription: true },
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
  OL629052W: {
    title: 'Manifiesto del Partido Comunista',
    authors: ['Karl Marx', 'Friedrich Engels'],
  },
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
  OL16813053W: { title: 'Palabras radiantes', year: 2014 },
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
  OL8061453W: { title: 'El lugar sin límites', year: 1966 },
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
  OL2421156W: { title: 'La virgen de los sicarios', year: 1994, noDescription: true },
  OL2854179W: { year: 1867 },
  OL872224W: { title: 'La muerte de Artemio Cruz' },
  OL1752050W: { title: 'Balún Canán' },
  OL938588W: { title: 'El Señor Presidente', year: 1946, noDescription: true },
  OL858784W: { title: 'Versos sencillos', year: 1891 },
  OL34305156W: { year: 1960 },
  OL992605W: {
    title: 'Los mares del Sur',
    description:
      'Stuart Pedrell, un importante empresario, aparece muerto a navajazos en un barrio extremo de la ciudad cuando desde hacía un año se le suponía en un viaje por Polinesia. Carvalho averigua lo que hizo en el curso de ese año y va desenredando un embrollo que tiene como fondo un sentimiento de frustración general. Desde la alta sociedad al inframundo de los suburbios, la novela traza un intenso cuadro de personajes y ambientes que refleja los conflictos personales y colectivos de la España de la Transición.',
  },
  OL8046305W: { title: 'La colmena', year: 1951 },
  OL23311241W: { year: 1993 },
  OL17082251W: { title: 'La casa de Bernarda Alba', year: 1945 },
  OL722547W: { year: 1933 },
  OL503616W: { title: 'San Manuel Bueno, mártir', year: 1931 },
  OL815454W: { title: 'Doña Perfecta', year: 1876, noDescription: true },
  OL815453W: { year: 1878 },
  OL629345W: { year: 1871 },
  OL28774526W: { title: 'Esperando al diluvio' },
  OL914527W: {
    title: 'Fuente Ovejuna',
    year: 1619,
    description:
      'Con probabilidad la más conocida y trascendente de las obras teatrales de Lope de Vega, por su explícito contenido social y crítico, representado en la rebelión unánime de todo un pueblo contra su comendador. Los hechos se desarrollan a partir del intento del tirano comendador de forzar a Laurencia, hija del alcalde. Una venganza «justa» y una frase para la posteridad («Fuente Ovejuna lo hizo») han dado fama a esta obra.',
  },
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
  OL26419966W: {
    title: 'Luces de bohemia',
    year: 1920,
    description:
      'Luces de bohemia es un esperpento trágico de la vida literaria en una sociedad irrespirable. Al degradarse la realidad aparece la farsa y, en un segundo nivel, el esperpento; «Los héroes clásicos reflejados en los espejos cóncavos dan el Esperpento», aclara Valle-Inclán. Aquí el espejo cóncavo es una conciencia dolorida, una conciencia moral que escandaliza o aterra. Resulta patético que quien vea la verdad sea un ciego, Max Estrella, soñador perdido en un Madrid absurdo y hambriento.',
  },
  // Titles fixed and descriptions left out after reading the whole catalog. A description here
  // replaces the one Open Library has, for a text already in Spanish with typos or notes in it.
  OL34965326W: { year: 2002 },
  OL16325201W: { year: 2012 },
  OL2827199W: { year: 2001 },
  OL1277046W: { year: 1929 },
  OL17367560W: { title: 'Heredera de fuego', coverId: 15102345 },
  OL745027W: {
    description:
      'Para Azorín esta novela resume mejor que ninguna el espíritu de Baroja. Y efectivamente: sus principios filosóficos y sociales, la reacción frente a la miseria y el dolor, y los elementos autobiográficos hacen de esta obra muestra privilegiada del mundo del autor. Médico, como Baroja, el protagonista de El árbol de la ciencia asiste impotente a los desafueros de una sociedad mezquina y envilecida. Entre el determinismo fisiológico y la rebelión moral hay la búsqueda de un camino propio.',
  },
  OL979578W: {
    description:
      'En el libro, Neruda hace un recorrido por su trayectoria vital: los fumaderos de opio en Tailandia, la Birmania dominada por los ingleses, sus experiencias con todo tipo de mujeres en todo tipo de situaciones, las conversaciones entre el poeta y Ernesto Che Guevara, sus viajes a México o a la URSS, su consulado en España durante la Segunda República Española y su ardua labor tras el estallido de la Guerra Civil española para salvar de la cárcel y de la muerte a republicanos, anarquistas y todo aquel que fuera oprimido bajo el régimen franquista, embarcándolos en el Winnipeg rumbo al exilio. Estos y otros sucesos se recrean con nitidez en la mente del autor.',
  },
  OL857600W: {
    description:
      'Novela histórica sobre los últimos días del general Rafael Leonidas Trujillo en la República Dominicana en 1961. El hilo conductor es el retorno a la isla de Urania Cabral, hija de un senador del régimen trujillista, muchos años después de la muerte del dictador. Mientras Urania visita a su padre moribundo, la narración reconstruye el fin de una era con una serie de personajes históricos, entre ellos el sempiterno presidente de la República Dominicana, Joaquín Balaguer. La crueldad del poder y la maldad humana destacan en este gran relato, una de las mejores novelas del escritor peruano.',
  },
  OL857544W: {
    description:
      'La ciudad y los perros no es solo un ataque contra la crueldad ejercida sobre un grupo de jóvenes alumnos del Colegio Militar Leoncio Prado, sino también una crítica frontal al concepto erróneo de la virilidad, de sus funciones y de las consecuencias de una educación castrense malentendida. Aunada a la brutalidad propia de la vida militar, a lo largo de las páginas de esta extraordinaria novela, la vehemencia y la pasión de la juventud se desbocan hasta llegar a una furia, una rabia y un fanatismo que anulan toda sensibilidad.',
  },
  OL886846W: {
    year: 1967,
    description:
      'Tres tristes tigres, la historia de tres amigos en una juerga desenfrenada por los clubes nocturnos, salas de música, barrios marginales y demás submundo habanero en los años previos a Castro, es la mayor obra literaria de Cabrera Infante. Repleta de cambios de estilo, juegos de palabras y ritmos, a medio camino entre Borges y García Márquez, y Joyce y Kafka, su autor manifestó que «está escrita en cubano». Ganadora del Premio Biblioteca Breve, de la editorial Seix Barral, en 1964, fue publicada por primera vez en 1967, en una versión reescrita por motivos de censura. Vetada por Castro en Cuba, la novela apareció en el periodo de auge del boom latinoamericano y es considerada una de las más importantes de las letras hispanoamericanas.',
  },
  OL2457366W: {
    description:
      'Perdido en la Barcelona preolímpica, el extraterrestre Gurb pone al servicio de su supervivencia la extraña cualidad de adoptar el aspecto que le plazca. Se pierde con la apariencia de Marta Sánchez, mientras su compañero alienígena inicia la búsqueda en la jungla urbana. Por su diario personal vamos conociendo las increíbles peripecias de un extraterrestre en Barcelona. En este relato de carácter paródico y satírico, la invención de Eduardo Mendoza convierte la Barcelona cotidiana y absurda en el escenario de una carnavalada. Tras las máscaras pintarrajeadas y grotescas, se revela el verdadero rostro del hombre urbano actual y, tras el estilo literario, la acerada conciencia artística del escritor. Eduardo Mendoza afirma de esta obra que «Sin noticias de Gurb es, sin duda, el libro más excéntrico de cuantos he escrito. No hay en él una sola sombra de melancolía. Es una mirada sobre el mundo asombrada, un punto desamparada, pero sin asomo de tragedia ni de censura.»',
  },
  OL712028W: {
    description:
      'Relato que se desarrolla a partir del catálogo de autores nazis imaginado por el autor en su libro anterior La literatura nazi en América. La atención se concentra aquí sobre uno de ellos, Carlos Ramírez Hoffman, para denunciar la impunidad del horror y el sentido tragicómico de los destinos humanos.',
  },
  OL8165007W: { title: 'El hombre más rico de Babilonia' },
  OL32466W: { title: 'Una canción de Navidad' },
  OL276492W: { title: 'El monje que vendió su Ferrari' },
  OL554615W: { title: 'Seduciendo a Mr. Bridgerton' },
  OL17417W: { title: 'Cita con Rama' },
  OL893516W: { title: 'Hijos de Dune' },
  OL8996438W: { title: 'El péndulo de Foucault' },
  OL1418187W: { title: 'Una princesa de Marte' },
  OL655908W: { title: 'Era la víspera de Navidad' },
  OL2163623W: { title: 'La vida, el universo y todo lo demás' },
  OL4797379W: { title: 'Física universitaria' },
  OL57249W: { title: 'Química orgánica' },
  OL1854815W: { title: 'Lecciones sobre la vida del monje que vendió su Ferrari' },
  OL516728W: { title: 'La piedra de cristal', coverId: 14119100 },
  OL1099513W: { title: 'Viaje al centro de la Tierra' },
  OL1914022W: { title: 'Los pilares de la Tierra' },
  OL46302W: { title: 'Los límites de la Fundación' },
  OL98488W: { title: 'El desayuno de los campeones' },
  OL261866W: { title: 'Trópico de Cáncer' },
  OL2897798W: { noDescription: true },
  OL27696982W: { noDescription: true },
  OL41495W: { noDescription: true },
  OL1984422W: { noDescription: true },
  OL362706W: { noDescription: true },
  OL15719630W: { noDescription: true },
  OL258850W: { noDescription: true },
  OL471940W: { noDescription: true },
  // Years that contradict the work's own text in Open Library, or, for a book written in Spanish, its
  // oldest Spanish edition: that edition is the first one.
  OL53908W: { year: 1884 },
  OL16239762W: { year: 2012 },
  OL1973422W: { year: 1972 },
  OL472250W: { year: 1976 },
  OL273644W: { year: 1982 },
  OL86707W: { year: 1993 },
  OL13826369W: { year: 2010 },
  OL262477W: { year: 1905 },
  OL77813W: { year: 1985 },
  OL262438W: { year: 1890 },
  OL81624W: { year: 1999 },
  OL17415W: { year: 1953 },
  OL3454854W: { year: 1974 },
  OL262454W: { year: 1902 },
  OL97947W: { year: 2004 },
  OL22705884W: { year: 2020 },
  OL16805135W: { year: 2013 },
  OL26387829W: { year: 2016 },
  OL5969057W: { title: 'Guerra Mundial Z' },
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
