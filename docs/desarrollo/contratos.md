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
- **Salir de "Leído":** `setStatus` no borra datos, porque no se puede distinguir un error de una relectura. Pasar a "Leyendo" quita `finishedAt`, porque esa lectura no ha terminado; inicio y puntaje quedan. Volver a "Leído" reutiliza lo guardado, y `BookRow` y la ficha solo muestran el puntaje de un libro en "Leído".
- **"Leído" para un libro fuera de la biblioteca** (por ejemplo, un resultado de búsqueda): `finishBook` crea la entrada (`folderIds: []`, `addedAt: today()`) antes de dejarla en `read`. Sin entrada, `StatusControl` usa `today()` como fecha de inicio.
- **Volver a "Lo quiero":** `setStatus` deja `wantCheckedAt = today()`, para que el aviso de D5 no pregunte por un libro que la persona acaba de elegir.
- **Versión de `localStorage`:** quien cambia un seed sube la constante de su archivo (`LIBRARY_SEED_VERSION` en `seedLibrary.ts`, `SOCIAL_SEED_VERSION` en `seedSocial.ts`). `src/store/index.ts` las suma, así que no hay que editarlo, y los navegadores con datos guardados del seed anterior vuelven a partir del nuevo.
- **Seeds como funciones:** `seedLibrary.ts` y `seedSocial.ts` exportan `buildInitialLibrary()`, `buildInitialFolders()`, `buildInitialFriendships()` y `buildInitialActivities()`, que el store llama al partir y en cada **Reiniciar demo**. Así las fechas siempre se cuentan desde hoy y cada reinicio entrega objetos nuevos. Un dato nuevo del seed que dependa de la fecha va dentro de una de esas funciones, no en una constante del módulo.
- **Toast:** el temporizador de 5 s se detiene mientras el toast tiene el mouse encima o el foco, y vuelve a partir de cero al salir. Un toque en pantalla táctil no lo detiene.
- **`StatusControl`:** es un menú anclado al control, sin fondo oscuro, que no deja inerte la página. Se abre hacia abajo. Si no cabe, primero desplaza la página y solo abre hacia arriba si la página no se puede desplazar, porque arriba taparía el libro. Elegir una opción aplica el cambio, cierra el menú y devuelve el foco al control. El tag y la cinta cambian en su lugar; el toast con Deshacer queda de respaldo.
- **`Button`:** nunca es blanco, porque lo blanco con borde es un campo. `secondary` y `quiet` usan `aria-expanded` para verse abiertos, así que el disparador de un `AnchoredMenu` no necesita nada más. La acción de una fila es `quiet`, y la de la página, en la banda, `secondary`. Un control que no sea un `Button`, como "Cambiar" en `StatusControl`, copia los estados de `quiet`. Un botón no sobresale del margen de su columna, y un `quiet` puede hacerlo solo para que su texto, y no su relleno invisible, quede sobre el margen.
- **`AnchoredMenu`:** quien lo usa dibuja el control en `trigger` y esparce las props que recibe, incluida `ref`. Elegir una opción cierra el menú y devuelve el foco antes de llamar a `onSelect`. Es el menú de `StatusControl`, así que comparte con él cómo se abre, se ubica y responde al teclado. En una página que no alcanza a hacer scroll puede quedar sobre la barra inferior, y lo que no cabe se desplaza dentro del menú.
- **Animación:** solo responde a una acción (regla 14) y respeta la preferencia de reducir movimiento, que `index.css` aplica a toda la app. `useChanged(valor)` dice si un valor cambió después de montar, para no animar al cargar la página.
- **Colores:** la paleta por defecto de Tailwind no existe, así que clases como `text-gray-700` no generan nada. Se usan los tokens de `index.css`.
- **Volver desde la ficha:** `BookRow` pasa `state.from` con la lista de origen y sus filtros. La ficha vuelve ahí; sin ese dato, por ejemplo con un enlace compartido, vuelve a Mis libros.
- **Scroll:** `AppShell` parte cada página nueva arriba y restaura la posición al volver, con el botón del navegador o con `BackLink`, que pasa `state.restoreScroll`. Solo un cambio de `pathname` mueve la página.
- **`SearchField` con `onClose`:** para un campo que el celular abre a pedido. Quien lo usa cierra el campo y devuelve el foco a lo que lo abrió. El campo sigue montado desde `md`, así que el foco al abrir se da a mano y `autoFocus` ya no existe.
- **`PageHeader`:** la fila del título es `relative`, para que `action` pueda cubrirla con `absolute inset-0`. Quien la cubre esconde lo que queda debajo, para que el teclado no llegue ahí. Lo que va adentro de la banda puede usar margen inferior.
- **Descripción de un libro:** `descriptionTranslated` solo tiene efecto si hay `description`. La ficha nunca cambia de forma según esos campos. Un libro de `extraBooks` sin `description` la pide a Open Library al abrir la ficha (`useBookDescription`, que el rol B agregó en la carpeta del rol A) y guarda solo ese texto, sin tocar el año ni la portada. `description: ''` significa que ya se preguntó y no hay.
- **Búsqueda:** `searchBooks` guarda en memoria sus últimas 30 respuestas correctas, y `savedSearch` las devuelve sin espera, para que volver a una lista la encuentre con su alto. Reiniciar demo las borra con `forgetSearches`. Lo que se vea de un resultado se toma del store cuando el libro ya está ahí, porque `BookRow` sobrescribe el libro al abrirlo.
- **Sin modales:** nada bloquea la página. Lo reversible se aplica al instante con Deshacer, y `InlineConfirm` queda solo para eliminar carpeta y Reiniciar demo.
- **Deshacer:** `undoSnapshot` guarda `library` y `folders`, y `friendships` solo cuando viene de `removeFriend`. Un aviso sin Deshacer borra la copia, por eso la aceptación de una solicitud no muestra el suyo si hay una copia guardada.
- **Fechas en la ficha:** el calendario guarda al elegir. Escribir pasa por fechas parciales, así que guarda con Enter o al salir del campo. Si el inicio pasa el fin, el fin lo sigue.
