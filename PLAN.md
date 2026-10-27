# PLAN · Prototipo E2 (Grupo 2 · Goodreads)

Este documento es lo único que hay que leer para empezar a programar. Todo lo que podría bloquear el trabajo en paralelo ya está decidido aquí. Si algo cambia, se edita este archivo en el mismo commit.

**Entrega:** viernes 30 de octubre, 21:00. La URL tiene que seguir funcionando hasta fines de noviembre (E3, 25 de noviembre).

| Rol | Responsable |
|---|---|
| Bloque base | Matías |
| A · Biblioteca | ___ |
| B · Social y búsqueda | ___ |
| Dueño de las cuentas de GitHub y Vercel | Matías |

> **Registro de IA:** cada uno anota sus prompts en `docs/registro-ia.md` (herramienta, prompt, qué produjo, qué cambiamos).

---

## 1. Las 3 tareas

Son las tareas que el prototipo debe permitir completar de principio a fin. Las mismas las usa otro grupo en la E3, partiendo de "Reiniciar demo".

- **T1:** registrar que terminé un libro, con las fechas en que lo leí y mi puntaje.
  - **Punto de partida:** el libro está en "Leyendo".
  - **Resultado:** el libro queda en "Leído", con fecha de inicio, fecha de fin y estrellas.
- **T2:** ordenar mi lista de pendientes, separando lo que quiero leer pronto y sacando lo que ya no me interesa.
  - **Punto de partida:** Mis libros → filtro "Quiero", que tiene más de 20 libros.
  - **Resultado:** los libros elegidos están en la carpeta "Próximos" y los descartados ya no están en mi biblioteca (`removeFromLibrary`).
- **T3:** agregar como amigo a una persona que conozco.
  - **Resultado:** la persona aparece en Amigos, primero como "Solicitud enviada" y luego como amiga.

El README del bloque base lista qué libros y qué persona concretos usa cada tarea, para que se puedan redactar las instrucciones de la E3.

---

## 2. Qué se construye

Es una página web responsiva. En el celular tiene una barra de navegación inferior y en el computador una barra superior con las mismas 5 secciones. El flujo principal es Inicio → Mis libros → carpeta → ficha del libro.

### Pantallas y rutas
| Ruta | Pantalla | Dueño |
|---|---|---|
| `/` | **Inicio:** tarjeta "Leyendo ahora" con el botón "Terminé" + actividad de amigos | B |
| `/biblioteca` | **Mis libros:** grilla de carpetas (2 portadas, nombre, cantidad), chips de filtro por estado, "+ Nueva carpeta" | A |
| `/biblioteca/carpeta/:folderId` | **Carpeta:** lista de libros, buscador interno, selección múltiple | A |
| `/libro/:bookId` | **Ficha:** portada, datos, control de estado, Poseo, carpetas del libro | A |
| `/libro/:bookId?accion=terminar` | La ficha con el panel "Terminé este libro" abierto | A |
| `/buscar?tab=libros` o `?tab=personas` | **Buscar:** pestañas Libros y Personas | B |
| `/amigos` | **Amigos:** amigos, solicitudes pendientes, "Agregar amigo" | B |
| `/amigos/:userId` | **Persona:** qué lee, libros en común, botón agregar o estado de la solicitud | B |
| `/perfil` | **Mi perfil:** nombre, @usuario, código con botón copiar, **Reiniciar demo** | B |

Barra de navegación, en este orden: **Inicio · Mis libros · Amigos · Buscar · Perfil**. Cada ícono va con su etiqueta de texto.

