# Tests

Cada test va junto al código que prueba (`*.test.ts` o `*.test.tsx`). `src/test/setup.ts` reinicia el store con `resetDemo()` antes de cada test y limpia el DOM, los timers falsos y los mocks después, así que ningún test depende de otro. Ayudas en `src/test/`:

- `state()`: el estado actual del store.
- `stubAction('nombreDeAccion')`: reemplaza una acción por un mock solo durante ese test, para revisar qué llama un componente.
- `renderWithRouter(ui, { route, path })` y `currentLocation()`: montan un componente en una ruta y dicen a qué URL navegó.
- `renderApp(path)`: monta la app completa, con `AppShell`, en una URL.
- `contrast(a, b)`: la razón de contraste WCAG entre dos colores hexadecimales.
- `stubCatalog({ books, texts, failing })`: responde lo que la app baja de `public/catalog/`, y `failing` hace fallar lo que calce. Devuelve el mock, para contar lo que se pidió.

Ningún test llega a la red. `src/test/setup.ts` reemplaza `fetch` por uno que nunca responde y olvida lo bajado, así que una página que usa el catálogo se queda cargando hasta que el test llame a `stubCatalog`.

jsdom no tiene `ResizeObserver` y `src/test/setup.ts` lo reemplaza por uno que no hace nada, para que una página con `useRail` se pueda montar. Tampoco tiene `scrollBy` ni `setPointerCapture`: el test que los necesita los simula, como `src/components/useRail.test.tsx`.

`src/routes.test.tsx` falla si se agrega una ruta sin agregarle una URL de ejemplo.

**Tests que revisan tus páginas.** `src/routes.test.tsx` monta cada ruta y exige que cada página:

- tenga exactamente un `h1`;
- se muestre dentro del `AppShell`, con la navegación "Principal";
- no llame a `console.error`, lo que incluye las advertencias de `act()` de React.

Si una página carga algo de forma asíncrona (por ejemplo el catálogo o una descripción), se prueba en su propio test con `findBy*` o `waitFor`; no se relaja el test de rutas.

`scripts/catalog-files.test.mjs` revisa los archivos publicados en `public/catalog/`: que estén todos los libros, que pesen lo que deben y que ninguna traducción arrastre su fuente.
