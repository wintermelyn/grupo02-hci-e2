# Conceptos de HCI para el desarrollo

Conceptos del curso IIC3182 (2026-2), filtrados a lo que sirve para construir y revisar el prototipo. Cada concepto tiene **qué es**, **cómo se nota en una interfaz** y una **pregunta de prueba** para revisar nuestras pantallas.

Para el informe, cada decisión de diseño se explica con **un** concepto y por qué ese. El enunciado acepta: affordance, signifier, mapeo, retroalimentación, restricción, una heurística de Nielsen, carga de memoria, modelo mental, golfo de ejecución o de evaluación. Nombrar varios conceptos sin usar ninguno es justo el ejemplo de "mal justificada" del enunciado.

---

## 1. Norman: principios de interacción

| Concepto | Qué es | Cómo se nota | Pregunta de prueba |
|---|---|---|---|
| **Visibilidad** | Lo que se puede hacer se debe ver, y el sistema informa su estado. Ojo: visibilidad no es mostrar todo, sino que se vea lo que importa | Acciones a la vista, estado actual indicado | ¿Alguien que llega por primera vez ve qué puede hacer aquí? |
| **Affordance** | Lo que el objeto permite (real) y lo que parece permitir (percibida). En digital: botones que parecen presionables, campos que parecen escribibles | Relieve, sombra, forma de botón, bordes de campo | ¿Esto parece tocable? ¿Hay algo que parece tocable y no lo es (affordance falsa)? Problemáticas típicas: texto azul subrayado que no es link, flat design extremo (¿botón o adorno?), elementos arrastrables sin pista visual |
| **Signifier** | La señal que comunica dónde y cómo actuar. La affordance es la posibilidad; el signifier la comunica. "si necesita instrucciones, el diseño falló" | Íconos, lupa en el buscador, ícono relleno de la sección activa, punto de "nuevo", cursor que cambia | ¿Cómo sabe la persona que esto se puede hacer, sin instrucciones? |
| **Mapping (mapeo)** | La disposición de los controles refleja la de aquello que controlan. Natural mapping: el control es un modelo en miniatura de lo controlado | Control cerca de lo que afecta, orden de los controles igual al del resultado | ¿Es obvio qué cambia cada control sin probarlo? |
| **Feedback (retroalimentación)** | El sistema siempre responde a lo que se hizo: inmediato y proporcional. Sin respuesta, la persona asume que falló y repite. Confirmar la acción es distinto de mostrar el resultado | El botón cambia al tocarlo, toast, check, contador que se actualiza | Después de tocar, ¿algo cambia en menos de un instante? |
| **Restricción (constraint)** | Limita las acciones posibles antes de que ocurra el error. **Física** (la SIM con esquina cortada), **lógica** (opción en gris porque no aplica), **cultural** (convenciones). Molestan cuando no coinciden con la tarea real | Opciones deshabilitadas, fechas inválidas en gris, campos que no aceptan lo imposible | ¿Qué error es imposible cometer aquí? |
| **Consistencia** | Interfaces similares se comportan igual. **Interna** (dentro del sistema), **externa** (con otros sistemas y convenciones), **transferencia** (lo aprendido sirve en otro lado) | Misma palabra = misma cosa, mismo componente para lo mismo, convenciones de plataforma | ¿Lo que aprendí en una pantalla me sirve en la otra? Cada convención respetada es una cosa menos que aprender |

Diferencia clave: **los principios explican por qué algo falla; las heurísticas dan la lista para salir a buscarlo.**

## 2. Las 10 heurísticas de Nielsen (1994, para evaluar)

