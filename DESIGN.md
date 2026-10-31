---
name: Goodreads · Prototipo de rediseño
description: Una biblioteca personal en neutros y tinta, donde una sola cinta marca lo activo, lo fijo y el estado de cada libro.
colors:
  white: '#ffffff'
  paper: '#faf8f6'
  shell: '#f4f1ea'
  sand: '#ebe2d7'
  sand-deep: '#dfd3c4'
  line: '#e9e2d8'
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
    fontSize: '2.125rem'
    fontWeight: 600
    lineHeight: '2.5rem'
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
  sheet: '16px'
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
    backgroundColor: '{colors.white}'
    textColor: '{colors.ink}'
    typography: '{typography.control}'
    rounded: '{rounded.control}'
    padding: '0 16px'
    height: '44px'
  button-secondary-hover:
    backgroundColor: '{colors.shell}'
  button-secondary-active:
    backgroundColor: '{colors.sand}'
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
    backgroundColor: '{colors.white}'
    textColor: '{colors.ink}'
    typography: '{typography.control}'
    rounded: '{rounded.card}'
    padding: '0 14px'
    height: '52px'
  status-control-hover:
    backgroundColor: '{colors.shell}'
  status-control-active:
    backgroundColor: '{colors.sand}'
  status-control-add:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.white}'
    typography: '{typography.control}'
    rounded: '{rounded.card}'
    padding: '0 14px'
    height: '52px'
  status-menu:
    backgroundColor: '{colors.white}'
    rounded: '{rounded.float}'
    padding: '6px'
  status-menu-item:
    rounded: '{rounded.control}'
    padding: '0 10px'
    height: '48px'
  status-menu-item-selected:
    backgroundColor: '{colors.shell}'
    rounded: '{rounded.control}'
    padding: '0 10px'
    height: '48px'
  page-header:
    backgroundColor: '{colors.shell}'
    textColor: '{colors.ink}'
    typography: '{typography.display}'
  tag-filter-item:
    textColor: '{colors.muted}'
    typography: '{typography.caption}'
    rounded: '{rounded.card}'
    height: '64px'
  tag-filter-item-active:
    backgroundColor: '{colors.paper}'
    textColor: '{colors.ink}'
    typography: '{typography.caption}'
    rounded: '{rounded.card}'
    height: '64px'
  folder-card:
    backgroundColor: '{colors.white}'
    textColor: '{colors.ink}'
    typography: '{typography.book-title}'
    rounded: '{rounded.card}'
    padding: '12px'
  folder-card-hover:
    backgroundColor: '{colors.shell}'
  folder-link:
    backgroundColor: '{colors.sand}'
    textColor: '{colors.ink}'
    rounded: '{rounded.control}'
    padding: '0 12px'
    height: '44px'
  folder-link-hover:
    backgroundColor: '{colors.sand-deep}'
  nav-bar:
    backgroundColor: '{colors.white}'
    textColor: '{colors.muted}'
    typography: '{typography.caption}'
    height: '64px'
  nav-bar-active:
    textColor: '{colors.ink}'
  toast:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.white}'
    typography: '{typography.body}'
    rounded: '{rounded.float}'
    padding: '4px 4px 4px 16px'
    width: '448px'
  bottom-sheet:
    backgroundColor: '{colors.white}'
    textColor: '{colors.ink}'
    rounded: '{rounded.sheet}'
    width: '512px'
  book-cover-sm:
    rounded: '{rounded.cover}'
    width: '56px'
  book-cover-sm-md:
    rounded: '{rounded.cover}'
    width: '64px'
  book-cover-lg:
    rounded: '{rounded.cover}'
    width: '164px'
  book-cover-lg-short:
    rounded: '{rounded.cover}'
    width: '88px'
  book-cover-lg-md:
    rounded: '{rounded.cover}'
    width: '224px'
  ribbon-nav:
    backgroundColor: '{colors.ribbon}'
    width: '9px'
    height: '10px'
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
    width: '13px'
    height: '36px'
---

# Design System: Goodreads · Prototipo de rediseño

## Overview

**Creative North Star: "Cinta marcapáginas"**

