# PLAN · Prototipo E2 (Grupo 2 · Goodreads)

Este documento es lo único que hay que leer para empezar a programar. Todo lo que podría bloquear el trabajo en paralelo ya está decidido aquí. Si algo cambia, se edita este archivo en el mismo commit.

**Fuente de las decisiones de diseño:** `docs/e2/informe-e2.pdf`. Si este plan y el informe se contradicen, manda el informe y se corrige el plan. Lo que el informe no define está resuelto en la sección 6.

**Estado del código:** el bloque base tiene los "Ajustes al bloque base" y la "Dirección visual" de la sección 4. Mis libros, la ficha, la carpeta, Más, Amigos y Persona ya están construidas, T1 y T3 se completan, y `DESIGN.md` describe el aspecto de la app.

**URL:** tiene que seguir funcionando hasta fines de noviembre (E3, 25 de noviembre).

| Rol | Responsable |
|---|---|
| Bloque base | Matías |
| A · Biblioteca | ___ |
| B · Social y búsqueda | ___ |
| Dueño de las cuentas de GitHub y Vercel | Matías |

> **Registro de IA:** cada uno anota sus prompts en `docs/registro-ia.md` (herramienta, prompt, qué produjo, qué cambiamos).

---

## 1. Las 3 tareas

Son las tareas que el prototipo debe permitir completar de principio a fin. Las mismas las usa otro grupo en la E3, partiendo de "Reiniciar demo". La tabla de tareas del informe (sección 4) está vacía: estas redacciones salen de sus journeys y decisiones, y falta copiarlas allá.

- **T1:** marcar como leído un libro que terminé, sin que salga de su carpeta (journey 2.2).
  - **Punto de partida:** el libro está en la carpeta "Terror", con el tag "Leyendo".
  - **Resultado:** el libro tiene el tag "Leído", sigue en "Terror" y muestra sus fechas de inicio y fin. El puntaje es opcional.
- **T2:** ordenar mi lista de pendientes, separando lo que quiero leer pronto y sacando lo que ya no me interesa (decisiones 1, 3 y 5).
  - **Punto de partida:** Mis libros → botón "Lo quiero", que muestra 17 libros.
  - **Resultado:** los libros elegidos están también en la carpeta "Próximos", sin salir de sus otras carpetas, y los descartados ya no están en mi biblioteca.
- **T3:** agregar como amigo a una persona que conozco (journey 2.1 y decisión 4).
  - **Punto de partida:** Más → Amigos.
  - **Resultado:** la persona aparece en Amigos, primero como "Solicitud enviada" y luego como amiga.

`docs/desarrollo/tareas.md` lista qué libros y qué persona concretos usa cada tarea, para que se puedan redactar las instrucciones de la E3.

---

## 2. Qué se construye

Es una página web responsiva. En el celular tiene una barra de navegación inferior y en el computador una barra superior con las mismas 5 secciones. El flujo principal es Inicio → Mis libros → carpeta → ficha del libro.

### Pantallas y rutas
| Ruta | Pantalla | Dueño |
|---|---|---|
| `/` | **Inicio:** tarjeta "Leyendo ahora", que abre la ficha, + actividad de amigos | B |
| `/biblioteca` | **Mis libros:** aviso periódico, botones de tag, tablero "Mis carpetas" (2 portadas, nombre, cantidad), "+ Nueva carpeta". Con un tag activo, la lista de libros con ese tag | A |
| `/biblioteca/carpeta/:folderId` | **Carpeta:** botones de tag, lista de libros con su tag, buscador interno | A |
| `/libro/:bookId` | **Ficha:** portada, datos, tag con lápiz, carpetas del libro, fechas y puntaje | A |
| `/descubrir` | **Descubrir:** "Seleccionados para ti" y las listas prehechas, al mismo nivel | B |
| `/buscar` | **Buscar:** libros y autores, sin personas ni pestañas | B |
| `/mas` | **Más:** enlaces a Amigos y Mi perfil | B |
| `/amigos` | **Amigos:** barra para buscar a cualquier usuario, amigos, solicitudes pendientes, "Invitar contactos" | B |
| `/amigos/:userId` | **Persona:** qué lee, libros en común, botón agregar o estado de la solicitud | B |
| `/perfil` | **Mi perfil:** nombre, @usuario, **Reiniciar demo** | B |

Barra de navegación, en este orden: **Inicio · Mis libros · Descubrir · Buscar · Más**. Cada ícono va con su etiqueta de texto. "Más" queda activa también en `/amigos` y `/perfil`.

### Decisiones de diseño que el prototipo debe mostrar
D1 a D6 son las decisiones 1 a 6 del informe, con la misma numeración. La columna "Pantalla" sirve para llenar "Dónde se ve en el prototipo" (sección 5 del informe).

| # | Elemento | Necesidad | Pantalla |
|---|---|---|---|
| D1 | **Carpetas en tablero:** reemplazan a las estanterías. Un libro puede estar en varias a la vez y el tag no depende de la carpeta. Carpeta fija **"Próximos"** primero | N1 | Mis libros, ficha |
| D2 | **Tags visibles:** *Lo quiero · Lo tengo · Leyendo · Leído* junto al título en cada lista. Se cambian en la ficha: el tag con un lápiz abre el selector | N4 | Listas, ficha |
| D3 | **Botones de tag:** *Todos · Lo quiero · Lo tengo · Leyendo · Leído*. En Mis libros muestran los libros de toda la biblioteca y dentro de una carpeta solo los de esa carpeta. El botón activo se ve marcado | N4 | Mis libros, carpeta |
| D4 | **Buscar usuarios en Amigos:** la barra encuentra a cualquier usuario por nombre o @usuario. Cada resultado trae avatar, amigos en común y "+ Agregar". Estado "Solicitud enviada" visible. "Conectar con más amigos" pasa a llamarse "Invitar contactos" y queda como opción secundaria | N2 | Amigos |
| D5 | **Aviso "¿Sigues queriendo leer este libro?":** un libro antiguo de "Lo quiero" a la vez, con portada, título y botones "Sí" y "No". "No" muestra "Quitado de tu lista" con Deshacer | N1 | Mis libros |
| D6 | **"Seleccionados para ti" en Descubrir:** las recomendaciones según los gustos quedan al mismo nivel que las listas prehechas | N5 | Descubrir |
| — | **Toast con Deshacer** después de cada cambio en la biblioteca | — | Global |
| — | Pantallas de **carga, sin resultados y error** | — | Buscar y ficha. Amigos solo tiene "sin resultados" y "sin amigos", porque su directorio está en la app |