1. **Visibilidad del estado del sistema:** el sistema siempre informa qué está pasando (progreso, confirmaciones). Ejemplo: el "escribiendo…".
2. **Relación entre el sistema y el mundo real:** hablar el idioma del usuario, no jerga técnica. "Error 0x80070057" no sirve.
3. **Control y libertad del usuario:** salidas de emergencia (deshacer, rehacer, cancelar), sin túneles sin salida. Ejemplo: Gmail no pregunta "¿está seguro?", envía y deja deshacer.
4. **Consistencia y estándares:** seguir las convenciones de la plataforma; la misma palabra significa la misma cosa.
5. **Prevención de errores:** mejor que un buen mensaje de error es que el error no pueda ocurrir (restricciones). Ejemplo: fechas inválidas en gris en el calendario.
6. **Reconocer antes que recordar:** opciones visibles en vez de exigir memoria.
7. **Flexibilidad y eficiencia de uso:** atajos para expertos que no estorban a los novatos.
8. **Diseño estético y minimalista:** cada elemento extra compite con los relevantes.
9. **Ayudar a reconocer, diagnosticar y recuperarse de errores:** mensajes claros que dicen qué pasó y cómo solucionarlo.
10. **Ayuda y documentación:** idealmente innecesaria; si existe, fácil de buscar y orientada a la tarea.

Prevenir es distinto de avisar: el calendario impide el error, el mensaje de error lo comunica cuando ya es tarde.

**Heurística:** regla práctica rápida, sin garantía de óptimo. La evaluación heurística es rápida, barata y sin usuarios, pero encuentra problemas conocidos, no sorpresas.

## 3. Las 8 reglas de oro de Shneiderman (para diseñar)

Coinciden en gran parte con Nielsen. Lo que agregan: diálogos con cierre y reducir la carga de memoria.

1. Buscar consistencia.
2. Usabilidad universal (atajos, accesibilidad).
3. Feedback informativo.
4. Diálogos con cierre: inicio, desarrollo y un fin claro.
5. Prevenir errores.
6. Permitir deshacer fácilmente.
7. Mantener al usuario en control.
8. Reducir la carga de la memoria de corto plazo.

## 4. Modelos mentales y los dos golfos

- **Modelo mental:** la explicación que la persona se arma de cómo funciona algo por dentro, a partir de lo que ve por fuera.
  - Se construye solo, casi nunca es completo ni exacto, y es lo que guía la acción.
  - No necesita ser exacto: necesita ser **útil**, es decir, permitir predecir qué pasa si hago X.
  - Un modelo equivocado no produce ignorancia: produce **acciones equivocadas hechas con confianza**.
  - Ejemplo: el termostato de Kempton (1986). La gente cree que subirlo al máximo calienta más rápido.
- **Los tres modelos (Norman):**
  - **Design model:** el del diseñador.
  - **System image:** lo único que le llega al usuario: pantallas, botones, mensajes.
  - **User's model:** lo que el usuario deduce de esa imagen.
  - El diseñador y el usuario **nunca conversan**: todo lo que queramos comunicar tiene que estar en la imagen del sistema.
- **Golfo de ejecución ("no sé cómo"):** sé lo que quiero lograr, pero no sé cómo pedírselo al sistema.
  - *Síntoma:* da vueltas, abre menús al azar o se rinde.
  - *Causa típica:* la acción está escondida, tiene otro nombre del que la persona espera, o requiere un paso previo invisible.
  - *Se cierra con:* visibilidad, etiquetas en palabras del usuario, valores por defecto, metáforas conocidas y deshacer (si equivocarse no cuesta, la persona prueba).
  - *Prueba:* ¿alguien que llega por primera vez sabe qué tocar?
- **Golfo de evaluación ("no sé si resultó"):** hice algo, pero no sé si funcionó.
  - *Síntoma:* repite la acción o pregunta si funcionó.
  - *Causa típica:* no hay feedback, es ambiguo o llega tarde.
  - *Se cierra con:* estado visible, confirmaciones, mensajes en el lenguaje de la persona y deshacer. El silencio se lee como "falló".
  - *Prueba:* después de actuar, ¿la pantalla dice qué pasó?
- **El vocabulario también es imagen del sistema:** la misma acción, con otro nombre, se encuentra o no se encuentra (por ejemplo, "estante", "lista" o "carpeta").
- **Metáfora conocida:** la papelera no borra, guarda hasta que se vacía. El modelo que la persona ya trae se importa completo y gratis.
- **Un buen diseño no elimina los golfos:** los hace tan angostos que no se notan. Ambos se cierran con lo mismo: hacer visible lo que pasa y responder a cada acción.
- **Ejercicio para nosotros:** escribir en una frase el modelo mental que queremos que se forme el usuario y revisar si se deduce mirando la pantalla, sin explicarla. En la evaluación cruzada, pedirle a la otra dupla que explique qué cree que hace la app: su explicación es el modelo mental real.

