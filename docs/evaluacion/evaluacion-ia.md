---
type: Evaluación
title: Evaluación heurística de usabilidad — SPOTTER
description: Evaluación heurística (Nielsen, 10 principios) sobre el wireframe del MVP de SPOTTER.
tags: [usabilidad, heuristicas, evaluacion, mvp]
status: draft
---

# Evaluación heurística de usabilidad

## Información general del informe

| Campo | Valor |
|---|---|
| **Fecha (DD/MM/AAAA)** | 19/09/2026 |
| **Producto estudiado** | SPOTTER — wireframe del MVP (Alternativa A: consulta de ocupación en tiempo real por playa). 4 pantallas evaluadas: 1) Mapa / estado normal, 2) Detalle de playa, 3) Sin conexión / dato viejo, 4) Mapa un sábado con La Paz cerrada. |
| **Grupo que evalúa** | gadsii — UNLaM |

**Alcance:** se evalúa únicamente el flujo principal del MVP (abrir la app → leer ocupación → decidir playa). Quedan fuera funcionalidades excluidas del MVP (login, onboarding, reserva anticipada, bloqueo corto, alertas), por lo que no se penalizan como hallazgos salvo cuando su ausencia afecta el flujo evaluado.

**Escala de severidad:** 1 = cosmético · 2 = menor · 3 = mayor · 4 = catastrófico.

---

## Checklist

| ID | Heurística | Total | Parcial | Nulo | N/A | Cantidad de hallazgos | Puntuación general (0 a 5) | Observaciones |
|---|---|:-:|:-:|:-:|:-:|:-:|:-:|---|
| **H1** | Visibilidad del estado del sistema | | ✔ | | | 3 | 3 | Muy bien resuelto el estado "dato viejo / sin conexión" (rótulo, borde punteado, opacidad y antigüedad en minutos). Falla en la pantalla normal: la marca de tiempo es de 11 px en el header y no hay indicador de actualización en curso ni acción manual de refrescar. |
| **H2** | Correspondencia entre el sistema y el mundo real | | ✔ | | | 2 | 3 | El lenguaje es el del usuario (LLENO / LIBRE / CERRADA, "si vas a esta playa…"). Pero la codificación por densidad de trama no tiene correlato en el mundo real y obliga a leer una leyenda; el brief preveía una metáfora de semáforo, más reconocible. |
| **H3** | Libertad y control del usuario | ✔ | | | | 1 | 4 | Toda pantalla tiene salida visible al mapa; ninguna acción es destructiva ni irreversible y no hay modales que bloqueen. Único punto flojo: en el detalle, los botones "Ver PERÓN" / "Ver LA PAZ" no indican cuál está activo. |
| **H4** | Prevención de errores | | ✔ | | | 2 | 3 | Buena prevención del error más caro: CERRADA se distingue de LLENO con trama propia y motivo explícito. Riesgo abierto: el bloque "AULAS" y la disposición espacial sugieren una escala real que no existe, y el dato viejo no exige ninguna confirmación. |
| **H5** | Coherencia y estándares | | ✔ | | | 2 | 3 | Las 4 pantallas comparten estructura, tipografía y jerarquía. Rompe la coherencia el nivel MEDIO, que aparece solo en la pantalla del sábado, sin leyenda ni consecuencia asociada. |
| **H6** | Reconocimiento en vez de recordar | | ✔ | | | 1 | 3 | Las dos playas se ven simultáneamente y cada una lleva su etiqueta textual, así que no hay que memorizar estados. La relación densidad de trama → nivel sí exige recordar la leyenda, que además no se repite en la pantalla del detalle. |
| **H7** | Flexibilidad y eficiencia de uso | | ✔ | | | 2 | 3 | La ruta principal es óptima: cero clics hasta el dato, lo que responde al atributo "eficiencia" del brief. No hay ningún camino acelerado para el usuario recurrente (playa favorita, orden por preferencia, vista reducida) ni personalización. |
| **H8** | Diseño estético y minimalista | ✔ | | | | 1 | 5 | Cada pantalla muestra solo lo que sostiene la decisión. Se resignan explícitamente cifras, distancias y recomendaciones porque el dato es simulado. Único exceso: los recuadros PRIORIZA/RESIGNA/POR QUÉ/SUPUESTO son documentación del wireframe y no deben llegar al producto. |
| **H9** | Reconocimiento, diagnóstico y recuperación ante errores | | ✔ | | | 1 | 4 | La pantalla 3 es el punto más fuerte: nombra el problema en lenguaje llano, explica la consecuencia y ofrece "Reintentar" más reintento automático. Falta diferenciar "sin conexión del teléfono" de "el servidor no responde / no hay dato", que se recuperan distinto. |
| **H10** | Ayuda y documentación | | ✔ | | | 1 | 2 | El onboarding fue excluido del MVP por diseño. Toda la ayuda se reduce a dos microcopys de leyenda de 10 px; no hay forma de responder "¿qué significa MEDIO?" ni "¿de dónde sale este dato?" dentro de la app. |