N3 no se atiende en esta entrega. Si el equipo cambia alguna decisión, se actualizan el informe y esta tabla.

---

## 3. Decisiones técnicas

### Stack
- **Node 22** (`.nvmrc`).
- **Base:** `npm create vite@latest` con la plantilla `react-ts`. Se usan React 19, Vite 8 y TypeScript tal como vienen, sin bajar versiones.
- **Router:** `react-router@7` en modo declarativo (`BrowserRouter`, `Routes`), importado desde `react-router`. No se usa la v8.
- **Estado:** `zustand@5` con `persist`.
- **Estilos:** `tailwindcss` 4 con `@tailwindcss/vite`. No hay `tailwind.config`: los tokens van en `@theme` dentro de `src/index.css`.
- **Íconos y fechas:** `lucide-react` y `date-fns@4` (`import { es } from 'date-fns/locale'`).
- **Calidad mínima para hacer merge:** `npm run build` (incluye el chequeo de tipos), `npm run lint` y `npm run test` deben pasar. El bloque base trae tests de Vitest para el store, las fechas, los datos iniciales, los componentes y las rutas. Cada rol agrega los suyos junto al código (`*.test.ts(x)`).

### Deploy y repositorio
- **Repositorio:** **privado**, en la cuenta **personal** de GitHub del responsable. El plan gratuito de Vercel no despliega repos privados de una organización.
  - Hay que invitar como colaboradoras a la profesora (cogallardo@uc.cl) y a la ayudante (ge.coli@uc.cl).
  - `docs/clases/` no se sube; `docs/e1/` y `docs/e2/` sí.
- **Vercel:** despliega desde `main`.
  - `vercel.json` con `{"rewrites":[{"source":"/(.*)","destination":"/index.html"}]}`.
  - **Solo se comparte el dominio de producción** (`<proyecto>.vercel.app`), porque las URLs de preview piden login de Vercel.
  - Un sitio estático no se suspende por inactividad.
- **Después de entregar:** tag `e2-entrega`. En `main` solo se suben arreglos hasta la E3, y la URL se revisa antes del 25 de noviembre.

### Responsivo
- Se diseña primero para el celular, con un punto de quiebre principal: `md` (≥ 768 px). `lg` solo afina el computador.
  - **Celular:** barra de navegación inferior.
  - **Computador:** barra superior y contenido centrado de hasta 1040 px.
  - **Modales:** no hay. Lo que se edita se edita en su lugar, y lo que pide confirmación la pide dentro de la página, con `InlineConfirm`.
- **Lo resuelve el bloque base** en `AppShell`. Cada rol solo ajusta sus grillas con clases `md:`. Por ejemplo, carpetas en 2 columnas en celular, 4 en tablet y 5 en computador, y la ficha en dos columnas desde `md`.

### Fechas
- Siempre se usa `src/lib/dates.ts`, que trae `today()`, `daysAgo(n)`, `parseDate()` y `formatDate()`, todas sobre date-fns.
- **Nunca** usar `toISOString().slice(0,10)` ni `new Date('2026-10-27')`. Después de las 21:00 en Chile, el primero ya da la fecha de mañana, y el segundo muestra el día anterior.

### Libros
- **Catálogo precargado (unos 50 libros reales).**
  - El script `scripts/seed-books.mjs` los baja una vez de Open Library: `search.json` con `lang=es` y los campos `editions,editions.key,editions.title,editions.language,editions.cover_i`.
  - Del resultado se usan el **título y la portada de la edición en español** (`editions.docs[0]`).
  - Los autores se corrigen a mano en el JSON, porque a veces vienen en el idioma original.
  - Las descripciones se traen de `/works/{key}.json`, donde vienen como string o como `{value}`. Las que no vienen en español se traducen en `scripts/translated-descriptions.json` y el libro queda marcado con `descriptionTranslated`. Pueden faltar.
  - Las portadas se bajan con `-L.jpg?default=false` a `public/covers/`, para que se vean nítidas en pantallas 2x.
  - El resultado se guarda en `src/data/books.json`, que se confirma en el repo, y la app no depende de Open Library para funcionar.
- **ID de un libro:** la clave de la obra en Open Library, por ejemplo `OL45804W`. Se usa así tal cual en la URL.
- **Búsqueda en vivo** (`src/lib/openlibrary.ts`, rol B):
  - Usa `search.json` con un timeout de 5 s. Si falla, busca en el catálogo local y avisa.
  - Los resultados en vivo se **deduplican** contra el catálogo local por título y autor normalizados, y los locales aparecen primero.
  - `upsertBook` **nunca sobrescribe** un libro del catálogo precargado.
- **Ficha de un libro que no está en el store** (por ejemplo, un enlace abierto en otro navegador): intenta cargarlo con `fetchWork(id)` de `openlibrary.ts`. Si no lo encuentra, muestra el estado "Libro no encontrado".