## 5. Memoria y carga cognitiva

- **Tres sistemas:**
  - **Sensorial:** dura alrededor de un segundo.
  - **De trabajo:** unos 4 chunks durante unos segundos. Es la frágil, y la que carga nuestra interfaz.
  - **De largo plazo:** lo ya aprendido. Apoyarse en ella es lo que llamamos consistencia.
- **Miller (1956), 7±2, corregido por Cowan (2001) a unos 4:** lo que importa es que el límite se mide en **chunks** (unidades con significado), no en elementos.
- **Chunking:** partir en pocos bloques con sentido.
  - Menús de 5–7 categorías.
  - Procesos largos en 3–4 pasos con el progreso visible.
  - Números en grupos de cuatro.
  - Grupos que *signifiquen* algo para quien mira, no agrupados al azar.
  - Bloques temáticos en vez de listas planas, y campos relacionados juntos.
  - Diseñar bien no es meter más en la memoria, sino hacer que quepa en menos chunks. Si algo tiene más de siete cosas seguidas, ahí hay trabajo.
- **Reconocer > recordar:** reconocer es mucho más barato que recuperar de la memoria. Un ícono ambiguo parece reconocimiento pero obliga a recordar. **Si un ícono no es universal, va con etiqueta de texto.**
- **Diseñar para la memoria:**
  - Valores por defecto inteligentes y autocompletar.
  - Mantener visible el contexto (pasos, historial).
  - Progressive disclosure: mostrar lo necesario cuando es necesario.
  - No pedir que se reingrese lo que el sistema ya sabe.
  - Nunca mostrar un dato en una pantalla y exigirlo en la siguiente (un código, el usuario de un amigo).
  - La solución no es que la persona se esfuerce más, sino mover la carga de la memoria a la tecnología (gestores de contraseñas, autocompletar).
- "Todo lo que una interfaz te obliga a recordar es un impuesto cognitivo." Si obliga a recordar algo que la memoria no puede sostener, la interfaz está mal, no el usuario.

## 6. Atención

- **Selectiva, dividida y sostenida.** Atender a algo es dejar de atender casi todo lo demás. Por eso que algo esté *en* la pantalla no significa que se *vea*: es la ceguera por falta de atención, como en el gorila de Simons y Chabris (1999).
- **El multitasking no existe:** es task-switching, y cada cambio cuesta tiempo y errores. No hay que diseñar asumiendo atención completa.
- **Fenómenos a respetar:**
  - **Banner blindness:** se ignora lo que parece publicidad.
  - **Ceguera al cambio:** no se nota lo que cambia fuera del foco.
  - **Se escanea, no se lee:** en patrón F, empezando arriba a la izquierda.
  - **Posición:** arriba a la izquierda gana, en culturas occidentales.
- **Reglas:**
  - Un solo foco principal por pantalla y jerarquía visual clara.
  - Contraste y color solo para lo importante.
  - Movimiento y parpadeo "con pinzas".
  - Interrumpir solo cuando el valor para el usuario lo justifica. Una notificación cobra dos veces: el vistazo y el reenfoque.
  - Notificaciones respetuosas: agrupar, priorizar y dejar silenciar de verdad. Sonido y vibración solo para lo urgente.

## 7. Percepción y Gestalt

- **Percibir es construir:** el cerebro agrupa y completa antes de que uno decida mirar.
  - La visión nítida cubre solo 1–2 grados.
  - La periferia detecta movimiento y contraste, pero no lee: un error al costado de la pantalla no existe para quien mira el centro.
- **Preatentivo (se nota sin buscarlo):** color, tamaño, orientación y movimiento.
  - El movimiento gana siempre.
  - Lo preatentivo es un recurso escaso: si todo lleva globito rojo, el globito deja de significar "importa".
