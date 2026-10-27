# Prototipo E2 · Grupo 2 · Goodreads

Prototipo web responsivo (celular y computador) para las 3 tareas de la E2: terminar un libro (T1), ordenar los pendientes (T2) y agregar un amigo (T3). Es una app solo de frontend: los datos parten de un seed y se guardan en `localStorage`. **Reiniciar demo**, en Perfil, vuelve al estado inicial.

El plan completo, con las decisiones técnicas y el reparto, está en [`PLAN.md`](PLAN.md). Las reglas de interfaz están en [`docs/conceptos-hci.md`](docs/conceptos-hci.md).

## Requisitos

- Node 22 (`nvm use` lee `.nvmrc`).

## Comandos

```bash
npm install
npm run dev           # servidor de desarrollo
npm run build         # chequeo de tipos + build; tiene que pasar antes de cada merge
npm run lint          # oxlint
npm test              # Vitest: store, fechas, seed, componentes y rutas
npm run format        # Prettier sobre todo el repo
npm run format:check  # solo revisa el formato
```

## Tests

Cada test va junto al código que prueba (`*.test.ts` o `*.test.tsx`). `src/test/setup.ts` reinicia el store con `resetDemo()` antes de cada test y limpia el DOM, los timers falsos y los mocks después, así que ningún test depende de otro. Ayudas en `src/test/`:

- `state()`: el estado actual del store.
- `stubAction('nombreDeAccion')`: reemplaza una acción por un mock solo durante ese test, para revisar qué llama un componente.
- `renderWithRouter(ui, { route, path })` y `currentLocation()`: montan un componente en una ruta y dicen a qué URL navegó.
- `renderApp(path)`: monta la app completa, con `AppShell`, en una URL.

`src/routes.test.tsx` falla si se agrega una ruta sin agregarle una URL de ejemplo.

**Tests que revisan tus páginas.** `src/routes.test.tsx` monta cada ruta (también `?accion=terminar` y las pestañas de Buscar) y exige que cada página:

- tenga exactamente un `h1`;
- se muestre dentro del `AppShell`, con la navegación "Principal";
- no llame a `console.error`, lo que incluye las advertencias de `act()` de React.

Si una página carga algo de forma asíncrona (por ejemplo `fetchWork` o la búsqueda con espera), se prueba en su propio test con `findBy*` o `waitFor`; no se relaja el test de rutas.

`src/test/setup.ts` agrega a jsdom lo mínimo de `<dialog>` (`showModal` y `close`), así que un `BottomSheet` abierto funciona en los tests.

## Catálogo de libros

`src/data/books.json` y las portadas de `public/covers/` se generan una vez desde Open Library y quedan en el repo, así que la app no depende de Open Library para partir.

```bash
node scripts/seed-books.mjs
npm test
```

- La lista de libros (título y autor originales) está en `CATALOG`, dentro del script. Si la búsqueda devuelve otra obra, se fija su clave con `id`.
- Los títulos o autores que llegan en el idioma original o con ruido se corrigen en `OVERRIDES`, por clave de obra.
- Solo se guardan las descripciones que vienen en español; el resto queda sin descripción.
- Las portadas ya descargadas no se vuelven a bajar. Para refrescarlas, borrar `public/covers/` antes de correr el script.
- Si cambian los ids, hay que revisar `src/data/seedLibrary.ts` y `src/data/users.json`; `npm test` avisa si alguno apunta a un libro que no existe.

## Quién toca qué

| Carpeta o archivo                                                                                                         | Dueño                                    |
| ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `src/store/index.ts`, `coreSlice.ts`, `src/components/`, `routes.tsx`, `lib/dates.ts`, `index.css`                        | Bloque base (avisar antes de cambiarlos) |
| `src/types.ts`, `src/lib/status.ts`, `src/data/books.json`, `scripts/seed-books.mjs`, `src/test/`                         | Bloque base (avisar antes de cambiarlos) |
| `src/features/library/`, `src/features/book/`, `librarySlice.ts`, `src/data/seedLibrary.ts`                               | Rol A · Biblioteca                       |
| `src/features/home/`, `search/`, `friends/`, `profile/`, `socialSlice.ts`, `lib/openlibrary.ts`, `src/data/seedSocial.ts` | Rol B · Social y búsqueda                |
| `src/data/users.json`                                                                                                     | Rol B · Social y búsqueda                |

`src/data/seed.test.ts`: quien cambia un seed actualiza su bloque `describe` (biblioteca: Rol A; social: Rol B).

El detalle está en `PLAN.md`, sección 3 ("Store: archivos y dueños") y sección 4 ("Reparto").

## Contratos del bloque base