### Amigos (simulados)
- El directorio fijo está en `src/data/users.json`.
- Una solicitud queda en `pending` y se acepta sola a los 4 s, con el toast "X aceptó tu solicitud". Lo implementa B en `processPendingRequests()`:
  - acepta las pendientes que tengan más de 4 s;
  - programa un timer para las demás;
  - el timer solo acepta si la solicitud sigue `pending` con el mismo `since`, así que "Reiniciar demo" o cancelar la solicitud la anulan.
- El bloque base llama a `processPendingRequests()` una vez al iniciar la app.

### Aviso periódico (D5)
- **A qué libro pregunta:** al libro en `want` con la fecha `wantCheckedAt ?? addedAt` más antigua, si tiene más de 90 días (`WANT_PROMPT_AFTER_DAYS`). Con el seed, el primero es *It*.
- **Cuándo aparece:** como tarjeta arriba de Mis libros, sin bloquear la pantalla, si hay un libro que cumpla y `lastWantPromptOn` no es hoy. Sigue ahí hasta que la persona responde, así que una tarea no lo pierde por entrar y salir de la sección.
- **"Sí":** deja `wantCheckedAt = today()` y muestra el toast "Sigue en tu lista".
- **"No":** saca el libro de la biblioteca y de sus carpetas, y muestra el toast "Quitado de tu lista" con Deshacer.
- **Después de responder:** `lastWantPromptOn = today()`, así que no aparece otro aviso ese día. Deshacer no cambia ese dato, porque `commit` solo guarda `library` y `folders`.

### Glosario (interfaz ↔ código)
| Interfaz | Código | Nota |
|---|---|---|
| Libro | `Book` | Datos del catálogo; no depende del usuario |
| Mi biblioteca | `library` | Libros que el usuario agregó |
| Entrada | `LibraryEntry` | Relación usuario–libro: tag, fechas, puntaje, carpetas |
| Tag: Lo quiero / Lo tengo / Leyendo / Leído | `status: 'want' \| 'owned' \| 'reading' \| 'read'` | Uno solo a la vez y sin relación con las carpetas. "Lo tengo" significa que lo tengo y no lo he leído. "Tag" es palabra del plan: la interfaz muestra solo el nombre de cada uno |
| Carpeta | `Folder` | La crea el usuario. Un libro puede estar en varias |
| Mis carpetas | | Título del tablero dentro de la sección Mis libros |
| Próximos | `Folder` con `pinned: true` | Viene precargada y no se puede borrar |
| Puntaje | `rating: 1–5` | Opcional |
| Aviso | `wantCheckedAt`, `lastWantPromptOn` | Ver "Aviso periódico" |
| Amigo / Solicitud | `Friendship`, `status: 'pending' \| 'friends'` | |
| Actividad | `Activity` | Algo que hizo un amigo |

### Tipos (`src/types.ts`, del bloque base)
```ts
type BookId = string;            // clave de obra de Open Library: "OL45804W"
type ReadingStatus = 'want' | 'owned' | 'reading' | 'read';
type ISODate = string;           // "2026-10-27"

interface Book { id: BookId; title: string; authors: string[]; coverUrl?: string; description?: string; descriptionTranslated?: boolean; year?: number; pages?: number }
interface LibraryEntry { bookId: BookId; status: ReadingStatus; folderIds: string[]; addedAt: ISODate; wantCheckedAt?: ISODate; startedAt?: ISODate; finishedAt?: ISODate; rating?: number }
interface Folder { id: string; name: string; pinned?: boolean; createdAt: ISODate }
interface User { id: string; name: string; username: string; avatarColor: string; mutualFriends: number; readingIds: BookId[]; readIds: BookId[] }
interface Friendship { userId: string; status: 'pending' | 'friends'; since: string } // fecha y hora ISO
interface Activity { id: string; userId: string; bookId: BookId; kind: 'started' | 'finished' | 'want'; date: ISODate; rating?: number }
interface Toast { id: number; message: string; undoable: boolean }

interface AppState {
  me: User;                                   // del seed, no se persiste
  seedBooks: Record<BookId, Book>;            // books.json, no se persiste
  extraBooks: Record<BookId, Book>;           // traídos de la API, se persisten
  library: Record<BookId, LibraryEntry>;
  folders: Folder[];
  users: User[];                              // users.json, no se persiste
  friendships: Friendship[];
  activities: Activity[];                     // generadas en el seed con fechas relativas a hoy
  likedActivityIds: string[];
  lastWantPromptOn?: ISODate;                 // último día en que se respondió el aviso, se persiste
  toast: Toast | null;
  undoSnapshot: { library: AppState['library']; folders: Folder[] } | null;
}
```
**Para leer datos en un componente** se usa `useStore(selectBook(id))` y `useStore(selectEntry(id))`, que buscan en `seedBooks` y luego en `extraBooks`, o en `library`. `getBook(id)` solo se usa dentro de las acciones: si se llama durante el render, el componente no se actualiza cuando `upsertBook` agrega el libro.

### Store: archivos y dueños
| Archivo | Dueño | Contenido |
|---|---|---|
| `src/store/index.ts` | Base, **no se toca después** | Une los tres slices, `persist` y `resetDemo` |
| `src/store/coreSlice.ts` | Base | `commit`, `undo`, `showToast`, `dismissToast`, `upsertBook`, `setStatus`, `getBook` |
| `src/store/librarySlice.ts` | A | Acciones de biblioteca (stubs del bloque base) |
| `src/store/socialSlice.ts` | B | Acciones sociales (stubs del bloque base) |
| `src/data/seedLibrary.ts` | A, después del bloque base | Biblioteca y carpetas iniciales |
| `src/data/seedSocial.ts` | B, después del bloque base | Amistades y actividades iniciales |
| `src/data/seedDiscover.ts` | B | "Seleccionados para ti" y listas prehechas de Descubrir |

Si un rol necesita una acción nueva, la agrega en su propio slice, con su tipo ahí mismo.

