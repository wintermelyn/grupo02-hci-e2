# CLAUDE.md

Prototipo web de un rediseño de Goodreads (curso IIC3182), sin backend: React 19, Vite, TypeScript, Zustand y Tailwind 4. Dos roles programan en paralelo sobre un bloque base compartido: **A · Biblioteca** y **B · Social y búsqueda**. Cada archivo tiene un solo **dueño**.

## Qué leer y cuándo

- **`PLAN.md`**, al empezar cualquier tarea de implementación. Dice qué pantalla, ruta y acción del store es de cada rol, y trae los tipos, el **contrato** del store y las reglas de interfaz.
- **`docs/desarrollo/contratos.md`**, al usar el store o un componente compartido, al cambiar un seed, o al editar un archivo cuyo dueño no es tu rol.
- **`docs/desarrollo/tests.md`**, al escribir tests o cuando falla `src/routes.test.tsx`.
- **`docs/desarrollo/tareas.md`**, al tocar los libros o personas que usan las tareas T1–T3.
- **`docs/desarrollo/catalogo.md`**, al agregar libros o regenerar `src/data/books.json`.
- **`docs/conceptos-hci.md`**, al decidir cómo se ve o se comporta una pantalla.

## Reglas que el código no muestra

- **Dueños:**
  - Escribe solo en los archivos de tu rol.
  - Los archivos del bloque base se cambian en un commit aparte y avisando al otro rol.
  - Las firmas de las acciones del store son contrato: se implementan, no se cambian. Una acción nueva va en el slice de su rol.
- **Idioma:** la interfaz va en español de Chile. Los identificadores van en inglés, según el glosario de `PLAN.md`.
- **Fechas de calendario:** solo con `today()`, `daysAgo()`, `parseDate()` y `formatDate()` de `src/lib/dates.ts`. Después de las 21:00 en Chile, las conversiones vía UTC dan otro día.
- **Leer el store:** en componentes, con `useStore(selectBook(id))` o `useStore(selectEntry(id))`. Cualquier otro selector debe devolver el dato tal cual; las listas derivadas se calculan con `useMemo` o `useShallow`.
- **"Leído":** solo `finishBook` deja un libro en `read`. La interfaz llega ahí por `onRequestFinish` → `/libro/:id?accion=terminar`.

## Cuándo una tarea está terminada

1. `npm run format`, `npm run lint`, `npm test` y `npm run build` pasan.
2. Lo nuevo tiene su test junto al código (`*.test.ts(x)`).
3. Hay una fila nueva en `docs/registro-ia.md` con la fecha, la herramienta, el prompt y qué se produjo. La columna "Qué cambiamos" la completa la persona.
