# Tests

Cada test va junto al código que prueba (`*.test.ts` o `*.test.tsx`). `src/test/setup.ts` reinicia el store con `resetDemo()` antes de cada test y limpia el DOM, los timers falsos y los mocks después, así que ningún test depende de otro. Ayudas en `src/test/`:

- `state()`: el estado actual del store.
- `stubAction('nombreDeAccion')`: reemplaza una acción por un mock solo durante ese test, para revisar qué llama un componente.
- `renderWithRouter(ui, { route, path })` y `currentLocation()`: montan un componente en una ruta y dicen a qué URL navegó.
- `renderApp(path)`: monta la app completa, con `AppShell`, en una URL.

`src/routes.test.tsx` falla si se agrega una ruta sin agregarle una URL de ejemplo.

**Tests que revisan tus páginas.** `src/routes.test.tsx` monta cada ruta y exige que cada página:

- tenga exactamente un `h1`;
- se muestre dentro del `AppShell`, con la navegación "Principal";
- no llame a `console.error`, lo que incluye las advertencias de `act()` de React.

Si una página carga algo de forma asíncrona (por ejemplo `fetchWork` o la búsqueda con espera), se prueba en su propio test con `findBy*` o `waitFor`; no se relaja el test de rutas.

`src/test/setup.ts` agrega a jsdom lo mínimo de `<dialog>` (`showModal` y `close`), así que un `BottomSheet` abierto funciona en los tests.
