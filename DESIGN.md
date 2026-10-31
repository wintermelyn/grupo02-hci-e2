---
name: Goodreads · Prototipo de rediseño
description: Una biblioteca personal en neutros y tinta, donde una sola cinta marca lo activo, lo fijo y el estado de cada libro.
colors:
  white: '#ffffff'
  paper: '#faf8f6'
  shell: '#f4f1ea'
  sand: '#ebe2d7'
  sand-deep: '#dfd3c4'
  sand-dark: '#d3c4b1'
  line: '#e9e2d8'
  edge: '#857a6e'
  ink: '#1e1915'
  muted: '#5f564d'
  ribbon: '#7a2334'
  want: '#2f4a78'
  owned: '#6b3a63'
  reading: '#85490f'
  read: '#2a6249'
  danger: '#a3341c'
typography:
  display:
    fontFamily: 'Source Serif 4, Georgia, serif'
    fontSize: '2rem'
    fontWeight: 600
    lineHeight: '2.375rem'
    letterSpacing: '-0.025em'
  title:
    fontFamily: 'Source Serif 4, Georgia, serif'
    fontSize: '1.75rem'
    fontWeight: 600
    lineHeight: '2.125rem'
    letterSpacing: '-0.025em'
  heading:
    fontFamily: 'Source Serif 4, Georgia, serif'
    fontSize: '1.375rem'
    fontWeight: 600
    lineHeight: '1.75rem'
  subheading:
    fontFamily: 'Source Serif 4, Georgia, serif'
    fontSize: '1.25rem'
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
  control: '6px'
  card: '8px'
  float: '10px'
  avatar: '9999px'
spacing:
  menu: '6px'
  row: '10px'
  grid: '10px'
  card: '12px'
  media: '14px'
  gutter: '16px'
  grid-md: '16px'
  section: '20px'
components:
  button-primary:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.white}'
    typography: '{typography.control}'
    rounded: '{rounded.control}'
    padding: '0 16px'
    height: '44px'
  button-secondary:
    backgroundColor: '{colors.sand-deep}'
    textColor: '{colors.ink}'
    typography: '{typography.control}'
    rounded: '{rounded.control}'
    padding: '0 16px'
    height: '44px'
  button-secondary-hover:
    backgroundColor: '{colors.sand-dark}'
    textColor: '{colors.ink}'
  button-secondary-open:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.white}'
  button-quiet:
    textColor: '{colors.ink}'
    typography: '{typography.control}'
    rounded: '{rounded.control}'
    padding: '0 16px'
    height: '44px'
  button-quiet-hover:
    backgroundColor: '{colors.sand}'
  button-quiet-active:
    backgroundColor: '{colors.sand-deep}'
  button-compact:
    padding: '0 10px'
    height: '44px'
  button-danger:
    backgroundColor: '{colors.danger}'
    textColor: '{colors.white}'
    typography: '{typography.control}'
    rounded: '{rounded.control}'
    padding: '0 16px'
    height: '44px'
  button-disabled:
    backgroundColor: '{colors.sand}'
    textColor: '{colors.muted}'
  status-control:
    textColor: '{colors.ink}'
    typography: '{typography.control}'
    height: '44px'
  status-control-add:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.white}'
    typography: '{typography.control}'
    rounded: '{rounded.control}'
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
  anchored-menu-item-selected:
    backgroundColor: '{colors.sand}'
    rounded: '{rounded.control}'
    padding: '0 10px'
    height: '44px'
  search-field:
    backgroundColor: '{colors.white}'
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    rounded: '{rounded.control}'
    padding: '0 0 0 12px'
    height: '44px'
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
    backgroundColor: '{colors.shell}'
    textColor: '{colors.ink}'
    typography: '{typography.display}'
  tag-filter-item:
    textColor: '{colors.muted}'
    typography: '{typography.caption}'
    rounded: '{rounded.card}'
    height: '56px'
  tag-filter-item-active:
    backgroundColor: '{colors.paper}'
    textColor: '{colors.ink}'
    typography: '{typography.caption}'
    rounded: '{rounded.card}'
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
  inline-confirm:
    backgroundColor: '{colors.white}'
    textColor: '{colors.ink}'
    rounded: '{rounded.card}'
    padding: '12px'
  nav-bar:
    backgroundColor: '{colors.paper}'
    textColor: '{colors.muted}'
    typography: '{typography.caption}'
    height: '64px'
  nav-bar-active:
    textColor: '{colors.ink}'
  nav-top:
    backgroundColor: '{colors.paper}'
    height: '48px'
  nav-top-item:
    textColor: '{colors.muted}'
    typography: '{typography.small-label}'
    rounded: '{rounded.control}'
    padding: '0 10px'
    height: '44px'
  nav-top-item-active:
    backgroundColor: '{colors.sand-deep}'
    textColor: '{colors.ink}'
    rounded: '{rounded.control}'
    padding: '0 10px'
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
    width: '9px'
    height: '10px'
  ribbon-nav-md:
    backgroundColor: '{colors.ribbon}'
    width: '9px'
    height: '12px'
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

La biblioteca se ve como Goodreads en sus neutros y su tinta, sin color de marca: fondos de papel, títulos serif y portadas reales sin teñir. Sobre esa calma, una cinta con la punta cortada es el único gesto propio. Marca lo activo, lo fijo y el estado de un libro, y nada más. La app es para ordenar libros, así que los controles son estándar y las pantallas se reconocen primero como una herramienta de trabajo.

La densidad es de app, no de página de lectura: márgenes de 16 px, tarjetas compactas y mucha información por pantalla. La jerarquía viene del fondo, las filas y el espacio, como en un libro mayor: solo el menú y el toast flotan con sombra. Lo blanco con borde es un campo y lo que se presiona es un bloque relleno, así que un campo y un botón nunca se confunden. No hay modales: lo que se edita se edita en su lugar. Las portadas ponen casi todo el color de la pantalla; por eso la interfaz casi no lo usa.

Este documento fija tipografía, color, densidad, formas y el gesto de la cinta. Las pantallas, los flujos, los textos y las decisiones D1 a D6 salen de `docs/e2/informe-e2.pdf` y de `PLAN.md`. El orden de autoridad es el informe, después `PLAN.md` y después este documento. **Ante un choque con las 14 reglas de interfaz de `PLAN.md`, ganan las reglas.** Lo que el sistema no cubra se anota como decisión para el CP.

Este sistema se escribió desde lo construido. Las páginas de referencia son Mis libros (`src/features/library/LibraryPage.tsx` y `FolderCard.tsx`) y la ficha (`src/features/book/BookPage.tsx`). Los tokens viven en `src/index.css`, y si este archivo y el código difieren, se corrige este archivo. Los títulos de sección quedan en inglés porque las herramientas de este formato los buscan por su nombre exacto.