- **Principios de Gestalt:**
  - **Proximidad:** lo cercano se lee como grupo; la etiqueta va junto a su campo.
  - **Similitud:** lo parecido se lee como relacionado; todos los botones primarios del mismo color.
  - **Cierre:** completamos figuras incompletas.
  - **Continuidad:** lo alineado se lee como flujo; por eso los carruseles muestran media tarjeta.
  - **Simetría:** se percibe como estable.
  - **Figura/fondo:** el overlay de un modal manda la página al fondo.
  - **Destino común:** lo que se mueve junto, va junto.
  - **Región común y conexión uniforme:** **les ganan a la proximidad.** Una tarjeta con fondo agrupa más fuerte que el espacio en blanco, y por eso las tarjetas funcionan en listados; una línea une pasos (steppers). Cuidado: un fondo mal puesto agrupa lo que no va junto.
  - **Metaprincipio:** el cerebro agrupa siempre. Si no diseñamos los grupos, los forma el azar del layout.
- **Jerarquía visual:** la fijan tamaño, contraste, posición y espacio, no la importancia que uno le asigne. Patrón F en pantallas con mucho texto, patrón Z en pantallas con poco.
- **Color:** agrupa fuerte pero comunica mal.
  - Cerca del 8% de los hombres tiene deficiencia rojo-verde. Con deuteranopia, el rojo de error y el verde de éxito se ven del mismo color.
  - **Nunca codificar solo por color:** siempre acompañarlo de texto, ícono, forma o posición.
  - El contraste se mide (WCAG 1.4.3, mínimo 4.5:1 para texto).

## 8. Tipos de interfaz e interacción

- **Tipos de interacción** (Preece, Rogers y Sharp):
  - **Instructing:** dar órdenes con comandos o menús.
  - **Conversing:** dialogar, como con un chatbot.
  - **Manipulating:** manipulación directa: arrastrar, tocar (Shneiderman, 1983).
  - **Exploring:** moverse por un espacio.
  - **Responding:** el sistema inicia y la persona responde, como en notificaciones o recomendaciones.
  - Primero se decide el tipo de interacción y después la interfaz.
- **Móvil:**
  - Pantalla chica: la jerarquía visual importa más.
  - El dedo es impreciso y tapa lo que toca: targets grandes y nada de hover.
  - El contexto cambia todo el tiempo (luz, movimiento, interrupciones).
- **Web:** el enlace es la unidad de interacción (navegar es saltar, no recorrer), no hay instalación y depende de la conexión y la latencia. La interacción dominante es exploring, apoyada en instructing.
- **El contexto de uso descarta opciones:** manos, vista, ruido, movimiento y costo del error.
- **GUI:** opciones a la vista (reconocer en vez de recordar), con el costo de que ocupan espacio y son más lentas para el experto.

## 9. Ética y dark patterns

- **Patrón oscuro (Brignull, 2010; hoy "patrón engañoso"):** decisión de diseño que engaña, confunde o presiona para que la persona haga algo que no elegiría de manera libre e informada. Beneficia a la organización y perjudica al usuario.
- Hacen que la decisión que el sistema no prefiere cueste más trabajo. Cada patrón oscuro es una heurística invertida: los mismos principios aplicados al revés.
- **Test de simetría:** si salir cuesta más que entrar, hay patrón oscuro.
- Una buena experiencia no es solo terminar la tarea rápido: también importa qué tarea se está facilitando y para quién.
- **Catálogo:**
  - **Interferencia visual:** se destaca una opción y se apaga la otra.
  - **Preselección:** la opción que conviene a la empresa viene marcada.
  - **Urgencia o escasez falsa:** "quedan 2".
  - **Confirmshaming:** el rechazo está redactado para dar vergüenza.
  - **Obstrucción:** suscribirse cuesta un clic y cancelar, varios.
  - **Insistencia (nagging):** se vuelve a pedir lo que ya fue rechazado.
  - **Acción forzada:** registrarse para poder seguir.
  - **Información oculta:** el precio sube en cada paso.