- **Datos de un libro:** `useStore(selectBook(bookId))` (de `src/store`). No llamar durante el render a un `getBook` sacado del store: su referencia nunca cambia, así que el componente no se vuelve a dibujar cuando `upsertBook` agrega el libro.
- **Entrada de un libro:** `useStore(selectEntry(bookId))` (de `src/store`), que devuelve `undefined` si el libro no está en la biblioteca. No usar `state.library[id]`: su tipo nunca incluye `undefined` y un id como `constructor` encuentra una clave heredada.
- **Libros de la API:** `BookRow` hace `upsertBook(book)` antes de abrir la ficha o de cambiar el estado, así que un resultado de búsqueda se puede mostrar tal cual. Fuera de `BookRow`, pasar `book` a `StatusControl` o llamar a `upsertBook` antes. `setStatus` ignora los ids que `getBook` no conoce.
- **Salir de "Leído":** `setStatus` quita `finishedAt` y `rating`; Deshacer los recupera. Pasar de "Leído" a "Leyendo" es una relectura, así que `startedAt` pasa a ser `today()`.
- **"Leído" para un libro fuera de la biblioteca** (por ejemplo, un resultado de búsqueda): `finishBook` crea la entrada (`owned: false`, `folderIds: []`, `addedAt: today()`) antes de dejarla en `read`. Sin entrada, el panel "Terminé este libro" propone `today()` como fecha de inicio.
- **Versión de `localStorage`:** quien cambia un seed sube la constante de su archivo (`LIBRARY_SEED_VERSION` en `seedLibrary.ts`, `SOCIAL_SEED_VERSION` en `seedSocial.ts`). `src/store/index.ts` las suma, así que no hay que editarlo, y los navegadores con datos guardados del seed anterior vuelven a partir del nuevo.
- **Seeds como funciones:** `seedLibrary.ts` y `seedSocial.ts` exportan `buildInitialLibrary()`, `buildInitialFolders()`, `buildInitialFriendships()` y `buildInitialActivities()`, que el store llama al partir y en cada **Reiniciar demo**. Así las fechas siempre se cuentan desde hoy y cada reinicio entrega objetos nuevos. Un dato nuevo del seed que dependa de la fecha va dentro de una de esas funciones, no en una constante del módulo.
- **Toast:** el temporizador de 5 s se detiene mientras el toast tiene el mouse encima o el foco, y vuelve a partir de cero al salir. Un toque en pantalla táctil no lo detiene.
- **Mantener presionada una fila:** `BookRow` acepta `onLongPress`, que se llama tras 500 ms sin mover el dedo (por ejemplo, para entrar a la selección múltiple, D6). El clic que termina la presión no abre el libro.
- **`BottomSheet` y el toast:** mientras el panel está abierto, el resto de la página (incluido el toast) queda inerte. El handler que hace un cambio en la biblioteca también cierra el panel, para que Deshacer se pueda tocar.

## Datos para las tareas

Todo parte desde **Reiniciar demo**. La persona que usa la app es **Alex Muñoz** (@alexlee, código `LEE-1024`).

### T1 · Terminar un libro

- **Libro:** _El hombre que confundió a su mujer con un sombrero_, de Oliver Sacks (`/libro/OL1811898W`).
- Está en "Leyendo" desde hace 12 días. El otro libro en "Leyendo" es _Dune_ (hace 30 días).

### T2 · Ordenar los pendientes

"Quiero" tiene estos 22 libros. "Próximos" ya trae 2: _Nuestra parte de noche_ y _La sombra del viento_.

| Libro                              | Autor                | Carpetas         |
| ---------------------------------- | -------------------- | ---------------- |
| It                                 | Stephen King         | Terror           |
| Cementerio de animales             | Stephen King         | Terror           |
| Carrie                             | Stephen King         | Terror           |
| Drácula                            | Bram Stoker          | Terror           |
| Frankenstein o el moderno Prometeo | Mary Shelley         | Terror           |
| La maldición de Hill House         | Shirley Jackson      | Terror           |
| Gótico                             | Silvia Moreno-Garcia | Terror           |
| Nuestra parte de noche             | Mariana Enríquez     | Próximos, Terror |
| El exorcista                       | William Peter Blatty | Terror           |
| Rayuela                            | Julio Cortázar       | Novela           |
| La sombra del viento               | Carlos Ruiz Zafón    | Próximos, Novela |
| Los detectives salvajes            | Roberto Bolaño       | Novela           |
| Crimen y castigo                   | Fiódor Dostoievski   | Novela           |
| Orgullo y prejuicio                | Jane Austen          | Novela           |
| Fundación                          | Isaac Asimov         | Ciencia ficción  |
| Neuromante                         | William Gibson       | Ciencia ficción  |
| El problema de los tres cuerpos    | Liu Cixin            | Ciencia ficción  |
| Un mundo feliz                     | Aldous Huxley        | Ciencia ficción  |
| El cuento de la criada             | Margaret Atwood      | Ciencia ficción  |
| Sapiens. De animales a dioses      | Yuval Noah Harari    | Regalos          |
| Breve historia del tiempo          | Stephen Hawking      | —                |
| Hábitos atómicos                   | James Clear          | —                |

Propuesta para las instrucciones de la E3:

- **Mover a "Próximos":** _Fundación_, _Rayuela_ y _El problema de los tres cuerpos_.
- **Quitar de la biblioteca:** _Hábitos atómicos_ y _Cementerio de animales_.

### T3 · Agregar un amigo

- **Persona:** **Camila Torres**, **@camitorres**, código **`LEE-4821`**, 3 amigos en común. Todavía no es amiga.
- **Homónimo para distinguir:** Camila Torres, @ctorres_99, 0 amigos en común y otro color de avatar.
- Amigos de Alex al partir: Diego Fuentes (@diegolee), Valentina Soto (@valelee) y Tomás Rojas (@tomasreads).