**Puntuación promedio: 3,3 / 5**

---

## Matriz de hallazgos

| # | Heurística involucrada | Detalle | Severidad (1 a 4) | Mejora sugerida |
|:-:|---|---|:-:|---|
| 1 | H2 — Correspondencia con el mundo real / H6 | La ocupación se codifica por densidad de trama (densa = LLENO, rala = LIBRE). Es una convención arbitraria que el usuario debe aprender de una leyenda de 10 px, y se lee en 2 segundos al volante. El brief mismo asumía una metáfora de semáforo ("la interfaz al basarse en un semáforo, es intuitiva"). | 3 | Sumar color de semáforo (rojo/amarillo/verde) manteniendo la trama y la etiqueta textual como redundancia para daltonismo y sol directo. Agrandar la etiqueta LLENO/LIBRE y darle el mayor peso visual de la caja. |
| 2 | H5 — Coherencia y estándares | El nivel MEDIO existe (aparece en Perón la pantalla del sábado) pero no figura en ninguna leyenda ni tiene texto de consecuencia en el detalle. El usuario ve un tercer estado que el sistema nunca le explicó. | 3 | Definir los tres niveles en un solo lugar y usar la misma leyenda en todas las pantallas. Escribir la consecuencia de MEDIO ("hay lugar, pero puede que esperes unos minutos"). |
| 3 | H1 — Visibilidad del estado del sistema | En la pantalla normal la antigüedad del dato ("dato 08:42 · hace 1 min") está en 11 px, en el mismo renglón que la marca y sin jerarquía. Es la información que legitima toda la decisión y compite con el logo. | 2 | Mover la antigüedad a una franja propia bajo el header, con tamaño mayor, y cambiar su tratamiento visual cuando supera un umbral (p. ej. más de 3 min). |
| 4 | H1 — Visibilidad del estado del sistema | No hay estado "actualizando" ni acción manual de refrescar en las pantallas 1, 2 y 4: solo aparece "Reintentar" cuando ya falló. El usuario detenido en la fila no tiene forma de pedir el dato más nuevo. | 2 | Agregar un control de actualizar siempre visible y un indicador breve de carga que no vacíe la pantalla (mantener el dato anterior mientras llega el nuevo). |
| 5 | H4 — Prevención de errores | El bloque "AULAS" y la ubicación relativa de las playas sugieren un mapa a escala, cuando el propio wireframe aclara que la disposición espacial no fue relevada. El usuario puede inferir distancias a pie inexistentes. | 2 | Rotular el esquema como orientativo dentro de la propia pantalla, o simplificarlo a dos tarjetas sin pretensión geográfica hasta relevar distancias reales. |
| 6 | H1 — Visibilidad / H3 — Libertad y control | En el detalle, los botones "Ver PERÓN" y "Ver LA PAZ" están siempre en el mismo estado visual. Si el usuario toca el de la playa que ya está viendo, no percibe ningún cambio y puede creer que la app se colgó. | 2 | Marcar como activo el botón de la playa mostrada (o desactivarlo), y mantener visible el estado de la otra playa en el mismo botón para permitir comparar sin volver al mapa. |
| 7 | H9 — Recuperación ante errores | La pantalla 3 cubre "sin conexión", pero no hay estado diferenciado para "el servidor no responde" o "no hay dato disponible para esta playa". Se le atribuiría al teléfono un problema del sistema y el usuario intentaría una solución equivocada. | 2 | Definir al menos dos mensajes distintos (falla de red del dispositivo vs. falla del servicio) con la misma degradación no bloqueante ya diseñada. |
| 8 | H4 — Prevención de errores | El dato viejo se marca pero nada frena la decisión sobre él. Con 12 minutos de antigüedad en hora pico, la ocupación pudo invertirse por completo y el usuario igual decide a qué playa ir. | 2 | Mantener la degradación no bloqueante (es correcta para el contexto), pero escalar el aviso según la antigüedad: pasado cierto umbral, reemplazar el nivel por "sin dato confiable" en lugar de mostrar LLENO/LIBRE atenuados. |
| 9 | H7 — Flexibilidad y eficiencia de uso | No existe ningún camino distinto para el usuario recurrente. U2 va 5 días por semana siempre a Perón y ve exactamente la misma pantalla que un visitante que entra por primera vez. | 2 | Permitir fijar una playa preferida que se muestre primero o en tamaño mayor, sin ocultar la otra. Es bajo costo y refuerza el atributo de eficiencia priorizado en el brief. |
| 10 | H10 — Ayuda y documentación | No hay forma de averiguar dentro de la app qué significa cada nivel, con qué frecuencia se actualiza el dato ni de dónde proviene. La única ayuda son dos líneas de leyenda de 10 px en el mapa. | 2 | Sumar un acceso mínimo a información ("¿Cómo funciona?") desde el header, con la leyenda de niveles, la frecuencia de actualización y el origen del dato. No requiere onboarding ni bloquea el flujo. |
| 11 | H5 — Coherencia y estándares | El header cambia de contenido entre pantallas: muestra "SPOTTER" en 1, 3 y 4, pero en el detalle lo reemplaza por "‹ Mapa", y el sábado agrega "sábado ·" antes de la marca de tiempo en el mismo espacio ya cargado. | 1 | Fijar una estructura única de header (identidad + contexto + antigüedad del dato) y ubicar la navegación de retroceso en una posición constante. |
| 12 | H8 — Diseño estético y minimalista / H3 | El detalle ofrece dos controles distintos para el mismo destino: "‹ Mapa" arriba y "Volver al mapa" abajo. La redundancia es defendible, pero suma peso visual en la pantalla más cargada del flujo. | 1 | Conservar solo el botón inferior (alcanzable con el pulgar) y dejar arriba el gesto/flecha estándar de la plataforma. |

