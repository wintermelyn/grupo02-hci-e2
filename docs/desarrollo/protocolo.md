# Protocolo de fases

El prototipo se implementa por fases, cada una en una sesión nueva. El prompt de cada fase dice qué se construye. Este protocolo dice cómo parte, cómo se comprueba y cómo cierra, para que todas trabajen igual.

**Esta rama** es `wintermelyn/desarrollo-proyecto`, y cada sesión abre en su carpeta, `desarrollo-proyecto`. El trabajo de cada fase llega aquí por un pull request (PR), y `main` avanza solo por otro PR, cuando se aprueba un checkpoint (CP). Mientras duren las fases, esto reemplaza el merge diario a `main` de la sección 5 de `PLAN.md`.

## Ramas y pull requests

Todo cambio queda en un PR. No se hace merge local hacia esta rama ni push directo a `main`.

- **Rama de la fase:** cada fase trabaja en su propia rama, nacida del último commit de esta rama. Se llama `fase-<n>`, salvo que el prompt dé otro nombre. Ahí va todo lo de la fase, incluidos sus cierres.
- **PR de la fase:** va de la rama de la fase hacia esta rama. Se abre al cerrar la fase y queda abierto hasta que Matías apruebe el CP.
- **PR de publicación:** va de esta rama hacia `main`. Se abre y se integra con `Aprobé el CP<n>`.

La sesión integra los PR en GitHub con `gh pr merge --merge`, nunca antes de `Aprobé el CP<n>` y primero el de la fase. Si un PR está en borrador, antes lo saca de borrador. Si este PR depende de otro que sigue abierto, la descripción enlaza ese PR.

## Reglas de toda fase

- El informe no se modifica.
- Los conceptos del curso los pone el equipo.
- Si algo no está definido, se elige lo que mejor calce con el informe y el plan, y se anota como decisión en el CP para que Matías la revise.

## Diseño visual

`DESIGN.md` describe el aspecto de la app. Nace en la fase 2, desde lo que ya quedó construido, y las fases siguientes lo siguen.

- **Qué manda:** el informe, después `PLAN.md` y después `DESIGN.md`. `DESIGN.md` fija tipografía, color, densidad, formas y un gesto propio. Las pantallas, los flujos, los textos y D1–D6 siguen saliendo del informe y del plan. Ante un choque con las 14 reglas de interfaz de `PLAN.md`, ganan las reglas.
- **Modo:** todas las pantallas son de modo Operate. Cada una se reconoce primero como una app para ordenar libros, con controles estándar.
- **Dónde corren las skills:** Impeccable y design-taste-frontend viven en `.claude/`, que no llega a los worktrees. Un agente en worktree las usa por la ruta absoluta de esta carpeta. Impeccable crea el mundo visual en la fase 2 y pule en la fase 5, con `/impeccable polish`. Desde la fase 3 ambas se usan antes de construir y al revisar.
- **Quién elige:** Impeccable propone las direcciones en su página y la sesión espera. Matías elige, y el CP registra la elegida y las descartadas.
- **Agentes en paralelo:** construyen con `DESIGN.md`, los tokens de `src/index.css` y los componentes compartidos. Lo que el sistema no cubra sigue "Antes de construir" y se anota como decisión para el CP.

### Antes de construir

Aplica a cada pantalla nueva y a cada pieza que `DESIGN.md` no cubra. Leer una skill no cuenta como usarla.

1. Quien construye corre `impeccable context --target <archivo>`.
2. Corre `draw.mjs --app --kind <tipo> --brief "<producto>" --keep palette,type --options 3`, elige una dirección y saca su hoja completa. La paleta, la tipografía y la Cinta marcapáginas se mantienen.
3. Construye tres propuestas de verdad distintas de esa pieza. Cambiar solo el radio o el color no cuenta. Las captura en celular y computador.
4. Elige una, con una razón que venga de este producto, y sigue. El CP muestra las tres para que Matías pueda cambiarla.
5. Su informe trae los comandos que corrió, sus resultados y las capturas de las tres. Si una herramienta no corre, informa el error exacto.

### Fallas ya vistas

Quien construye y quien revisa comprueban cada punto en el navegador, en los cuatro dispositivos. Las capturas, las medidas y los revisores corren una vez, cuando el trabajo está terminado, y no después de cada cambio.

