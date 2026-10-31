# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

El primer público es **quien prueba el prototipo sin ayuda**: otro grupo del curso IIC3182 que en la E3 abre el link por primera vez y debe completar las tres tareas actuando como Alex Muñoz (@alexlee). Cuando una decisión favorece a un público más que a otro, gana lo que esa persona entiende al primer uso.

El público que dio origen al diseño son adultos jóvenes que tienen la lectura como hobby y usan Goodreads como complemento, representados por P1 a P4 en la investigación de la E1. Registran lo que leen y guardan lo que quieren leer, y descubren libros sobre todo fuera de la plataforma. Su trabajo es mantener ese registro al día sin que les cueste.

La profesora y la ayudante revisan el informe, la interfaz publicada y el repositorio. El enunciado evalúa que cada decisión se pueda defender con la materia del curso, no la calidad del código ni que la interfaz sea bonita.

## Product Purpose

Es un prototipo funcional de un rediseño de Goodreads. Busca resolver tres problemas que aparecieron en las entrevistas: actualizar el estado de un libro toma demasiados pasos, las listas se acumulan hasta perder utilidad y agregar a una persona conocida obliga a coordinarse por fuera de la app.

El prototipo tiene éxito si una persona que parte de "Reiniciar demo" completa estas tareas sin ayuda, en celular y en computador:

- **T1:** marcar como leído un libro que terminó, sin que salga de su carpeta.
- **T2:** ordenar su lista de pendientes, separando lo que quiere leer pronto y sacando lo que ya no le interesa.
- **T3:** agregar como amiga a una persona que conoce.

## Positioning

Es **archivo personal primero**. Lo central es mantener la biblioteca ordenada y al día, porque ese es el uso principal que describieron los participantes. Amigos y Descubrir existen y funcionan, pero acompañan al archivo.

Lo que distingue a este rediseño de Goodreads es que el estado de lectura y el lugar donde se guarda un libro son dos cosas independientes. Un libro puede estar en varias carpetas, y cambiarle el tag no lo mueve de ninguna.

## Operating Context

- Se usa como página web, sin instalar nada ni crear una cuenta, desde el link de producción. El enunciado exige que abra en cualquier navegador.
- La evaluación de la E3 es el 25 de noviembre de 2026, con las mismas tres tareas. La URL tiene que seguir funcionando hasta fines de noviembre.
- Cada sesión de evaluación parte desde "Reiniciar demo", en Más → Mi perfil.
- `docs/desarrollo/tareas.md` fija los libros y las personas concretas de cada tarea.

## Capabilities and Constraints

El informe y el plan mandan sobre este archivo. Si se contradicen, el orden es `docs/e2/informe-e2.pdf` y después `PLAN.md`, que trae las pantallas, las rutas, el contrato del store, las reglas de interfaz y el avance.

**Lo que hace el producto:**

- Mis libros, con tablero de carpetas y la carpeta fija "Próximos" primero.
- Cuatro tags excluyentes y visibles en cada lista: Lo quiero, Lo tengo, Leyendo y Leído. "Lo tengo" significa que lo tengo y no lo he leído.
- Botones de tag para filtrar, en Mis libros y dentro de cada carpeta.
- Aviso "¿Sigues queriendo leer este libro?", con un libro antiguo a la vez y botones "Sí" y "No".
- Búsqueda de cualquier usuario dentro de Amigos, con "+ Agregar" y el estado "Solicitud enviada".
- Descubrir, con "Seleccionados para ti" al mismo nivel que las listas prehechas.
- Buscar, solo de libros y autores.
- Deshacer después de cada cambio en la biblioteca.

**Límites técnicos y de alcance:**

- No hay backend. Los datos parten de un seed y se guardan en `localStorage`. Las amistades y las solicitudes son simuladas.
- La búsqueda corre en el navegador sobre el catálogo de la app, por inicio de palabra en título y autor.
- La necesidad N3 (entender contenido en otro idioma o con varias ediciones) no se atiende en esta entrega.
- No hay selección múltiple, código de amigo ni seguidores.

**Límites del curso:**

- La IA se usa para código. Los journeys, las justificaciones de diseño y la reflexión los escribe el equipo.
- Todo uso de IA se declara en `docs/registro-ia.md`.
- El trabajo de diseño no modifica el informe ni asigna conceptos del curso a las decisiones.

**Sin decidir:** en qué dispositivo se hará la E3. Por eso el prototipo debe funcionar igual de bien en ambos, y el diseño parte del celular según `PLAN.md`.

## Brand Commitments

- El producto se presenta con el nombre **Goodreads**, como rediseño académico, y deja claro que es un prototipo.
- No usa el logo oficial de Goodreads ni se hace pasar por el producto real.
- La interfaz va en español de Chile, con trato de tú y en palabras de quien lee, como en "¿Sigues queriendo leer este libro?" y "Seleccionados para ti".
- La misma cosa se llama igual en toda la app, según el glosario de `PLAN.md`. "Tag" es palabra del equipo y la interfaz muestra solo el nombre de cada uno.

## Evidence on Hand

- **Investigación:** entrevistas a P1, P2, P3 y P4, con códigos anónimos, en `docs/e1/informe-e1.pdf`. P5 fue un caso de contraste y quedó fuera del análisis.
- **Decisiones de diseño:** las seis decisiones y las cinco necesidades, en `docs/e2/informe-e2.pdf`.
- **Catálogo:** 1.046 libros reales con edición en español, preparados desde Open Library en archivos estáticos, con portadas en `public/covers/`. Los 54 que usan los seeds van en `src/data/books.json`.
- **Datos simulados:** Alex Muñoz, sus amigos, el directorio de usuarios y sus actividades son ficticios (`src/data/`).

No hay métricas de uso, resultados de evaluación con usuarios ni testimonios para mostrar en la interfaz. La E3 todavía no se hace, así que ninguna pantalla o documento debe afirmar resultados de ella.

## Product Principles

1. **Se entiende al primer uso.** Si algo requiere explicación, conocer la app antes o una instrucción de la evaluación, hay que corregirlo en la pantalla.
2. **El archivo va primero.** Ante la duda, gana lo que ayuda a mantener la biblioteca ordenada y al día.
3. **El estado y el lugar son independientes.** Ningún cambio de tag mueve un libro de sus carpetas, y ninguna pantalla debe sugerir lo contrario.
4. **Equivocarse no cuesta.** Lo reversible se aplica de inmediato y se puede deshacer. Solo Reiniciar demo y eliminar carpeta piden confirmación.
5. **Las opciones pesan lo mismo.** Agregar y quitar, o "Sí" y "No", cuestan los mismos pasos, y la interfaz no empuja a la persona hacia ninguna.

## Accessibility & Inclusion

El requisito viene de las reglas de interfaz de `PLAN.md` y de `docs/conceptos-hci.md`:

- Contraste de texto de al menos 4.5:1.
- El estado siempre se comunica con texto además de color.
- Áreas táctiles de al menos 44×44 px, y nada depende solo del hover.
- Los íconos van siempre con etiqueta de texto, incluida la barra de navegación, salvo las dos excepciones aprobadas en `PLAN.md`: las flechas de un riel, en computador, y el corazón de "Me gusta", en celular. Las dos llevan nombre accesible.
- La animación solo responde a una acción.
