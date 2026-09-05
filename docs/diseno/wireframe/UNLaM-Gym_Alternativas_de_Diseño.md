# UNLaM-Gym — Tres alternativas de diseño para el flujo principal

## Flujo principal a resolver (según Brief V3, sección 12 y 14)
Login → Consultar rutina asignada (por día) → Ver ejercicios del día (series/repeticiones) → Registrar asistencia → Ver historial/progreso.

Contexto clave del brief que condiciona el diseño:
- 83% usa el celular *durante* el entrenamiento (contexto de uso: entre series, con poco tiempo/atención).
- El dolor real es "dependencia de la memoria" e "informalidad" (notas sueltas, memoria, WhatsApp), no falta de tecnología per se.
- El objetivo de éxito del MVP es que el 80% complete "ver rutina + registrar asistencia" sin ayuda en la primera semana.

Cada alternativa resuelve este mismo flujo, pero prioriza un atributo de usabilidad distinto.

---

## Alternativa 1 — Facilidad de aprendizaje
**Lógica de diseño:** más pantallas, cada una con una sola decisión posible, refuerzo visual y textual constante, onboarding explícito la primera vez. Pensado para el primer uso / usuario nuevo que no confía todavía en la app.

- **Pantalla 0 — Onboarding (solo primera vez, 3 slides)**
  - Slide 1: "Acá vas a ver la rutina que te asignó tu profe" (ilustración)
  - Slide 2: "Marcá tu asistencia cada vez que vengas"
  - Slide 3: "Con el tiempo vas a ver tu progreso" + botón "Empezar"
- **Pantalla 1 — Login**
  - Campo usuario / contraseña
  - Texto de ayuda debajo de cada campo ("Es el mismo mail con el que te inscribiste")
  - Botón único "Ingresar" (sin acciones secundarias que distraigan)
- **Pantalla 2 — Home / Bienvenida**
  - Saludo con nombre ("¡Hola, Juan!")
  - Un solo bloque central: "Tu rutina de hoy" con botón grande "Ver rutina"
  - Íconos con etiquetas de texto explícitas (no solo íconos): "📋 Ver rutina", "✅ Registrar asistencia", "📈 Mi progreso"
  - Tooltip/globo la primera vez señalando cada botón
- **Pantalla 3 — Selección de día**
  - Lista vertical simple: "Día 1", "Día 2", "Día 3"... con indicación de qué día es hoy resaltado
  - Texto guía arriba: "Elegí el día de tu rutina para ver los ejercicios"
- **Pantalla 4 — Detalle de ejercicios del día**
  - Un ejercicio por bloque/tarjeta grande (no tabla densa)
  - Cada tarjeta: nombre del ejercicio + imagen ilustrativa + "3 series x 12 repeticiones" en texto grande
  - Scroll vertical simple, un ejercicio a la vez, sin información adicional que confunda
- **Pantalla 5 — Registrar asistencia (paso explicado)**
  - Pantalla dedicada, separada del resto
  - Pregunta directa: "¿Viniste hoy a entrenar?"
  - Botón grande "Sí, registrar asistencia" + confirmación visual (check verde + mensaje "¡Asistencia registrada!")
- **Pantalla 6 — Historial/progreso (con explicación)**
  - Calendario simple con días marcados
  - Texto explicativo arriba: "Acá podés ver los días que asististe este mes"
  - Sin gráficos complejos, solo conteo simple: "Fuiste 8 veces este mes"

**Diferencial estructural:** flujo lineal, secuencial, un objetivo por pantalla, con textos guía y confirmaciones explícitas en cada paso. Prioriza que nadie se pierda, a costa de más clics y pantallas.

---

## Alternativa 2 — Eficiencia
**Lógica de diseño:** todo lo posible en una sola pantalla (dashboard), mínimos taps, pensado para el alumno que ya conoce la app y la usa parado, entre series, con el celular en la mano.

- **Pantalla 1 — Login rápido**
  - Opción de mantener sesión iniciada / biometría (huella o PIN corto) para no tipear contraseña en el gimnasio
