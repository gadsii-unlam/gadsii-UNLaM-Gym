# Registro de trabajo con IA

| Fecha | Herramienta y versión | Prompt (resumen) | TP |
|---|---|---|---|
| 27/08| ChatGPT | Necesito sugerencia de preguntas relacionada a como las personas que asisten al gimnasio registran sus rutinas y progresos | TP2 |
| 05/09| Claude  | Actúa como un diseñador UX/UI experto. Para cada una de las tres alternativas, documentá el diseño con un esquema en texto (tipo wireframe de baja fidelidad en viñetas) de sus pantallas principales. | TP3 |
| 19/09| Claude  | En base al siguiente archivo brief.md y la tabla de evaluación que te adjunto, realiza dicha evaluación sobre el wireframe en base a lo que consideres. | TP4 |
| 31/10| Claude Code (Claude Opus 5.5) | Construir el MVP de UNLaM-Gym a partir del wireframe, con correcciones F01 a F08, log de eventos y herramientas del equipo (ver sección TP5). | TP5 |

## TP5 – Construcción del MVP

**Fecha:** 31/10/2026
**Herramienta:** Claude Code (modelo Claude Opus 5.5), trabajando sobre la rama `MVP`.

### Prompt usado (resumen)

El equipo le pidió a la herramienta construir el MVP de UNLaM-Gym, una web app mobile-first para probar con U1, U2 y U3 y medir si la siguen usando durante la semana posterior. El prompt fijaba:

- **Base:** el wireframe `docs/diseno/wireframe/wireframe_UnlamGym_2.html` y `docs/brief.md`. La herramienta tenía que presentar un plan y esperar el OK antes de implementar.
- **Scope cerrado:** Hoy, Rutina, Calendario del mes actual, Cuota "en construcción" y barra inferior. Quedaban fuera login, backend, Mercado Pago, notificaciones, roles, catálogo, navegación entre meses e inglés.
- **Stack:** HTML, CSS y JS vanilla con ES modules, sin build, publicable en GitHub Pages desde `/app`. La lógica pura va separada en `logic.js` y hay archivos fijos (`store`, `ui`, `events`, `seeds`, `main`). Áreas táctiles de 44 px, sin scroll horizontal en 360 px, fechas locales con `localDateKey`.
- **Usuarios:** identificación por `?u=U1|U2|U3`, que se recuerda en el celular. Persistencia en `unlamgym:v1:<userId>` y seeds con `TODO equipo`.
- **Modelo de datos:** fijado por el equipo (`routine` con `rest` y ejercicios con `id`, `attendance` y `completed` por fecha). Todo se calcula desde `attendance`.
- **Correcciones:** F01, F02, F03, F04, F05, F07 y F08, cada una con su criterio de aceptación, más reglas de racha, constancia y singular/plural.
- **Eventos:** lista fija de eventos, cola en `localStorage` y envío `fetch` POST `no-cors` `text/plain` a `EVENTS_ENDPOINT`, más un Apps Script que escribe en una Google Sheet.
- **Herramientas:** pantalla oculta `?admin=1` para exportar, resetear y reenviar.
- **Calidad:** tests con `node --test`, verificación en 375 px, commits chicos en español y registro de quién decidió qué.

### Qué decidió el equipo (en el prompt)

- El scope, lo que queda fuera de scope y el stack sin frameworks ni build.
- La estructura de archivos de `app/js/` y la separación entre lógica pura y DOM.
- El modelo de datos completo, la clave `unlamgym:v1:<userId>`, la identificación por `?u=` y su persistencia, y que el seed se aplique solo sin datos guardados.
- Los criterios de aceptación de F01, F02, F03, F04, F05, F07 y F08. Los límites de validación (nombre de 1 a 40, series de 1 a 20, cantidad de 1 a 600, unidad reps o seg). Las reglas de racha y constancia. Dejar F06 fuera.
- Los textos del botón de asistencia y del estado vacío.
- La lista de eventos y su formato, el envío con `fetch` `no-cors` `text/plain`, la cola offline y el uso de Apps Script con Google Sheets.
- Las funciones de `?admin=1`, la lista de tests y el uso de una rama `MVP` sin push hasta que el equipo lo pida.

### Qué decidió la herramienta

Cada decisión también figura en el cuerpo del commit correspondiente con el prefijo `Decisión de la herramienta:`.

- **Estructura y publicación:**
  - Un solo `index.html` con las pantallas como `<section>` que se muestran y ocultan, sin router.
  - Un `package.json` mínimo con `"type": "module"` para los tests.
  - Un workflow de GitHub Actions para publicar `app/`, porque "Deploy from a branch" solo admite `/` o `/docs`. Por eso la URL publicada no lleva `/app/`.
- **Estilo:**
  - Ancho máximo de 520 px centrado en escritorio y campos de 16 px para evitar el zoom de iOS.
  - Ícono de una pesa en SVG y PNG (180, 192 y 512 px) generados sin dependencias.
