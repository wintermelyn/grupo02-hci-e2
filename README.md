# Prototipo E2 · Grupo 2 · Goodreads

Prototipo web responsivo (celular y computador) para las 3 tareas de la E2: marcar un libro como leído (T1), ordenar los pendientes (T2) y agregar un amigo (T3). Es una app solo de frontend: los datos parten de un seed y se guardan en `localStorage`. **Reiniciar demo**, en Más → Mi perfil, vuelve al estado inicial.

## Para empezar

Requiere Node 22 (`nvm use` lee `.nvmrc`).

```bash
npm install
npm run dev           # servidor de desarrollo
npm run build         # chequeo de tipos + build
npm run lint          # oxlint
npm test              # Vitest
npm run format        # Prettier sobre todo el repo
npm run format:check  # solo revisa el formato
```

Antes de cada merge a `main` tienen que pasar `build`, `lint` y `test`.

## Documentación

| Archivo                                                        | Para qué                                                                                |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| [`PLAN.md`](PLAN.md)                                           | Qué se construye, decisiones técnicas y reparto entre los roles A y B. **Leer primero** |
| [`docs/desarrollo/contratos.md`](docs/desarrollo/contratos.md) | Quién es dueño de cada archivo y cómo usar el store y los componentes compartidos       |
| [`docs/desarrollo/tests.md`](docs/desarrollo/tests.md)         | Cómo están armados los tests y qué exigen a cada página                                 |
| [`docs/desarrollo/catalogo.md`](docs/desarrollo/catalogo.md)   | Cómo se regenera el catálogo de libros desde Open Library                               |
| [`docs/desarrollo/tareas.md`](docs/desarrollo/tareas.md)       | Libros y personas concretos de T1, T2 y T3 (para las instrucciones de la E3)            |
| [`docs/conceptos-hci.md`](docs/conceptos-hci.md)               | Conceptos del curso y reglas de interfaz                                                |
| [`docs/registro-ia.md`](docs/registro-ia.md)                   | Registro de uso de IA (anotar cada sesión)                                              |