**Persistencia.**
- `persist` usa la clave `gr-e2` y `partialize` guarda solo `library`, `folders`, `friendships`, `likedActivityIds`, `extraBooks` y `lastWantPromptOn`.
- Tiene `version` y `migrate: () => estado inicial`. La versión es la suma de `BASE_VERSION` (en `store/index.ts`), `LIBRARY_SEED_VERSION` (en `seedLibrary.ts`, de A) y `SOCIAL_SEED_VERSION` (en `seedSocial.ts`, de B). **Si un rol cambia su seed, sube su propia constante**, sin tocar `index.ts`.

**Deshacer y toast.**
- Todo cambio en `library` o `folders` pasa por `commit(label, mutator)`. Este guarda en `undoSnapshot` solo `{ library, folders }` y llama a `showToast(label, { undoable: true })`.
- `<Toast/>` está montado en `AppShell` y lee `toast` del store. El botón Deshacer llama a `undo()`.
- La copia se descarta cuando el toast desaparece (5 s).

**Selectores (Zustand v5).** Nunca escribir `useStore(s => s.lista.filter(...))`, porque cada render crea un array nuevo y entra en un loop. Se selecciona el dato tal cual y se deriva con `useMemo`, o se usa `useShallow`.

### Contrato de acciones
| Acción | Quién | Comportamiento |
|---|---|---|
| `upsertBook(book)` | Base | Agrega un libro a `extraBooks`. No hace nada si el id ya está en `seedBooks` |
| `setStatus(bookId, 'want' \| 'owned' \| 'reading')` | Base | Si no está en la biblioteca, lo agrega. Al pasar a `reading`, completa `startedAt = today()` si no tiene y quita `finishedAt`, porque esa lectura no ha terminado. Al pasar a `want`, deja `wantCheckedAt = today()`. Salir de `read` no borra nada más: fechas y puntaje quedan guardados, para que corregir un error no pierda datos. **No acepta `read`** |
| `undo()`, `resetDemo()` | Base | `resetDemo` limpia localStorage y vuelve al estado inicial |
| `finishBook(bookId, { startedAt, finishedAt, rating? })` | A | **Es la única forma de dejar un libro en `read`.** También guarda las fechas y el puntaje que se editan en la ficha |
| `setStartDate(bookId, startedAt)` | A | Corrige el inicio de un libro en `reading`, sin terminarlo. Lo usa la fila "Inicio" de la ficha |
| `removeFromLibrary(bookIds[])` | A | |
| `createFolder(name) → id`, `renameFolder(id, name)`, `deleteFolder(id)` | A | No se puede borrar una carpeta `pinned` |
| `addToFolder(bookIds[], folderId)`, `removeFromFolder(bookIds[], folderId)` | A | |
| `answerWantPrompt(bookId, keep: boolean)` | A | Ver "Aviso periódico" |
| `sendFriendRequest(userId)`, `cancelFriendRequest(userId)`, `removeFriend(userId)` | B | `removeFriend` deja Deshacer: es lo único que guarda `friendships` en `undoSnapshot`. La aceptación de una solicitud no muestra su aviso si hay un Deshacer disponible |
| `processPendingRequests()` | B | Ver "Amigos (simulados)" |
| `toggleLike(activityId)` | B | |

**Elegir "Leído":**
- `StatusControl` llama a `finishBook(bookId, { startedAt: entry?.startedAt ?? entry?.addedAt ?? today(), finishedAt: entry?.finishedAt ?? today(), rating: entry?.rating })`, nunca a `setStatus`.
- No hay un paso intermedio: el tag cambia al instante y aparece el toast con Deshacer. El libro sigue en sus carpetas.
- Con el tag en "Leído", la ficha muestra inicio, fin y puntaje como filas editables, que guardan con `finishBook`. Con "Leyendo" muestra el inicio, que guarda con `setStartDate`.

### Componentes compartidos (`src/components/`, del bloque base)
- **`AppShell`:** navegación inferior en celular y superior en computador, contenedor centrado y `<Toast/>`.
- **`PageHeader`:** banda de la página con título, subtítulo, botón de volver y una acción a la derecha. Lo que recibe como hijo, como `TagFilter`, queda en el borde inferior. "Goodreads / prototipo" sigue visible en el celular, también con acción. `media` pone algo antes del título, como un `Avatar`.
- **`BookCover`:** portada, con un placeholder de color e iniciales si no hay imagen. Con la prop `status`, muestra la cinta del tag bajo la portada.
- **`BookRow`:** portada con su cinta, título, `StatusTag` junto al autor, bajo el título (si el libro está en la biblioteca), y estrellas (si está en "Leído"). Acepta las props `trailing` y `note`, que reemplaza mi tag y mis estrellas en una lista sobre otra persona. Al abrir la ficha le pasa de dónde viene, para que vuelva a esa misma lista.
- **`AnchoredMenu`:** el menú anclado reutilizable. Sirve para un cambio rápido y reversible con pocas opciones, junto a su control: `radio` para una opción actual, `checkbox` para varias y `action` para comandos. `actions` agrega comandos bajo una línea, con lo que cuestan.
- **`SearchField`:** campo de búsqueda que filtra mientras se escribe, con "Borrar". Con `onClose` suma "Cerrar", para un campo que el celular abre a pedido.
- **`Avatar`:** círculo con las iniciales sobre `avatarColor`, siempre junto al nombre.
- **`StatusControl`:** el tag de la ficha con su lápiz (D2). Al tocarlo abre un `AnchoredMenu` junto al control, con las cuatro opciones de 48 px de alto. El menú no oscurece la pantalla y deja ver el libro. Funciona con foco, flechas, Inicio, Fin, Escape y clic afuera. El informe solo pide una "vista de selección de opciones de tags". Si el libro no está en la biblioteca, muestra "Agregar a Mis libros" y abre el mismo menú. Si está, el menú suma "Quitar de mi biblioteca" bajo una línea, con lo que se pierde, así que entrar y salir cuestan dos toques. Recibe `bookId` y `book`.
- **`StatusTag`:** el tag en solo lectura, con ícono, texto y color, sin relleno. Tamaño `sm` para las listas.
- **`TagFilter`:** los botones de tag (D3), con la cantidad de libros de cada uno. El activo se marca con la cinta. Lo usan Mis libros y la carpeta.
- **`Ribbon`:** la cinta, la marca de lo activo.
- **`Stars`:** muestra el puntaje, o permite elegirlo si recibe `onChange`.
- **`InlineConfirm`:** pide confirmar dentro de la página, junto a lo que afecta. Solo para eliminar carpeta y Reiniciar demo.
- **`Button`:** variantes `primary`, `secondary`, `quiet` y `danger`, y `compact` para una fila o una banda. Son bloques de relleno, para que no se confundan con un campo. `secondary` lleva borde `edge` para distinguirse de la banda, y un disparador de menú se invierte mientras el menú está abierto.
- **`EmptyState`, `LoadingState`, `ErrorState`.**

