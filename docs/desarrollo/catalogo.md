# Catálogo de libros

`src/data/books.json` y las portadas de `public/covers/` se generan una vez desde Open Library y quedan en el repo, así que la app no depende de Open Library para partir.

```bash
node scripts/seed-books.mjs
npm test
```

- La lista de libros (título y autor originales) está en `CATALOG`, dentro del script. Si la búsqueda devuelve otra obra, se fija su clave con `id`.
- Los títulos o autores que llegan en el idioma original o con ruido se corrigen en `OVERRIDES`, por clave de obra. Ahí también se elige otra portada con `coverId`.
- Las descripciones que vienen en español se guardan tal cual. Las que vienen en otro idioma se reemplazan por su traducción de `scripts/translated-descriptions.json`, ordenada por clave de obra y con el idioma de origen; el script la aplica y marca el libro con `descriptionTranslated`.
- Una traducción es fiel al original, sin Markdown, listas de ediciones ni notas de la edición. Si la obra no tiene descripción o la que trae es de otro libro, queda sin ella: no se escribe una sinopsis nueva.
- Las portadas ya descargadas no se vuelven a bajar. Para refrescarlas, borrar `public/covers/` antes de correr el script.
- Si cambian los ids, hay que revisar `src/data/seedLibrary.ts` y `src/data/users.json`; `npm test` avisa si alguno apunta a un libro que no existe.
