---
version: 1
slug: "src-features-library-librarypage-tsx"
primary_target: "src/features/library/LibraryPage.tsx"
related_targets: ["src/features/book/BookPage.tsx", "src/features/library/FolderPage.tsx", "src/features/friends/FriendsPage.tsx", "src/features/friends/PersonPage.tsx", "src/features/more/MorePage.tsx"]
---

# Pantallas construidas · Cinta marcapáginas

**Alcance y modo:** Mis libros, ficha, carpeta, Más, Amigos y Persona. Modo Operate. Público primario: quien prueba el prototipo sin ayuda en la E3. Tarea: encontrar un libro por tag o carpeta y cambiarle el tag en la ficha.

**Restricciones:** las 14 reglas de `PLAN.md` ganan a este documento. Solo se lee el store, salvo el selector de tags. Las acciones siguen para la fase 3. La interfaz no usa el logo de Goodreads ni la palabra "tag".

**Dirección elegida:** Cinta marcapáginas. Momento memorable: el tag cambia y la cinta bajo la portada se reemplaza en su lugar.

## Direction contract

THESIS: la biblioteca se ve como Goodreads en sus neutros y su tinta, sin color de marca, y una sola cinta marca lo activo. Rechaza la app teñida por un acento, las píldoras de color por fila y todo modal: lo que se edita se edita en su lugar.

OWN-WORLD: fondos `#faf8f6`, `#f4f1ea` y blanco, arena `#ebe2d7`, tinta `#1e1915`, neutro `#5f564d`, cinta burdeo `#7a2334`. Títulos en Source Serif 4 semibold, interfaz en Figtree. Tags sin relleno, con ícono, texto y color. Jerarquía por fondo, filas y espacio, como un libro mayor: solo flota con sombra el menú y el aviso, y los controles llevan un borde de 1 px medido (`edge`, `#857a6e`). Portadas sin teñir, con sombra física.

STORY: la persona ve cuántos libros tiene en cada tag y sus carpetas, entra a un libro, ve su estado junto a la portada y lo cambia ahí mismo. Entiende que el tag no mueve el libro de sus carpetas porque ambos se ven juntos.

FIRST VIEWPORT: Mis libros: banda `#f4f1ea` a todo el ancho con h1 serif de 28 px en celular y 32 px desde tablet, "34 libros en tu biblioteca" y cinco botones de tag iguales con cantidad serif y etiqueta, y una cinta burdeo colgando del botón activo, que abre hacia el fondo. Debajo, "Mis carpetas" en dos columnas de tarjetas con dos portadas, con "Próximos" primero y su cinta. Abajo, barra blanca con cinco secciones, y cinta sobre la activa. Ficha: sobre el papel, la portada de 112 px con la cinta del tag asomando bajo ella, el título serif y los datos a su lado, y debajo el registro: filas de Estado, fechas, Puntaje y Carpetas, cada una editable ahí mismo. El menú anclado abre bajo la fila del tag.

FORM: candidata 7 de 7 en la lista propia de la segunda ronda. seed:9d2f6e6bc7b891a3

SIGNATURE: la cinta. Al elegir un tag, el menú se desvanece, el texto del tag entra en su lugar y la cinta nueva baja desde detrás de la portada, en 180 a 220 ms, solo como respuesta a esa acción. Con reducir movimiento, el cambio es instantáneo.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

**Sin resolver:** ninguna decisión de producto. Las anotadas para el CP van en su página.