También son compartidos y del bloque base:
- **`src/routes.tsx`:** fija los nombres de las páginas, así que nadie tiene que editarlo después.
- **`src/index.css`:** con `@theme`, que define los colores, las fuentes, la escala tipográfica, las sombras y las animaciones. La paleta por defecto de Tailwind no existe: solo hay estos tokens.
- **`src/lib/dates.ts`.**
- **`DESIGN.md`:** el aspecto de la app. Se escribe en "Dirección visual".

Si alguien necesita cambiar algo compartido, le avisa al otro rol antes y lo sube en un commit separado.

### Reglas de interfaz (valen para ambos roles; el detalle está en `docs/conceptos-hci.md`)
1. **Íconos siempre con etiqueta de texto**, incluida la barra de navegación.
2. **Áreas táctiles de al menos 44×44 px**, y nada que dependa solo del hover.
3. **El estado nunca se comunica solo con color:** siempre texto + color.
4. **Contraste de texto mínimo 4.5:1.** Nada de gris claro sobre blanco para texto que importa.
5. **Un solo botón principal por pantalla.**
6. **Toda acción responde al instante:** el control cambia y aparece el toast.
7. **Prevenir antes que avisar:** fechas futuras deshabilitadas, "Guardar" deshabilitado mientras algo sea inválido, "Próximos" sin la opción de borrar.
8. **Valores por defecto útiles:** fechas ya completadas, la carpeta actual preseleccionada y nunca pedir de nuevo un dato que se mostró en la pantalla anterior.
9. **Consistencia:** la misma acción tiene el mismo nombre (según el glosario) y el mismo componente en toda la app.
10. **Deshacer en vez de "¿Estás seguro?"** para lo reversible. Se pide confirmación solo para Reiniciar demo y eliminar carpeta.
11. **Simetría:** agregar y quitar tienen el mismo peso visual y la misma cantidad de pasos. Lo mismo vale para "Sí" y "No" en el aviso. "Invitar contactos" no va preseleccionado ni reaparece si se ignora.
12. **Agrupar con tarjetas y cercanía:** cada etiqueta pegada a su campo.
13. **Barras de acciones cortas:** máximo 4–5 opciones visibles a la vez.
14. **Animación solo como respuesta a una acción**, nunca decorativa.

---

## 4. Reparto

### Bloque base (martes 27; todos dependen de él)
- [x] **Proyecto:** Vite + dependencias de la sección 3, `.nvmrc`, `.gitignore` (excluye `node_modules`, `dist` y `docs/clases/`), `vercel.json`, README con cómo correrlo y `docs/desarrollo/` con los contratos, los tests, el catálogo y los datos concretos de T1, T2 y T3.
- [x] **Store completo** según la sección 3: tipos, archivos, persistencia, deshacer, toast, acciones del bloque base y stubs con firma fija en los slices de A y B.
- [x] **`scripts/seed-books.mjs`**, con `books.json` y las portadas ya generados.
- [x] **Datos iniciales de la biblioteca:**
  - 34 libros (el reparto por tag cambia en "Ajustes al bloque base");
  - carpetas: Próximos (fija, 2 libros), Terror, Novela, Ciencia ficción y Regalos.
- [x] **Datos iniciales sociales:**
  - **Yo:** Alex Muñoz, @alexlee.
  - **3 amigos:** Diego Fuentes (@diegolee), Valentina Soto (@valelee) y Tomás Rojas (@tomasreads).
  - **Persona de T3:** Camila Torres, @camitorres, 3 amigos en común, todavía sin agregar.
  - **Homónimo:** Camila Torres, @ctorres_99, 0 amigos en común y otro color de avatar.
  - **4 personas más** en el directorio.
  - **Unas 10 actividades** de los amigos, con fechas relativas a hoy (`daysAgo`).
  - Cada `User` lleva sus `readingIds` y `readIds`.
- [x] **Componentes compartidos**, `routes.tsx`, `index.css` y `lib/dates.ts`.
- [x] **Una página placeholder por ruta**, con estos nombres:
  - **A:** `features/library/LibraryPage.tsx`, `FolderPage.tsx` y `features/book/BookPage.tsx`;
  - **B:** `features/home/HomePage.tsx`, `features/search/SearchPage.tsx`, `features/friends/FriendsPage.tsx`, `PersonPage.tsx` y `features/profile/ProfilePage.tsx`.
- [x] **`docs/registro-ia.md`** con su plantilla.
- [ ] **Repo privado** en GitHub, con la profesora y la ayudante invitadas, y **primer deploy en Vercel**.