- **Persistencia:**
  - Usuario activo en `unlamgym:v1:activeUser`. Un `?u=` desconocido entra como demo sin pisar el usuario guardado.
  - Si `localStorage` falla o el JSON está corrupto, se usa el seed.
  - `completed` conserva solo la fecha de hoy.
  - Historial de asistencia de demo con fechas fijas de septiembre y octubre de 2026.
- **Rutina:**
  - Formulario como panel dentro de la pantalla, no modal.
  - Confirmación de eliminar en línea, no `confirm()`.
  - Campos numéricos como texto con `inputmode="numeric"` para validar lo escrito.
  - Ids `ex_` + 6 caracteres base 36.
  - Marcar descanso no borra los ejercicios del día.
  - Al eliminar un ejercicio también se borra su marca.
- **Hoy:**
  - El acceso "Agregar ejercicio" en un día vacío abre Rutina en ese día con el formulario abierto.
  - Al cambiar de día con la app abierta se recalcula todo (control cada minuto y al volver a la pestaña).
- **Calendario:** la leyenda queda "▢ hoy", sin "(tocar para marcar)", para no dar instrucciones en la UI.
- **Mensaje comparativo (F07):**
  - Se muestra solo si este mes va mejor que el mismo tramo del mes anterior y hay datos del mes anterior.
  - Texto: "Vas mejor que el mes pasado: N días contra M días a esta altura."
  - Si el mes anterior es más corto, su tramo llega hasta su último día.
- **Eventos:**
  - Envío por lotes de hasta 50 eventos con body `{ "events": [...] }`.
  - Un lote se da por enviado si `fetch` se completa. Puede haber duplicados raros, que se filtran por `userId` + `type` + `ts`.
  - Reintentos al recuperar la conexión, al ocultar o mostrar la pestaña y cada 2 minutos.
  - La cola tiene un tope de 5000 eventos y es única por celular.
  - Los eventos de ejercicios incluyen nombre, series, cantidad y unidad.
  - La pantalla admin no registra eventos.
  - El Apps Script guarda las columnas como texto.
- **Admin:**
  - Nombre del archivo exportado `unlamgym-<usuario>-<fecha>.json`.
  - Confirmación del reset en línea.

### Verificación hecha por la herramienta

- 35 tests unitarios con `node --test`, todos pasan.
- Recorrido automatizado en Chrome headless a 375 px y 360 px, con la fecha simulada y un endpoint de eventos local de prueba. Cubre el flujo principal, F01 a F08, la persistencia, la separación entre usuarios, el modo sin conexión, la pantalla admin y el tamaño de las áreas táctiles. Pasaron las 110 verificaciones.
- No se probó en celulares reales ni con el Apps Script publicado.

### Ajustes después del deploy (31/10/2026)

**Pedido del equipo**, en la misma sesión de Claude Code, rama `mejoras-feedback`:

1. Agregar íconos a las secciones de la barra inferior, que mostraba cuadrados vacíos.
2. Poder moverse entre meses en el Calendario. Este cambio de scope lo decidió el equipo: el prompt original dejaba la navegación entre meses fuera.
3. La pantalla `?admin=1` mostraba información que no coincidía con lo que veía U1. Se pidió corregirla y explicar su alcance.

**Qué decidió la herramienta:**

- **Íconos:**
  - SVG de trazo escritos en el código, sin librería: pesa (Hoy), planilla (Rutina), calendario (Calendario) y tarjeta (Cuota).
  - Lápiz y tacho para editar y eliminar.
  - Línea superior para marcar la sección activa.
- **Calendario:**
  - Flechas para ir al mes anterior y al siguiente, hasta 12 meses atrás y sin meses futuros.
  - Botón "Volver al mes actual".
  - La constancia de un mes pasado se calcula sobre todos los días del mes.
  - La asistencia solo se marca en el día de hoy.
  - Al volver a la pantalla se abre en el mes actual.
  - Nuevo evento `calendar_month_view`.
- **Admin:**
  - Diagnóstico: la pantalla muestra lo guardado en el navegador donde se abre, porque no hay servidor, no lo que hace U1 en su celular. Además, `?u=` cambiaba el usuario guardado y mirar un usuario sin datos le creaba datos.
  - Se rehízo en un módulo propio, `admin.js`. `main.js` quedó como punto de entrada y la app pasó a `app.js`.
  - Ahora explica su alcance, distingue el usuario del navegador del usuario que se está mirando, y mirar no cambia nada.
  - Lista los usuarios con datos y muestra el detalle de cada uno.
  - Avisa si `EVENTS_ENDPOINT` está vacío y cuenta los eventos enviados (`unlamgym:v1:eventStats`).
  - Exporta todos los usuarios del navegador.

**Verificación:** 39 tests unitarios y un recorrido en Chrome headless con 134 verificaciones, que pasó dos veces seguidas. No se probó en celulares reales.
