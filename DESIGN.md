---
name: Goodreads · Prototipo de rediseño
description: Una biblioteca personal sobre pálidos del burdeo, con títulos serif grandes y formas redondeadas, donde una cinta marca lo activo, lo fijo y el estado de cada libro.
colors:
  white: '#ffffff'
  paper: '#fdfafa'
  shell: '#f9f1f2'
  sand: '#f3e4e6'
  sand-deep: '#ead4d8'
  sand-dark: '#dfc2c8'
  line: '#f0e4e6'
  edge: '#8b7a7d'
  ink: '#1e1915'
  muted: '#5e5251'
  ribbon: '#7a2334'
  want: '#2f4a78'
  owned: '#6b3a63'
  reading: '#85490f'
  read: '#2a6249'
  danger: '#a3341c'
typography:
  page-title:
    fontFamily: 'Source Serif 4, Georgia, serif'
    fontSize: '2rem'
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: '-0.03em'
  page-title-sm:
    fontFamily: 'Source Serif 4, Georgia, serif'
    fontSize: '1.75rem'
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: '-0.03em'
  page-title-lg:
    fontFamily: 'Source Serif 4, Georgia, serif'
    fontSize: '2.5rem'
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: '-0.03em'
  section-title:
    fontFamily: 'Source Serif 4, Georgia, serif'
    fontSize: '1.5rem'
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: '-0.02em'
  section-title-lg:
    fontFamily: 'Source Serif 4, Georgia, serif'
    fontSize: '1.75rem'
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: '-0.02em'
  display:
    fontFamily: 'Source Serif 4, Georgia, serif'
    fontSize: '2rem'
    fontWeight: 600
    lineHeight: '2.375rem'
    letterSpacing: '-0.025em'
  heading:
    fontFamily: 'Source Serif 4, Georgia, serif'
    fontSize: '1.375rem'
    fontWeight: 600
    lineHeight: '1.75rem'
  book-title:
    fontFamily: 'Source Serif 4, Georgia, serif'
    fontSize: '1.125rem'
    fontWeight: 600
    lineHeight: 1.375
  body:
    fontFamily: 'Figtree, ui-sans-serif, system-ui, sans-serif'
    fontSize: '1rem'
    fontWeight: 400
    lineHeight: '1.5rem'
  control:
    fontFamily: 'Figtree, ui-sans-serif, system-ui, sans-serif'
    fontSize: '1rem'
    fontWeight: 600
    lineHeight: '1.5rem'
  small:
    fontFamily: 'Figtree, ui-sans-serif, system-ui, sans-serif'
    fontSize: '0.875rem'
    fontWeight: 400
    lineHeight: '1.25rem'
  small-label:
    fontFamily: 'Figtree, ui-sans-serif, system-ui, sans-serif'
    fontSize: '0.875rem'
    fontWeight: 600
    lineHeight: '1.25rem'
  caption:
    fontFamily: 'Figtree, ui-sans-serif, system-ui, sans-serif'
    fontSize: '0.75rem'
    fontWeight: 500
    lineHeight: '1rem'
rounded:
  cover: '2px 3px 3px 2px'
  control: '10px'
  row: '14px'
  card: '16px'
  float: '16px'
  tile: '20px'
  tab: '22px'
  stage: '24px'
  pill: '9999px'
  avatar: '9999px'
spacing:
  menu: '6px'
  row: '10px'
  grid: '10px'
  card: '12px'
  media: '14px'
  gutter: '16px'
  gutter-md: '28px'
  gutter-lg: '44px'
  grid-md: '16px'
  section: '28px'
  section-lg: '40px'
components:
  button-primary:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.white}'
    typography: '{typography.control}'
    rounded: '{rounded.pill}'
    padding: '0 16px'
    height: '44px'
  button-secondary:
    textColor: '{colors.ink}'
    typography: '{typography.control}'
    rounded: '{rounded.pill}'
    padding: '0 16px'
    height: '44px'
  button-secondary-hover:
    backgroundColor: '{colors.sand}'
    textColor: '{colors.ink}'
  button-secondary-pressed:
    backgroundColor: '{colors.sand-deep}'
    textColor: '{colors.ink}'
  button-secondary-open:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.white}'
  button-quiet:
    textColor: '{colors.ink}'
    typography: '{typography.control}'
    rounded: '{rounded.pill}'
    padding: '0 16px'
    height: '44px'
  button-quiet-hover:
    backgroundColor: '{colors.sand}'
  button-quiet-pressed:
    backgroundColor: '{colors.sand-deep}'
  button-compact:
    padding: '0 10px'
    height: '44px'
  button-danger:
    backgroundColor: '{colors.danger}'
    textColor: '{colors.white}'
    typography: '{typography.control}'
    rounded: '{rounded.pill}'
    padding: '0 16px'
    height: '44px'
  button-disabled:
    backgroundColor: '{colors.sand}'
    textColor: '{colors.muted}'
  rail-arrow:
    backgroundColor: '{colors.white}'
    textColor: '{colors.ink}'
    rounded: '{rounded.pill}'
    width: '48px'
    height: '48px'
  status-control:
    textColor: '{colors.ink}'
    typography: '{typography.control}'
    height: '44px'
  status-control-add:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.white}'
    typography: '{typography.control}'
    rounded: '{rounded.pill}'
    padding: '0 16px'
    height: '44px'
  anchored-menu:
    backgroundColor: '{colors.white}'
    rounded: '{rounded.float}'
    padding: '6px'
  anchored-menu-item:
    rounded: '{rounded.control}'
    padding: '0 10px'
    height: '44px'
  anchored-menu-item-hover:
    backgroundColor: '{colors.sand}'
    rounded: '{rounded.control}'
    padding: '0 10px'
    height: '44px'
  search-field:
    backgroundColor: '{colors.white}'
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    rounded: '{rounded.pill}'
    padding: '0 0 0 16px'
    height: '44px'
  search-field-lg:
    backgroundColor: '{colors.white}'
    textColor: '{colors.ink}'
    rounded: '{rounded.pill}'
    padding: '0 6px 0 20px'
    height: '56px'
  text-field:
    backgroundColor: '{colors.white}'
    textColor: '{colors.ink}'
    rounded: '{rounded.control}'
    padding: '0 12px'
    height: '44px'
  avatar-xs:
    textColor: '{colors.white}'
    rounded: '{rounded.avatar}'
    width: '24px'
    height: '24px'
  avatar-sm:
    textColor: '{colors.white}'
    typography: '{typography.small-label}'
    rounded: '{rounded.avatar}'
    width: '40px'
    height: '40px'
  avatar-lg:
    textColor: '{colors.white}'
    typography: '{typography.subheading}'
    rounded: '{rounded.avatar}'
    width: '64px'
    height: '64px'
  page-header:
    textColor: '{colors.ink}'
    typography: '{typography.page-title}'
  tag-filter-item:
    textColor: '{colors.muted}'
    typography: '{typography.caption}'
    rounded: '{rounded.control}'
    height: '56px'
  tag-filter-item-active:
    textColor: '{colors.ink}'
    typography: '{typography.caption}'
    rounded: '{rounded.control}'
    height: '56px'
  folder-card:
    backgroundColor: '{colors.white}'
    textColor: '{colors.ink}'
    typography: '{typography.book-title}'
    rounded: '{rounded.card}'
    padding: '12px'
  new-folder-card:
    backgroundColor: '{colors.sand}'
    textColor: '{colors.ink}'
    typography: '{typography.book-title}'
    rounded: '{rounded.card}'
    padding: '12px'
  new-folder-card-hover:
    backgroundColor: '{colors.sand-deep}'
  folder-link:
    textColor: '{colors.ink}'
    height: '44px'
  ledger-row:
    textColor: '{colors.ink}'
    padding: '4px 0'
  block:
    backgroundColor: '{colors.shell}'
    textColor: '{colors.ink}'
    rounded: '{rounded.tile}'
    padding: '20px'
  inline-confirm:
    backgroundColor: '{colors.shell}'
    textColor: '{colors.ink}'
    rounded: '{rounded.tile}'
    padding: '20px'
  book-row:
    textColor: '{colors.ink}'
    rounded: '{rounded.row}'
  book-row-hover:
    backgroundColor: '{colors.shell}'
    rounded: '{rounded.row}'
  nav-bar:
    backgroundColor: '{colors.paper}'
    textColor: '{colors.muted}'
    typography: '{typography.caption}'
    height: '65px'
  nav-bar-item:
    rounded: '{rounded.tab}'
    height: '56px'
  nav-bar-active:
    backgroundColor: '{colors.sand}'
    textColor: '{colors.ink}'
    rounded: '{rounded.tab}'
    height: '56px'
  nav-sidebar:
    backgroundColor: '{colors.paper}'
    width: '232px'
  nav-sidebar-item:
    textColor: '{colors.muted}'
    rounded: '{rounded.control}'
    padding: '0 12px'
    height: '44px'
  nav-sidebar-item-active:
    backgroundColor: '{colors.sand}'
    textColor: '{colors.ink}'
    rounded: '{rounded.control}'
    padding: '0 12px'
    height: '44px'
  toast:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.white}'
    typography: '{typography.body}'
    rounded: '{rounded.float}'
    padding: '4px 4px 4px 16px'
    width: '448px'
  book-cover-sm:
    rounded: '{rounded.cover}'
    width: '56px'
  book-cover-sm-md:
    rounded: '{rounded.cover}'
    width: '64px'
  book-cover-lg:
    rounded: '{rounded.cover}'
    width: '112px'
  book-cover-lg-md:
    rounded: '{rounded.cover}'
    width: '224px'
  ribbon-nav:
    backgroundColor: '{colors.ribbon}'
    width: '10px'
    height: '16px'
  ribbon-tag-filter:
    backgroundColor: '{colors.ribbon}'
    width: '9px'
    height: '12px'
  ribbon-pinned:
    backgroundColor: '{colors.ribbon}'
    width: '9px'
    height: '26px'
  ribbon-cover-sm:
    width: '7px'
    height: '16px'
  ribbon-cover-fill:
    width: '10px'
    height: '24px'
  ribbon-cover-lg:
    width: '10px'
    height: '24px'
  ribbon-cover-lg-md:
    width: '13px'
    height: '36px'
---

# Design System: Goodreads · Prototipo de rediseño

## Overview

**Creative North Star: "Cinta marcapáginas"**