### Ajustes al bloque base (primero; A y B dependen de ellos)
Cambian tipos usados en todo el proyecto, así que van en un solo commit para que `npm run build` siga pasando.
- [x] **`types.ts`:** `ReadingStatus` con `'owned'`; `LibraryEntry` sin `owned` y con `wantCheckedAt`; `User` sin `code`; `AppState` con `lastWantPromptOn`.
- [x] **Store:**
  - `setStatus` acepta `owned` y deja `wantCheckedAt` al pasar a `want`;
  - `persist` guarda `lastWantPromptOn`, y se sube `BASE_VERSION`;
  - `buildInitialState` incluye `lastWantPromptOn: undefined`, porque `resetDemo` usa `set`, que combina claves, y sin ella el valor anterior sobrevive a "Reiniciar demo";
  - en `librarySlice`, quitar los stubs `toggleOwned` y `moveToFolder`, y agregar `answerWantPrompt`.
- [x] **Etiquetas y estilos:** cuatro tags en `STATUS_LABELS` (*Lo quiero, Lo tengo, Leyendo, Leído*), sus estilos, `STATUS_ICONS` y `--color-owned`, con contraste de 4.5:1.
- [x] **Componentes:**
  - `StatusControl` nuevo, según "Componentes compartidos";
  - `BookRow` con `StatusTag`, sin `selectable`, `onLongPress` ni `onRequestFinish`;
  - quitar `useLongPress.ts` y `finishBookPath` de `paths.ts`.
- [x] **Navegación y rutas:**
  - `AppShell` con *Inicio · Mis libros · Descubrir · Buscar · Más*;
  - `routes.tsx` con `/descubrir` y `/mas`;
  - placeholders `features/discover/DiscoverPage.tsx` y `features/more/MorePage.tsx`.
- [x] **Seed de la biblioteca** (se sube `LIBRARY_SEED_VERSION`):
  - **17 en "Lo quiero"**;
  - **5 en "Lo tengo":** los 4 de "Quiero" que tenían `owned` y el libro de Oliver Sacks;
  - **2 en "Leyendo":** *Carrie* (libro de T1, ya está en Terror), con `startedAt` hace 12 días, y *Dune*, hace 30;
  - 10 en "Leído".
- [x] **Seed social:** quitar `code` de `users.json`, y se sube `SOCIAL_SEED_VERSION`.
- [x] **Tests:** actualizar `coreSlice.test.ts`, `seed.test.ts`, `routes.test.tsx`, `StatusControl.test.tsx`, `BookRow.test.tsx` y `src/test/helpers.test.tsx`.

### Dirección visual (después de los ajustes; A y B dependen de ella)
Es una sola sesión con Impeccable, sin trabajo en paralelo, según `docs/desarrollo/protocolo.md`. Reemplaza el aspecto del bloque base. Mis libros y la ficha se construyen aquí por excepción, para que los agentes tengan dos pantallas reales de referencia. `LibraryPage.tsx` y `BookPage.tsx` siguen siendo del rol A.
- [x] **Evaluación de Goodreads:** cada elemento contra las 14 reglas y los problemas de la interfaz anterior, con el contraste medido. Las direcciones parten de lo que sobrevive.
- [x] **Mundo visual:** Impeccable propone las direcciones y Matías elige una.
- [x] **Sistema:** `src/index.css` y todos los componentes compartidos con el aspecto elegido, en un commit aparte.
  - fuentes libres alojadas en el proyecto;
  - `StatusControl` como menú anclado;
  - portadas regeneradas en mayor resolución.
- [x] **Mis libros como primera superficie:** solo lee el store.
  - fila de botones de tag (D3), con "Todos" activo al entrar;
  - tablero "Mis carpetas" con "Próximos" primero y enlaces a cada carpeta (D1);
  - con un tag activo, la lista de esos libros en vez del tablero.
- [x] **Ficha como segunda superficie:** portada, datos, descripción, carpetas y `StatusControl`. Solo lee el store, salvo el selector.
- [x] **Pantallas pendientes** dentro del sistema, sin textos internos.
- [x] **`DESIGN.md` y `.impeccable/design.json`**, escritos desde lo construido.
- **Listo cuando:** la revisión final de Impeccable termina con veredicto `ship` y `DESIGN.md` describe lo que se ve en Mis libros y en la ficha.

### Rol A · Biblioteca (T1 + T2) · `src/features/library/`, `src/features/book/`, `librarySlice.ts`
- [ ] **Mis libros**, sobre lo que dejó "Dirección visual":
  - aviso periódico (D5);
  - buscador sobre la biblioteca;
  - "+ Nueva carpeta".
- [x] **Carpeta:** `TagFilter`, lista de `BookRow`, buscador interno, renombrar y eliminar carpeta, y estado vacío. El título y la banda ya están.
- [x] **Ficha**, sobre lo que dejó "Dirección visual":
  - agregar y quitar carpetas desde la fila "Carpetas", cuyos enlaces llevan a cada una;
  - "Quitar de mi biblioteca", en el menú del tag;
  - estado de carga mientras se ejecuta `fetchWork`, antes de "Libro no encontrado".
- [x] **Fechas y puntaje en la ficha:**
  - se muestran cuando el tag es "Leído";
  - se editan ahí mismo, con fechas y estrellas opcionales;
  - no permite fin anterior a inicio ni fechas futuras.
- [ ] **Acciones de `librarySlice`.** Falta `answerWantPrompt`; las demás están hechas.
- [ ] **Campo de formulario compartido** (bloque base, antes de "+ Nueva carpeta"): lo usan renombrar carpeta y "+ Nueva carpeta".
- **Listo cuando:** T1 y T2 se completan desde "Reiniciar demo", en celular y en computador, y cada cambio muestra el toast con Deshacer.

### Rol B · Social y búsqueda (T3 + búsqueda) · `src/features/home|search|discover|more|friends|profile/`, `src/lib/openlibrary.ts`, `socialSlice.ts`, `src/data/seedDiscover.ts`
- [ ] **`openlibrary.ts`:**
  - `searchBooks(query, signal)` con espera de 350 ms mientras se escribe, `AbortController`, timeout de 5 s, búsqueda en el catálogo local si falla y deduplicación;
  - `fetchWork(id)`, que usa la ficha de A.
