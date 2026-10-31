# Catálogo de libros

`src/data/books.json` y las portadas de `public/covers/` se generan una vez desde Open Library y quedan en el repo, así que la app no depende de Open Library para partir.

```bash
node scripts/seed-books.mjs
npm test
```

- La lista de libros (título y autor originales) está en `CATALOG`, dentro del script. Si la búsqueda devuelve otra obra, se fija su clave con `id`.
- Los títulos o autores que llegan en el idioma original o con ruido se corrigen en `OVERRIDES`, por clave de obra. Ahí también se elige otra portada con `coverId`.
- Solo se guardan las descripciones que vienen en español; el resto queda sin descripción.
- Las portadas ya descargadas no se vuelven a bajar. Para refrescarlas, borrar `public/covers/` antes de correr el script.
- Si cambian los ids, hay que revisar `src/data/seedLibrary.ts` y `src/data/users.json`; `npm test` avisa si alguno apunta a un libro que no existe.