- **Lugar:** lo que se abre aparece donde se tocó. Un control no abre algo más abajo ni empuja la lista.
- **Forma:** una pantalla mantiene su forma con el dato presente o ausente. Lo que falta se avisa en el mismo lugar donde estaría.
- **Borde:** ningún campo ni bloque queda pegado a un cambio de color. La distancia se mide.
- **Un sentido por botón:** un botón no cambia de significado según el estado. Quien pierde datos lee cuáles antes de confirmar.
- **Sin modales:** ni diálogos ni paneles inferiores. Las alternativas están en `DESIGN.md`.
- **Espacio:** el primer contenido útil se mide a 320 px y su alto va en el informe.
- **Casos extremos:** título y nombre largos, dato ausente, listas vacías y control con su texto más largo. Nada salta de línea sin querer ni se sale del margen.
- **Medidas:** contraste, áreas de 44 px y scroll horizontal se miden; no se estiman.

### Revisión de las fases 3 y 4

Va después de corregir los hallazgos del recorrido.

1. La sesión corre `.claude/skills/impeccable/scripts/impeccable detect --json src`, y `lint.mjs --app src` e `inspect.mjs --app <url>` de design-taste-frontend.
2. Lanza el agente `impeccable-finish-reviewer` sobre las pantallas nuevas, con sus capturas en los cuatro dispositivos, `DESIGN.md` como vara y "Fallas ya vistas" como lista. Le pasa las palabras de Matías y las capturas, sin el razonamiento de la sesión.
3. Corrige sus arreglos, vuelve a capturar y le pide veredicto otra vez.
4. La revisión termina con veredicto `ship` o, tras dos rondas de arreglos, con lo abierto como hallazgo del CP. El veredicto va en la evidencia del CP.

Un comentario de Matías sobre el aspecto se encarga a un agente nuevo, con sus palabras textuales, para que no herede el razonamiento de la sesión.

## 1. Empezar

Una fase parte cuando Matías escribe `Aprobé el CP<n>` con sus respuestas. La fase 1 no viene de un CP y parte directo con su prompt. `Aprobé el CP6` no abre otra fase, pero hace estos mismos pasos para que el cierre de la fase 6 llegue a `main`.

1. Se integra el PR de la fase aprobada y se actualiza esta rama con `git pull --ff-only`.
2. Se pasan las respuestas a `PLAN.md`. Las decisiones de implementación van a la sección 6, y si una respuesta cambia otra sección, esa también se edita.
3. Se hace commit en esta rama y se hace push, sin forzar. Si `main` tiene commits que esta rama no tiene, primero se hace merge de `main` en esta rama.
4. Se abre el PR de publicación y se integra. Vercel despliega desde `main`, así que este paso publica el prototipo.
5. Se actualiza esta rama con `git pull --ff-only origin main`, se hace push y se crea la rama de la fase nueva.

**Listo cuando** `git status` no muestra cambios y esta rama y `origin/main` apuntan al mismo commit.

## 2. Construir en paralelo

Aplica cuando un workflow construye en paralelo. Cada agente:

- trabaja en su propio worktree, creado desde el último commit de la rama de la fase, y lo comprueba antes de escribir. Si nació de otro commit, lo avanza con `git merge --ff-only`;
- parte con `npm ci`;
- recibe las secciones de `PLAN.md` que le tocan, `DESIGN.md` y "Diseño visual" de este protocolo;
- hace commit en su rama.

Después un agente integra las ramas de los agentes en la rama de la fase hasta que pasen format, lint, test y build. Ese resultado llega a esta rama con el PR de la fase.

**Listo cuando** todas las ramas están integradas y `npm run format:check`, `npm run lint`, `npm test` y `npm run build` pasan en la rama de la fase.

## 3. Recorrer

Recorrer es usar la app en el navegador desde "Reiniciar demo" como alguien que no conoce el código, con `docs/desarrollo/tareas.md` y sin cambiar nada.

- Quien recorre se guía solo por la pantalla y por `docs/desarrollo/tareas.md`, y guarda una captura por paso.
- El navegador es el de la sección 4: Playwright con Chrome sobre `vite preview`, en el dispositivo que pida la fase.
- Mientras Mi perfil no tenga el botón "Reiniciar demo", se parte de un contexto de navegador nuevo, que carga el mismo estado inicial.

### Hallazgos

Lo que se reproduzca es un hallazgo: al repetir los pasos desde el inicio, vuelve a pasar. Cada hallazgo nombra su pantalla y dispositivo, se escribe como qué vi, qué esperaba y qué pasó, y lleva severidad y estado.