- [ ] **Buscar:**
  - resultados en `BookRow`; al tocar uno se hace `upsertBook` y se navega a `/libro/:id`;
  - estados de carga, sin resultados y error.
- [ ] **Descubrir (D6):**
  - `seedDiscover.ts` con "Seleccionados para ti" (unos 6 libros según los gustos de Alex: terror y ciencia ficción) y 2 o 3 listas prehechas, usando los 20 libros del catálogo que no están en la biblioteca inicial;
  - todas las secciones usan el mismo componente y tamaño;
  - "Seleccionados para ti" oculta los libros que ya están en la biblioteca;
  - al tocar un libro se abre la ficha.
- [x] **Más:** enlaces a Amigos y Mi perfil, con el botón "Amigos" a la vista.
- [x] **Amigos (D4):**
  - sin texto en la barra, lista de amigos y solicitudes pendientes;
  - con texto, resultados de todo el directorio por nombre o @usuario;
  - cada resultado muestra avatar, @usuario, amigos en común y "+ Agregar";
  - *+ Agregar* → mensaje y estado "Solicitud enviada" (con la opción de cancelar) → "Amigos";
  - "Invitar contactos" es una acción secundaria junto al título, que solo muestra un aviso;
  - estado sin resultados.
- [x] **Persona:** qué está leyendo, últimos leídos, libros en común y botón de agregar o estado de la solicitud.
- [ ] **Inicio:**
  - "Leyendo ahora", que abre la ficha;
  - feed de actividad con like;
  - estado vacío.
- [ ] **Mi perfil:** nombre, @usuario y "Reiniciar demo" con confirmación.
- [x] **Acciones de `socialSlice`.**
- **Listo cuando:** T3 se completa desde "Reiniciar demo", en celular y en computador; la búsqueda funciona aunque Open Library esté caído; y los estados de carga, sin resultados y error están implementados.

### Puntos de contacto entre A y B (ya resueltos)
- B no cambia tags: enlaza a la ficha con `bookPath`, y ahí `StatusControl` hace el cambio.
- B nunca toca la biblioteca: usa `upsertBook` y luego navega a la ficha de A.
- A usa `fetchWork` de B. Mientras B no lo tenga listo, la ficha muestra "Libro no encontrado".
- Cada uno escribe solo en sus carpetas y en su slice.

---

## 5. Cómo trabajamos

- **Ramas:** `main` siempre se puede publicar. Cada rol trabaja en ramas con su prefijo, por ejemplo `a/carpetas` o `b/amigos`, y hace merge a `main` cuando pasa `npm run build`, al menos una vez al día.
- **Correr el proyecto:** `npm install` y luego `npm run dev`. Para volver al estado inicial, "Reiniciar demo" en Perfil.

| Orden | Qué |
|---|---|
| 1 | Ajustes al bloque base, publicados en `main` |
| 2 | Dirección visual, con `DESIGN.md`, y Mis libros y la ficha como primeras superficies |
| 3 | A y B en paralelo, con merge a `main` cada vez que pase `npm run build` |
| 4 | Integración: probar T1, T2 y T3 desde cero en celular y en computador |
| 5 | Correcciones, capturas para el informe, entrega y tag `e2-entrega` |

---

## 6. Lo que el informe no define

Son decisiones de implementación tomadas para poder programar. El equipo puede cambiarlas: se edita esta tabla y lo que corresponda del plan. Cuando el texto del informe no coincide con el prototipo, hay que corregir el informe.

