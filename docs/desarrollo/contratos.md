# Contratos y dueños de archivos

Lo que hay que saber antes de tocar código compartido. El porqué de cada decisión está en [`PLAN.md`](../../PLAN.md).

## Quién toca qué

| Carpeta o archivo                                                                                                         | Dueño                                    |
| ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `src/store/index.ts`, `coreSlice.ts`, `src/components/`, `routes.tsx`, `lib/dates.ts`, `index.css`                        | Bloque base (avisar antes de cambiarlos) |
| `src/types.ts`, `src/lib/status.ts`, `src/data/books.json`, `scripts/seed-books.mjs`, `src/test/`, `DESIGN.md`            | Bloque base (avisar antes de cambiarlos) |
| `src/features/library/`, `src/features/book/`, `librarySlice.ts`, `src/data/seedLibrary.ts`                               | Rol A · Biblioteca                       |
| `src/features/home/`, `search/`, `discover/`, `more/`, `friends/`, `profile/`, `socialSlice.ts`, `lib/openlibrary.ts`     | Rol B · Social y búsqueda                |
| `src/data/seedSocial.ts`, `src/data/seedDiscover.ts`, `src/data/users.json`                                               | Rol B · Social y búsqueda                |

`src/data/seed.test.ts`: quien cambia un seed actualiza su bloque `describe` (biblioteca: Rol A; social: Rol B).

El detalle está en [`PLAN.md`](../../PLAN.md), sección 3 ("Store: archivos y dueños") y sección 4 ("Reparto").

## Contratos del bloque base

- **Datos de un libro:** `useStore(selectBook(bookId))` (de `src/store`). No llamar durante el render a un `getBook` sacado del store: su referencia nunca cambia, así que el componente no se vuelve a dibujar cuando `upsertBook` agrega el libro.
- **Entrada de un libro:** `useStore(selectEntry(bookId))` (de `src/store`), que devuelve `undefined` si el libro no está en la biblioteca. No usar `state.library[id]`: su tipo nunca incluye `undefined` y un id como `constructor` encuentra una clave heredada.
- **Libros de la API:** `BookRow` hace `upsertBook(book)` antes de abrir la ficha, así que un resultado de búsqueda se puede mostrar tal cual. Fuera de `BookRow`, pasar `book` a `StatusControl` o llamar a `upsertBook` antes. `setStatus` ignora los ids que `getBook` no conoce.
- **Salir de "Leído":** `setStatus` quita `finishedAt` y `rating`; Deshacer los recupera. Pasar de "Leído" a "Leyendo" es una relectura, así que `startedAt` pasa a ser `today()`.
- **"Leído" para un libro fuera de la biblioteca** (por ejemplo, un resultado de búsqueda): `finishBook` crea la entrada (`folderIds: []`, `addedAt: today()`) antes de dejarla en `read`. Sin entrada, `StatusControl` usa `today()` como fecha de inicio.
- **Volver a "Lo quiero":** `setStatus` deja `wantCheckedAt = today()`, para que el aviso de D5 no pregunte por un libro que la persona acaba de elegir.
- **Versión de `localStorage`:** quien cambia un seed sube la constante de su archivo (`LIBRARY_SEED_VERSION` en `seedLibrary.ts`, `SOCIAL_SEED_VERSION` en `seedSocial.ts`). `src/store/index.ts` las suma, así que no hay que editarlo, y los navegadores con datos guardados del seed anterior vuelven a partir del nuevo.
- **Seeds como funciones:** `seedLibrary.ts` y `seedSocial.ts` exportan `buildInitialLibrary()`, `buildInitialFolders()`, `buildInitialFriendships()` y `buildInitialActivities()`, que el store llama al partir y en cada **Reiniciar demo**. Así las fechas siempre se cuentan desde hoy y cada reinicio entrega objetos nuevos. Un dato nuevo del seed que dependa de la fecha va dentro de una de esas funciones, no en una constante del módulo.
- **Toast:** el temporizador de 5 s se detiene mientras el toast tiene el mouse encima o el foco, y vuelve a partir de cero al salir. Un toque en pantalla táctil no lo detiene.
- **`BottomSheet` y el toast:** mientras el panel está abierto, el resto de la página (incluido el toast) queda inerte. El handler que hace un cambio en la biblioteca también cierra el panel, para que Deshacer se pueda tocar.