### Elementos de diseño que el prototipo debe mostrar
| # | Elemento | Pantalla |
|---|---|---|
| D1 | **Carpetas** creadas por el usuario, en grilla e independientes del estado. Carpeta fija **"Próximos"** primero | Mis libros |
| D2 | **Estado con un toque:** control segmentado *Quiero · Leyendo · Leído* en la ficha y en cada fila, sin desplegables. **"Poseo"** es una marca aparte | Ficha, listas |
| D3 | **Agregar amigo simplificado:** pestaña *Personas* en Buscar, búsqueda por nombre, @usuario o código. Avatar y amigos en común para distinguir homónimos. Estado "Solicitud enviada" visible. "Invitar contactos" queda como opción secundaria | Buscar, Amigos |
| D4 | **Panel "Terminé este libro":** fechas de inicio y fin ya completadas y estrellas opcionales, todo junto y siempre en el mismo lugar. No acepta fechas imposibles | Ficha |
| D5 | **Toast con Deshacer** después de cada cambio en la biblioteca | Global |
| D6 | **Selección múltiple** para mover o quitar varios libros a la vez | Listas |
| — | Pantallas de **carga, sin resultados y error** | Buscar, ficha |

Si el equipo cambia alguna decisión, se actualiza esta tabla.

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
- Se diseña primero para el celular, con un solo punto de quiebre: `md` (≥ 768 px).
  - **Celular:** barra de navegación inferior y paneles que suben desde abajo.
  - **Computador:** barra superior, contenido centrado de hasta 1040 px y paneles como modal centrado.
- **Lo resuelve el bloque base** en `AppShell` y `BottomSheet`. Cada rol solo ajusta sus grillas con clases `md:`. Por ejemplo, carpetas en 2 columnas en celular y 4 en computador, y la ficha en dos columnas en computador.

### Fechas
- Siempre se usa `src/lib/dates.ts`, que trae `today()`, `daysAgo(n)`, `parseDate()` y `formatDate()`, todas sobre date-fns.
- **Nunca** usar `toISOString().slice(0,10)` ni `new Date('2026-10-27')`. Después de las 21:00 en Chile, el primero ya da la fecha de mañana, y el segundo muestra el día anterior.

### Libros
- **Catálogo precargado (unos 50 libros reales).**
  - El script `scripts/seed-books.mjs` los baja una vez de Open Library: `search.json` con `lang=es` y los campos `editions,editions.key,editions.title,editions.language,editions.cover_i`.
  - Del resultado se usan el **título y la portada de la edición en español** (`editions.docs[0]`).
  - Los autores se corrigen a mano en el JSON, porque a veces vienen en el idioma original.
  - Las descripciones se traen de `/works/{key}.json`, donde vienen como string o como `{value}`. Pueden faltar.
  - Las portadas se bajan con `-M.jpg?default=false` a `public/covers/`.
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

### Glosario (interfaz ↔ código)
| Interfaz | Código | Nota |
|---|---|---|
| Libro | `Book` | Datos del catálogo; no depende del usuario |
| Mi biblioteca | `library` | Libros que el usuario agregó |
| Entrada | `LibraryEntry` | Relación usuario–libro: estado, poseo, fechas, puntaje, carpetas |
| Estado: Quiero / Leyendo / Leído | `status: 'want' \| 'reading' \| 'read'` | Uno solo a la vez |
| Poseo | `owned: boolean` | Independiente del estado |
| Carpeta | `Folder` | La crea el usuario. Un libro puede estar en varias |
| Próximos | `Folder` con `pinned: true` | Viene precargada y no se puede borrar |
| Puntaje | `rating: 1–5` | Opcional |
| Amigo / Solicitud | `Friendship`, `status: 'pending' \| 'friends'` | |
| Actividad | `Activity` | Algo que hizo un amigo |

