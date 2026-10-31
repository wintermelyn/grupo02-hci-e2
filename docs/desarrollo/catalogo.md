# Catálogo de libros

El catálogo tiene 1.046 libros y se prepara desde Open Library con scripts. Todo queda en el repo como archivos estáticos, así que la app nunca le pide nada a Open Library.

| Archivo | Qué trae | Cuándo se baja |
| --- | --- | --- |
| `src/data/books.json` | Los 54 libros que usan los seeds, con su descripción | Con el bundle |
| `public/catalog/index.json` | Los 1.046 libros, los más leídos primero: id, título, autores, año, páginas y color de portada. 33 KB comprimido | Al entrar a Buscar o al abrir una ficha que no está a mano |
| `public/catalog/descriptions/0.json` a `15.json` | Las descripciones de los libros que no están en `books.json`, por id. De 16 a 23 KB comprimidos cada uno | Al abrir una ficha, solo el de ese libro |
| `public/covers/{id}.jpg` | Una portada por libro | Cuando se ve |

El archivo de descripciones de un libro es el resto de dividir por 16 el número de su id. Ese 16 está en `scripts/catalog-rules.mjs` y en `src/lib/catalog.ts`, y `scripts/catalog-files.test.mjs` revisa que coincidan.

## Los 54 libros de los seeds

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
# Se traduce cada pendiente a traducidas-*.json, en .claude/catalogo/: un objeto por id, con el
# texto en español, o null si el texto no describe el libro.
node scripts/seed-catalog.mjs translations # los suma a scripts/translated-descriptions.json
node scripts/seed-catalog.mjs publish      # revisa todo y escribe public/catalog/
npm test
```

- Lo que se decide a mano está en `scripts/catalog-lists.mjs`: los autores hispanos con su cuota, las exclusiones y su motivo, los libros sacados del catálogo, los títulos que en español son iguales al original, las portadas descartadas al revisarlas y, en `BOOK_FIXES`, las correcciones de título, autor, año y descripción.
- Todo libro nuevo tiene descripción. Un texto que no describe su libro se marca con `noDescription` en `BOOK_FIXES`, y el libro se saca en `REMOVED_WORKS`, con su motivo. Son 30 libros, además de los 92 que no trajeron un texto utilizable. También salen ahí los 2 libros cuya portada era de audiolibro y no tienen otra que sirva.
- `REMOVED_WORKS` se aplica al final de `select`: cada libro sacado conserva su lugar en las listas, así que no entra otro en su reemplazo sin portada ni traducción.
- Una traducción que ya está en `scripts/translated-descriptions.json` no se reemplaza, así que una corrección hecha ahí sobrevive a otra corrida. Si dos archivos traducen el mismo libro, gana el primero.
- `publish` se detiene si falta una traducción o si a alguna le queda inglés evidente, Markdown, un enlace o una nota de la fuente, con las reglas de `translationProblems`. El nombre de otra obra en inglés dentro de una frase no cuenta.
- Las reglas están en `scripts/catalog-rules.mjs`, con sus tests. El título es el que más repiten las ediciones en español. Una edición con título en otro idioma trae mal la marca de idioma: no vota y su portada no se usa.
- El año de Open Library es el de la edición más antigua que tiene registrada, y muchas veces es un relleno como 1900 o 2000. Los que se conocen están corregidos en `BOOK_FIXES`: los que contradicen el propio texto de la obra y, en un libro escrito en español, los anteriores a su edición en español más antigua. Un año sin ese respaldo en `.claude/catalogo/obras` se deja como está.
- Una obra sin título español confiable o sin portada de una edición en español queda fuera, con su motivo en `.claude/catalogo/excluidos.json` y `sin-portada.json`.
- Las descripciones que no vienen en español quedan en `pendientes-1.json` a `pendientes-6.json`. Cada objeto trae además `sourceLanguage`, que `scripts/translated-descriptions.json` necesita.
- Una traducción sigue las reglas de arriba: es fiel al original y deja fuera las notas de una edición en otro idioma, como el traductor o el material extra.
- Una portada con marco de audiolibro va a `REJECTED_COVERS`, para que entre la siguiente edición en español. Las de audiolibro traen una banda arriba (`AUDIOBOOK` o `Audio Libro en Español`), y sus ediciones son de Audible, Brilliance Audio o FonoLibro.

## Colores de portada

`scripts/cover-colors.json` guarda el color dominante de cada portada, y `coverTone` lo oscurece para usarlo como fondo de una tarjeta. Se genera desde `public/covers/` y queda en el repo, así que la app no decodifica imágenes. Los colores de los 54 libros pasan a `src/data/coverColors.json`, en el bundle, y `publish` lleva los demás a `public/catalog/index.json`, para que el bundle no crezca.

```bash
node scripts/cover-colors.mjs
node scripts/seed-catalog.mjs publish
npm test
```

- Después de agregar libros, el script solo calcula las portadas que no tienen color. `npm test` avisa si falta alguna de los 54.
- Una portada que ya tiene color lo conserva, para que un libro nuevo no cambie las tarjetas de los demás. `--all` los calcula todos de nuevo.
- Los colores actuales son los aprobados, y se calcularon antes que este script. `--all` se acerca a ellos sin ser idéntico: el tono final se mueve 7 puntos en promedio en su canal más distinto, 29 como máximo, y uno de los seis libros sin color pasa a tenerlo. Úsalo solo si se quiere cambiar ese aspecto.
- Promedia la portada en una grilla de 32 × 48, deja fuera los grises, los negros y los blancos, elige el matiz que más pesa, contando más los colores vivos, y toma la celda más viva de ese matiz. Una portada con menos de 2 % de celdas con color queda en `null`.