La biblioteca se ve como Goodreads en sus neutros y su tinta, sin color de marca: fondos de papel, títulos serif y portadas reales sin teñir. Sobre esa calma, una cinta con la punta cortada es el único gesto propio. Marca lo activo, lo fijo y el estado de un libro, y nada más. La app es para ordenar libros, así que los controles son estándar y las pantallas se reconocen primero como una herramienta de trabajo.

La densidad es de app, no de página de lectura: márgenes de 16 px, tarjetas compactas y mucha información por pantalla. La jerarquía viene de capas (fondo, banda, tarjeta y menú) con sombra suave. Las portadas ponen casi todo el color de la pantalla; por eso la interfaz casi no lo usa.

Este documento fija tipografía, color, densidad, formas y el gesto de la cinta. Las pantallas, los flujos, los textos y las decisiones D1 a D6 salen de `docs/e2/informe-e2.pdf` y de `PLAN.md`. El orden de autoridad es el informe, después `PLAN.md` y después este documento. **Ante un choque con las 14 reglas de interfaz de `PLAN.md`, ganan las reglas.** Lo que el sistema no cubra se anota como decisión para el CP.

Este sistema se escribió desde lo construido. Las páginas de referencia son Mis libros (`src/features/library/LibraryPage.tsx` y `FolderCard.tsx`) y la ficha (`src/features/book/BookPage.tsx`). Los tokens viven en `src/index.css`, y si este archivo y el código difieren, se corrige este archivo. Los títulos de sección quedan en inglés porque las herramientas de este formato los buscan por su nombre exacto.

**Key Characteristics:**

- Neutros cálidos y tinta, sin color de marca ni acento que tiña la app.
- Una cinta con punta cortada como única marca de lo activo, lo fijo y el estado.
- Títulos en Source Serif 4 semibold e interfaz en Figtree.
- Tags sin relleno: ícono, texto y color, siempre juntos.
- Capas con sombra suave en vez de bordes gruesos.
- Portadas sin teñir, con sombra física.
- Movimiento corto y solo como respuesta a una acción.

## Colors

La paleta es de papel y tinta, con cuatro colores de estado sobrios y una cinta burdeo. La paleta por defecto de Tailwind está borrada: solo existen estos tokens.

### Primary