### Tipos (`src/types.ts`, del bloque base)
```ts
type BookId = string;            // clave de obra de Open Library: "OL45804W"
type ReadingStatus = 'want' | 'reading' | 'read';
type ISODate = string;           // "2026-10-27"

interface Book { id: BookId; title: string; authors: string[]; coverUrl?: string; description?: string; year?: number; pages?: number }
interface LibraryEntry { bookId: BookId; status: ReadingStatus; owned: boolean; folderIds: string[]; addedAt: ISODate; startedAt?: ISODate; finishedAt?: ISODate; rating?: number }
interface Folder { id: string; name: string; pinned?: boolean; createdAt: ISODate }
interface User { id: string; name: string; username: string; code: string; avatarColor: string; mutualFriends: number; readingIds: BookId[]; readIds: BookId[] }
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

Si un rol necesita una acción nueva, la agrega en su propio slice, con su tipo ahí mismo.

**Persistencia.**
- `persist` usa la clave `gr-e2` y `partialize` guarda solo `library`, `folders`, `friendships`, `likedActivityIds` y `extraBooks`.
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
| `setStatus(bookId, 'want' \| 'reading')` | Base | Si no está en la biblioteca, lo agrega. Al pasar a `reading`, completa `startedAt = today()` si no tiene, o si viene de `read` (relectura). Al salir de `read` se borran `finishedAt` y `rating`. **No acepta `read`** |
| `undo()`, `resetDemo()` | Base | `resetDemo` limpia localStorage y vuelve al estado inicial |
| `finishBook(bookId, { startedAt, finishedAt, rating? })` | A | **Es la única forma de dejar un libro en `read`** |
| `toggleOwned(bookId)`, `removeFromLibrary(bookIds[])` | A | |
| `createFolder(name) → id`, `renameFolder(id, name)`, `deleteFolder(id)` | A | No se puede borrar una carpeta `pinned` |
| `addToFolder(bookIds[], folderId)`, `removeFromFolder(bookIds[], folderId)`, `moveToFolder(bookIds[], fromId, toId)` | A | |
| `sendFriendRequest(userId)`, `cancelFriendRequest(userId)`, `removeFriend(userId)` | B | |
| `processPendingRequests()` | B | Ver "Amigos (simulados)" |
| `toggleLike(activityId)` | B | |

**Elegir "Leído":**
- En `StatusControl` no se llama a `setStatus`, sino a `onRequestFinish`, que navega a `/libro/:id?accion=terminar`.
- Solo `finishBook` cambia el estado.
- Si se cierra el panel sin guardar, se quita el parámetro de la URL y el estado queda como estaba.

### Componentes compartidos (`src/components/`, del bloque base)
- **`AppShell`:** navegación inferior en celular y superior en computador, contenedor centrado y `<Toast/>`.
- **`PageHeader`:** título, botón de volver y una acción a la derecha.
- **`BookCover`:** portada, con un placeholder de color e iniciales si no hay imagen.
- **`BookRow`:** portada, título, autor, estrellas y `StatusControl` compacto. Acepta las props `trailing`, `selectable` y `selected`.
- **`StatusControl`:** el control segmentado *Quiero · Leyendo · Leído* (D2), con texto y color. Recibe `bookId` y `onRequestFinish`, y tiene una variante `compact` para las filas.
- **`StatusTag`:** el estado en solo lectura.
- **`Stars`:** muestra el puntaje, o permite elegirlo si recibe `onChange`.
- **`BottomSheet`:** panel inferior en celular y modal centrado en computador.
- **`Button`:** variantes `primary`, `secondary` y `danger`.
- **`EmptyState`, `LoadingState`, `ErrorState`.**

También son compartidos y del bloque base:
- **`src/routes.tsx`:** fija los nombres de las páginas, así que nadie tiene que editarlo después.
- **`src/index.css`:** con `@theme`, que define `--color-want`, `--color-reading`, `--color-read` y el color de marca.
- **`src/lib/dates.ts`.**

Si alguien necesita cambiar algo compartido, le avisa al otro rol antes y lo sube en un commit separado.

### Reglas de interfaz (valen para ambos roles; el detalle está en `docs/conceptos-hci.md`)
1. **Íconos siempre con etiqueta de texto**, incluida la barra de navegación.
2. **Áreas táctiles de al menos 44×44 px**, y nada que dependa solo del hover.
3. **El estado nunca se comunica solo con color:** siempre texto + color.
4. **Contraste de texto mínimo 4.5:1.** Nada de gris claro sobre blanco para texto que importa.
5. **Un solo botón principal por pantalla o panel.**
6. **Toda acción responde al instante:** el control cambia y aparece el toast.
7. **Prevenir antes que avisar:** fechas futuras deshabilitadas, "Guardar" deshabilitado mientras algo sea inválido, "Próximos" sin la opción de borrar.
8. **Valores por defecto útiles:** fechas ya completadas, la carpeta actual preseleccionada y nunca pedir de nuevo un dato que se mostró en la pantalla anterior.
9. **Consistencia:** la misma acción tiene el mismo nombre (según el glosario) y el mismo componente en toda la app.
10. **Deshacer en vez de "¿Estás seguro?"** para lo reversible. Se pide confirmación solo para Reiniciar demo y eliminar carpeta.
11. **Simetría:** agregar y quitar tienen el mismo peso visual y la misma cantidad de pasos. "Invitar contactos" no va preseleccionado ni reaparece si se ignora.
12. **Agrupar con tarjetas y cercanía:** cada etiqueta pegada a su campo.
13. **Barras de acciones cortas:** máximo 4–5 opciones visibles a la vez.
14. **Animación solo como respuesta a una acción**, nunca decorativa.

---

## 4. Reparto

### Bloque base (martes 27; todos dependen de él)
- [ ] **Proyecto:** Vite + dependencias de la sección 3, `.nvmrc`, `.gitignore` (excluye `node_modules`, `dist` y `docs/clases/`), `vercel.json` y README con cómo correrlo y con los datos concretos de T1, T2 y T3.
- [ ] **Store completo** según la sección 3: tipos, archivos, persistencia, deshacer, toast, acciones del bloque base y stubs con firma fija en los slices de A y B.
- [ ] **`scripts/seed-books.mjs`**, con `books.json` y las portadas ya generados.
- [ ] **Datos iniciales de la biblioteca:**
  - unos 35 libros, de ellos **22 en "Quiero"**;
  - **2 en "Leyendo"**, con `startedAt` hace 12 y 30 días; uno es el libro de T1;
  - 10 en "Leído";
  - carpetas: Próximos (fija, 2 libros), Terror, Novela, Ciencia ficción y Regalos.
- [ ] **Datos iniciales sociales:**
  - **Yo:** Alex Muñoz, @alexlee, código `LEE-1024`.
  - **3 amigos:** Diego Fuentes (@diegolee), Valentina Soto (@valelee) y Tomás Rojas (@tomasreads).
  - **Persona de T3:** Camila Torres, @camitorres, código `LEE-4821`, 3 amigos en común, todavía sin agregar.
  - **Homónimo:** Camila Torres, @ctorres_99, 0 amigos en común y otro color de avatar.
  - **4 personas más** en el directorio.
  - **Unas 10 actividades** de los amigos, con fechas relativas a hoy (`daysAgo`).
  - Cada `User` lleva sus `readingIds` y `readIds`.
- [ ] **Componentes compartidos**, `routes.tsx`, `index.css` y `lib/dates.ts`.
- [ ] **Una página placeholder por ruta**, con estos nombres:
  - **A:** `features/library/LibraryPage.tsx`, `FolderPage.tsx` y `features/book/BookPage.tsx`;
  - **B:** `features/home/HomePage.tsx`, `features/search/SearchPage.tsx`, `features/friends/FriendsPage.tsx`, `PersonPage.tsx` y `features/profile/ProfilePage.tsx`.
- [ ] **`docs/registro-ia.md`** con su plantilla.
- [ ] **Repo privado** en GitHub, con la profesora y la ayudante invitadas, y **primer deploy en Vercel**.

### Rol A · Biblioteca (T1 + T2) · `src/features/library/`, `src/features/book/`, `librarySlice.ts`
- [ ] **Mis libros:**
  - grilla de carpetas con "Próximos" primero;
  - chips de estado, que muestran la **misma lista** que una carpeta (con selección múltiple), filtrada por estado;
  - buscador sobre la biblioteca;
  - "+ Nueva carpeta".
- [ ] **Carpeta:** lista de `BookRow`, buscador interno, renombrar y eliminar carpeta, y estado vacío.
- [ ] **Selección múltiple (D6):**
  - se activa con el botón "Seleccionar" o manteniendo presionado;
  - barra de acciones: *Mover a… · Agregar a… · Quitar de esta carpeta · Quitar de mi biblioteca*;
  - el destino se elige en un `BottomSheet`.
- [ ] **Ficha:**
  - portada, datos y descripción (si existe);
  - `StatusControl`, el switch "Poseo" y chips de carpetas (agregar o quitar);
  - si el libro no está en la biblioteca, elegir un estado lo agrega;
  - estado "Libro no encontrado" y estado de carga mientras se ejecuta `fetchWork`.
- [ ] **Panel "Terminé este libro" (D4):**
  - se abre con `?accion=terminar`;
  - inicio = `startedAt` o `addedAt`; fin = `today()`; estrellas opcionales;
  - no permite fin anterior a inicio ni fechas futuras;
  - después, la ficha muestra las fechas y el puntaje, con la opción de editar.
- [ ] **Acciones de `librarySlice`.**
- **Listo cuando:** T1 y T2 se completan desde "Reiniciar demo", en celular y en computador, y cada cambio muestra el toast con Deshacer.

### Rol B · Social y búsqueda (T3 + búsqueda) · `src/features/home|search|friends|profile/`, `src/lib/openlibrary.ts`, `socialSlice.ts`
- [ ] **`openlibrary.ts`:**
  - `searchBooks(query, signal)` con espera de 350 ms mientras se escribe, `AbortController`, timeout de 5 s, búsqueda en el catálogo local si falla y deduplicación;
  - `fetchWork(id)`, que usa la ficha de A.
- [ ] **Buscar:**
  - pestañas que se recuerdan en la URL;
  - **Libros:** resultados en `BookRow`; al tocar uno se hace `upsertBook` y se navega a `/libro/:id`;
  - **Personas:** búsqueda por nombre, @usuario o código;
  - estados de carga, sin resultados y error.
- [ ] **Amigos:**
  - lista de amigos y solicitudes pendientes;
  - "Agregar amigo" lleva a la pestaña Personas, o abre un panel con el campo de código;
  - cada persona muestra avatar, @usuario y amigos en común;
  - *Agregar* → "Solicitud enviada" (con la opción de cancelar) → "Amigos";
  - "Invitar contactos" es un enlace secundario que solo muestra un aviso.
- [ ] **Persona:** qué está leyendo, últimos leídos, libros en común y botón de agregar o estado de la solicitud.
- [ ] **Inicio:**
  - "Leyendo ahora" con el botón "Terminé", que lleva a `/libro/:id?accion=terminar`;
  - feed de actividad con like;
  - estado vacío.
- [ ] **Mi perfil:** código con botón copiar y "Reiniciar demo" con confirmación.
- [ ] **Acciones de `socialSlice`.**
- **Listo cuando:** T3 se completa desde "Reiniciar demo", en celular y en computador; la búsqueda funciona aunque Open Library esté caído; y los estados de carga, sin resultados y error están implementados.

### Puntos de contacto entre A y B (ya resueltos)
- B nunca abre el panel de terminar: enlaza a `/libro/:id?accion=terminar`.
- B nunca toca la biblioteca: usa `upsertBook` y luego navega a la ficha de A.
- A usa `fetchWork` de B. Mientras B no lo tenga listo, la ficha muestra "Libro no encontrado".
- Cada uno escribe solo en sus carpetas y en su slice.

---

## 5. Cómo trabajamos

- **Ramas:** `main` siempre se puede publicar. Cada rol trabaja en ramas con su prefijo, por ejemplo `a/carpetas` o `b/amigos`, y hace merge a `main` cuando pasa `npm run build`, al menos una vez al día.
- **Correr el proyecto:** `npm install` y luego `npm run dev`. Para volver al estado inicial, "Reiniciar demo" en Perfil.

| Día | Qué |
|---|---|
| Mar 27 | Bloque base terminado y publicado |
| Mié 28 – Jue 29 | A y B en paralelo, con merge diario a `main` |
| Jue 29 noche | Integración: probar T1, T2 y T3 desde cero en celular y en computador |
| Vie 30 | Correcciones, capturas para el informe, entrega a las 21:00 y tag `e2-entrega` |