La biblioteca vive sobre un papel apenas rosado, una escalera de pálidos que sale del burdeo de la cinta. El título de cada página es una serif grande sin nada detrás, y él solo dice dónde estás. Las formas son redondeadas: los botones son píldoras, las tarjetas tienen esquinas amplias y las portadas ponen casi todo el color de la pantalla. En Inicio y en Buscar, ese color salta a la tarjeta que carga el libro. Sobre esa calma, una cinta con la punta cortada sigue siendo el gesto propio: marca lo activo, lo fijo y el estado de un libro.

La vara es que parezca un producto que alguien usaría hoy, despejado y con un orden evidente. La jerarquía viene del tamaño del título, del espacio y de pocos bloques de color, no de bandas ni de cajas. Un solo botón relleno por pantalla concentra la atención, y los demás se dibujan con su borde. En computador la navegación es una barra lateral, y en celular y tablet una barra sólida pegada al borde inferior. No hay modales: lo que se edita se edita en su lugar.

Este documento fija tipografía, color, densidad, formas y el gesto de la cinta. Las pantallas, los flujos, los textos y las decisiones D1 a D6 salen de `docs/e2/informe-e2.pdf` y de `PLAN.md`. El orden de autoridad es el informe, después `PLAN.md` y después este documento. **Ante un choque con las 14 reglas de interfaz de `PLAN.md`, ganan las reglas**, salvo las excepciones aprobadas en su sección 6. Lo que el sistema no cubra se anota como decisión para el CP.

Los tokens viven en `src/index.css`, y si este archivo y el código difieren, se corrige este archivo. Los títulos de sección quedan en inglés porque las herramientas de este formato los buscan por su nombre exacto.

**Key Characteristics:**

- Fondos de pálidos del burdeo y tinta para el texto.
- Títulos serif grandes, sin banda ni caja detrás.
- Barra lateral en computador, y barra sólida pegada al borde bajo 1024 px.
- Píldoras para lo que se presiona: solo el botón principal va relleno.
- Una cinta con punta cortada como marca de lo activo, lo fijo y el estado.
- Tags sin relleno: ícono, texto y color, siempre juntos.
- El color de la portada como fondo de sus tarjetas, oscurecido hasta 8,5:1 con texto blanco.
- Rieles nativos, con flechas solo para el mouse.
- Lo que se edita se edita en su lugar, sin modales ni paneles.
- Movimiento corto y solo como respuesta a una acción.

## Colors

La paleta es una escalera de un solo tono: los pálidos salen del burdeo de la cinta y hacen el trabajo de área. La paleta por defecto de Tailwind está borrada: solo existen estos tokens.

### Primary