| Tema | Qué dice el informe | Qué hace el prototipo |
|---|---|---|
| "Lo tengo" | "Cada libro tiene un estado", el selector ofrece una opción entre cuatro y el filtro muestra los que "tiene y no ha leído" | Es el cuarto valor de `status`, excluyente. Reemplaza a "Poseo", así que un libro en "Leído" no registra si lo tengo |
| Fechas y puntaje al terminar | El journey 2.2.2 pasa de elegir "Leído" a volver a Mis libros, sin un paso intermedio. N4 nombra fechas y puntaje | "Leído" se aplica de inmediato con fin = hoy. Las fechas y el puntaje se editan después en la ficha |
| Tag inicial de T1 | El paso 3 del journey 2.2.2 dice "Quiero leer", un nombre que no está entre los tags de la decisión 2 | T1 parte en "Leyendo". Falta corregir ese paso en el informe |
| Selección múltiple | No aparece | Queda fuera. Los libros se agregan a carpetas y se quitan desde la ficha |
| "Próximos" | No aparece | Se mantiene como carpeta fija porque es el destino de T2 |
| "No" del aviso | "Lo quita de Lo quiero" y muestra "Quitado de tu lista" | El libro sale de la biblioteca y de sus carpetas. Deshacer lo devuelve |
| "Cada cierto tiempo" y "mucho tiempo" | Sin valores | Un aviso respondido por día y 90 días en la lista |
| "Mis carpetas" y "Mis libros" | La decisión 3 usa "Mis carpetas" y los journeys, "Mis libros" | "Mis libros" es la sección y "Mis carpetas", el título del tablero |
| Libros sin carpeta | La decisión 3 habla de "todas las carpetas" | Los botones de tag en Mis libros filtran toda la biblioteca, así que también aparecen. En "Todos", una tarjeta "Sin carpeta" al final del tablero los reúne |
| Botón de agregar | El journey dice "+" y la decisión 4, "Agregar" | "+ Agregar", porque los íconos van con etiqueta |
| "Conectar con más amigos" | La decisión 4 habla de un renombrado, sin dar el nombre nuevo | "Invitar contactos" |
| Código de amigo | No aparece | Queda fuera. Compartir un código exige coordinarse por otro medio, lo contrario de N2 |
| Seguidores | El journey 2.1.2 menciona "amigos y seguidores" | Amigos muestra solo amigos y solicitudes |
| Barra de navegación | Nombra "Mis libros", "Más", "Descubrir" y el buscador principal, sin dar el orden | *Inicio · Mis libros · Descubrir · Buscar · Más* |
| Selector de tags | Pide una "vista de selección de opciones de tags", sin decir cuál | Un menú anclado junto al tag, porque cambiarlo es rápido y reversible |
| Tag en las listas | "Junto al título" | Bajo el título, junto al autor y con la cinta de su color bajo la portada, porque un título largo no deja lugar a su lado en un celular |
| Cantidad en los botones de tag | No aparece | Cada botón muestra cuántos libros tiene, porque T2 parte de saber que son 17 |
| Orden de la lista por tag | No aparece | Por título, para encontrar un libro conocido en una lista larga |
| Salir de "Leído" | No aparece | No se distingue un error de una relectura, así que nada se borra: inicio y puntaje quedan, y volver a "Leyendo" solo quita el fin. Una relectura corrige el inicio en la ficha, en su fila |
| Sección marcada en la ficha | No aparece | Ninguna, porque la ficha se abre desde cualquier sección |
| Nombre del selector | Habla de "un lápiz" | "Cambiar" junto al lápiz, porque todo ícono lleva texto. El selector se titula "Estado de «título»" |
| Libros sin descripción | No aparece | La ficha mantiene la misma forma en todos los anchos. "Sobre este libro" va siempre en el mismo lugar y, sin descripción, dice "Aún no tenemos descripción de este libro.". Hoy son 2 de 54 libros |
| Descripción traducida | No aparece | Bajo la descripción, "Traducción hecha con IA" como dato de procedencia, sin cinta ni color de acento, si el libro trae `descriptionTranslated` |
| Estrellas | No aparece | De tinta. El naranja de Goodreads compite con las portadas y como ícono llega a 3,03:1 |
| Color de la cinta | No aparece | Burdeo `#7a2334`. Se parece al ciruela de "Lo tengo", pero el estado nunca se apoya solo en el color |
| Nombre en el celular | No aparece | "Goodreads / prototipo" a la derecha del título en cada pantalla, porque el celular no tiene barra superior |
| Confirmar Reiniciar demo y eliminar carpeta | No aparece. El plan pide confirmación sin decir con qué pieza | `InlineConfirm`, dentro de la página, con el foco en Cancelar. Reiniciar demo la usa cuando exista Mi perfil, en la fase 4 |
| Agregar y quitar a una persona | El journey solo dice "+" y "Solicitud enviada" | Estado y acción no comparten control, porque la aceptación llega sola a los 4 s. "Solicitud enviada" y "Amigos" son texto, y Agregar, Cancelar y "Quitar de amigos" son el mismo botón: pesan lo mismo y cuestan un toque, como pide la regla 11. Quitar ofrece Deshacer, y solo está en Persona. Un toque a Cancelar que cae en Quitar justo al aceptarse termina igual: sin ser amigos |
| Carpetas de un libro sin carpetas | No aparece | La fila dice "Sin carpetas" y el botón, "Agregar". Con carpetas dice "Agregar o quitar", sin ícono, porque el más diría solo la mitad |
| Libros en común | Persona debe mostrarlos | Cada libro aparece una vez, en "Está leyendo" o "Últimos leídos", marcado "En común", y la cantidad va en el encabezado. Esas filas no muestran mi tag ni mis estrellas |
| Buscador de la carpeta | "Buscador interno" | En la fila del título, dentro de la banda. Desde 768 px está siempre visible. En celular, "Buscar" lo abre sobre esa misma fila y "Cerrar" lo vacía y lo cierra, así aparece donde se tocó y ningún libro se mueve. En Amigos sigue siempre visible, porque es el camino de T3 |
| Quitar de mi biblioteca | No aparece | Dos toques en el menú del tag, que dice qué se pierde, con Deshacer y sin confirmación (reglas 10 y 11) |
| Aspecto de los botones | No aparece | Bloques de relleno, como describe `DESIGN.md`. Se revisan otra vez en la auditoría con todas las vistas |
| Texto en agregar y quitar | Solo menciona "+" y un lápiz | Todo botón lleva texto (regla 1). Sin carpetas, el botón de la ficha dice "Agregar" |
| Forma y color del avatar | No aparece | Círculo, para separarlo de una portada de un vistazo. Cinco fondos de la portada de reemplazo, sin el burdeo. Entre homónimos distingue el @usuario |
| Menú de carpetas de un libro | No aparece | Se cierra al elegir, igual que el de tags, y cada cambio deja su Deshacer |
| Renombrar "Próximos" | No aparece | Sin renombrar ni eliminar, porque T2 depende de ese nombre. La carpeta dice "fija" |
| Campo de fecha | No aparece | Campo nativo con un solo ícono. En Firefox queda su ícono, y el formato sigue el idioma del navegador |
| Campo de formulario | No aparece | Pieza compartida desde la fase 4, para renombrar carpeta, "+ Nueva carpeta" y lo que venga |
| Nombres de carpeta | No aparece | Máximo 40 caracteres. Los repetidos se comparan sin mayúsculas, tildes ni espacios externos |
| Carpeta vacía | No aparece | Se oculta el buscador y se explica cómo agregar libros desde la ficha |
| Límites del calendario | Fechas futuras deshabilitadas | Inicio llega hasta hoy y fin va de inicio a hoy. Si inicio queda después de fin, un texto lo explica y no se guarda |
| Falla de red en una ficha | No aparece | Error con Reintentar, separado de "Libro no encontrado" |
| Orden en Amigos | No aparece | Amigos y solicitudes por nombre. Los resultados siguen el orden del directorio |