- **Problema de usabilidad vs. patrón oscuro:**
  - El problema de usabilidad dificulta la tarea por error, y se arregla haciéndola más clara.
  - En el patrón oscuro, la dificultad favorece a la organización; hay que cambiar la intención del diseño.
  - Conviene mirar los efectos y quién se beneficia, más que discutir la intención.
- **Un rediseño ético** no obliga a elegir lo que nos parece correcto: permite entender las opciones y decidir. Mismo tamaño, mismo contraste y misma cantidad de pasos para las dos opciones.
- SERNAC (2021) revisó 107 sitios chilenos: 69 tenían al menos un patrón oscuro, y el más frecuente era obligar a registrarse para comprar.
- Caso real: la CNIL multó a Google (150 M€) y a Facebook (60 M€) en 2022 por banners de cookies sin un botón equivalente para rechazar.

## 10. Investigar y evaluar con usuarios (útil para la E3)

- **No somos nuestros usuarios:** lo que nos parece obvio no prueba nada.
- **Lo que la gente dice no es lo que hace.** Nisbett y Wilson (1977): al explicar por qué hicimos algo, no recordamos el motivo, lo deducimos.
- **Preguntar por el pasado concreto, no por el futuro hipotético.** "¿Usarías…?" no es un dato. "Muéstreme cómo lo hace" es la mejor pregunta: pide conducta, no memoria.
- **Pensar en voz alta:** pedir que narre mientras usa la interfaz. Ahí aparecen los golfos ("no sé dónde está esto", "creí que había guardado").
- **Un hallazgo es un hecho, no una impresión.**
  - "El botón no se entiende" no se puede verificar.
  - "El botón dice Continuar pero confirma el pago" sí se puede verificar.
  - Siempre en tres partes: **qué vi, qué esperaba que pasara, qué pasó en realidad.**
- **Severidad:** sirve para priorizar. Si todo es grave, no hay nada que arreglar primero.
- Al auditar, también hay que nombrar lo que funciona: si no se puede decir qué está bien, tampoco se sabe por qué lo otro está mal.

## 11. Ideas de fondo

- **Interfaz:** el punto de contacto donde una persona percibe el estado del sistema y actúa sobre él. Las mejores casi desaparecen.
- **Cuando la persona se equivoca siempre, el problema no es la persona.** Ejemplos: las puertas de Norman, o Citibank (2021), que pagó por error el total de una deuda en vez de solo los intereses, con un costo de 500 millones de dólares. La interfaz exigía marcar la misma opción en tres campos distintos, la persona marcó uno solo y tres revisores lo aprobaron.

---

## Referencias (formato para el informe)

- Norman, D. (2013). *The Design of Everyday Things* (ed. revisada). Basic Books.
- Nielsen, J. (1994). Enhancing the explanatory power of usability heuristics. *Proc. CHI '94*, 152–158. doi:10.1145/191666.191729
- Shneiderman, B., Plaisant, C. et al. (2017). *Designing the User Interface* (6th ed.). Pearson.
- Preece, J., Rogers, Y. & Sharp, H. (2019). *Interaction Design: Beyond Human-Computer Interaction* (5th ed.). Wiley.
- Miller, G. A. (1956). The magical number seven, plus or minus two. *Psychological Review*, 63(2).
- Cowan, N. (2001). The magical number 4 in short-term memory. *Behavioral and Brain Sciences*, 24(1).
- Card, S., Moran, T. & Newell, A. (1983). *The Psychology of Human-Computer Interaction*. Erlbaum.
- Simons, D. & Chabris, C. (1999). Gorillas in our midst. *Perception*, 28(9).
- Kempton, W. (1986). Two theories of home heat control. *Cognitive Science*, 10(1), 75–90.
- Johnson, J. (2010). *Designing with the Mind in Mind*. Morgan Kaufmann.
- Weinschenk, S. (2011). *100 Things Every Designer Needs to Know About People*. New Riders.
- Nisbett, R. & Wilson, T. (1977). Telling more than we can know. *Psychological Review*, 84(3).
- Brignull, H. (2010). Deceptive patterns (deceptive.design).
- Gallardo Estrada, C. (2026). *IIC3182 Interfaces Humano-Computador* [material de clases]. Pontificia Universidad Católica de Chile.