- **Tinta** (`ink`, #1e1915): texto principal, relleno del botón `primary`, del toast, de "Agregar a Mis libros" y de la opción elegida de un selector de listas, botón con su menú abierto, anillo de foco y estrellas llenas. Hace el trabajo que en otra app haría un color de marca.
- **Cinta burdeo** (`ribbon`, #7a2334): el relleno de la cinta que marca lo activo y lo fijo. También es el color del cursor de texto (`caret-color`), uno de los seis fondos de la portada de reemplazo, el corazón de un "Me gusta" dado y la línea que explica una recomendación en Descubrir, como "Porque guardas Terror". No se usa para nada más: tampoco en avatares.

### Secondary

Los cuatro colores de estado se usan en el texto y el ícono de `StatusTag`, y en la cinta bajo la portada. Nunca como relleno de una superficie de la interfaz ni solos: siempre van con su ícono y su nombre. La única excepción son las portadas de reemplazo y los avatares, que los usan como pigmento, sin significado de estado.

- **Azul Lo quiero** (`want`, #2f4a78), con el ícono `Bookmark`.
- **Ciruela Lo tengo** (`owned`, #6b3a63), con el ícono `Book`.
- **Ámbar Leyendo** (`reading`, #85490f), con el ícono `BookOpen`.
- **Verde Leído** (`read`, #2a6249), con el ícono `CircleCheck`.

### Tertiary

- **Óxido de peligro** (`danger`, #a3341c): solo para la variante `danger` de `Button` y el ícono de `ErrorState`.

### Neutral

- **Papel** (`paper`, #fdfafa): el fondo de la app, de las dos barras y el `theme-color` del navegador.
- **Concha** (`shell`, #f9f1f2): los bloques de la página, como `EmptyState`, `ErrorState`, `InlineConfirm` o un aviso. También las filas de actividad en Inicio, y el hover de las filas y de las secciones inactivas de la barra lateral.
- **Blanco** (`white`, #ffffff): tarjetas, campos, menú, flechas de un riel y la píldora de un tag sobre una tarjeta de tono.
- **Arena** (`sand`, #f3e4e6): la sección activa de las dos barras, el hover de `secondary`, `quiet` y las opciones del menú, la presión de las filas, el botón deshabilitado, los huecos de portada, los esqueletos de carga, la selección de texto, el fondo de un selector de listas y el bloque de "+ Nueva carpeta".
- **Arena profunda** (`sand-deep`, #ead4d8): la presión de `secondary`, `quiet` y las opciones del menú, el resaltado de una coincidencia en Buscar y el hover de un selector de listas. Solo da 1,4:1 sobre papel, así que nunca es la única señal de un control.
- **Arena oscura** (`sand-dark`, #dfc2c8): un paso más, solo para la presión dentro de un selector de listas.
- **Línea** (`line`, #f0e4e6): separadores de 1 px entre filas, borde de `FolderCard` y de la barra lateral, y la raya del menú antes de sus comandos. Es decorativa (1,19:1 sobre papel), así que nunca es la única señal de un control o un estado.
- **Borde** (`edge`, #8b7a7d): el borde de 1 px de `Button` `secondary`, `SearchField` y `TextField`, y el hover de `FolderCard`. Llega a 3:1 sobre blanco, papel, concha y arena. Al 60 % es la raya superior de la barra inferior, que es decorativa.
- **Neutro** (`muted`, #5e5251): texto secundario, secciones inactivas, íconos y estrellas vacías.

### Tono de portada

`coverTone(book)`, de `src/lib/coverTone.ts`, toma el color dominante de la portada, que viene de `src/data/coverColors.json` o del propio libro si es del catálogo, y lo oscurece hasta dar 8,5:1 con texto blanco. El texto secundario va en blanco al 88 %. Un azul que deriva a índigo se queda en azul y un amarillo, que oscuro se vuelve oliva, pasa a ámbar. Una portada sin color propio toma un tono de tinta (`rgb(50 43 38)`).

- **Inicio, Buscar y Persona:** el tono es el fondo de la tarjeta que carga ese libro o autor. En Persona, solo la tarjeta de "Está leyendo".
- **Descubrir:** solo es un tinte al 12 % sobre papel detrás de los libros (`tone-scene`, con `--tone`), y nunca queda bajo el texto, así que no cambia ningún contraste. La ficha no lleva tinte: su portada va sola, sobre `paper`.
- **Ninguna otra superficie** se tiñe, y las portadas mismas nunca se tiñen.

### Contrastes medidos

Calculados con la fórmula WCAG de `src/test/contrast.ts` sobre los tokens reales. `src/components/statusStyles.test.ts` vigila las columnas de blanco a arena, y `src/lib/coverTone.test.ts` vigila los tonos de portada de todo el catálogo. El recorrido de los cuatro dispositivos midió 6,09:1 como mínimo en todo el texto visible.

| Texto sobre | `white` | `paper` | `shell` | `sand` | `sand-deep` | `sand-dark` |
| ----------- | ------- | ------- | ------- | ------ | ----------- | ----------- |
| `ink`       | 17,43   | 16,79   | 15,68   | 14,15  | 12,37       | 10,53       |
| `muted`     | 7,50    | 7,22    | 6,74    | 6,09   | 5,32        | 4,53        |
| `want`      | 8,85    | 8,53    | 7,97    | 7,19   | 6,29        | 5,35        |
| `owned`     | 8,71    | 8,39    | 7,84    | 7,07   | 6,18        | 5,26        |
| `reading`   | 7,10    | 6,84    | 6,39    | 5,77   | 5,04        | 4,29        |
| `read`      | 7,14    | 6,88    | 6,42    | 5,80   | 5,07        | 4,31        |
| `danger`    | 6,85    | 6,60    | 6,16    | 5,56   | 4,86        | 4,14        |
| `ribbon`    | 9,92    | 9,55    | 8,92    | 8,05   | 7,04        | 5,99        |

Sobre `sand-dark` los tags de ámbar y verde y `danger` no llegan a 4,5:1, así que ningún texto de color va ahí. Es solo la presión de un selector de listas, con texto de tinta.

| Texto en controles llenos                                        | Contraste       |
| ---------------------------------------------------------------- | --------------- |
| Blanco sobre `ink`                                               | 17,43           |
| Blanco sobre `ink` al 90 % y al 80 %                             | 13,08 y 9,19    |
| Blanco sobre `danger`                                            | 6,85            |
| Blanco sobre `danger` al 90 % y al 80 %                          | 5,63 y 4,54     |
| `shell` sobre `ink` (Deshacer)                                   | 15,68           |
| `shell` sobre `ink` con blanco al 10 % y al 20 %                 | 11,77 y 8,27    |
| `ink` sobre `sand` y `sand-deep` (`secondary` y `quiet`)         | 14,15 y 12,37   |
| `muted` sobre `sand` (botón deshabilitado)                       | 6,09            |
| Tags y `muted` sobre `ink` al 5 %, en `paper` (fila bajo cursor) | 6,21 o más      |
| Tags y `muted` sobre `ink` al 10 %, en `paper` (fila presionada) | 5,61 o más      |
| Blanco sobre un tono de portada, en los 54 libros                | de 8,50 a 13,92 |
| Blanco al 88 % sobre un tono de portada                          | 6,90 o más      |

Los valores de `ink` y `danger` con transparencia son el peor caso, sobre blanco. El mínimo de toda la tabla es 4,54:1, en `danger` presionado. Las cintas de los cuatro estados y la burdeo superan 4,6:1 sobre todos los fondos, por encima del 3:1 que pide una marca gráfica. Los seis fondos de la portada de reemplazo dan 7,10:1 o más con las iniciales blancas.

| Borde sobre | `white` | `paper` | `shell` | `sand` |
| ----------- | ------- | ------- | ------- | ------ |
| `edge`      | 4,06    | 3,91    | 3,65    | 3,29   |

Todos superan el 3:1 que pide el borde de un control. Sobre `sand-deep` da 2,88:1, así que `edge` no va ahí: un `secondary` presionado sigue siendo legible por su texto, y su forma ya se vio en reposo.

### Named Rules

**La regla del tono.** El fondo de la app sale de un solo tono, el de la cinta. El único otro color de área es el de una portada, y solo en una tarjeta que carga ese libro. Encabezados, enlaces y botones se resuelven con tinta.

**La regla del tag sin relleno.** Un estado es ícono, texto y color, nunca una píldora de color. Esta regla existe para que una lista de veinte libros no compita con sus portadas. Sobre una tarjeta de tono, donde su color no se leería, el tag va en una píldora blanca (`rounded-full bg-white px-2.5 py-1`) y conserva su color.

**La regla de las estrellas de tinta.** Las estrellas son de tinta y las vacías son de neutro. No hay naranja en esta paleta.

## Typography

**Display Font:** Source Serif 4 (con Georgia y serif)
**Body Font:** Figtree (con ui-sans-serif, system-ui y sans-serif)

**Character:** una serif de libro con eje óptico para lo que se lee como título, y una sans redonda y clara para todo lo que se opera. Ambas son libres y están alojadas en `src/assets/fonts/`.

### Hierarchy

- **Título de página** (600, 32 px, línea 1,1, tracking -0,03 em; 28 px bajo 360 px y 40 px desde 1024 px): el h1 de cada sección. Es la utilidad `page-title`, y `PageHeader` ya la usa.
- **Título de sección** (600, 24 px, línea 1,2, tracking -0,02 em; 28 px desde 1024 px): títulos dentro de la página, como "Mis carpetas", "Tus amigos" o "Está leyendo". Es la utilidad `section-title`.
- **Título de tarjeta** (600, 24 px y línea 1,12; 32 px desde 1024 px, tracking -0,02 em): el libro en una tarjeta de tono, con `font-serif text-[1.5rem]/[1.12] lg:text-[2rem]/[1.1]`.
- **Nombre de autor** (600, 18 px y línea 1,15; 20 px desde 1024 px): el autor en su tarjeta de tono, con `font-serif text-lg/[1.15] lg:text-xl/[1.15]`. Desde 1024 px, la primera tarjeta de los resultados, que hace de mejor resultado, usa los 32 px de Título de tarjeta.
- **Título del libro en Descubrir** (600, tracking -0,02 em): 22 px en celular, 28 px desde 640 px y 44 px desde 1024 px.
- **Heading** (600, 22 px, 28 px de línea, tracking -0,025 em): el título de la ficha bajo 768 px, al lado de la portada. Desde 768 px usa `page-title`.
- **Display** (600, 32 px, 38 px de línea, tracking -0,025 em): quedó sin uso desde que la ficha pasó a `page-title`.
- **Subheading** (600, 20 px, 28 px de línea): las iniciales de `Avatar` `lg`.
- **Book title** (600, 18 px): el nombre de un libro en `BookRow` (línea 1,375, máximo dos líneas), el de una persona en `PersonRow` (16 px bajo 360 px), el de una carpeta en `FolderCard` y el título de `EmptyState`, `ErrorState` e `InlineConfirm`.
- **Fila compacta** (600, 17 px, línea 1,375): el libro en una fila de actividad, en `BookRow` con `compact` o en el estante de una persona, con `font-serif text-[1.0625rem]/snug`.
- **Body** (400, 16 px, 24 px de línea): texto de lectura y datos del libro.
- **Control** (600, 16 px, 24 px de línea): botones y `StatusTag` en tamaño normal. Los enlaces de volver y de carpeta usan 500.
- **Small** (400, 14 px, 20 px de línea): subtítulos, autores, cantidades y procedencia de una descripción, en `muted`.
- **Small label** (600, 14 px, 20 px de línea): `StatusTag` en listas, @usuario, estado de una persona, "En común".
- **Caption** (500, 12 px, 16 px de línea): etiquetas de `TagFilter`, el aviso de prototipo y la barra inferior en 600. Las activas pasan a 700. Bajo 360 px, también los amigos en común y el estado en una fila de persona.

La marca "Goodreads" usa la serif a 600: 24 px en la barra lateral, 16 px en `Wordmark` y 14 px cuando va apilada. La cantidad de `TagFilter` usa la serif a 600, 16 px y 20 px de línea, con cifras tabulares.

Todo `h1`, `h2` y `h3` usa `text-wrap: balance`.

### Named Rules

**La regla de la serif que nombra.** La serif es para lo que nombra: páginas, secciones, libros, autores, carpetas, la marca y las cantidades de `TagFilter`. Lo que se opera o se explica va en Figtree.

**La regla de la escala cerrada.** Usa solo los tamaños de esta lista. Las únicas excepciones son las iniciales de la portada de reemplazo, que crecen con la portada, y las de `Avatar` `xs`, de 10 px. No hay texto en mayúsculas sostenidas.

## Layout

El diseño parte del celular. `AppShell` pone el marco y cada pantalla solo llena `main`.

- **Puntos de quiebre:** `lg` (1024 px) cambia la barra inferior por la lateral. `md` (768 px) cambia las grillas. `sm` (640 px) solo afina Descubrir.
- **Barra lateral:** 232 px (`--sidebar`), fija al alto de la pantalla, desde `lg`.
- **Margen:** `--gut` mide 16 px, 28 px desde `md` y 44 px desde `lg`. `main` lo pone siempre, así que una pantalla no agrega su propio margen lateral. Lo que deba llegar al borde de la columna, como un riel, usa `full-bleed`.
- **Ancho:** Inicio, Descubrir, Buscar y `/actividad` usan todo el ancho que deja la barra lateral (`WIDE_PATHS` en `AppShell`). Las demás pantallas van en una columna de hasta 1040 px (`max-w-app`), centrada bajo `lg` y pegada a la barra lateral desde ahí.
- **Inicio de página:** `PageHeader` deja 12 px arriba, 32 px desde `lg`, y 16 px abajo si no lleva nada bajo el título. El margen inferior de lo que lleva adentro queda en el encabezado, gracias a `flow-root`. La acción de la página, si la hay, va en la misma fila del título.
- **Espacio bajo el contenido:** `main` deja 128 px abajo más el área segura bajo `lg`, para la barra de 65 px y el toast, y 64 px desde `lg`. Medido al final de cada pantalla, lo último queda a 63 px o más de la barra.
- **Ritmo vertical:** 28 px entre secciones (40 px desde `lg`), 12 px bajo un título de sección y 16 px bajo un título de página.
- **Tablero de tarjetas:** 2 columnas con 10 px de separación en celular, 4 columnas con 16 px desde `md` y 5 desde `lg`. Las tarjetas de una fila miden lo mismo, y un nombre llega a dos líneas. "+ Nueva carpeta" cierra el tablero: ocupa su celda, como una carpeta, y mientras se escribe toma dos.
- **Listas de libros:** una columna de `BookRow` en celular y dos desde `md`, con 32 px entre columnas. Cada fila va en un `li` con `border-b border-line last:border-b-0`, como en `BookList`. Desde `md`, las dos últimas filas pierden su línea si quedan una al lado de la otra, con `md:nth-last-2:odd:border-b-0`.
- **Ficha:** sin `PageHeader`, con `BackLink` y `Wordmark` en la primera fila. Tiene la misma forma para todo libro, con o sin descripción.
  - **Bajo 768 px:** la portada de 112 px a la izquierda y, a 16 px, el título en Heading con el autor, el año y las páginas. Debajo van el registro y "Sobre este libro", a todo el ancho.
  - **Desde 768 px:** dos columnas, con 32 px entre ambas: la de la portada, de 280 px, y lo que se lee. La portada de 224 px queda arriba y a la izquierda de su columna.
  - **Desde 1024 px:** las mismas dos columnas en proporción 4 a 7, con 48 px entre ambas y la de la portada de 264 px como mínimo. A 1024 px deja 392 px para el registro, donde dos carpetas y "Agregar o quitar" caben en una línea.
  - La portada sigue la lectura desde 768 px (`sticky`), para que una descripción larga no deje su columna vacía.
- **Áreas táctiles:** 44 px como mínimo en todo control. Las secciones de la barra inferior miden 56 px de alto, y a 320 px de ancho, 62 × 56 px. `TagFilter` mide 56 px y las opciones del menú 44 px. El recorrido final no encontró ningún control bajo 44 px ni scroll horizontal, en los cuatro dispositivos.

## Elevation & Depth

El sistema se ordena por espacio, tamaño de los títulos y pocos bloques de `shell`. Las filas se separan con líneas de 1 px. Solo hay sombra en lo que flota sobre la página y en las portadas, siempre teñida, nunca negra. Las dos barras son planas, sobre `paper`, y sólidas: nada las transparenta ni las desenfoca.

### Shadow Vocabulary

- **Flotante** (`--shadow-float`: `0 2px 4px rgb(30 25 21 / 14%), 0 18px 34px -8px rgb(30 25 21 / 40%)`): `AnchoredMenu`, toast y `RailArrow`.
- **Libro** (`--shadow-book`: `0 1px 1px rgb(30 25 21 / 20%), 0 6px 12px -5px rgb(30 25 21 / 35%)`): portadas en tamaños `sm` y `fill`.
- **Libro grande** (`--shadow-book-lg`: `0 2px 3px rgb(30 25 21 / 22%), 0 16px 26px -10px rgb(30 25 21 / 50%)`): una portada `lg` sin `raised`, como la de la ficha.
- **Portada** (`--shadow-cover`: `0 1px 2px rgb(20 12 8 / 22%), 0 14px 28px -12px rgb(20 12 8 / 55%)`): una portada con `raised`, sobre un tono o sola en un riel.

### Named Rules

**La regla de lo que flota.** Solo `AnchoredMenu`, el toast y las flechas de un riel flotan con sombra. Una tarjeta, un botón o un campo no llevan sombra: se separan con fondo, borde y espacio.

**La regla de la presión.** Lo que se toca responde al instante. Un botón se encoge al 98 % en 150 ms (`active:scale-98`), una tarjeta baja 1 px (`active:translate-y-px`) y una fila cambia de fondo.

**La regla del libro físico.** Solo las portadas usan sombras de libro. Son objetos, no tarjetas. En un riel suben 6 px bajo el cursor, con `cover-lift`, y nunca se mueven solas.

## Shapes

Lo que se presiona es una píldora y lo que contiene tiene esquinas amplias, que crecen con el tamaño del bloque.

- **Portada** (2 px en el lomo y 3 px en el borde exterior): portadas, sus huecos en `FolderCard` y en "+ Nueva carpeta" y sus esqueletos en `LoadingState`. Una línea plana de 2 px de tinta al 15 % dibuja la bisagra del libro y separa las portadas claras del fondo.
- **Píldora** (`rounded-full`): `Button`, `SearchField`, los botones de texto de un campo, "Cambiar o quitar" y un selector de listas.
- **Control** (`rounded-control`, 10 px): `TextField`, opciones del menú, secciones de la barra lateral, botones de `TagFilter` y `BackLink`.
- **Fila** (`rounded-row`, 14 px): el fondo de una fila bajo el cursor, una fila de actividad y el enlace "ver todo" como tarjeta.
- **Tarjeta** (`rounded-card`, 16 px): tarjetas de carpeta y de autor.
- **Flotante** (`rounded-float`, 16 px): menú y toast.
- **Bloque** (`rounded-tile`, 20 px): tarjetas de tono, `EmptyState`, `ErrorState` e `InlineConfirm`.
- **Pestaña** (`rounded-tab`, 22 px): la sección activa de la barra inferior.
- **Escena** (`rounded-stage`, 24 px): el escenario del carrusel de Descubrir.
- **Cinta:** rectángulo con muesca en V, con `clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 76%, 0 100%)`. Se dibuja solo con `Ribbon`.
- **Avatar:** un círculo, para separar a una persona de un libro de un vistazo.

## Components

Importa todo desde `src/components/`. Son del bloque base: si necesitas cambiar uno, se hace en un commit aparte y avisando al otro rol.

### Qué usar para cada necesidad

| Necesidad                                          | Usa                                                                                                                                       |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Navegación principal y contenedor de la página     | `AppShell`, que ya envuelve las rutas; no agregues otra barra                                                                             |
| Comienzo de una sección, con título y volver       | `PageHeader`, con `backTo` y `backLabel` en subpáginas, y `action` para lo que actúa sobre la página                                      |
| Un título de página sin `PageHeader`               | `page-title` en el h1, con `Wordmark` en la misma pantalla                                                                                |
| Un título de sección                               | `section-title`                                                                                                                           |
| Volver desde una página sin `PageHeader`           | `BackLink`, siempre a una ruta fija, junto a `Wordmark`, como en la ficha                                                                 |
| Filtrar por tag con la cantidad de cada uno        | `TagFilter`, como hijo de `PageHeader`                                                                                                    |
| Mostrar un libro en una lista                      | `BookRow`; la acción extra, como "Quitar", va en `trailing`, y en una lista de otra persona, `note`                                       |
| Mostrar una portada suelta                         | `BookCover`: `xs` para filas densas, `sm` para listas, `fill` para grillas y `lg` para la ficha; `raised` sobre un tono o sola en un riel |
| Que una portada responda al cursor                 | `cover-lift` en lo que la envuelve, dentro del enlace                                                                                     |
| Una lista horizontal que se recorre                | `useRail`, `rail` y `full-bleed`; `RailArrow` para el mouse                                                                               |
| Una tarjeta con el color de su libro               | `coverTone(bookId)` como `backgroundColor`, con `text-white`                                                                              |
| Mostrar el estado de un libro, sin cambiarlo       | `StatusTag`; en listas, `size="sm"`                                                                                                       |
| Cambiar o agregar el tag de un libro               | `StatusControl`, y no otro control. Recibe `book` si el libro puede no estar en el store                                                  |
| Mostrar o elegir un puntaje                        | `Stars`; con `onChange` es un campo                                                                                                       |
| Acción con botón                                   | `Button`: `primary`, `secondary`, `quiet` o `danger`; `compact` en una fila o junto al título                                             |
| Cambio rápido con pocas opciones, junto al control | `AnchoredMenu`                                                                                                                            |
| Editar un dato                                     | En su lugar, en la misma fila o título donde se lee                                                                                       |
| Escribir un texto corto donde se lee               | `TextField`, con Guardar y Cancelar al lado                                                                                               |
| Confirmar lo que no se puede deshacer              | `InlineConfirm`, solo para eliminar carpeta y Reiniciar demo                                                                              |
| Buscar o filtrar mientras se escribe               | `SearchField`, bajo el título o en su fila; `size="lg"` si buscar es lo primero de la pantalla; en una lista de libros, `BandSearch`      |
| Mostrar a una persona                              | `Avatar`, siempre junto a su nombre; `xs` dentro de una línea de texto                                                                    |
| Confirmar después de un cambio y permitir deshacer | El toast del store, que `AppShell` ya muestra; no montes otro                                                                             |
| Lista vacía o sin resultados                       | `EmptyState`, con ícono, título, descripción y acción opcional                                                                            |
| Esperar resultados                                 | `LoadingState`                                                                                                                            |
| Algo falló                                         | `ErrorState`, con `onRetry` si se puede reintentar                                                                                        |
| Enlaces a un libro o una carpeta                   | `bookPath` y `folderPath`                                                                                                                 |

### Piezas por pantalla

Todas las pantallas tienen su forma final. Esto dice qué piezas locales usa cada una, y su contenido y sus textos salen de `PLAN.md`.

| Pantalla   | Piezas locales, en su carpeta                                                                                                                              |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Inicio     | `ReadingNow` (tarjeta de lectura), `ActivityPreview` y `ActivityRow` (filas de actividad), `ActivityView` y `ActivityEntry` (vista completa), `LikeButton` |
| Mis libros | `FolderBoard`, `FolderCard`, `NewFolderCard`, `WantPrompt`, `BandSearch`, `BookList`; también en Carpeta y Sin carpeta                                     |
| Ficha      | `LedgerRow` (registro), `ReadingDetails` (fechas y puntaje), `BookFolders`, `BookSkeleton` (carga), `MissingBook` (libro que no está)                      |
| Descubrir  | `ListPicker` (selector de listas), `BookCarousel` (carrusel y sus zonas de flecha), `BookDetail`                                                           |
| Buscar     | `AuthorList` (tarjetas de autor), `BestBook` (mejor resultado), `FriendsShelf` (riel), `RecentSearches`, `Highlight`                                       |
| Amigos     | `PersonRow`, `PersonAction`, `PersonBooks` (los libros de una persona), `Section` y `RowList`                                                              |

La actividad completa es `/?actividad=1`, dentro de Inicio: no tiene ruta propia, y `AppShell` deja Inicio activa y a todo el ancho ahí.

**Lo que no está en `src/components/` no tiene aspecto definido.** Arma lo que falte solo con estos tokens, respeta las 14 reglas y anótalo como decisión para el CP. Una pieza que dos pantallas necesiten se propone como compartida, para que los dos roles no construyan versiones distintas. Los campos de texto ya heredan el foco global, el acento de tinta (`accent-color`) y el cursor burdeo. `FolderCard` es de `src/features/library/`: sirve de ejemplo para una tarjeta, pero no es un componente compartido.

### Piezas locales

Viven en la carpeta de su pantalla. Sirven de ejemplo, y se vuelven compartidas si otra pantalla las necesita.

- **Lista de libros:** `BookList`, en `src/features/library/`, la usan Mis libros y la carpeta.
- **Aviso de D5:** `WantPrompt`, en `src/features/library/`. Una fila sobre la lista, sin tarjeta, en "Todos" y "Lo quiero", y oculta mientras se busca. Lleva portada de 56 px, la pregunta en Book title y "It · 210 días en Lo quiero" en Small `muted`, hasta dos líneas. Debajo, también en Small `muted`, dice lo que cuesta el "No" con las palabras del toast: "Si dices No, sale de Mis libros y de Terror". Con dos carpetas o más dice "y de sus 2 carpetas", y sin carpetas termina en "Mis libros". Separa de lo que sigue con una línea, a 16 px de `TagFilter`. "Sí" y "No" son el mismo `Button` `secondary` `compact`, en una grilla de hasta 208 px: desde `md` van en el borde derecho y en celular bajo el texto. Responder mueve la lista hacia arriba, así que el segundo toque de un doble toque se ignora y el foco sigue en el contenido. Deshacer la respuesta devuelve la fila arriba de la lista: el foco va a la pregunta y la página se mueve lo justo para dejarla completa a la vista.
- **"+ Nueva carpeta":** `NewFolderCard`, la última tarjeta del tablero. En reposo tiene el ancho y la forma de una `FolderCard`, en su celda de la grilla y en todos los anchos: fondo `sand`, sin borde, radio de tarjeta y 12 px de relleno, con dos huecos de portada en `shell`, "+ Nueva carpeta" en Book title a 10 px y "Un libro puede estar en varias" en Small `muted`. El más va al lado de las palabras, centrado en el alto del nombre. Bajo el cursor y al presionar toma `sand-deep`. Al presionarla se vuelve blanca con borde `edge`, porque ahora se escribe: "Nueva carpeta" en Small label, `TextField`, y Crear (`primary`) y Cancelar (`secondary`), los dos `compact` y del mismo tamaño. Mientras se escribe toma dos celdas en todo dispositivo, con la altura de una `FolderCard` desde `md`: en celular, media fila solo dejaría leer unas doce letras de un nombre de hasta 40, y en una celda de tablet Crear y Cancelar no caben en una fila. En celular no reserva la forma de la tarjeta, así que mide menos que en reposo. Si cae en la última columna, baja a la fila siguiente sin cambiar de lado, alineada a la derecha, para abrir bajo el dedo. En celular toma la fila entera. La línea del motivo queda reservada, así que aparecer no mueve nada. Crear queda deshabilitado sin nombre. El motivo aparece cuando la persona escribe algo que no sirve, o presiona Enter con el campo vacío. Sigue los límites de renombrar. Al crear, la carpeta aparece antes de esta tarjeta y el foco vuelve a ella.
- **Fila de persona:** `PersonRow`, en `src/features/friends/`. Una fila tintada, separada 6 px en celular y 10 px desde `md`: una columna en celular y dos desde `md`. `Avatar` `sm`, nombre en Book title, @usuario en Small label de tinta y amigos en común en Small. El @usuario va en tinta porque es lo que separa a dos homónimos. Esas dos líneas no se juntan nunca, para que la fila mida lo mismo en todos los estados. Solo el enlace pinta la fila, con `sand` bajo el cursor y `sand-deep` al presionar, para que la acción `quiet` conserve su propia respuesta. La acción va a la derecha, dentro de la fila, en un espacio fijo de 104 px (120 px desde 360 px, y su propio ancho desde `xl`), para que el nombre no se mueva cuando la acción pasa a ser el estado de la solicitud. Hasta `xl`, "Solicitud enviada" va sobre Cancelar y mide lo mismo que las tres líneas de texto. Bajo 360 px el avatar mide 36 px, y "Fernanda Castillo", el nombre más largo del directorio, llega a dos líneas.
- **Invitar contactos:** un `Button` `quiet` `compact`, a la derecha del título de Amigos, para que no salte con cada búsqueda. El texto queda sobre el margen, así que su relleno sobresale 10 px con el cursor.
- **Estado de una persona:** "Solicitud enviada" y "Amigos" en Small label `muted`, en una línea, sin color de estado ni cinta. Esos colores son solo de los libros. "Amigos" lleva ícono de 16 px, y "Solicitud enviada" solo en Persona, donde hay espacio. En la lista "Tus amigos" el estado se omite, porque el título ya lo dice.
- **Acción sobre una persona:** `PersonAction`. El estado y la acción nunca son el mismo control: el estado es texto y la acción es un `Button` `compact`, el mismo para Agregar, Cancelar y Quitar de amigos: `quiet` en una fila de Amigos y `secondary` en el encabezado de Persona. Pesan lo mismo y cuestan un toque, como pide la regla 11, y Quitar de amigos ofrece Deshacer. Si la solicitud se acepta justo bajo un toque a Cancelar, ese toque cae en Quitar de amigos y termina donde la persona quería: sin ser amigos. Quitar de amigos solo existe en Persona, en su encabezado, con la acción en el borde derecho desde que cabe en la misma fila.
- **Tarjeta de Más:** `MoreCard`, en `MorePage.tsx`. Un bloque `shell` con radio de bloque, en una columna en celular y dos desde `md`, que toma `sand` con el cursor y `sand-deep` al presionar. El nombre va en Section title, con su ícono de 22 px en `muted` a la izquierda (`Users` en Amigos y `CircleUser` en Mi perfil) y una flecha a la derecha, que avanza 4 px con el cursor. Debajo, en Small `muted`, qué se encuentra ahí, y a 16 px quién está detrás, solo con datos que la app ya tiene: en Amigos, hasta cinco avatares superpuestos, con un anillo del color de la tarjeta, la cantidad de amigos y las solicitudes enviadas si las hay; en Mi perfil, `Avatar`, nombre y @usuario. Sin amigos, dice "Aún no tienes amigos" en el mismo lugar y la tarjeta mide lo mismo. El enlace es el nombre y cubre la tarjeta con `after:absolute after:inset-0`, así que un lector de pantalla anuncia solo el nombre y lo demás se lee aparte. El foco dibuja toda la tarjeta.
- **Demo en Mi perfil:** bajo el título de sección, un bloque `shell` con la explicación y "Reiniciar demo" (`secondary`), con la forma de `InlineConfirm`: en celular el botón va debajo, y desde `md` a la derecha. Al presionarlo, `InlineConfirm` toma su lugar y su ancho, así que la pregunta aparece donde se tocó. Bajo el @usuario, en Small `muted`, "34 libros · 3 amigos", como la línea de Persona.
- **Fila del registro:** `LedgerRow`, en `src/features/book/`, dentro de un `dl`. La etiqueta va en Small `muted`, en una columna de 60 px (80 px desde `md`), y el valor va a la derecha, editable ahí mismo. Mide 44 px más 4 px arriba y abajo, con una línea debajo. Las filas son Estado, Inicio, Fin, Puntaje y Carpetas: Inicio aparece en Leyendo y Leído, Fin y Puntaje solo en Leído, y Carpetas si el libro está en la biblioteca. La acción de una fila es un botón `quiet` `compact`, siempre al final, con el texto sobre el margen. Solo la fecha y la fila Estado sobresalen 8 px a la izquierda con el cursor, para que su texto quede alineado.
- **Fecha en una fila:** sin borde ni fondo, con su ícono `CalendarDays` en `muted` y hover de tinta al 5 %. Abre el calendario al tocar cualquier parte, así que las partes de la fecha se editan con el teclado. Chrome ignora `:focus` sobre ellas, por lo que un filtro convierte su azul en un tono cercano a `sand` y deja marcada la parte que se edita. La fecha del calendario se guarda de inmediato, y la escrita al presionar Enter o al salir del campo.
- **Carpetas de un libro:** enlaces de texto en la fila Carpetas, en peso 500, con subrayado `muted` al 50 % que pasa a tinta con el cursor, y 44 × 44 px como mínimo. Son un lugar, no un estado: no llevan cinta ni color de tag. Al final de la fila, un `Button` `quiet` `compact` abre el menú y se llama según lo que se puede hacer: "Agregar", con un más, si no hay ninguna, y "Agregar o quitar", sin ícono, si hay, porque el más diría solo la mitad. Su nombre accesible dice "Agregar a carpeta". Sin carpetas, a su izquierda dice "Sin carpetas" en `muted`. El botón no se mueve de la primera línea: lo que no cabe son los enlaces, que bajan.
- **Nombre de una carpeta:** `TextField` toma el lugar del título con el mismo tipo. En celular, Guardar y Cancelar van debajo. Desde `md` van en la fila del campo, que mide hasta 480 px, y la lista no se mueve.
- **Búsqueda en una lista de libros:** `BandSearch`, en `src/features/library/`, la usan Mis libros y la carpeta. El nombre viene de cuando había una banda. `SearchField` va en la fila del título, porque `TagFilter` ocupa lo que sigue al título. Respeta el botón de tag activo, y cambiarlo no borra lo escrito. En Mis libros reemplaza el tablero y el aviso por los resultados. Con otro tag activo, "Sin resultados" ofrece "Ver todos los libros"; en "Todos", dice que Buscar sirve para lo que está fuera de la biblioteca. Desde `md` está siempre a la vista, con 288 px de ancho, junto a Opciones. En celular no cabe junto al título, así que el botón `compact` "Buscar", sin ícono para que el título quepa a 320 px, lo abre sobre esa misma fila, con el foco en el campo: aparece bajo el dedo y ningún libro se mueve. Cubre la fila con el fondo `paper`. El título sigue en la página para los lectores de pantalla, y el `placeholder` dice en qué carpeta se busca. "Cerrar" vacía la búsqueda, cierra el campo y devuelve el foco a "Buscar". Una búsqueda que vuelve desde la URL abre el campo sola, sin tomar el foco.
- **Carpeta fija:** solo dice "Carpeta fija" de subtítulo.
- **Sin carpeta:** `UnfiledPage`, en `src/features/library/`. Se ve como una carpeta en el tablero, así que es la misma pantalla, con "Mis libros" para volver, `TagFilter` y `BandSearch`, y sin Opciones. De subtítulo dice "Libros que no están en ninguna carpeta". Sin libros, un `EmptyState` lo dice en el mismo lugar, en vez de sacar a la persona de la página.
- **Buscar antes de escribir:** la marca va a la derecha del título, en su fila. Del título al campo hay 20 px (24 px desde `lg`), 28 px sobre "Búsquedas recientes" y "Autores de Mis libros", y 32 px sobre "Lo que leen tus amigos", en todos los anchos. Cada tarjeta de autor cuenta los libros del catálogo, no los de la biblioteca. Mientras baja el índice, o si no se pudo bajar, la línea de la cantidad queda vacía y conserva su alto.
- **Buscar mientras se escribe:** sin espera ni esqueletos entre letras, porque cada letra tiene su lista en el mismo render. `LoadingState` y `ErrorState` aparecen solo si el índice todavía no llega o no se pudo bajar. Como lo que hay en pantalla ya es la respuesta completa, no se reserva lugar para lo que podría llegar.
- **Título de una carpeta:** en celular llega a dos líneas, porque comparte la fila con dos botones y un nombre de 40 caracteres dejaría el primer libro a media pantalla. Desde `md` se muestra entero.
- **Portada de la ficha:** la portada `lg` sola, sin bloque de color detrás ni `raised`, y con 12 px bajo ella (20 px desde `md`) para que la cinta baje a la vista cuando cambia el tag. `BookSkeleton` tiene la misma forma, con el título, el autor y el año en el alto de su texto, para que el registro no salte al cargar. El título corta una palabra larga en vez de salirse de su columna.
- **Sobre este libro:** el bloque va siempre en el mismo lugar, con su título en `section-title`. La descripción va en Body, entera, sin cortar ni "Leer más", hasta `max-w-[60ch]`. Sin descripción dice "Aún no tenemos descripción de este libro." en Body `muted`, sin ícono ni `EmptyState`, porque es un caso normal y no un problema. Mientras baja el archivo, en ese mismo lugar y en el mismo estilo dice "Buscando la descripción…". Si la bajada falla, va una fila `shell` en Small con "No pudimos cargar la descripción." y Reintentar `quiet` y `compact`, porque el resto de la ficha sigue sirviendo.
- **Procedencia de una descripción:** en Small `muted` y a 8 px bajo la descripción. "Traducción hecha con IA", con el ícono de destellos que pide `PLAN.md`, si el libro trae `descriptionTranslated`. Es un dato sobre el texto, como la línea del autor, y no un aviso: sin cinta ni color de acento. Da 7,22:1 sobre `paper`.
- **Motivo de un botón deshabilitado:** Small en tinta con `CircleAlert` en `muted`, dentro de una región `status`.
- **Libros de una persona:** cada libro aparece una vez. "Está leyendo" es una tarjeta de tono como la de "Leyendo ahora" en Inicio, una o dos columnas desde `md`, con las páginas desde `lg`; un libro solo usa todo el ancho. "Últimos leídos" es un estante de portadas con `raised`: un riel en celular y tablet, y una grilla de seis columnas desde `lg`, donde todo cabe y no hacen falta flechas. Bajo cada portada, el título en Fila compacta, hasta dos líneas, y el autor en Small `muted`. Los compartidos dicen "En común", en Small label, sobre la tarjeta o bajo el autor. Ninguno lleva cinta, tag ni estrellas míos, porque podrían pasar por los de esa persona. El encabezado de Persona suma los amigos y libros en común, y `PersonAction`.

### Cinta

La firma del sistema. `Ribbon` es decorativo y lleva `aria-hidden`: lo que marca también debe decirse con texto, peso o `aria-current`.

- **Lo activo, en burdeo:** la sección de la barra lateral (10 × 16 px, colgando del borde superior de la sección, a 12 px de su borde derecho) y el botón activo de `TagFilter` (9 × 12 px). `AppShell` y `TagFilter` ya la dibujan. En la barra inferior no hay cinta: la sección activa la marcan su relleno `sand`, su peso y `aria-current`.
- **Lo fijo, en burdeo:** la carpeta fija, en la esquina superior derecha de su tarjeta (9 × 26 px, a 10 px del borde), siempre con el texto "· fija".
- **El estado de un libro, en su color:** sale por debajo de la portada, detrás de ella. `BookCover` la dibuja al recibir `status`: 7 × 16 px en `sm`, 10 × 24 px en `fill` y en `lg`, y 13 × 36 px en `lg` desde `md`. Pásale `status` solo si el libro está en la biblioteca.
- **El gesto:** al elegir un tag, el texto nuevo entra en 180 ms (`animate-tag-in`) y la cinta nueva baja desde detrás de la portada en 220 ms (`animate-ribbon-in`). Con reducir movimiento, el cambio es instantáneo.

**La regla de la cinta.** La cinta marca solo lo activo, lo fijo o el estado de un libro. No decora títulos, no separa secciones y no destaca novedades, recomendaciones ni llamados a la acción.

**La regla de una por grupo.** Dentro de un grupo de opciones hay una sola cinta activa. Una pantalla puede tener varias cintas porque cada una responde a una pregunta distinta: dónde estoy, qué filtro uso, qué carpeta es fija y en qué estado va cada libro.

**La regla del burdeo y el estado.** El burdeo significa activo o fijo, y como cinta nunca marca un estado: una cinta de estado usa siempre el color de su tag. Fuera de la cinta, solo aparece en el corazón de un "Me gusta" dado y en la razón de una recomendación.

### Editar en su lugar

**La regla de editar en su lugar.** No hay modales ni paneles. Lo que se edita se edita donde se lee, sin tapar ni oscurecer la página.

**La regla del cambio rápido.** Un cambio rápido y reversible, con pocas opciones, se resuelve en un menú anclado junto al control. Elegir un tag nunca lleva a otra pantalla.

**La regla de confirmar en la página.** Solo eliminar carpeta y Reiniciar demo piden confirmación, con `InlineConfirm`. Lo demás se aplica de inmediato y ofrece Deshacer.

- **Dónde abre el menú:** debajo del control siempre que pueda, porque arriba taparía el libro. Si no cabe, la página hace scroll primero. Solo abre hacia arriba cuando la página ya no puede moverse. Si tampoco cabe arriba, queda abajo, sobre la barra inferior, y limita su alto al espacio que queda. Va en la capa 50, sobre las barras y el toast, que va en la 45, para que un toque en una opción nunca caiga en Deshacer.
- **Agregar o quitar carpetas de un libro:** es un cambio rápido y reversible, así que va en un menú anclado con todas las carpetas. Tocar una la agrega o la quita, y las dos cosas cuestan lo mismo, como pide la regla 11.
- **Nombrar una carpeta:** el nombre se escribe en el título, o en la última tarjeta del tablero si es nueva, con `TextField`.
- **Fechas y puntaje:** se corrigen en su fila de la ficha, y cada cambio ofrece Deshacer.

### AnchoredMenu

El menú anclado de `src/components/AnchoredMenu.tsx`, el mismo de `StatusControl`. Quien lo usa dibuja el control en `trigger`, esparce ahí las props que recibe y le pasa `options`, cada una con `id`, `label` y `onSelect`. `Button` acepta esas props, incluida `ref`. No oscurece ni bloquea la página. Las opciones miden 44 px, y el menú llega hasta 60 % de la pantalla, con scroll interno. Se ubica a 6 px del control. En `radio` aparece con el foco en la opción actual, y en `checkbox` en la primera, para que un Enter de más agregue y no saque. Responde a flechas, Inicio, Fin, Escape y clic afuera.

- **`kind`:** `radio` cuando una opción es la actual, como los tags. `checkbox` cuando pueden ser varias, como las carpetas de un libro. `action` para comandos, sin opción marcada.
- **`actions`:** comandos bajo una línea, separados de las opciones porque hacen otra cosa, como "Quitar de Mis libros". Van en peso 600, y `detail` dice en Small `muted` lo que cuesta el comando. Abrir con la flecha hacia arriba no cae en ellos.
- **`checkedLabel`:** dice con texto que la opción está activa, junto al check. Por defecto es "Actual"; en las carpetas de un libro es "Agregado".
- **`align`:** `fill` usa el ancho del control. `end` da 256 px y alinea el menú con el borde derecho del control, para botones angostos.
- **`resetKey`:** al cambiar cierra el menú, como cuando el botón Atrás lleva a otro libro.

Elegir aplica el cambio, cierra el menú y devuelve el foco al control. Un cambio en la biblioteca ya muestra el toast con Deshacer.

### SearchField

Una píldora blanca con borde de 1 px `edge` y la lupa a la izquierda. Filtra mientras se escribe, así que no tiene botón de enviar. Al escribir aparece "Borrar" con su ícono, que limpia el campo y deja el foco ahí.

- **Tamaño:** `md` mide 44 px y es para filtrar una lista, como en Amigos. `lg` mide 56 px, con texto de 18 px, y es para una pantalla cuyo primer trabajo es buscar, como Buscar.
- **Dónde va:** bajo el título, con 16 px abajo, si es lo primero de la página, como en Amigos, donde sigue a la vista porque es el camino de T3. Si `TagFilter` ya sigue al título, va en la fila del título, como en una carpeta. Nunca más abajo: el campo debe aparecer junto a lo que se tocó y no empujar la lista.
- **Etiqueta:** `label` nombra el campo para lectores de pantalla. `placeholder` dice qué se puede buscar, como "Nombre o @usuario", o dónde, como "Buscar en Terror", en `muted`, y un texto que no cabe termina en puntos suspensivos.
- **Borrar y Cerrar:** píldoras de texto en tinta, peso 600, sin relleno en reposo, con hover `sand` y presión `sand-deep`, como `quiet`. El relleno y el foco quedan dentro del campo y nunca tocan su borde: en `md` se ven de 34 px, a 4 px del borde por arriba, por abajo y a la derecha, y un pseudoelemento conserva los 44 px para tocar, sin llegar a lo escrito; en `lg` miden 44 px, porque el campo les da aire. Presionarlos no le quita el foco al campo, así que el borde sigue en tinta y un texto largo no salta a su inicio.
- **`onClose`:** para un campo que el celular abre a pedido. Agrega "Cerrar", que en celular toma el lugar de "Borrar", porque con ambos quedan 56 px para escribir a 320 px. Desde `md` sigue "Borrar". Escape cierra en todos los anchos.
- **Foco:** con el foco, el borde pasa a tinta y se dobla, alrededor de toda la píldora.

### TextField

Un texto corto que se escribe donde se lee, como el nombre de una carpeta. Hereda el tipo de lo que reemplaza, en un campo blanco con radio de control y borde de 1 px `edge`, que se aparta mientras el contorno de foco dibuja el campo. Parte con el foco y su texto seleccionado. Enter guarda y Escape cancela, y Enter no llega a ser un clic en el botón que recibe el foco después de guardar. Si el valor no se puede guardar, `problem` lo dice debajo, en Small con `CircleAlert`. Quien lo muestra pone Guardar y Cancelar a su lado.

### Avatar

Un círculo con las iniciales blancas en serif sobre `avatarColor`, que viene del directorio. `xs` mide 24 px, con las iniciales en Figtree 700 de 10 px y un anillo `line`, para ir dentro de una línea de texto. `sm` mide 40 px, con Small label, para las filas. `lg` mide 64 px, con Subheading, para el encabezado de una persona. Es decorativo: el nombre siempre va escrito al lado, y entre homónimos los distingue el @usuario, no el color. Los colores son cinco de los seis fondos de la portada de reemplazo, todos menos el burdeo, porque el burdeo significa activo o fijo. Como en la portada, no significan nada. Un test vigila que todos los del directorio salgan de esa lista y den 4,5:1 con el blanco. En Persona va en `media` de `PageHeader`.

### InlineConfirm

Pregunta dentro de la página, junto a lo que afecta, para que siga a la vista. Es un bloque `shell` con radio de bloque y 20 px de relleno: título en Book title, lo que va a pasar en Body, y un `Button` `danger` con la acción junto a Cancelar en `secondary`. Desde `md`, el texto y los botones van en una fila, con el título en una línea. Al eliminar una carpeta, desde `md` toma el lugar de `TagFilter`, que conserva su alto, con 6 px de relleno vertical: mide 66 px y lo que sobra de los 56 px cae en el espacio vacío alrededor, así que la lista no se mueve ni queda tapada. En celular no cabe, y va bajo `TagFilter`. El foco parte en Cancelar, para que un Enter de más no confirme, y Escape cancela. Quien la muestra devuelve el foco al cancelar.

### Buttons

Píldoras con texto en peso 600, con un solo llamado por pantalla. Solo `primary` y `danger` van rellenos, así que la pantalla tiene una sola forma negra y el ojo sabe a dónde ir. Los demás se dibujan con su borde o con nada. Un campo se distingue porque es blanco y trae su lupa o su texto; por eso ningún botón es blanco.

- **Shape:** píldora, 44 px de alto, 16 px de relleno lateral y texto Control. El ícono mide 18 px y va antes del texto. Nunca hay botones de solo ícono, salvo la flecha de un riel y el corazón de "Me gusta" en celular y en las filas de Inicio en tablet, las dos excepciones aprobadas en `PLAN.md`. Si algo sobra en una fila angosta, sobra el ícono, no el texto.
- **Primary:** relleno de tinta con texto blanco. Al pasar el cursor baja al 90 % y al presionar al 80 %.
- **Secondary:** sin relleno, con borde `edge` de 1 px y texto de tinta. Al pasar el cursor toma `sand`, y al presionar, `sand-deep`. Con su menú abierto (`aria-expanded`) se invierte a tinta con texto blanco, con o sin cursor: la tinta significa abierto. Es la variante por defecto.
- **Quiet:** texto de tinta sin borde ni relleno. Al pasar el cursor y con su menú abierto toma `sand`, y al presionar, `sand-deep`. Es para las acciones de una fila, como "Agregar o quitar" o "+ Agregar", y para lo secundario de la página, como "Invitar contactos". En una fila, el texto queda sobre el margen y el relleno sobresale con el cursor.
- **Compact:** 10 px de relleno lateral y 6 px entre ícono y texto, para una fila o un título que comparte el ancho con texto. Conserva los 44 px de alto.
- **Danger:** relleno `danger` con texto blanco, con el mismo comportamiento que `primary`. Es para lo destructivo que pide confirmación, como Reiniciar demo y eliminar carpeta.
- **Disabled:** relleno `sand`, texto `muted`, sin borde.
- **Pares:** "Sí" y "No", agregar y quitar, o la acción y Cancelar, usan la misma variante o el mismo tamaño, para cumplir la regla 11. Cancelar nunca es un enlace subrayado.

**La regla del lugar del botón.** Lo que actúa sobre la página va a la derecha del título y lleva borde, como "Opciones" y "Buscar". Lo que actúa sobre una fila va al final de esa fila y no lleva borde en reposo, para que una lista o un registro no se llenen de píldoras que compiten con las portadas. Así un botón siempre termina en el margen derecho de la columna.

`StatusControl` lleno de tinta ("Agregar a Mis libros") cuenta como el botón principal de la pantalla. Una pantalla puede no tener `primary`: Amigos y Persona no lo tienen, porque sus filas repiten la misma acción y agregar y quitar pesan lo mismo.

### RailArrow

La flecha de un riel: un círculo blanco de 48 px con `shadow-float` y un chevron de 24 px. Crece al 105 % bajo el cursor y se encoge al 95 % al presionar. No aparece en tacto (`pointer-coarse:hidden`), donde manda el gesto, y sale del orden de tabulación, porque el teclado recorre los libros con Tab y las flechas. Lleva nombre accesible en `label`, como "Ver más libros". Al llegar al final de un lado se desvanece y queda deshabilitada. Se ubica con `className`, dentro de un padre `relative`.

### StatusControl

La fila Estado de la ficha, a todo el ancho y de 44 px de alto, y toda ella abre el menú. A la izquierda va `StatusTag` y a la derecha el lápiz con "Cambiar o quitar", dibujado como un botón `quiet` `compact`, en paralelo con "Agregar o quitar" de la fila Carpetas. Bajo 360 px el texto baja a Small y el lápiz se va, porque es lo que permite que quepa en una línea junto a "Lo quiero". Bajo el cursor, la fila toma tinta al 5 %, como una fecha, con radio de control, y "Cambiar o quitar" solo reacciona si el cursor está sobre él, con `sand`, igual que con el menú abierto. Si el libro no está en la biblioteca, la fila es una píldora de tinta con un más y "Agregar a Mis libros", dentro de los márgenes del registro, y abre el mismo menú. En la ficha ocupa toda la fila en celular y toma su propio ancho desde 768 px. El menú es un `AnchoredMenu`. La opción actual tiene un check con "Actual" en tinta. Se aplica de inmediato. "Leído" se elige aquí mismo, sin pasos intermedios. Si el libro está en la biblioteca, bajo una línea va "Quitar de Mis libros", con lo que cuesta en una sola línea. Las carpetas no se pierden, así que se dicen con las palabras del aviso de D5: "También sale de Terror", o "También sale de sus 2 carpetas" con varias. Si además pierde datos, siguen ahí: "También sale de Terror y pierdes las fechas y el puntaje". Sin carpetas dice "Pierdes las fechas y el puntaje", y sin nada que perder no lleva línea.

### StatusTag

Ícono, texto y color, sin fondo. `md` usa ícono de 18 px y texto de 16 px. `sm` usa ícono de 14 px y texto de 14 px. Peso 600 en ambos.

### TagFilter

Cinco botones iguales en una grilla, de 56 px de alto y hasta 512 px de ancho total desde `md`: cantidad en serif de 16 px y etiqueta en Caption. No lleva caja alrededor. El activo se reconoce por la tinta, el peso 700 y la cinta burdeo que cuelga sobre él. Los demás son `muted` y bajo el cursor toman `shell`. Va como hijo de `PageHeader`. No usa los colores de estado.

### Stars

Estrellas de 14 px para mostrar un puntaje y de 26 px, en áreas de 44 px, cuando son un campo. La llena es de tinta y la vacía tiene contorno `muted`. Como campo, su leyenda es solo para lectores de pantalla, porque la fila que lo rodea ya lo nombra. El puntaje siempre es opcional: el campo ofrece el botón "Quitar".

### Cards / Containers

- **Tarjeta blanca** (`FolderCard`): radio de tarjeta, fondo blanco, 1 px `line` que pasa a `edge` con el cursor y 12 px de relleno. Dos portadas con 6 px de separación, nombre serif a 10 px y cantidad en Small. Si falta una portada, su hueco se rellena con `sand`.
- **Bloque** (`EmptyState`, `ErrorState`, `InlineConfirm`, las tarjetas de Más y Demo en Mi perfil): radio de bloque, fondo `shell`, sin borde y 20 px de relleno.
- **Fila tintada** (fila de persona, aviso): radio de fila, fondo `shell` que pasa a `sand` con el cursor.
- **Fila de actividad** (Inicio): radio de fila, fondo `shell` que pasa a `sand` con el cursor y a `sand-deep` al presionar, sin borde. La portada va suelta, de 40 px (48 px desde `lg`), sin `raised`. En la línea de la persona van el avatar y la fecha corta, como "Hoy" o "3 d", que nunca se corta: lo que cede es la frase. Debajo, el título en Fila compacta, en una línea. Bajo `lg` termina con el corazón solo; desde `lg` suma el autor bajo el título y "Me gusta" con texto.
- **Tarjeta de tono** (lectura, también la de otra persona, autor, mejor resultado): radio de bloque o de tarjeta, fondo `coverTone`, texto `text-white` y `text-white/88`, portada con `raised`. La de lectura muestra la portada entera siempre: sobre el texto en dos o tres columnas, y al lado desde `md` si hay espacio.
- **Mejor resultado:** desde `lg` va junto a los primeros cinco libros, y lo demás sigue debajo. Si es un autor, es la primera tarjeta de "Autores" y sus portadas la llenan. Si es un libro, trae su descripción. Con un solo libro no se llama "mejor".
- **Shadow Strategy:** ninguna. Nunca una tarjeta dentro de otra.

### BookRow

Portada `sm` (56 px, 64 px desde `md`) con su cinta, y a 14 px el título, el `StatusTag` junto al autor, y las estrellas si tiene puntaje. Con `compact`, para los resultados de Buscar, la portada es `xs` (44 px) y el título va en Fila compacta. `highlight` marca lo que coincidió con una búsqueda, en el título y en los autores. Toda la fila abre la ficha y recuerda de qué lista se viene. Con el cursor toma `shell` y al presionar `sand`, con radio de fila. En una lista de otra persona, `note` reemplaza el tag y las estrellas, y la portada va sin cinta, porque podrían pasar por los de esa persona. En una lista ya filtrada por estado, `folders` suma una línea con las carpetas: van bajo el tag y el autor, en Small de peso 500, hasta dos líneas y separadas por un punto medio. El tag conserva su texto, porque el botón del filtro sale de la pantalla apenas se baja por la lista y la cinta sola sería color. Un libro sin carpetas no lleva esa línea, y dentro de una carpeta no se repite la que está abierta.

### BookCover

Las portadas no se tiñen ni se recortan en la ficha. `lg` mide 112 px en celular y 224 px desde `md`, y conserva la proporción real de la imagen dentro de una caja de 2:3, para que nada salte al cargar. `raised` cambia su sombra por `shadow-cover`, para una portada sobre un tono, sola en un riel o en la escena de la ficha. Si falta la imagen, muestra las iniciales blancas sobre uno de seis fondos, elegido por el id del libro. Ese fondo no significa nada. Es decorativa: el título siempre va escrito al lado.

### Navigation

- **Scroll:** `AppShell` parte cada página arriba. Volver, con el botón del navegador o con `BackLink`, deja la lista donde estaba. Un filtro no mueve la página. Una búsqueda nueva la lleva al comienzo de sus resultados, justo bajo el campo, solo si estaba más abajo. La barra lateral queda fija mientras la página se desplaza.
- **Bajo `lg`:** `AppShell` fija una barra al borde inferior, de lado a lado, sobre `paper` sólido y sin desenfoque, de 65 px más el área segura, con una raya superior `edge` al 60 %. Va pegada al borde porque una barra flotante se movía con la barra del navegador en un celular real. Tiene cinco secciones repartidas por igual, hasta 448 px de ancho y centradas en una tablet, de 56 px de alto, con ícono de 21 px y etiqueta Caption. La presión es `sand`.
- **Desde `lg`:** barra lateral de 232 px, sobre `paper`, con una raya `line` a la derecha. Arriba va "Goodreads" en serif de 24 px, que lleva a Inicio; abajo, "Prototipo de rediseño, proyecto de curso" en Caption. Las secciones miden 44 px, con ícono de 20 px, y van una sobre otra.
- **Estados:** la sección activa es de tinta, con peso 700, ícono más grueso y relleno `sand`, y en la lateral también con cinta. Las demás son `muted`, con peso 500 en la lateral y 600 abajo. En la lateral, con el cursor, toman `shell` y tinta. "Más" sigue activa en Amigos y Mi perfil, e "Inicio" en `/actividad`, y esa página se anuncia con `aria-current="true"`.
- **Marca bajo `lg`:** `PageHeader` y la ficha muestran `Wordmark`, "Goodreads prototipo" en una línea. Va a la derecha del título. Si `PageHeader` recibe `backTo` o `action`, sube a la fila de arriba, para que el título y la acción tengan el ancho, salvo con `wordmarkBeside`, para un título corto y una acción `compact`, como en Mis libros, donde se apila en dos líneas. Una pantalla sin `PageHeader` pone su propio `Wordmark`. Ninguna pantalla pierde el aviso de prototipo: desde `lg` lo dice la barra lateral.

### Toast

Una capa de tinta de hasta 448 px, con radio `float` y `shadow-float`. Bajo `lg` queda centrada, a 15 px sobre la barra inferior, y desde `lg` a 24 px del borde, centrada en el contenido y sin pisar la barra lateral. Entra en 200 ms. Deshacer es una píldora con ícono y texto en `shell`. Dura 5 s y se detiene mientras el cursor o el foco están encima, o mientras hay un menú abierto, que puede taparlo. Si la acción se hizo con teclado y su control desapareció, como en el aviso de D5, el foco llega a Deshacer y Tab lo devuelve a donde estaba. El mensaje corta una palabra larga, para que Deshacer siga a la vista.

### Estados de pantalla

`EmptyState` y `ErrorState` son un bloque `shell` en el lugar donde iría el contenido, a 16 px de lo anterior: ícono de 24 px a la izquierda, título en Book title, descripción `muted` y la acción al final, que baja de línea si no cabe. El título y la descripción cortan una palabra larga para no salirse del margen. El ícono de error va en `danger`. `LoadingState` dibuja tres filas de esqueleto en `sand` con la forma de `BookRow`, para que la página no salte, y pulsa solo si la persona no pidió reducir movimiento. La ficha de un libro que llega con el catálogo espera con `BookSkeleton`, en `src/features/book/`, con su misma forma: la escena, el título y el registro, y sin autor dice "Autor desconocido" en ese mismo lugar.

### Movimiento

Una sola curva, `--ease-quick` (`cubic-bezier(0.16, 1, 0.3, 1)`). Respuestas al tacto entre 100 y 150 ms, menú en 150 ms, tag en 180 ms, toast en 200 ms, cinta y `cover-lift` en 220 ms, carrusel en 260 ms y tono de escena en 420 ms. Una página nueva cruza en 160 ms y la portada viaja en 320 ms, en los enlaces con `viewTransition`. `src/index.css` reduce todo a 1 ms con `prefers-reduced-motion`.

### Foco

Un solo estilo: contorno de 2 px de tinta a 2 px de distancia, definido de forma global. No lo reemplaces ni lo quites. Solo el toast lo cambia a blanco, por su fondo oscuro, las opciones del menú y Borrar y Cerrar lo dibujan hacia adentro, y `SearchField` pasa su borde a tinta y lo dobla, alrededor de toda la píldora.

## Cómo se aplica a una pantalla

Lo que sigue quien lleva una pantalla al aspecto de este documento.

**Marco.** `main` ya trae el margen, el fondo y el espacio bajo el contenido. La pantalla no agrega `px-*` en su raíz, ni fondo, ni `pb-*`, y parte con un `section` sin clases. Ninguna pantalla toca la barra ni el toast.

**Ancho de columna.** Inicio, Descubrir, Buscar y `/actividad` usan todo el ancho. Las demás van en `max-w-app`. Dentro de una pantalla ancha, el texto seguido no pasa de `max-w-3xl`, y una descripción, de `max-w-[60ch]`.

**Títulos.**

- Cada pantalla tiene un solo `h1`. Con `PageHeader` no hay que hacer nada más.
- Una pantalla sin `PageHeader` usa `page-title` en su `h1`, con `pt-3 lg:pt-8` arriba y `Wordmark` en la pantalla, como Buscar o Descubrir. Si el título visible no nombra la sección, como "Leyendo ahora" en Inicio, el `h1` va en `sr-only` con el nombre real y el título visible es un `h2` con `page-title`.
- Cada bloque se abre con un `h2` con `section-title`, sin línea ni fondo.

**Secciones.** `mt-7 lg:mt-10` entre secciones, `mt-3` bajo un título de sección y `mt-4` bajo un título de página. Un "ver todo" va a la derecha del título de sección en celular, en una fila con `items-end justify-between`, y como última tarjeta de la grilla desde `md`.

**Tarjetas.** Elige por lo que carga, y no anides una dentro de otra.

| Qué es                         | Clases                                                                                                                                           |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Libro con color propio         | `rounded-tile p-4 text-white lg:p-5` y `style={{ backgroundColor: coverTone(book.id) }}`, portada con `raised`, texto secundario `text-white/88` |
| Autor o mejor resultado        | `rounded-card p-3.5 text-white`, con el tono de su primer libro                                                                                  |
| Fila de aviso                  | `rounded-row bg-shell`, con `hover:bg-sand`, y toda la fila como enlace con `after:absolute after:inset-0`                                       |
| Fila de actividad              | `ActivityRow`, con toda la fila como enlace con `after:absolute after:inset-0`; el avatar y el corazón van sobre él con `relative z-10`          |
| Carpeta                        | `FolderCard`                                                                                                                                     |
| Enlace "ver todo" como tarjeta | `rounded-row border border-edge px-4 font-semibold hover:bg-sand active:bg-sand-deep`                                                            |

Una tarjeta con color baja 1 px al presionar (`active:translate-y-px`). Un `StatusTag` sobre un tono va en su píldora blanca.

**Rieles.** Un riel es un `ul` nativo, con el dedo y el trackpad en manos del navegador. Va así, dentro de un padre `relative`:

```tsx
const { ref, canGoBack, canGoForward, advance, railProps } = useRail<HTMLUListElement>()

<div className="relative">
  <ul
    ref={ref}
    {...railProps}
    className="rail full-bleed flex snap-x scroll-pl-(--gut) gap-3.5 overflow-x-auto pt-1.5 pb-3 lg:cursor-grab lg:gap-4"
  >
    <li className="w-28 shrink-0 snap-start lg:w-36">
      <Link to={bookPath(book.id)} className="block rounded-control">
        <span className="cover-lift block">
          <BookCover book={book} raised />
        </span>
      </Link>
    </li>
  </ul>
  <RailArrow direction="back" label="Ver libros anteriores" onClick={() => advance(-1)} visible={canGoBack} className="top-20 -left-3" />
  <RailArrow direction="forward" label="Ver más libros" onClick={() => advance(1)} visible={canGoForward} className="top-20 -right-3" />
</div>
```

Un riel que solo vive en celular y en computador es grilla usa `lg:grid lg:snap-none lg:overflow-visible`, y ahí no lleva `RailArrow`. Si el `li` no tiene un enlace, las flechas del teclado no hacen nada.

**Selector de listas.** Las opciones que cambian el contenido de una misma pantalla, como las listas de Descubrir, van en `flex rounded-full bg-sand p-1`, con `aria-pressed` en cada botón de `min-h-11 rounded-full`. La elegida es `bg-ink text-white` y las demás `text-ink hover:bg-sand-deep active:bg-sand-dark`. Caben todas a 320 px, sin scroll. `TagFilter` no se reemplaza por esto: es la fila de D3.

**Portadas que viajan.** Un enlace a la ficha desde una pantalla ancha lleva `viewTransition`, con su `state={{ from }}` para volver.

**Estados.** Lo vacío, lo que falla y lo que carga van en el lugar donde iría el contenido, con `EmptyState`, `ErrorState` y `LoadingState`. Una pantalla mantiene su forma con el dato presente o ausente. Un vacío al que se llega por un filtro trae una salida.

**Contraste.** Texto solo en los pares de "Contrastes medidos". Sobre un tono, solo blanco y blanco al 88 %. El tinte de Descubrir nunca queda bajo texto.

**Prohibido en una pantalla.** Un `style` con colores que no sean `coverTone` o el `avatarColor` de una persona, `text-[#fff]` en vez de `text-white`, un `backdrop-blur`, un `shadow-*` en una tarjeta, y CSS en `src/index.css` para arreglar un componente desde afuera. Si una forma falta, va en el componente o en un token, en un commit aparte.

## Do's and Don'ts

### Do:

- **Do** parte cada sección con `PageHeader`, o con `page-title` y `Wordmark` si la pantalla necesita otra forma.
- **Do** edita cada dato en su lugar, en la fila o el título donde se lee.
- **Do** da una salida en los estados vacíos a los que se llega por un filtro o un enlace malo: un botón "Ver todos los libros" o "Ir a Mis libros".
- **Do** usa solo los tokens de `src/index.css`: colores, tamaños, radios y sombras.
- **Do** muestra cada estado con texto además de color, como pide la regla 3.
- **Do** pon los tags solo sobre `white`, `paper`, `shell` o `sand`, donde el test vigila que lleguen a 4,5:1, o en su píldora blanca sobre un tono.
- **Do** escribe etiqueta de texto junto a cada ícono, también en la barra de navegación. Las únicas excepciones son las flechas de un riel y el corazón en celular y en las filas de Inicio en tablet.
- **Do** mantén 44 px como mínimo en todo control, y que nada dependa solo del hover.
- **Do** usa el color de una portada solo con `coverTone`, en una tarjeta que carga ese libro, o como tinte detrás de portadas.
- **Do** deja que un riel sea un scroll nativo, y usa `useRail` para lo que el navegador no da.
- **Do** anima solo como respuesta a una acción, y deja que `prefers-reduced-motion` la anule.
- **Do** anota como decisión para el CP lo que este documento no cubra.

### Don't:

- **Don't** uses la cinta para decorar o para llamar la atención, ni la dibujes sin `Ribbon`.
- **Don't** pongas una cinta burdeo bajo una portada, ni uses burdeo en botones o superficies de la interfaz.
- **Don't** vuelvas a poner una banda o una caja detrás de un título.
- **Don't** hagas flotar la barra inferior, ni le pongas transparencia o desenfoque.
- **Don't** uses un color de marca, el naranja de las estrellas de Goodreads ni su logo.
- **Don't** rellenes un tag con su color ni lo conviertas en píldora de color.
- **Don't** tiñas una portada, ni pongas texto sobre el tinte de Descubrir.
- **Don't** abras un panel o un modal: no existen en este sistema.
- **Don't** pongas sombra en lo que no flota, salvo las portadas.
- **Don't** dibujes un botón blanco: es el aspecto de un campo. La flecha de un riel es la excepción, porque va sobre portadas.
- **Don't** agregues un "¿Estás seguro?" a lo reversible: se resuelve con Deshacer.
- **Don't** pongas más de un `primary` por pantalla; "Agregar a Mis libros" y "Ver ficha" también cuentan.
- **Don't** apiles tarjetas dentro de tarjetas ni uses bordes de 2 px para separar capas.
- **Don't** escribas colores o sombras sueltos en una pantalla, ni uses la paleta por defecto de Tailwind, que no existe.
- **Don't** corrijas un componente desde `src/index.css` con un selector como `main button`.
- **Don't** copies "Disponible pronto" como patrón: son textos temporales de las pantallas pendientes.
- **Don't** muestres la palabra "tag" en la interfaz: cada uno se llama por su nombre.