- **Pantalla 2 — Dashboard único (pantalla principal, todo visible sin navegar)**
  - Header: día de hoy resaltado (chip "Día 3 · Piernas")
  - Bloque de ejercicios del día en formato lista compacta con checkbox por serie:
    - Sentadilla — 4x10 — [☐][☐][☐][☐]
    - Prensa — 3x12 — [☐][☐][☐]
    - (el alumno tilda cada serie a medida que la hace, sin salir de la pantalla)
  - Botón fijo (sticky) abajo: **"Marcar asistencia de hoy"** (un solo tap, sin pantalla adicional ni confirmación extra)
  - Mini indicador de racha/asistencias del mes en una esquina (ej: "🔥 12 días") sin necesidad de entrar a otra sección
- **Pantalla 3 — Cambio de día (atajo, no pantalla nueva)**
  - Swipe horizontal o tabs superiores (Día 1 | Día 2 | Día 3...) para moverse entre días sin volver atrás
- **Pantalla 4 — Historial (acceso secundario, para quien lo necesite)**
  - Vista tipo calendario compacto, accesible con un tap desde el dashboard, pero no forma parte del camino crítico diario

**Diferencial estructural:** una sola pantalla concentra rutina + registro de asistencia + progreso resumido. Menos jerarquía, más densidad, acciones de un solo tap, navegación por gestos (swipe/tabs) en vez de botones "Volver". Prioriza velocidad y mínima fricción a costa de mostrar más información junta.

---

## Alternativa 3 — Satisfacción
**Lógica de diseño:** el flujo es funcionalmente similar al de un uso recurrente normal, pero cada interacción da feedback emocional/motivador, mostrando avance y logro, para que el alumno sienta que "le conviene" volver a usar la app en vez de la memoria o WhatsApp.

- **Pantalla 1 — Login con continuidad emocional**
  - Frase dinámica de bienvenida según racha: "¡Volviste! Llevás 5 días seguidos 🔥"
- **Pantalla 2 — Home motivacional**
  - Barra de progreso semanal visible arriba ("3 de 4 entrenamientos esta semana")
  - Tarjeta "Rutina de hoy" con CTA destacado "Empezar entrenamiento"
  - Comparación implícita con el "antes": mensaje tipo "Ya no dependés de la memoria, tu rutina está acá"
- **Pantalla 3 — Ejecución de rutina con feedback progresivo**
  - Cada ejercicio se completa marcando "Hecho ✅"
  - Barra de progreso que se llena en tiempo real a medida que tacha ejercicios
  - Micro-mensajes de aliento al completar cada ejercicio ("¡Vas 3 de 5! Seguí así")
- **Pantalla 4 — Registro de asistencia como "logro"**
  - Al marcar asistencia, no es solo un check: aparece una animación/celebración breve
  - Se suma visualmente a una racha o medalla ("¡Nuevo récord! 6 días seguidos")
  - Mensaje de refuerzo positivo comparando con el mes anterior: "Vas mejor que el mes pasado"
- **Pantalla 5 — Progreso como recompensa visual**
  - Gráfico de evolución (asistencias por semana/mes) con hitos destacados
  - Insignias o logros desbloqueados (ej: "10 entrenamientos", "Mes completo")
  - Mensaje que conecta con la constancia: "Estás construyendo un hábito"
- **Pantalla 6 — Notificación motivacional (fuera de la app)**
  - Recordatorio push con tono personal, no administrativo: "Hoy toca piernas 💪 ¿Vamos?"

**Diferencial estructural:** mismo esqueleto funcional que un flujo estándar, pero cada pantalla incorpora una capa de feedback emocional (progreso visible, rachas, logros, comparación con el método anterior) diseñada para reforzar la percepción de mejora y la intención de uso continuo, no solo la finalización de la tarea.

---

## Comparación rápida de las tres estructuras

| Aspecto | A1 – Aprendizaje | A2 – Eficiencia | A3 – Satisfacción |
|---|---|---|---|
| N° de pantallas | Más (secuencial) | Mínimo (todo en 1) | Similar a uso estándar |
| Densidad de información | Baja (una idea por pantalla) | Alta (todo junto) | Media, con capas de feedback |
| Navegación | Lineal, con "Volver" | Gestos/tabs, sin retroceso | Lineal simple |
| Confirmaciones | Explícitas y explicadas | Mínimas, silenciosas | Celebratorias/emocionales |
| Usuario objetivo | Primera vez / nuevo | Recurrente, en pleno entrenamiento | Cualquiera, buscando adopción a largo plazo |