---

## Conclusiones / Recomendaciones generales

El wireframe resuelve bien aquello que el brief definió como crítico. La ruta principal —abrir, mirar, decidir— es de cero clics hasta el dato, con ambas playas visibles al mismo tiempo y con el mismo peso visual, lo que responde directamente al atributo de **eficiencia** priorizado por U1 y U2. Y la pantalla del sábado demuestra un cuidado explícito del atributo **tasa de errores**: separar CERRADA de LLENO con una trama propia y un motivo escrito evita el peor error posible, que el usuario espere a que se libere una playa que directamente no abre. La degradación no bloqueante ante falta de conexión (pantalla 3) es la decisión de diseño más sólida del conjunto, porque mantiene la información a la vista en el momento exacto en que el 4G falla.

Las debilidades se concentran en dos frentes. El primero es la **legibilidad del código visual**: la densidad de trama es una convención que el producto inventa y que el usuario debe aprender, en un contexto de estrés cognitivo donde no hay tiempo para consultar leyendas; a esto se suma el nivel MEDIO, que aparece sin haber sido definido. El segundo es la **confianza en el dato**: la antigüedad de la información es lo que sostiene toda la decisión, y hoy está tipografiada como metadato secundario, sin posibilidad de forzar una actualización.

**Prioridad de corrección antes de la validación con usuarios (TP5):**

1. Reforzar la codificación de niveles con color de semáforo y jerarquía tipográfica mayor, conservando trama y texto como redundancia (hallazgo 1).
2. Definir y documentar los tres niveles de forma consistente en todas las pantallas, incluida la consecuencia de MEDIO (hallazgo 2).
3. Jerarquizar la antigüedad del dato y agregar actualización manual (hallazgos 3 y 4).
4. Diferenciar el estado activo en los botones de cambio de playa del detalle (hallazgo 6).

Los hallazgos 5, 7, 8, 9 y 10 pueden abordarse en una segunda iteración; los 11 y 12 son cosméticos. Finalmente, cabe recordar que los recuadros PRIORIZA / RESIGNA / POR QUÉ / SUPUESTO son documentación del proceso de diseño y no forman parte de la interfaz: deben retirarse antes de poner el prototipo frente a U1, U2 y U3, porque de lo contrario sesgan la prueba al explicarle al usuario lo que se espera que entienda por sí solo.
