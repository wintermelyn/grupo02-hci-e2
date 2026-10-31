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

## Catálogo ampliado

`scripts/seed-catalog.mjs` suma, a los 54 libros de arriba, los más leídos con edición en español y un grupo de autores hispanos y latinoamericanos. Los 54 no se tocan. Las respuestas de Open Library y los datos intermedios quedan en `.claude/catalogo/`, que no se sube, así que cada etapa se puede repetir sin volver a pedirlos. Necesita ImageMagick (`magick`).

```bash
node scripts/seed-catalog.mjs candidates   # las listas de Open Library
node scripts/seed-catalog.mjs works        # cada obra con sus ediciones en español
node scripts/seed-catalog.mjs select       # aplica las reglas, sin red
node scripts/seed-catalog.mjs covers       # portadas de 300 px, de unos 15 KB
node scripts/seed-catalog.mjs pending      # libros.json y pendientes-1 a 6.json
```

- Lo que se decide a mano está en `scripts/catalog-lists.mjs`: los autores hispanos con su cuota, las exclusiones y su motivo, los títulos que en español son iguales al original, las portadas descartadas al revisarlas y las correcciones de título, autor y año.
- Las reglas están en `scripts/catalog-rules.mjs`, con sus tests. El título es el que más repiten las ediciones en español. Una edición con título en otro idioma trae mal la marca de idioma: no vota y su portada no se usa.
- El año de Open Library es el de la edición más antigua que tiene registrada, y muchas veces es un relleno como 1900 o 2000. Los que se conocen están corregidos en `BOOK_FIXES`.
- Una obra sin título español confiable o sin portada de una edición en español queda fuera, con su motivo en `.claude/catalogo/excluidos.json` y `sin-portada.json`.
- Las descripciones que no vienen en español quedan en `pendientes-1.json` a `pendientes-6.json`. Cada objeto trae además `sourceLanguage`, que `scripts/translated-descriptions.json` necesita.

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
