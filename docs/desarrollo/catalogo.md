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

## Colores de portada

`src/data/coverColors.json` guarda el color dominante de cada portada, y `coverTone` lo oscurece para usarlo como fondo de una tarjeta. Se genera desde `public/covers/` y queda en el repo, así que la app no decodifica imágenes.

```bash
node scripts/cover-colors.mjs
npm test
```

- Después de agregar libros, el script solo calcula las portadas que no tienen color. `npm test` avisa si falta alguna.
- Una portada que ya tiene color lo conserva, para que un libro nuevo no cambie las tarjetas de los demás. `--all` los calcula todos de nuevo.
- Los colores actuales son los aprobados, y se calcularon antes que este script. `--all` se acerca a ellos sin ser idéntico: el tono final se mueve 7 puntos en promedio en su canal más distinto, 29 como máximo, y uno de los seis libros sin color pasa a tenerlo. Úsalo solo si se quiere cambiar ese aspecto.
- Promedia la portada en una grilla de 32 × 48, deja fuera los grises, los negros y los blancos, elige el matiz que más pesa, contando más los colores vivos, y toma la celda más viva de ese matiz. Una portada con menos de 2 % de celdas con color queda en `null`.