- **Tinta** (`ink`, #1e1915): texto principal, relleno del botón `primary`, del toast y de "Agregar a Mis libros", anillo de foco y estrellas llenas. Hace el trabajo que en otra app haría un color de marca.
- **Cinta burdeo** (`ribbon`, #7a2334): el relleno de la cinta que marca lo activo y lo fijo. También es el color del cursor de texto (`caret-color`) y uno de los seis fondos de la portada de reemplazo. No se usa para nada más.

### Secondary

Los cuatro colores de estado se usan en el texto y el ícono de `StatusTag`, y en la cinta bajo la portada. Nunca como relleno de una superficie ni solos: siempre van con su ícono y su nombre.

- **Azul Lo quiero** (`want`, #2f4a78), con el ícono `Bookmark`.
- **Ciruela Lo tengo** (`owned`, #6b3a63), con el ícono `Book`.
- **Ámbar Leyendo** (`reading`, #85490f), con el ícono `BookOpen`.
- **Verde Leído** (`read`, #2a6249), con el ícono `CircleCheck`.

### Tertiary

- **Óxido de peligro** (`danger`, #a3341c): solo para la variante `danger` de `Button` y el ícono de `ErrorState`.

### Neutral

- **Papel** (`paper`, #faf8f6): el fondo de la app. También rellena el botón activo de `TagFilter`, que así se abre hacia la página.
- **Concha** (`shell`, #f4f1ea): la banda superior de cada sección, el hover de las tarjetas y la opción actual del menú. También es el `theme-color` del navegador.
- **Blanco** (`white`, #ffffff): tarjetas, barras de navegación, menú y panel.
- **Arena** (`sand`, #ebe2d7): enlaces a carpetas, estado presionado de los controles blancos, botón deshabilitado, esqueletos de carga y selección de texto.
- **Arena profunda** (`sand-deep`, #dfd3c4): solo el hover y la presión de los enlaces a carpetas.
- **Línea** (`line`, #e9e2d8): separadores de 1 px entre filas, en el panel y bajo las barras. Es decorativa (1,21:1 sobre papel), así que nunca es la única señal de un control o un estado.
- **Neutro** (`muted`, #5f564d): texto secundario, secciones inactivas, íconos y estrellas vacías.

### Contrastes medidos

Calculados con la fórmula WCAG de `src/components/statusStyles.test.ts` sobre los tokens reales. Ese test vigila las columnas de blanco a arena; la columna de arena profunda y los estados con transparencia se calcularon aparte para este documento.

| Texto sobre | `white` | `paper` | `shell` | `sand` | `sand-deep` |
| ----------- | ------- | ------- | ------- | ------ | ----------- |
| `ink`       | 17,43   | 16,45   | 15,45   | 13,60  | 11,83       |
| `muted`     | 7,18    | 6,78    | 6,37    | 5,60   | 4,87        |
| `want`      | 8,85    | 8,36    | 7,85    | 6,91   | 6,01        |
| `owned`     | 8,71    | 8,22    | 7,72    | 6,80   | 5,91        |
| `reading`   | 7,10    | 6,70    | 6,30    | 5,54   | 4,82        |
| `read`      | 7,14    | 6,74    | 6,33    | 5,57   | 4,84        |
| `danger`    | 6,85    | 6,47    | 6,07    | 5,35   | 4,65        |

| Texto en controles llenos                        | Contraste    |
| ------------------------------------------------ | ------------ |
| Blanco sobre `ink`                               | 17,43        |
| Blanco sobre `ink` al 90 % y al 80 %             | 13,06 y 9,20 |
| Blanco sobre `danger`                            | 6,85         |
| Blanco sobre `danger` al 90 % y al 80 %          | 5,61 y 4,54  |
| `shell` sobre `ink` (Deshacer)                   | 15,45        |
| `shell` sobre `ink` con blanco al 10 % y al 20 % | 11,57 y 8,15 |
| `muted` sobre `sand` (botón deshabilitado)       | 5,60         |

Los valores con transparencia son el peor caso, sobre blanco. El mínimo de toda la tabla es 4,54:1, en `danger` presionado. Las cintas de los cuatro estados y la burdeo superan 4,6:1 sobre todos los fondos, por encima del 3:1 que pide una marca gráfica. Los seis fondos de la portada de reemplazo dan 7,10:1 o más con las iniciales blancas.

### Named Rules

**La regla sin acento.** Ningún color tiñe la app. Encabezados, enlaces y botones se resuelven con tinta y neutros; el color vive en las portadas, los tags y las cintas.

**La regla del tag sin relleno.** Un estado es ícono, texto y color, nunca una píldora de color. Esta regla existe para que una lista de veinte libros no compita con sus portadas.

**La regla de las estrellas de tinta.** Las estrellas son de tinta y las vacías son de neutro. No hay naranja en esta paleta.

## Typography

**Display Font:** Source Serif 4 (con Georgia y serif)
**Body Font:** Figtree (con ui-sans-serif, system-ui y sans-serif)

**Character:** una serif de libro con eje óptico para lo que se lee como título, y una sans redonda y clara para todo lo que se opera. Ambas son libres y están alojadas en `src/assets/fonts/`.

### Hierarchy

- **Display** (600, 34 px, 40 px de línea, tracking -0,025 em): el h1 de cada sección, en `PageHeader`. También el título de la ficha desde 768 px.
- **Title** (600, 28 px, 34 px de línea, tracking -0,025 em): el título de la ficha en celular.
- **Heading** (600, 22 px, 28 px de línea): títulos de sección dentro de la página, como "Mis carpetas". También el título de la ficha en pantallas bajas, ahí con tracking -0,025 em.
- **Subheading** (600, 20 px, 28 px de línea): títulos de `BottomSheet`, `EmptyState` y `ErrorState`, y la cantidad de cada botón de `TagFilter`, con cifras tabulares.
- **Book title** (600, 18 px): el nombre de un libro en `BookRow` (línea 1,375, máximo dos líneas) y el de una carpeta en `FolderCard` (línea de 28 px).
- **Body** (400, 16 px, 24 px de línea): texto de lectura y datos del libro. La descripción de la ficha se limita a 34 rem (544 px).
- **Control** (600, 16 px, 24 px de línea): botones y `StatusTag` en tamaño normal. Las navegaciones y los enlaces de volver y de carpeta usan 500. La sección activa usa 700.
- **Small** (400, 14 px, 20 px de línea): subtítulo de la banda, autores y cantidades.
- **Small label** (600, 14 px, 20 px de línea): `StatusTag` en listas, y títulos de bloque de la ficha, como "Carpetas" y "Sobre este libro", en `muted`.
- **Caption** (500, 12 px, 16 px de línea): etiquetas de la barra inferior y de `TagFilter`, que pasan a 700 cuando están activas.

Todo `h1`, `h2` y `h3` usa `text-wrap: balance`.

### Named Rules

**La regla de la serif que nombra.** La serif es para lo que nombra: secciones, libros, carpetas, la marca y las cantidades de `TagFilter`. Lo que se opera o se explica va en Figtree.

**La regla de la escala cerrada.** Usa solo los tamaños de esta lista. La única excepción son las iniciales de la portada de reemplazo, que crecen con la portada. No hay texto en mayúsculas sostenidas ni tamaños sueltos en el código.

## Layout

El diseño parte del celular. El contenido vive en una columna centrada de hasta 1040 px (`max-w-app`) con márgenes de 16 px, y la app no tiene barra lateral.

- **Puntos de quiebre:** `md` (768 px) cambia de barra inferior a barra superior y convierte el panel inferior en modal. `lg` (1024 px) solo agranda el espacio de la barra superior y pasa el tablero de carpetas a 5 columnas. `short` (alto de hasta 640 px y ancho menor a 768 px) reordena la ficha para que el menú quepa sin hacer scroll.
- **Banda:** `PageHeader` llena todo el ancho de la pantalla con `shell`, gracias a `full-bleed`, y deja el texto alineado con la columna. Cada sección parte con esta banda.
- **Espacio bajo el contenido:** `main` deja 144 px abajo en celular, para la barra y el toast, y 48 px desde `md`.
- **Ritmo vertical:** 20 px entre bloques, 12 px bajo un título de sección y 4 px entre un título de bloque de la ficha y su contenido.
- **Tablero de tarjetas:** 2 columnas con 10 px de separación en celular, 4 columnas con 16 px desde `md` y 5 desde `lg`.
- **Listas de libros:** una columna de `BookRow` en celular y dos desde `md`, con 32 px entre columnas. Cada fila va en un `li` con `border-b border-line last:border-b-0`, como en `TagList` de `LibraryPage.tsx`. Esa lista es local: la carpeta debe repetir esas clases.
- **Ficha:**
  - **Celular:** portada centrada de 164 px en una banda `shell`, seguida del título centrado y el control a todo el ancho.
  - **Pantalla baja:** la portada baja a 88 px, va junto al título en una columna de 5,5 rem y la banda se vuelve transparente.
  - **Desde 768 px:** dos columnas, con una columna de hasta 17 rem para la portada de 224 px, sobre un bloque `shell` con radio de tarjeta. El título queda a la izquierda, y el control y la descripción llegan a 34 rem.
- **Áreas táctiles:** 44 px como mínimo en todo control. Las barras y `TagFilter` miden 64 px de alto, y las opciones del menú 48 px. Las capturas actuales dan 62 × 64 px como mínimo en la barra a 320 px de ancho, sin etiquetas cortadas ni scroll horizontal en ninguno de los cuatro dispositivos.

## Elevation & Depth

El sistema se ordena por capas de fondo y sombras suaves teñidas de tinta, nunca negras. `paper` es el piso, `shell` marca la banda, `white` con `shadow-card` es lo que se toca y `shadow-float` es lo que flota sobre la página. Las barras no usan sombra difusa: las separa una línea de 1 px hecha con `box-shadow` en color `line`.

### Shadow Vocabulary

- **Tarjeta** (`--shadow-card`: `0 1px 2px rgb(30 25 21 / 7%), 0 3px 10px -5px rgb(30 25 21 / 14%)`): tarjetas de carpeta, `Button` y `StatusControl`.
- **Flotante** (`--shadow-float`: `0 2px 4px rgb(30 25 21 / 14%), 0 18px 34px -8px rgb(30 25 21 / 40%)`): menú de `StatusControl`, toast y `BottomSheet`.
- **Libro** (`--shadow-book`: `0 1px 1px rgb(30 25 21 / 20%), 0 6px 12px -5px rgb(30 25 21 / 35%)`): portadas en tamaños `sm` y `fill`.
- **Libro grande** (`--shadow-book-lg`: `0 2px 3px rgb(30 25 21 / 22%), 0 16px 26px -10px rgb(30 25 21 / 50%)`): la portada `lg` de la ficha.

### Named Rules

**La regla de la presión.** Lo que se toca baja 1 px y pierde su sombra al presionarlo. Las tarjetas, `Button` y `StatusControl` lo hacen en 100 ms.

**La regla del libro físico.** Solo las portadas usan sombras de libro. Son objetos, no tarjetas.

## Shapes

La forma es de papelería: esquinas apenas redondeadas que crecen con la altura de la capa.

- **Portada** (2 px en el lomo y 3 px en el borde exterior): portadas, sus huecos en `FolderCard` y sus esqueletos en `LoadingState`. Una banda de 8 px con degradado de tinta al 15 % dibuja la bisagra del libro y separa las portadas claras del fondo.
- **Control** (6 px): botones, enlaces a carpetas y opciones del menú.
- **Tarjeta** (8 px): tarjetas de carpeta, `StatusControl` y bloque de portada de la ficha. Solo arriba en `TagFilter`, para que parezca una pestaña.
- **Flotante** (10 px): menú y toast. También `BottomSheet` como modal desde `md`.
- **Panel** (16 px, solo arriba): `BottomSheet` en celular.
- **Cinta:** rectángulo con muesca en V, con `clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 76%, 0 100%)`. Se dibuja solo con `Ribbon`.

No hay formas de píldora ni círculos en lo construido.

## Components

Importa todo desde `src/components/`. Son del bloque base: si necesitas cambiar uno, se hace en un commit aparte y avisando al otro rol.

### Qué usar para cada necesidad

| Necesidad                                          | Usa                                                                                      |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Navegación principal y contenedor de la página     | `AppShell`, que ya envuelve las rutas; no agregues otra barra                            |
| Comienzo de una sección, con título y volver       | `PageHeader`, con `backTo` y `backLabel` en subpáginas                                   |
| Volver desde una página sin `PageHeader`           | `BackLink`, siempre a una ruta fija, junto a `Wordmark`, como en la ficha                |
| Filtrar por tag con la cantidad de cada uno        | `TagFilter`, como hijo de `PageHeader`                                                   |
| Mostrar un libro en una lista                      | `BookRow`; la acción extra, como "Quitar", va en `trailing`                              |
| Mostrar una portada suelta                         | `BookCover`: `sm` para listas, `fill` para grillas y `lg` para la ficha                  |
| Mostrar el estado de un libro, sin cambiarlo       | `StatusTag`; en listas, `size="sm"`                                                      |
| Cambiar o agregar el tag de un libro               | `StatusControl`, y no otro control. Recibe `book` si el libro puede no estar en el store |
| Mostrar o elegir un puntaje                        | `Stars`; con `onChange` es un campo                                                      |
| Acción con botón                                   | `Button`: `primary`, `secondary` o `danger`                                              |
| Contenido largo o un formulario                    | `BottomSheet`                                                                            |
| Confirmar después de un cambio y permitir deshacer | El toast del store, que `AppShell` ya muestra; no montes otro                            |
| Lista vacía o sin resultados                       | `EmptyState`, con ícono, título, descripción y acción opcional                           |
| Esperar resultados                                 | `LoadingState`                                                                           |
| Algo falló                                         | `ErrorState`, con `onRetry` si se puede reintentar                                       |
| Enlaces a un libro o una carpeta                   | `bookPath` y `folderPath`                                                                |

### Pantallas pendientes

Esto dice qué piezas existen para cada pantalla. Su contenido y sus textos salen de `PLAN.md`.

| Pantalla  | Piezas existentes                                                               | Sin componente todavía                     |
| --------- | ------------------------------------------------------------------------------- | ------------------------------------------ |
| Carpeta   | `PageHeader` con `backTo` y `TagFilter`, `BookRow`, `EmptyState`, `BottomSheet` | Buscador interno                           |
| Inicio    | `PageHeader`, `BookCover`, `StatusTag`, `EmptyState`                            | Tarjeta "Leyendo ahora", fila de actividad |
| Descubrir | `PageHeader`, `BookCover` con `fill`; título de sección en Heading              | Tarjeta de libro para las secciones        |
| Buscar    | `PageHeader`, `BookRow`, `LoadingState`, `EmptyState`, `ErrorState`             | Campo de búsqueda                          |
| Más       | `PageHeader`                                                                    | Fila de enlace                             |
| Amigos    | `PageHeader`, `Button`, `EmptyState`, `LoadingState`, `ErrorState`              | Campo de búsqueda, avatar, fila de persona |
| Persona   | `PageHeader` con `backTo`, `BookRow`, `Button`                                  | Avatar                                     |
| Mi perfil | `PageHeader`, `Button` con `danger`, `BottomSheet` para la confirmación         | Avatar                                     |

Usar `BottomSheet` para confirmar es una inferencia de este documento: el plan pide confirmación, pero no dice con qué pieza. Conviene revisarlo en el CP.

Tampoco existen todavía el aviso de D5, los campos de fecha, el selector de carpetas ni un menú anclado genérico. **Lo que no está en `src/components/` no tiene aspecto definido.** Arma lo que falte solo con estos tokens, respeta las 14 reglas y anótalo como decisión para el CP. Una pieza que dos pantallas necesiten se propone como compartida, para que los dos roles no construyan versiones distintas. Los campos de texto ya heredan el foco global, el acento de tinta (`accent-color`) y el cursor burdeo. `FolderCard` es de `src/features/library/`: sirve de modelo para una tarjeta, pero no es un componente compartido.

### Cinta

La firma del sistema. `Ribbon` es decorativo y lleva `aria-hidden`: lo que marca también debe decirse con texto, peso o `aria-current`.

- **Lo activo, en burdeo:** la sección de la barra (9 × 10 px, colgando del borde superior) y el botón activo de `TagFilter` (9 × 12 px). `AppShell` y `TagFilter` ya la dibujan.
- **Lo fijo, en burdeo:** la carpeta fija, en la esquina superior derecha de su tarjeta (9 × 26 px, a 10 px del borde), siempre con el texto "· fija".
- **El estado de un libro, en su color:** sale por debajo de la portada, detrás de ella. `BookCover` la dibuja al recibir `status`: 7 × 16 px en `sm`, 10 × 24 px en `fill` y 13 × 36 px en `lg`. Pásale `status` solo si el libro está en la biblioteca.
- **El gesto:** al elegir un tag, el texto nuevo entra en 180 ms (`animate-tag-in`) y la cinta nueva baja desde detrás de la portada en 220 ms (`animate-ribbon-in`). Con reducir movimiento, el cambio es instantáneo.

**La regla de la cinta.** La cinta marca solo lo activo, lo fijo o el estado de un libro. No decora títulos, no separa secciones y no destaca novedades, recomendaciones ni llamados a la acción.

**La regla de una por grupo.** Dentro de un grupo de opciones hay una sola cinta activa. Una pantalla puede tener varias cintas porque cada una responde a una pregunta distinta: dónde estoy, qué filtro uso, qué carpeta es fija y en qué estado va cada libro.

**La regla del burdeo y el estado.** El burdeo significa activo o fijo. Una cinta de estado usa siempre el color de su tag y nunca burdeo.

### Menú anclado o panel inferior

**La regla del cambio rápido.** Un cambio rápido y reversible, con pocas opciones, se resuelve en un menú anclado junto al control. El contenido largo o un formulario va en un panel. Elegir un tag nunca abre un panel ni un modal.

| Pregunta   | Menú anclado                                                         | Panel inferior                                               |
| ---------- | -------------------------------------------------------------------- | ------------------------------------------------------------ |
| Componente | Solo dentro de `StatusControl`                                       | `BottomSheet`                                                |
| Para qué   | Cambiar o agregar el tag de un libro                                 | Contenido largo, como "Editar lectura", y las confirmaciones |
| Se aplica  | Al elegir, sin botón de guardar                                      | Con un botón al pie, en `footer`                             |
| Fondo      | La página sigue visible y sin oscurecer                              | Oscurece con `ink` al 40 % y bloquea el scroll               |
| Posición   | Pegado al control, a 6 px, y del mismo ancho                         | Abajo en celular y modal centrado de 512 px desde `md`       |
| Altura     | Cuatro opciones de 48 px, 204 px en total                            | Hasta 85 % de la pantalla, con scroll interno                |
| Teclado    | Foco en la opción actual, flechas, Inicio, Fin, Escape y clic afuera | Foco atrapado, Escape, y el foco vuelve al control           |

- **Dónde abre el menú:** debajo del control siempre que pueda, porque arriba taparía el libro. Si no cabe, la página hace scroll primero. Solo abre hacia arriba cuando la página ya no puede moverse.
- **Toast y panel:** mientras el panel está abierto, el toast no se puede tocar. Quien guarde un cambio en la biblioteca debe cerrar también el panel, para que Deshacer quede disponible.
- **Pie del panel:** Cancelar y un solo botón `primary`, salvo cuando la acción sea destructiva, que usa `danger`.

`BottomSheet` todavía no aparece en una pantalla real: su aspecto sale del código, no de una captura.

### Buttons

Sobrios y estándar, con un solo llamado por pantalla o panel.

- **Shape:** esquinas de control (6 px), 44 px de alto, 16 px de relleno lateral y texto Control. El ícono mide 18 px y va antes del texto. Nunca hay botones de solo ícono.
- **Primary:** relleno de tinta con texto blanco. Al pasar el cursor baja al 90 % y al presionar al 80 %.
- **Secondary:** tarjeta blanca con texto de tinta. Al pasar el cursor pasa a `shell` y al presionar, a `sand`. Es la variante por defecto.
- **Danger:** relleno `danger` con texto blanco, con el mismo comportamiento que `primary`. Es para lo destructivo que pide confirmación, como Reiniciar demo y eliminar carpeta.
- **Disabled:** relleno `sand`, texto `muted`, sin sombra.
- **Pares:** "Sí" y "No", o agregar y quitar, usan la misma variante, para cumplir la regla 11.

`StatusControl` lleno de tinta ("Agregar a Mis libros") cuenta como el botón principal de la pantalla. Hasta ahora, `Button` solo aparece dentro de `ErrorState`, así que su aspecto sale del código y no de una captura.

### StatusControl

La tarjeta del tag en la ficha, a todo el ancho y de 52 px de alto. A la izquierda va `StatusTag` y a la derecha el lápiz con "Cambiar". Es blanca con `shadow-card`, con hover `shell` y presión `sand`. Si el libro no está en la biblioteca, se llena de tinta con un más y "Agregar a Mis libros", y abre el mismo menú. El menú es una capa `float` blanca con 6 px de relleno. La opción actual tiene fondo `shell` y un check con "Actual". Aparece en 150 ms con un desplazamiento de 4 px y se aplica de inmediato. "Leído" se elige aquí mismo, sin pasos intermedios.

### StatusTag

Ícono, texto y color, sin fondo. `md` usa ícono de 18 px y texto de 16 px. `sm` usa ícono de 14 px y texto de 14 px. Peso 600 en ambos.

### TagFilter

Cinco botones iguales en una grilla, de 64 px de alto y hasta 512 px de ancho total desde `md`: cantidad en Subheading y etiqueta en Caption. El activo toma el fondo `paper`, peso 700 y la cinta burdeo, y se abre hacia la página como una pestaña. Por eso va en el borde inferior de la banda, como hijo de `PageHeader`. No usa los colores de estado.

### Stars

Estrellas de 14 px para mostrar un puntaje y de 28 px, en áreas de 44 px, cuando son un campo. La llena es de tinta y la vacía tiene contorno `muted`. El puntaje siempre es opcional: el campo ofrece "Quitar puntaje".

### Cards / Containers

- **Corner Style:** tarjeta (8 px).
- **Background:** blanco, con hover `shell` si toda la tarjeta es un enlace.
- **Shadow Strategy:** `shadow-card`, que desaparece al presionar. Nunca una tarjeta dentro de otra.
- **Border:** ninguno.
- **Internal Padding:** 12 px.

`FolderCard` es la tarjeta de referencia: dos portadas con 6 px de separación, nombre serif a 10 px y cantidad en Small. Si falta una portada, su hueco se rellena con `shell`.

### BookRow

Portada `sm` (56 px, 64 px desde `md`) con su cinta, y a 14 px el título, el `StatusTag` junto al autor, y las estrellas si tiene puntaje. Toda la fila abre la ficha y recuerda de qué lista se viene. Solo muestra una respuesta al presionar, con fondo `shell`.

### BookCover

Las portadas no se tiñen ni se recortan en la ficha: `lg` conserva la proporción real de la imagen dentro de una caja de 2:3, para que nada salte al cargar. Si falta la imagen, muestra las iniciales blancas sobre uno de seis fondos, elegido por el id del libro. Ese fondo no significa nada. Es decorativa: el título siempre va escrito al lado.

### Chips

El único chip construido es el enlace a una carpeta en la ficha, hoy local en `BookPage.tsx`: fondo `sand`, 44 px de alto, 6 px de radio, peso 500. Hover y presión en `sand-deep`. Es un lugar, no un estado: no lleva cinta ni color de tag.

### Navigation

- **Celular:** `AppShell` fija una barra blanca abajo, de 64 px más el área segura, con cinco secciones repartidas por igual, ícono de 22 px y etiqueta Caption.
- **Desde `md`:** barra superior fija, blanca, de 64 px, con "Goodreads" en serif, "Prototipo de rediseño" e íconos de 20 px.
- **Estados:** la sección activa es de tinta, con peso 700 y cinta. Las demás son `muted` con peso 500 y pasan a tinta con el cursor. "Más" sigue activa en Amigos y Mi perfil.
- **Marca en celular:** `PageHeader` y la ficha muestran `Wordmark`, porque no hay barra superior. Si a `PageHeader` le pasas `action`, el `Wordmark` no aparece: en esa pantalla el aviso de prototipo se pierde en celular.

### Toast

Una capa de tinta de hasta 448 px, centrada, con radio `float` y `shadow-float`. Queda sobre la barra inferior en celular y a 24 px del borde desde `md`. Entra en 200 ms. Deshacer va con ícono y texto en `shell`. Dura 5 s y se detiene mientras el cursor o el foco están encima.

### Estados de pantalla

`EmptyState` y `ErrorState` centran un ícono de 32 px con trazo 1,5, un título Subheading y una descripción `muted`. El ícono de error va en `danger`. `LoadingState` dibuja tres filas de esqueleto en `sand` con la forma de `BookRow`, para que la página no salte, y pulsa solo si la persona no pidió reducir movimiento.

### Movimiento

Una sola curva, `--ease-quick` (`cubic-bezier(0.16, 1, 0.3, 1)`). Respuestas al tacto en 100 ms, menú en 150 ms, tag en 180 ms, toast en 200 ms y cinta en 220 ms. `src/index.css` reduce todo a 1 ms con `prefers-reduced-motion`.

### Foco

Un solo estilo: contorno de 2 px de tinta a 2 px de distancia, definido de forma global. No lo reemplaces ni lo quites. Solo el toast lo cambia a blanco, por su fondo oscuro, y las opciones del menú lo dibujan hacia adentro.

## Do's and Don'ts

### Do:

- **Do** parte cada sección con `PageHeader`, salvo la ficha, que usa su propia banda.
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
- **Don't** abras un panel o un modal para cambiar un tag.
- **Don't** agregues un "¿Estás seguro?" a lo reversible: se resuelve con Deshacer.
- **Don't** pongas más de un `primary` por pantalla o panel; "Agregar a Mis libros" también cuenta.
- **Don't** apiles tarjetas dentro de tarjetas ni uses bordes de 2 px para separar capas.
- **Don't** escribas colores, tamaños o sombras sueltos en una pantalla, ni uses la paleta por defecto de Tailwind, que no existe.
- **Don't** copies "Disponible pronto" como patrón: son textos temporales de las pantallas pendientes.
- **Don't** muestres la palabra "tag" en la interfaz: cada uno se llama por su nombre.