**Key Characteristics:**

- Neutros cálidos y tinta, sin color de marca ni acento que tiña la app.
- Una cinta con punta cortada como única marca de lo activo, lo fijo y el estado.
- Títulos en Source Serif 4 semibold e interfaz en Figtree.
- Tags sin relleno: ícono, texto y color, siempre juntos.
- Jerarquía por fondo, filas y espacio; sombra solo en lo que flota y en las portadas.
- Botones de relleno; lo blanco con borde es un campo.
- Lo que se edita se edita en su lugar, sin modales ni paneles.
- Portadas sin teñir, con sombra física.
- Movimiento corto y solo como respuesta a una acción.

## Colors

La paleta es de papel y tinta, con cuatro colores de estado sobrios y una cinta burdeo. La paleta por defecto de Tailwind está borrada: solo existen estos tokens.

### Primary

- **Tinta** (`ink`, #1e1915): texto principal, relleno del botón `primary`, del toast y de "Agregar a Mis libros", botón con su menú abierto, anillo de foco y estrellas llenas. Hace el trabajo que en otra app haría un color de marca.
- **Cinta burdeo** (`ribbon`, #7a2334): el relleno de la cinta que marca lo activo y lo fijo. También es el color del cursor de texto (`caret-color`) y uno de los seis fondos de la portada de reemplazo, una imagen de libro que no se confunde con la interfaz. No se usa para nada más: tampoco en avatares.

### Secondary

Los cuatro colores de estado se usan en el texto y el ícono de `StatusTag`, y en la cinta bajo la portada. Nunca como relleno de una superficie de la interfaz ni solos: siempre van con su ícono y su nombre. La única excepción son las portadas de reemplazo y los avatares, que los usan como pigmento, sin significado de estado.

- **Azul Lo quiero** (`want`, #2f4a78), con el ícono `Bookmark`.
- **Ciruela Lo tengo** (`owned`, #6b3a63), con el ícono `Book`.
- **Ámbar Leyendo** (`reading`, #85490f), con el ícono `BookOpen`.
- **Verde Leído** (`read`, #2a6249), con el ícono `CircleCheck`.

### Tertiary

- **Óxido de peligro** (`danger`, #a3341c): solo para la variante `danger` de `Button` y el ícono de `ErrorState`.

### Neutral

- **Papel** (`paper`, #faf8f6): el fondo de la app. También rellena el botón activo de `TagFilter`, que así se abre hacia la página.
- **Concha** (`shell`, #f4f1ea): la banda superior de cada sección, el hover de las opciones del menú y de las filas de enlace, y la presión de las filas de libro y de persona. También es el `theme-color` del navegador.
- **Blanco** (`white`, #ffffff): tarjetas, campo de búsqueda, menú e `InlineConfirm`.
- **Arena** (`sand`, #ebe2d7): hover de las secciones de la barra superior y de los botones de texto del buscador, presión de `quiet`, presión de las filas de enlace, botón deshabilitado, huecos de portada, esqueletos de carga, selección de texto y el bloque de "+ Nueva carpeta".
- **Arena profunda** (`sand-deep`, #dfd3c4): el relleno de `Button` `secondary` y de la sección activa de la barra superior, la presión de las opciones del menú y "+ Nueva carpeta" bajo el cursor. Solo da 1,47, 1,39 y 1,31:1 sobre blanco, papel y concha, así que `secondary` lleva además un borde `edge`.
- **Arena oscura** (`sand-dark`, #d3c4b1): un paso más que arena profunda, para `secondary` bajo el cursor y al presionar
- **Línea** (`line`, #e9e2d8): separadores de 1 px entre filas, borde de `FolderCard` y la raya del menú antes de sus comandos. Es decorativa (1,21:1 sobre papel), así que nunca es la única señal de un control o un estado.
- **Borde** (`edge`, #857a6e): el borde de 1 px de `SearchField`, `InlineConfirm`, `Button` `secondary` y "+ Nueva carpeta", la raya de las dos barras y el hover de `FolderCard`. Llega a 3:1 para que un campo se vea sin depender de una sombra.
- **Neutro** (`muted`, #5f564d): texto secundario, secciones inactivas, íconos y estrellas vacías.

### Contrastes medidos

Calculados con la fórmula WCAG de `src/components/statusStyles.test.ts` sobre los tokens reales. Ese test vigila las columnas de blanco a arena y `ink` sobre arena profunda; el resto de esa columna, los estados con transparencia y los bordes se calcularon aparte para este documento.

| Texto sobre | `white` | `paper` | `shell` | `sand` | `sand-deep` |
| ----------- | ------- | ------- | ------- | ------ | ----------- |
| `ink`       | 17,43   | 16,45   | 15,45   | 13,60  | 11,83       |
| `muted`     | 7,18    | 6,78    | 6,37    | 5,60   | 4,87        |
| `want`      | 8,85    | 8,36    | 7,85    | 6,91   | 6,01        |
| `owned`     | 8,71    | 8,22    | 7,72    | 6,80   | 5,91        |
| `reading`   | 7,10    | 6,70    | 6,30    | 5,54   | 4,82        |
| `read`      | 7,14    | 6,74    | 6,33    | 5,57   | 4,84        |
| `danger`    | 6,85    | 6,47    | 6,07    | 5,35   | 4,65        |

| Texto en controles llenos                                        | Contraste    |
| ---------------------------------------------------------------- | ------------ |
| Blanco sobre `ink`                                               | 17,43        |
| Blanco sobre `ink` al 90 % y al 80 %                             | 13,06 y 9,20 |
| Blanco sobre `danger`                                            | 6,85         |
| Blanco sobre `danger` al 90 % y al 80 %                          | 5,61 y 4,54  |
| `shell` sobre `ink` (Deshacer)                                   | 15,45        |
| `shell` sobre `ink` con blanco al 10 % y al 20 %                 | 11,57 y 8,15 |
| `ink` sobre `sand-deep` (`secondary`)                            | 11,83        |
| `muted` sobre `sand` (botón deshabilitado)                       | 5,60         |
| Tags y `muted` sobre `ink` al 10 %, en `paper` (fila presionada) | 5,50 o más   |

Los valores de `ink` y `danger` con transparencia son el peor caso, sobre blanco. Los de las filas se midieron sobre el fondo donde van. El mínimo de toda la tabla es 4,54:1, en `danger` presionado. Las cintas de los cuatro estados y la burdeo superan 4,6:1 sobre todos los fondos, por encima del 3:1 que pide una marca gráfica. Los seis fondos de la portada de reemplazo dan 7,10:1 o más con las iniciales blancas.

| Borde sobre | `white` | `paper` | `shell` | `sand` |
| ----------- | ------- | ------- | ------- | ------ |
| `edge`      | 4,19    | 3,96    | 3,72    | 3,27   |

Todos superan el 3:1 que pide el borde de un control. Sobre `sand-deep` da 2,85:1, así que `edge` no va ahí. El borde de `secondary` da esos mismos valores contra el fondo; su relleno solo no llega a 3:1 con ninguno.

### Named Rules

**La regla sin acento.** Ningún color tiñe la app. Encabezados, enlaces y botones se resuelven con tinta y neutros; el color vive en las portadas, los tags y las cintas.

**La regla del tag sin relleno.** Un estado es ícono, texto y color, nunca una píldora de color. Esta regla existe para que una lista de veinte libros no compita con sus portadas.

**La regla de las estrellas de tinta.** Las estrellas son de tinta y las vacías son de neutro. No hay naranja en esta paleta.

## Typography

**Display Font:** Source Serif 4 (con Georgia y serif)
**Body Font:** Figtree (con ui-sans-serif, system-ui y sans-serif)

**Character:** una serif de libro con eje óptico para lo que se lee como título, y una sans redonda y clara para todo lo que se opera. Ambas son libres y están alojadas en `src/assets/fonts/`.

### Hierarchy

- **Display** (600, 32 px, 38 px de línea, tracking -0,025 em): el h1 de cada sección desde 768 px, en `PageHeader`. También el título de la ficha desde 768 px.
- **Title** (600, 28 px, 34 px de línea, tracking -0,025 em): el h1 de cada sección en celular, en `PageHeader`.
- **Heading** (600, 22 px, 28 px de línea): títulos de sección dentro de la página, como "Mis carpetas", "Tus amigos" o "Está leyendo". También el título de la ficha en celular, ahí con tracking -0,025 em.
- **Subheading** (600, 20 px, 28 px de línea): títulos de `EmptyState` y `ErrorState`.
- **Book title** (600, 18 px): el nombre de un libro en `BookRow` (línea 1,375, máximo dos líneas), el de una persona en `PersonRow` y el de una carpeta en `FolderCard` (línea de 28 px). También "Sobre este libro" y el título de `InlineConfirm`.
- **Body** (400, 16 px, 24 px de línea): texto de lectura y datos del libro. La descripción de la ficha llega a 34 rem (544 px) y, desde 1024 px, al ancho de su columna.
- **Control** (600, 16 px, 24 px de línea): botones y `StatusTag` en tamaño normal. Los enlaces de volver y de carpeta usan 500.
- **Small** (400, 14 px, 20 px de línea): subtítulo de la banda, autores, cantidades, etiquetas de `LedgerRow` y procedencia de una descripción, en `muted`.
- **Small label** (600, 14 px, 20 px de línea): `StatusTag` en listas, @usuario, estado de una persona, "En común" y secciones de la barra superior, en 700 la activa.
- **Caption** (500, 12 px, 16 px de línea): etiquetas de `TagFilter`, y las de la barra inferior en 600. Las activas pasan a 700.

La cantidad de `TagFilter` usa la serif a 600, 16 px y 20 px de línea, con cifras tabulares.

Todo `h1`, `h2` y `h3` usa `text-wrap: balance`.

### Named Rules

**La regla de la serif que nombra.** La serif es para lo que nombra: secciones, libros, carpetas, la marca y las cantidades de `TagFilter`. Lo que se opera o se explica va en Figtree.

**La regla de la escala cerrada.** Usa solo los tamaños de esta lista. La única excepción son las iniciales de la portada de reemplazo, que crecen con la portada. No hay texto en mayúsculas sostenidas ni tamaños sueltos en el código.

## Layout

El diseño parte del celular. El contenido vive en una columna centrada de hasta 1040 px (`max-w-app`) con márgenes de 16 px, y la app no tiene barra lateral.

- **Puntos de quiebre:** `md` (768 px) cambia de barra inferior a barra superior. `lg` (1024 px) da más aire a la barra superior, completa "Prototipo de rediseño", pasa el tablero de carpetas a 5 columnas y le da a la ficha su tercera columna.
- **Banda:** `PageHeader` llena todo el ancho de la pantalla con `shell`, gracias a `full-bleed`, y deja el texto alineado con la columna. Tiene 8 px arriba, 16 px desde `md`, y 16 px abajo si no lleva nada en su borde inferior. El margen inferior de lo que lleva adentro queda en la banda, gracias a `flow-root`. La acción de la página, si la hay, va en la misma fila del título. Cada sección parte con esta banda, salvo la ficha.
- **Espacio bajo el contenido:** `main` deja 144 px abajo en celular, para la barra y el toast, y 48 px desde `md`.
- **Ritmo vertical:** 20 px entre bloques, 12 px bajo un título de sección y 4 px entre un título de bloque de la ficha y su contenido.
- **Tablero de tarjetas:** 2 columnas con 10 px de separación en celular, 4 columnas con 16 px desde `md` y 5 desde `lg`. Las tarjetas de una fila miden lo mismo, y un nombre llega a dos líneas. "+ Nueva carpeta" cierra el tablero: en celular ocupa lo que la última fila deja libre, y mientras se escribe toma dos celdas.
- **Listas de libros:** una columna de `BookRow` en celular y dos desde `md`, con 32 px entre columnas. Cada fila va en un `li` con `border-b border-line last:border-b-0`, como en `BookList`. Esa lista es `BookList`. Desde `md`, las dos últimas filas pierden su línea si quedan una al lado de la otra, con `md:nth-last-2:odd:border-b-0`.
- **Ficha:** sin banda, sobre el papel, con `BackLink` y `Wordmark` en la primera fila. Tiene la misma forma para todo libro, con o sin descripción.
  - **Celular:** portada de 112 px a la izquierda, con el título y los datos a su lado. Debajo, a todo el ancho, el registro y "Sobre este libro".
  - **Desde 768 px:** una columna de 224 px para la portada y otra de hasta 34 rem, con 40 px entre ambas, para el título, el registro y "Sobre este libro". Este último sigue al registro aunque la portada sea más alta.
  - **Desde 1024 px:** tres columnas. El título cruza las dos de la derecha, y el registro y "Sobre este libro" quedan lado a lado, en proporción 1,2 a 1, para que dos carpetas y "Agregar o quitar" quepan en una línea.
- **Áreas táctiles:** 44 px como mínimo en todo control. La barra inferior mide 64 px de alto y la superior 48 px, con secciones de 44 px; `TagFilter` mide 56 px y las opciones del menú 44 px. Las capturas actuales dan 62 × 64 px como mínimo en la barra a 320 px de ancho, sin etiquetas cortadas ni scroll horizontal en ninguno de los cuatro dispositivos.

## Elevation & Depth

El sistema se ordena por fondo, filas y espacio. `paper` es el piso, `shell` marca la banda, las filas se separan con líneas de 1 px, los campos se dibujan con un borde de 1 px y los botones con un relleno. Solo hay sombra en lo que flota sobre la página y en las portadas, siempre teñida de tinta, nunca negra. Las barras son planas, sobre `paper`: las separa una raya de 1 px en color `edge`, porque el contenido pasa por debajo.

### Shadow Vocabulary

- **Flotante** (`--shadow-float`: `0 2px 4px rgb(30 25 21 / 14%), 0 18px 34px -8px rgb(30 25 21 / 40%)`): `AnchoredMenu` y toast.
- **Libro** (`--shadow-book`: `0 1px 1px rgb(30 25 21 / 20%), 0 6px 12px -5px rgb(30 25 21 / 35%)`): portadas en tamaños `sm` y `fill`.
- **Libro grande** (`--shadow-book-lg`: `0 2px 3px rgb(30 25 21 / 22%), 0 16px 26px -10px rgb(30 25 21 / 50%)`): la portada `lg` de la ficha.

### Named Rules

**La regla de lo que flota.** Solo `AnchoredMenu` y el toast flotan con sombra. Una tarjeta, un botón o un campo no llevan sombra: se separan con fondo, borde y espacio.

**La regla de la presión.** Lo que se toca baja 1 px al presionarlo. `FolderCard`, `Button` y "Cambiar o quitar" lo hacen en 100 ms.

**La regla del libro físico.** Solo las portadas usan sombras de libro. Son objetos, no tarjetas.

## Shapes

La forma es de papelería: esquinas apenas redondeadas que crecen con la altura de la capa.

- **Portada** (2 px en el lomo y 3 px en el borde exterior): portadas, sus huecos en `FolderCard` y sus esqueletos en `LoadingState`. Una línea plana de 2 px de tinta al 15 % dibuja la bisagra del libro y separa las portadas claras del fondo.
- **Control** (6 px): botones, campo de búsqueda, opciones del menú y secciones de la barra superior.
- **Tarjeta** (8 px): tarjetas de carpeta e `InlineConfirm`. Solo arriba en `TagFilter`, para que parezca una pestaña.
- **Flotante** (10 px): menú y toast.
- **Cinta:** rectángulo con muesca en V, con `clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 76%, 0 100%)`. Se dibuja solo con `Ribbon`.

- **Avatar:** un círculo, la única forma redonda del sistema. Separa a una persona de un libro de un vistazo, porque las portadas son rectángulos.

No hay formas de píldora.

## Components

Importa todo desde `src/components/`. Son del bloque base: si necesitas cambiar uno, se hace en un commit aparte y avisando al otro rol.

### Qué usar para cada necesidad

| Necesidad                                          | Usa                                                                                                  |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Navegación principal y contenedor de la página     | `AppShell`, que ya envuelve las rutas; no agregues otra barra                                        |
| Comienzo de una sección, con título y volver       | `PageHeader`, con `backTo` y `backLabel` en subpáginas, y `action` para lo que actúa sobre la página |
| Volver desde una página sin `PageHeader`           | `BackLink`, siempre a una ruta fija, junto a `Wordmark`, como en la ficha                            |
| Filtrar por tag con la cantidad de cada uno        | `TagFilter`, como hijo de `PageHeader`                                                               |
| Mostrar un libro en una lista                      | `BookRow`; la acción extra, como "Quitar", va en `trailing`, y en una lista de otra persona, `note`  |
| Mostrar una portada suelta                         | `BookCover`: `sm` para listas, `fill` para grillas y `lg` para la ficha                              |
| Mostrar el estado de un libro, sin cambiarlo       | `StatusTag`; en listas, `size="sm"`                                                                  |
| Cambiar o agregar el tag de un libro               | `StatusControl`, y no otro control. Recibe `book` si el libro puede no estar en el store             |
| Mostrar o elegir un puntaje                        | `Stars`; con `onChange` es un campo                                                                  |
| Acción con botón                                   | `Button`: `primary`, `secondary`, `quiet` o `danger`; `compact` en una fila o una banda              |
| Cambio rápido con pocas opciones, junto al control | `AnchoredMenu`                                                                                       |
| Editar un dato                                     | En su lugar, en la misma fila o título donde se lee                                                  |
| Escribir un texto corto donde se lee               | `TextField`, con Guardar y Cancelar al lado                                                          |
| Confirmar lo que no se puede deshacer              | `InlineConfirm`, solo para eliminar carpeta y Reiniciar demo                                         |
| Buscar o filtrar mientras se escribe               | `SearchField`, en la banda; en una lista de libros, `BandSearch`                                     |
| Mostrar a una persona                              | `Avatar`, siempre junto a su nombre                                                                  |
| Confirmar después de un cambio y permitir deshacer | El toast del store, que `AppShell` ya muestra; no montes otro                                        |
| Lista vacía o sin resultados                       | `EmptyState`, con ícono, título, descripción y acción opcional                                       |
| Esperar resultados                                 | `LoadingState`                                                                                       |
| Algo falló                                         | `ErrorState`, con `onRetry` si se puede reintentar                                                   |
| Enlaces a un libro o una carpeta                   | `bookPath` y `folderPath`                                                                            |

### Pantallas pendientes

Esto dice qué piezas existen para cada pantalla. Su contenido y sus textos salen de `PLAN.md`.

| Pantalla  | Piezas existentes                                                                  | Sin componente todavía                     |
| --------- | ---------------------------------------------------------------------------------- | ------------------------------------------ |
| Inicio    | `PageHeader`, `BookCover`, `StatusTag`, `EmptyState`                               | Tarjeta "Leyendo ahora", fila de actividad |
| Descubrir | `PageHeader`, `BookCover` con `fill`; título de sección en Heading                 | Tarjeta de libro para las secciones        |
| Buscar    | `PageHeader`, `SearchField`, `BookRow`, `LoadingState`, `EmptyState`, `ErrorState` | Nada                                       |
| Mi perfil | `PageHeader`, `Avatar`, `Button`, `InlineConfirm` para la confirmación             | Nada                                       |

`InlineConfirm` confirma eliminar carpeta, y confirmará Reiniciar demo cuando exista Mi perfil.

**Lo que no está en `src/components/` no tiene aspecto definido.** Arma lo que falte solo con estos tokens, respeta las 14 reglas y anótalo como decisión para el CP. Una pieza que dos pantallas necesiten se propone como compartida, para que los dos roles no construyan versiones distintas. Los campos de texto ya heredan el foco global, el acento de tinta (`accent-color`) y el cursor burdeo. `FolderCard` es de `src/features/library/`: sirve de modelo para una tarjeta, pero no es un componente compartido.

### Piezas locales

Viven en la carpeta de su pantalla. Sirven de modelo, y se vuelven compartidas si otra pantalla las necesita.

- **Lista de libros:** `BookList`, en `src/features/library/`, la usan Mis libros y la carpeta.
- **Aviso de D5:** `WantPrompt`, en `src/features/library/`. Una fila sobre la lista, sin tarjeta, en "Todos" y "Lo quiero", y oculta mientras se busca. Lleva portada de 56 px, la pregunta en Book title y "It · 210 días en Lo quiero" en Small `muted`, hasta dos líneas. Debajo, también en Small `muted`, dice lo que cuesta el "No" con las palabras del toast: "Si dices No, sale de Mis libros y de Terror". Con dos carpetas o más dice "y de sus 2 carpetas", y sin carpetas termina en "Mis libros". Separa de lo que sigue con una línea, a 16 px de la banda. "Sí" y "No" son el mismo `Button` `secondary` `compact`, en una grilla de hasta 208 px: desde `md` van en el borde derecho y en celular bajo el texto. Responder mueve la lista hacia arriba, así que el segundo toque de un doble toque se ignora y el foco sigue en el contenido.
- **"+ Nueva carpeta":** `NewFolderCard`, la última tarjeta del tablero. En reposo es un bloque `sand` con borde `edge`, porque se presiona: "+ Nueva carpeta" en Book title y "Un libro puede estar en varias" en Small `muted`, abajo y a la izquierda. Bajo el cursor toma `sand-deep`. Cuánto pesa en reposo es una decisión abierta del CP4, en `docs/desarrollo/checkpoints/cp4/decisiones.md`. Desde `md` mide lo mismo que una `FolderCard`, también sola en su fila. En celular ocupa la media fila que deja libre una cantidad impar de tarjetas, o la fila entera si la empieza. Al presionarla se vuelve blanca con borde `edge`, porque ahora se escribe: "Nueva carpeta" en Small label, `TextField`, y Crear (`primary`) y Cancelar (`secondary`), los dos `compact` y del mismo tamaño. Mientras se escribe toma dos celdas en todo dispositivo, con la altura de una `FolderCard` desde `md`: en celular, media fila solo dejaría leer unas doce letras de un nombre de hasta 40, y en una celda de tablet Crear y Cancelar no caben en una fila. Si cae en la última columna, baja a la fila siguiente sin cambiar de lado, alineada a la derecha, para abrir bajo el dedo. En celular toma la fila entera. La línea del motivo queda reservada, así que aparecer no mueve nada. No lleva huecos de portada: esos dicen que una carpeta real no tiene libros. Crear queda deshabilitado sin nombre. El motivo aparece cuando la persona escribe algo que no sirve, o presiona Enter con el campo vacío. Sigue los límites de renombrar. Al crear, la carpeta aparece antes de esta tarjeta y el foco vuelve a ella.
- **Fila de persona:** `PersonRow`, en `src/features/friends/`. `Avatar` `sm`, nombre en Book title, @usuario en Small label de tinta y amigos en común en Small. El @usuario va en tinta porque es lo que separa a dos homónimos. Esas dos líneas no se juntan nunca, para que la fila mida lo mismo en todos los estados. La acción va a la derecha, en un espacio fijo de 104 px, y desde `lg` toma su propio ancho, para que el nombre no se mueva cuando la acción pasa a ser el estado de la solicitud.
- **Invitar contactos:** un `Button` `quiet` `compact`, a la derecha del título de Amigos, para que no salte con cada búsqueda. El texto queda sobre el margen, así que su relleno sobresale 10 px con el cursor.
- **Estado de una persona:** "Solicitud enviada" y "Amigos" en Small label `muted`, sin color de estado ni cinta. Esos colores son solo de los libros. "Amigos" lleva ícono de 16 px, y "Solicitud enviada" solo en Persona, donde hay espacio. En la lista "Tus amigos" el estado se omite, porque el título ya lo dice.
- **Acción sobre una persona:** `PersonAction`. El estado y la acción nunca son el mismo control: el estado es texto y la acción es un `Button` `compact`, el mismo para Agregar, Cancelar y Quitar de amigos: `quiet` en una fila de Amigos y `secondary` en la banda de Persona. Pesan lo mismo y cuestan un toque, como pide la regla 11, y Quitar de amigos ofrece Deshacer. Si la solicitud se acepta justo bajo un toque a Cancelar, ese toque cae en Quitar de amigos y termina donde la persona quería: sin ser amigos. Quitar de amigos solo existe en Persona, y Persona está en la banda, con la acción en el borde derecho desde que cabe en la misma fila.
- **Fila de enlace:** en `MorePage.tsx`, una fila de 56 px con ícono, texto y flecha, separada por una línea. Hover `shell` y presión `sand`.
- **Fila del registro:** `LedgerRow`, en `src/features/book/`, dentro de un `dl`. La etiqueta va en Small `muted`, en una columna de 60 px (80 px desde `md`), y el valor va a la derecha, editable ahí mismo. Mide 44 px más 4 px arriba y abajo, con una línea debajo. Las filas son Estado, Inicio, Fin, Puntaje y Carpetas: Inicio aparece en Leyendo y Leído, Fin y Puntaje solo en Leído, y Carpetas si el libro está en la biblioteca. La acción de una fila es un botón `quiet` `compact`, siempre al final, con el texto sobre el margen. Solo la fecha y la fila Estado sobresalen 8 px a la izquierda con el cursor, para que su texto quede alineado.
- **Fecha en una fila:** sin borde ni fondo, con su ícono `CalendarDays` en `muted` y hover de tinta al 5 %. Abre el calendario al tocar cualquier parte, así que las partes de la fecha se editan con el teclado. Chrome ignora `:focus` sobre ellas, por lo que un filtro convierte su azul en un tono cercano a `sand` y deja marcada la parte que se edita. La fecha del calendario se guarda de inmediato, y la escrita al presionar Enter o al salir del campo.
- **Carpetas de un libro:** enlaces de texto en la fila Carpetas, en peso 500, con subrayado `muted` al 50 % que pasa a tinta con el cursor, y 44 × 44 px como mínimo. Son un lugar, no un estado: no llevan cinta ni color de tag. Al final de la fila, un `Button` `quiet` `compact` abre el menú y se llama según lo que se puede hacer: "Agregar", con un más, si no hay ninguna, y "Agregar o quitar", sin ícono, si hay, porque el más diría solo la mitad. Su nombre accesible dice "Agregar a carpeta". Sin carpetas, a su izquierda dice "Sin carpetas" en `muted`. El botón no se mueve de la primera línea: lo que no cabe son los enlaces, que bajan.
- **Nombre de una carpeta:** `TextField` toma el lugar del título con el mismo tipo, con Guardar y Cancelar en la banda.
- **Búsqueda en una lista de libros:** `BandSearch`, en `src/features/library/`, la usan Mis libros y la carpeta. `SearchField` va en la fila del título, porque `TagFilter` ocupa el borde inferior de la banda. Respeta el botón de tag activo, y cambiarlo no borra lo escrito. En Mis libros reemplaza el tablero y el aviso por los resultados. Con otro tag activo, "Sin resultados" ofrece "Ver todos los libros"; en "Todos", dice que Buscar sirve para lo que está fuera de la biblioteca. Desde `md` está siempre a la vista, con 288 px de ancho, junto a Opciones. En celular no cabe junto al título, así que el botón `compact` "Buscar", sin ícono para que el título quepa a 320 px, lo abre sobre esa misma fila, con el foco en el campo: aparece bajo el dedo y ningún libro se mueve. El título sigue en la página para los lectores de pantalla, y el `placeholder` dice en qué carpeta se busca. "Cerrar" vacía la búsqueda, cierra el campo y devuelve el foco a "Buscar". Una búsqueda que vuelve desde la URL abre el campo sola, sin tomar el foco.
- **Carpeta fija:** solo dice "Carpeta fija" de subtítulo.
- **Título de una carpeta:** en celular llega a dos líneas, porque comparte la fila con dos botones y un nombre de 40 caracteres dejaría el primer libro a media pantalla. Desde `md` se muestra entero.
- **Sobre este libro:** el bloque va siempre en el mismo lugar, con su título en Book title. La descripción va en Body, entera, sin cortar ni "Leer más". Sin descripción dice "Aún no tenemos descripción de este libro." en Body `muted`, sin ícono ni `EmptyState`, porque es el caso normal y no un problema.
- **Procedencia de una descripción:** "Traducción hecha con IA", en Small `muted` y a 8 px bajo la descripción, solo si el libro trae `descriptionTranslated`. Es un dato sobre el texto, como la línea del autor, y no un aviso: sin cinta, sin ícono y sin color de acento. Da 6,78:1 sobre `paper`.
- **Motivo de un botón deshabilitado:** Small en tinta con `CircleAlert` en `muted`, dentro de una región `status`.
- **Libros de una persona:** cada libro aparece una vez, en "Está leyendo" o "Últimos leídos". Los compartidos llevan "En común" en `note` de `BookRow`, sin grilla aparte. La banda de Persona suma los amigos y libros en común, y `PersonAction`.

### Cinta

La firma del sistema. `Ribbon` es decorativo y lleva `aria-hidden`: lo que marca también debe decirse con texto, peso o `aria-current`.

- **Lo activo, en burdeo:** la sección de la barra (9 × 10 px abajo y 9 × 12 px arriba, colgando del borde superior de la barra hacia la sección) y el botón activo de `TagFilter` (9 × 12 px). `AppShell` y `TagFilter` ya la dibujan.
- **Lo fijo, en burdeo:** la carpeta fija, en la esquina superior derecha de su tarjeta (9 × 26 px, a 10 px del borde), siempre con el texto "· fija".
- **El estado de un libro, en su color:** sale por debajo de la portada, detrás de ella. `BookCover` la dibuja al recibir `status`: 7 × 16 px en `sm`, 10 × 24 px en `fill` y en `lg`, y 13 × 36 px en `lg` desde `md`. Pásale `status` solo si el libro está en la biblioteca.
- **El gesto:** al elegir un tag, el texto nuevo entra en 180 ms (`animate-tag-in`) y la cinta nueva baja desde detrás de la portada en 220 ms (`animate-ribbon-in`). Con reducir movimiento, el cambio es instantáneo.

**La regla de la cinta.** La cinta marca solo lo activo, lo fijo o el estado de un libro. No decora títulos, no separa secciones y no destaca novedades, recomendaciones ni llamados a la acción.

**La regla de una por grupo.** Dentro de un grupo de opciones hay una sola cinta activa. Una pantalla puede tener varias cintas porque cada una responde a una pregunta distinta: dónde estoy, qué filtro uso, qué carpeta es fija y en qué estado va cada libro.

**La regla del burdeo y el estado.** El burdeo significa activo o fijo. Una cinta de estado usa siempre el color de su tag y nunca burdeo.

### Editar en su lugar

**La regla de editar en su lugar.** No hay modales ni paneles. Lo que se edita se edita donde se lee, sin tapar ni oscurecer la página.

**La regla del cambio rápido.** Un cambio rápido y reversible, con pocas opciones, se resuelve en un menú anclado junto al control. Elegir un tag nunca lleva a otra pantalla.

**La regla de confirmar en la página.** Solo eliminar carpeta y Reiniciar demo piden confirmación, con `InlineConfirm`. Lo demás se aplica de inmediato y ofrece Deshacer.

- **Dónde abre el menú:** debajo del control siempre que pueda, porque arriba taparía el libro. Si no cabe, la página hace scroll primero. Solo abre hacia arriba cuando la página ya no puede moverse. Si tampoco cabe arriba, queda abajo, sobre la barra inferior (capa 45, entre las barras y el toast), y limita su alto al espacio que queda.
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

Un campo blanco con borde de 1 px `edge`, 44 px de alto y radio de control, con la lupa a la izquierda. Filtra mientras se escribe, así que no tiene botón de enviar. Al escribir aparece "Borrar" con su ícono, que limpia el campo y deja el foco ahí.

- **Dónde va:** siempre dentro de la banda. Con 16 px abajo si es lo primero de la página, como en Amigos, donde sigue a la vista porque es el camino de T3. Si `TagFilter` ya ocupa el borde inferior, va en la fila del título, como en una carpeta. Nunca bajo la banda: el campo debe aparecer junto a lo que se tocó y no empujar la lista.
- **Etiqueta:** `label` nombra el campo para lectores de pantalla. `placeholder` dice qué se puede buscar, como "Nombre o @usuario", o dónde, como "Buscar en Terror", en `muted`, y un texto que no cabe termina en puntos suspensivos.
- **Borrar y Cerrar:** texto en tinta, peso 600, con hover `sand` y presión `sand-deep`, como `quiet`.
- **`onClose`:** para un campo que el celular abre a pedido. Agrega "Cerrar", que en celular toma el lugar de "Borrar", porque con ambos quedan 56 px para escribir a 320 px. Desde `md` sigue "Borrar". Escape cierra en todos los anchos.
- **Foco:** el contorno global rodea todo el campo, no solo el texto.

### TextField

Un texto corto que se escribe donde se lee, como el nombre de una carpeta. Hereda el tipo de lo que reemplaza y va sobre una línea de 1 px de tinta, que se aparta mientras el contorno de foco dibuja el campo. Parte con el foco y su texto seleccionado. Enter guarda y Escape cancela, y Enter no llega a ser un clic en el botón que recibe el foco después de guardar. Si el valor no se puede guardar, `problem` lo dice debajo, en Small con `CircleAlert`. Quien lo muestra pone Guardar y Cancelar a su lado.

### Avatar

Un círculo con las iniciales blancas en serif sobre `avatarColor`, que viene del directorio. `sm` mide 40 px, con Small label, para las filas. `lg` mide 64 px, con Subheading, para el encabezado de una persona. Es decorativo: el nombre siempre va escrito al lado, y entre homónimos los distingue el @usuario, no el color. Los colores son cinco de los seis fondos de la portada de reemplazo, todos menos el burdeo, porque el burdeo significa activo o fijo. Como en la portada, no significan nada. Un test vigila que todos los del directorio salgan de esa lista y den 4,5:1 con el blanco. En Persona va en la banda, en `media` de `PageHeader`.

### InlineConfirm

Pregunta dentro de la página, junto a lo que afecta, para que siga a la vista. Es una tarjeta blanca con borde de 1 px `edge`, radio de tarjeta y 12 px de relleno: título en Book title, lo que va a pasar en Body, y un `Button` `danger` con la acción junto a Cancelar en `secondary`. Desde `md`, el texto y los botones van en una fila. El foco parte en Cancelar, para que un Enter de más no confirme, y Escape cancela. Quien la muestra devuelve el foco al cancelar.

### Buttons

Bloques de relleno, con un solo llamado por pantalla. Es la diferencia con un campo: lo blanco con borde se escribe, y lo relleno se presiona. Por eso ningún botón es blanco.

- **Shape:** esquinas de control (6 px), 44 px de alto, 16 px de relleno lateral y texto Control. El ícono mide 18 px y va antes del texto. Nunca hay botones de solo ícono. Si algo sobra en una fila angosta, sobra el ícono, no el texto.
- **Primary:** relleno de tinta con texto blanco. Al pasar el cursor baja al 90 % y al presionar al 80 %.
- **Secondary:** relleno `sand-deep` con borde `edge` de 1 px y texto de tinta. Al pasar el cursor el relleno sube a `sand-dark`, y al presionar suma borde de tinta. Con su menú abierto (`aria-expanded`) se invierte a tinta con texto blanco, con o sin cursor: la tinta significa abierto. Es la variante por defecto.
- **Quiet:** texto de tinta sin relleno, sobre el papel o la banda. Al pasar el cursor toma `sand`, y al presionar y con su menú abierto, `sand-deep`. Es para las acciones de una fila, como "Agregar o quitar" o "+ Agregar", y para lo secundario de la página, como "Invitar contactos". En una fila, el texto queda sobre el margen y el relleno sobresale con el cursor.
- **Compact:** 10 px de relleno lateral y 6 px entre ícono y texto, para una fila o una banda que comparte el ancho con texto. Conserva los 44 px de alto.
- **Danger:** relleno `danger` con texto blanco, con el mismo comportamiento que `primary`. Es para lo destructivo que pide confirmación, como Reiniciar demo y eliminar carpeta.
- **Disabled:** relleno `sand`, texto `muted`.
- **Pares:** "Sí" y "No", agregar y quitar, o la acción y Cancelar, usan la misma variante o el mismo tamaño, para cumplir la regla 11. Cancelar nunca es un enlace subrayado.

**La regla del relleno de página.** Lo que actúa sobre la página va a la derecha del título, en la banda, y lleva relleno, como "Opciones" y "Buscar". Lo que actúa sobre una fila va al final de esa fila y no lleva relleno en reposo, para que una lista o un registro no se llenen de bloques que compiten con las portadas. Así un botón siempre termina en el margen derecho de la columna.

`StatusControl` lleno de tinta ("Agregar a Mis libros") cuenta como el botón principal de la pantalla. Una pantalla puede no tener `primary`: Amigos y Persona no lo tienen, porque sus filas repiten la misma acción y agregar y quitar pesan lo mismo.

### StatusControl

La fila Estado de la ficha, a todo el ancho y de 44 px de alto, y toda ella abre el menú. A la izquierda va `StatusTag` y a la derecha el lápiz con "Cambiar o quitar", dibujado como un botón `quiet` `compact`, en paralelo con "Agregar o quitar" de la fila Carpetas. Bajo 360 px el texto baja a Small y el lápiz se va, porque es lo que permite que quepa en una línea junto a "Lo quiero". Bajo el cursor, la fila toma tinta al 5 %, como una fecha, y "Cambiar o quitar" solo reacciona si el cursor está sobre él, con `sand`; con el menú abierto toma `sand-deep`. Si el libro no está en la biblioteca, la fila se llena de tinta con un más y "Agregar a Mis libros", dentro de los márgenes del registro, abre el mismo menú y con él abierto pasa a `sand-dark`. El menú es un `AnchoredMenu`. La opción actual tiene fondo `sand` y un check con "Actual" en tinta. Se aplica de inmediato. "Leído" se elige aquí mismo, sin pasos intermedios. Si el libro está en la biblioteca, bajo una línea va "Quitar de Mis libros", con el detalle de lo que se pierde, como "Pierdes 1 carpeta y el puntaje".

### StatusTag

Ícono, texto y color, sin fondo. `md` usa ícono de 18 px y texto de 16 px. `sm` usa ícono de 14 px y texto de 14 px. Peso 600 en ambos.

### TagFilter

Cinco botones iguales en una grilla, de 56 px de alto y hasta 512 px de ancho total desde `md`: cantidad en serif de 16 px y etiqueta en Caption. El activo toma el fondo `paper`, peso 700 y la cinta burdeo, y se abre hacia la página como una pestaña. Por eso va en el borde inferior de la banda, como hijo de `PageHeader`. No usa los colores de estado.

### Stars

Estrellas de 14 px para mostrar un puntaje y de 26 px, en áreas de 44 px, cuando son un campo. La llena es de tinta y la vacía tiene contorno `muted`. Como campo, su leyenda es solo para lectores de pantalla, porque la fila que lo rodea ya lo nombra. El puntaje siempre es opcional: el campo ofrece el botón "Quitar".

### Cards / Containers

- **Corner Style:** tarjeta (8 px).
- **Background:** blanco. "+ Nueva carpeta" es la excepción en reposo: es un bloque que se presiona.
- **Shadow Strategy:** ninguna. Nunca una tarjeta dentro de otra.
- **Border:** 1 px `line` en `FolderCard`, que pasa a `edge` con el cursor, y 1 px `edge` en `InlineConfirm` y "+ Nueva carpeta".
- **Internal Padding:** 12 px.

`FolderCard` es la tarjeta de referencia: dos portadas con 6 px de separación, nombre serif a 10 px y cantidad en Small. Si falta una portada, su hueco se rellena con `sand`.

### BookRow

Portada `sm` (56 px, 64 px desde `md`) con su cinta, y a 14 px el título, el `StatusTag` junto al autor, y las estrellas si tiene puntaje. Toda la fila abre la ficha y recuerda de qué lista se viene. Solo muestra una respuesta al presionar, con fondo `shell`. En una lista de otra persona, `note` reemplaza el tag y las estrellas, y la portada va sin cinta, porque podrían pasar por los de esa persona. En una lista ya filtrada por estado, `folders` reemplaza el texto del tag, que el filtro ya dice: las carpetas van bajo el autor, en Small de peso 500, hasta dos líneas y separadas por un punto medio, y la cinta se queda. Un libro sin carpetas no lleva esa línea, y dentro de una carpeta no se repite la que está abierta.

### BookCover

Las portadas no se tiñen ni se recortan en la ficha. `lg` mide 112 px en celular y 224 px desde `md`, y conserva la proporción real de la imagen dentro de una caja de 2:3, para que nada salte al cargar. Si falta la imagen, muestra las iniciales blancas sobre uno de seis fondos, elegido por el id del libro. Ese fondo no significa nada. Es decorativa: el título siempre va escrito al lado.

### Navigation

- **Scroll:** `AppShell` parte cada página arriba. Volver, con el botón del navegador o con `BackLink`, deja la lista donde estaba. Un filtro o una búsqueda no mueven la página.
- **Celular:** `AppShell` fija una barra abajo, sobre `paper`, de 64 px más el área segura, con raya superior `edge` y cinco secciones repartidas por igual, ícono de 22 px y etiqueta Caption. La presión es `sand`.
- **Desde `md`:** barra superior fija, sobre `paper`, de 48 px, con raya inferior `edge`. "Goodreads" en serif de 18 px y "Prototipo" ("Prototipo de rediseño" desde `lg`) van en el borde izquierdo de la columna, y las cinco secciones terminan en el derecho, con íconos de 18 px y Small label. Cada sección mide 44 px para tocar y muestra un relleno de 36 px, para que la barra no quede llena. El hover es `sand`.
- **Estados:** la sección activa es de tinta, con peso 700 y cinta, y desde `md` también con relleno `sand-deep`. Las demás son `muted` con peso 600 y pasan a tinta con el cursor. "Más" sigue activa en Amigos y Mi perfil.
- **Marca en celular:** `PageHeader` y la ficha muestran `Wordmark`, porque no hay barra superior. Va a la derecha del título. Si `PageHeader` recibe `backTo` o `action`, sube a la fila de arriba, para que el título y la acción tengan el ancho, salvo con `wordmarkBeside`, para un título corto y una acción `compact`, como en Mis libros. Ninguna pantalla pierde el aviso de prototipo.

### Toast

Una capa de tinta de hasta 448 px, centrada, con radio `float` y `shadow-float`. Queda sobre la barra inferior en celular y a 24 px del borde desde `md`. Entra en 200 ms. Deshacer va con ícono y texto en `shell`. Dura 5 s y se detiene mientras el cursor o el foco están encima. Si la acción se hizo con teclado y su control desapareció, como en el aviso de D5, el foco llega a Deshacer y Tab lo devuelve a donde estaba. El mensaje corta una palabra larga, para que Deshacer siga a la vista.

### Estados de pantalla

`EmptyState` y `ErrorState` centran un ícono de 32 px con trazo 1,5, un título Subheading y una descripción `muted`, que corta una palabra larga para no salirse del margen. El ícono de error va en `danger`. `LoadingState` dibuja tres filas de esqueleto en `sand` con la forma de `BookRow`, para que la página no salte, y pulsa solo si la persona no pidió reducir movimiento.

### Movimiento

Una sola curva, `--ease-quick` (`cubic-bezier(0.16, 1, 0.3, 1)`). Respuestas al tacto en 100 ms, menú en 150 ms, tag en 180 ms, toast en 200 ms y cinta en 220 ms. `src/index.css` reduce todo a 1 ms con `prefers-reduced-motion`.

### Foco

Un solo estilo: contorno de 2 px de tinta a 2 px de distancia, definido de forma global. No lo reemplaces ni lo quites. Solo el toast lo cambia a blanco, por su fondo oscuro, las opciones del menú lo dibujan hacia adentro y `SearchField` lo dibuja alrededor de todo el campo.

## Do's and Don'ts

### Do:

- **Do** parte cada sección con `PageHeader`, salvo la ficha, que parte sobre el papel, sin banda.
- **Do** edita cada dato en su lugar, en la fila o el título donde se lee.
- **Do** da una salida en los estados vacíos a los que se llega por un filtro o un enlace malo: un botón "Ver todos los libros" o "Ir a Mis libros".
- **Do** usa solo los tokens de `src/index.css`: colores, tamaños, radios y sombras.
- **Do** muestra cada estado con texto además de color, como pide la regla 3.
- **Do** pon los tags solo sobre `white`, `paper`, `shell` o `sand`, donde el test vigila que lleguen a 4,5:1.
- **Do** escribe etiqueta de texto junto a cada ícono, también en la barra de navegación.
- **Do** mantén 44 px como mínimo en todo control, y que nada dependa solo del hover.
- **Do** deja las portadas sin teñir y con su sombra de libro.
- **Do** anima solo como respuesta a una acción, y deja que `prefers-reduced-motion` la anule.
- **Do** mira Mis libros y la ficha como referencia, en `.claude/capturas/salida/<dispositivo>/`.
- **Do** anota como decisión para el CP lo que este documento no cubra.

### Don't:

- **Don't** uses la cinta para decorar o para llamar la atención, ni la dibujes sin `Ribbon`.
- **Don't** pongas una cinta burdeo bajo una portada ni uses burdeo en texto, botones o superficies de la interfaz.
- **Don't** uses un color de marca, el naranja de las estrellas de Goodreads ni su logo.
- **Don't** rellenes un tag ni lo conviertas en píldora de color.
- **Don't** abras un panel o un modal: no existen en este sistema.
- **Don't** pongas sombra en lo que no flota, salvo las portadas.
- **Don't** dibujes un botón blanco: es el aspecto de un campo.
- **Don't** agregues un "¿Estás seguro?" a lo reversible: se resuelve con Deshacer.
- **Don't** pongas más de un `primary` por pantalla; "Agregar a Mis libros" también cuenta.
- **Don't** apiles tarjetas dentro de tarjetas ni uses bordes de 2 px para separar capas.
- **Don't** escribas colores, tamaños o sombras sueltos en una pantalla, ni uses la paleta por defecto de Tailwind, que no existe.
- **Don't** copies "Disponible pronto" como patrón: son textos temporales de las pantallas pendientes.
- **Don't** muestres la palabra "tag" en la interfaz: cada uno se llama por su nombre.