| Severidad | Cuándo se usa                                                                                     |
| --------- | ------------------------------------------------------------------------------------------------- |
| Alta      | Impide completar T1, T2 o T3, pierde datos o contradice una decisión D1–D6                        |
| Media     | La tarea se completa, pero hay un error visible, una confusión o una regla de interfaz incumplida |
| Baja      | Detalle que no cambia el resultado de la tarea                                                    |

| Estado     | Qué dice el hallazgo                  |
| ---------- | ------------------------------------- |
| Corregido  | Con qué commit se arregló             |
| Decisión   | Que quedó entre las decisiones del CP |
| Abierto    | Por qué sigue así                     |
| Descartado | Por qué se descartó                   |

## 4. Capturar

Las capturas se hacen con Playwright instalado en `.claude/capturas/`, con su propio `package.json` y fuera del `package.json` del repo. Usan el Chrome instalado (`channel: 'chrome'`) sobre `vite preview` y un contexto nuevo por dispositivo.

```sh
npm run build
npm run preview -- --strictPort
```

El build va primero porque `vite preview` sirve `dist/`. `--strictPort` evita capturar la app de otra carpeta que ya esté usando el puerto.

| Dispositivo    | Perfil de Playwright | Ancho   |
| -------------- | -------------------- | ------- |
| Celular chico  | `iPhone SE`          | 320 px  |
| Celular normal | `Pixel 7`            | 412 px  |
| Tablet         | `iPad Mini`          | 768 px  |
| Computador     | `Desktop Chrome`     | 1280 px |

`iPad Mini` mide justo el punto de quiebre `md`, así que muestra la barra superior en su ancho mínimo.

La lista de pantallas vive en el script de `.claude/capturas/`. Cada fase agrega las suyas y vuelve a capturar la lista completa.

`.claude/` no se sube ni llega a los worktrees, así que los recorridos, las capturas y el CP se hacen en esta carpeta.

## 5. Armar el checkpoint

Cada fase cierra con un CP, una página en `docs/desarrollo/checkpoints/cp<n>/index.html` que abre sin servidor. Cada CP tiene su carpeta y queda en el repo con el PR de la fase. La arma la sesión principal. Lleva su CSS adentro y sus capturas copiadas al lado, con rutas relativas, para que no cambie cuando la fase siguiente vuelva a capturar.

Trae cuatro cosas, en este orden:

1. **Explicación** en lenguaje simple, sin nombres de archivos, de qué se puede hacer ahora, qué cambió por dentro, qué quedó pendiente y cómo probarlo.
2. **Decisiones** que Matías necesita tomar, con por qué surgieron, 2 o 3 opciones con sus consecuencias, cuál quedó por defecto y cuánto cuesta cambiarla.
3. **Capturas**, con una fila por pantalla o estado y una columna por dispositivo.
4. **Evidencia**, con el resultado de format, lint, test y build, los hallazgos con su estado, los commits y los agentes que corrieron.

`npm run format` reescribe los archivos y siempre pasa, así que la evidencia usa el resultado de `npm run format:check`.

**Listo cuando** todo lo de la fase tiene captura en todos los dispositivos, cada hallazgo tiene estado y cada decisión tiene opciones.

## 6. Cerrar

1. Se marca en la sección 4 de `PLAN.md` lo que quedó hecho.
2. Se agrega a `docs/registro-ia.md` una fila con el prompt en español formal y con ortografía correcta, con todo su contenido y cada pedido. Va en una sola línea, con `<br>` entre párrafos y con `|` y `<` escapados con `\`. Lo que la persona ajustó sobre el resultado va en "Qué cambiamos" como los cambios hechos, sin hablar de iteraciones ni de prompts; la sesión deja un borrador y la persona lo revisa y completa. Un encargo extenso hecho sobre ese resultado puede ir como fila propia, justo después.
3. Se hace commit en la rama de la fase y se hace push.
4. Se abre el PR de la fase, o se actualiza si ya existe. No se integra.
5. Se abre la página con `open docs/desarrollo/checkpoints/cp<n>/index.html`.
6. Se resume el resultado en cinco líneas, con el enlace al PR.

Ahí se termina y se espera la respuesta de Matías.

Una sesión de correcciones sobre un CP trabaja en la misma rama de la fase, actualiza esa misma página y cierra con estos mismos pasos. Sus cambios quedan en el mismo PR y llegan a `main` con el `Aprobé el CP<n>` siguiente.
