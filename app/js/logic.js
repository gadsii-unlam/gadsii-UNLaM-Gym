// Funciones puras: sin document ni localStorage.
// Las fechas se manejan siempre como fecha LOCAL con formato YYYY-MM-DD.

export const DAY_KEYS = ["lun", "mar", "mie", "jue", "vie", "sab", "dom"];
export const DAY_LABELS = { lun: "Lun", mar: "Mar", mie: "Mié", jue: "Jue", vie: "Vie", sab: "Sáb", dom: "Dom" };
const MONTHS_SHORT = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const MONTHS_FULL = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

const pad = n => String(n).padStart(2, "0");

/* ---------- Fechas ---------- */

// Nunca usar toISOString().slice(0,10): en UTC-3 desde las 21 h devuelve el día siguiente.
export function localDateKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseDateKey(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(key, n) {
  const d = parseDateKey(key);
  d.setDate(d.getDate() + n);
  return localDateKey(d);
}

// Clave de rutina ("lun".."dom") del día de la semana de una fecha.
export function dayKeyOf(date) {
  return DAY_KEYS[(date.getDay() + 6) % 7];
}

export function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// "Sáb · 31 oct"
export function formatHeaderDate(date) {
  return `${DAY_LABELS[dayKeyOf(date)]} · ${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}`;
}

// "Octubre 2026"
export function formatMonthTitle(year, month) {
  return `${MONTHS_FULL[month]} ${year}`;
}

// ISO 8601 con la zona local, ej. "2026-10-31T21:05:09.123-03:00".
export function isoWithOffset(date) {
  const off = -date.getTimezoneOffset();
  const sign = off >= 0 ? "+" : "-";
  const abs = Math.abs(off);
  const ms = String(date.getMilliseconds()).padStart(3, "0");
  return `${localDateKey(date)}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${ms}` +
    `${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`;
}

/* ---------- Estado ---------- */

const DATE_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;

// Fechas válidas, sin duplicados y ordenadas.
export function normalizeAttendance(list) {
  return [...new Set((list || []).filter(d => DATE_KEY_RE.test(d)))].sort();
}

// Las marcas de completado solo valen para hoy: se descartan las de otras fechas.
export function pruneCompleted(completed, todayKey) {
  const ids = completed && Array.isArray(completed[todayKey]) ? completed[todayKey] : [];
  return ids.length ? { [todayKey]: [...new Set(ids)] } : {};
}

// Estado nuevo a partir de un seed (copia profunda: el seed nunca se modifica).
export function stateFromSeed(userId, seed) {
  const routine = {};
  for (const k of DAY_KEYS) {
    const d = seed.routine[k] || { rest: false, exercises: [] };
    routine[k] = { rest: !!d.rest, exercises: d.exercises.map(e => ({ ...e })) };
  }
  return { version: 1, userId, routine, attendance: normalizeAttendance(seed.attendance), completed: {} };
}

// Verifica la forma mínima de un estado leído de localStorage.
export function isValidState(s, userId) {
  return !!s && s.version === 1 && s.userId === userId &&
    !!s.routine && DAY_KEYS.every(k => s.routine[k] && Array.isArray(s.routine[k].exercises)) &&
    Array.isArray(s.attendance) && !!s.completed && typeof s.completed === "object";
}

/* ---------- Ejercicios ---------- */

export const LIMITS = { nameMax: 40, seriesMin: 1, seriesMax: 20, repsMin: 1, repsMax: 600 };
export const UNITS = ["reps", "seg"];

// "4x10" o "3x40 seg"
export function formatDose(ex) {
  return ex.unit === "seg" ? `${ex.series}x${ex.reps} seg` : `${ex.series}x${ex.reps}`;
}

// Entero escrito solo con dígitos ("12", " 12 "); cualquier otra cosa es NaN.
function toInt(v) {
  if (typeof v === "number") return Number.isInteger(v) ? v : NaN;
  const s = String(v ?? "").trim();
  return /^\d{1,6}$/.test(s) ? Number(s) : NaN;
}

// Valida los datos del formulario. El nombre se guarda sin espacios al
// inicio ni al final. Devuelve { ok, errors, value }.
export function validateExercise(input) {
  const errors = {};
  const name = String(input.name ?? "").trim();
  if (name.length === 0) errors.name = "Ingresá el nombre del ejercicio.";
  else if (name.length > LIMITS.nameMax) errors.name = `El nombre puede tener hasta ${LIMITS.nameMax} caracteres.`;

  const series = toInt(input.series);
  if (!(series >= LIMITS.seriesMin && series <= LIMITS.seriesMax)) {
    errors.series = `Ingresá un número entero entre ${LIMITS.seriesMin} y ${LIMITS.seriesMax}.`;
  }

  const unit = input.unit;
  if (!UNITS.includes(unit)) errors.unit = "Elegí repeticiones o segundos.";

  const reps = toInt(input.reps);
  if (!(reps >= LIMITS.repsMin && reps <= LIMITS.repsMax)) {
    errors.reps = `Ingresá un número entero entre ${LIMITS.repsMin} y ${LIMITS.repsMax}.`;
  }

  const ok = Object.keys(errors).length === 0;
  return { ok, errors, value: ok ? { name, series, reps, unit } : null };
}

export function allExerciseIds(routine) {
  return new Set(DAY_KEYS.flatMap(k => routine[k].exercises.map(e => e.id)));
}

// Id único y estable: se genera al crear el ejercicio y no cambia al editarlo.
export function makeId(existingIds, rand = Math.random) {
  for (;;) {
    const id = "ex_" + rand().toString(36).slice(2, 8);
    if (id.length === 9 && !existingIds.has(id)) return id;
  }
}

const withDay = (routine, dayKey, fn) => ({ ...routine, [dayKey]: fn(routine[dayKey]) });

export function addExercise(routine, dayKey, value, id) {
  return withDay(routine, dayKey, d => ({ ...d, exercises: [...d.exercises, { id, ...value }] }));
}

export function editExercise(routine, dayKey, id, value) {
  return withDay(routine, dayKey, d => ({
    ...d,
    exercises: d.exercises.map(e => (e.id === id ? { ...value, id } : e)),
  }));
}

export function deleteExercise(routine, dayKey, id) {
  return withDay(routine, dayKey, d => ({ ...d, exercises: d.exercises.filter(e => e.id !== id) }));
}

export function findExercise(routine, dayKey, id) {
  return routine[dayKey].exercises.find(e => e.id === id) || null;
}

// Marca o desmarca el día como descanso. Los ejercicios del día se conservan
// (ocultos) para no perderlos si se vuelve a desmarcar.
export function setRest(routine, dayKey, rest) {
  return withDay(routine, dayKey, d => ({ ...d, rest: !!rest }));
}

// "rest" | "empty" | "exercises"
export function dayStatus(day) {
  if (day.rest) return "rest";
  return day.exercises.length === 0 ? "empty" : "exercises";
}

/* ---------- Completado (por id y por fecha) ---------- */

// Marca o desmarca un ejercicio como completado en la fecha dada.
export function toggleCompleted(completed, dateKey, id) {
  const ids = completed[dateKey] || [];
  const next = ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id];
  return { ...completed, [dateKey]: next };
}

// Ids completados en la fecha que siguen existiendo en la lista de ejercicios.
export function completedIdsFor(completed, dateKey, exercises) {
  const done = new Set(completed[dateKey] || []);
  return new Set(exercises.filter(e => done.has(e.id)).map(e => e.id));
}

/* ---------- Asistencia ---------- */

export function hasAttendance(attendance, dateKey) {
  return attendance.includes(dateKey);
}

export function addAttendance(attendance, dateKey) {
  return normalizeAttendance([...attendance, dateKey]);
}

// Marca o desmarca la asistencia de la fecha. Devuelve { attendance, marked }.
export function toggleAttendance(attendance, dateKey) {
  const marked = !attendance.includes(dateKey);
  return {
    attendance: marked ? addAttendance(attendance, dateKey) : attendance.filter(d => d !== dateKey),
    marked,
  };
}

// Al eliminar un ejercicio se borra su marca en todas las fechas.
export function removeCompletedId(completed, id) {
  const next = {};
  for (const [date, ids] of Object.entries(completed)) next[date] = ids.filter(x => x !== id);
  return next;
}

/* ---------- Calendario ---------- */

// Celdas vacías antes del día 1, con semana que arranca en lunes.
// Sale del día de la semana del 1° del mes, no del de hoy.
export function calendarOffset(year, month) {
  return (new Date(year, month, 1).getDay() + 6) % 7;
}

// Días con asistencia en el mes (month 0..11) hasta el día lastDay inclusive.
export function countInMonthUpTo(attendance, year, month, lastDay) {
  const prefix = `${year}-${pad(month + 1)}-`;
  return attendance.filter(d => d.startsWith(prefix) && Number(d.slice(8)) <= lastDay).length;
}

// Datos del mes actual para dibujar el calendario.
export function calendarMonth(attendance, today) {
  const year = today.getFullYear();
  const month = today.getMonth();
  const todayKey = localDateKey(today);
  const marked = new Set(attendance);
  const days = [];
  for (let d = 1; d <= daysInMonth(year, month); d++) {
    const key = localDateKey(new Date(year, month, d));
    days.push({ day: d, key, marked: marked.has(key), isToday: key === todayKey });
  }
  return { year, month, offset: calendarOffset(year, month), days };
}

/* ---------- Racha, constancia y refuerzo (todo desde attendance) ---------- */

// Días consecutivos con asistencia que terminan hoy; si hoy todavía no
// marcó, los que terminan ayer. Sin asistencia ayer ni hoy: 0.
export function streak(attendance, todayKey) {
  const set = new Set(attendance);
  let cursor = set.has(todayKey) ? todayKey : addDays(todayKey, -1);
  let n = 0;
  while (set.has(cursor)) {
    n++;
    cursor = addDays(cursor, -1);
  }
  return n;
}

export const daysText = n => `${n} ${n === 1 ? "día" : "días"}`;

// "Empezá tu racha hoy" / "1 día seguido" / "3 días seguidos"
export function streakText(n) {
  if (n === 0) return "Empezá tu racha hoy";
  return n === 1 ? "1 día seguido" : `${n} días seguidos`;
}

// Días con asistencia en el mes actual / días transcurridos (incluido hoy), en %.
export function constancy(attendance, today) {
  const day = today.getDate();
  return Math.round((countInMonthUpTo(attendance, today.getFullYear(), today.getMonth(), day) / day) * 100);
}

// Días entrenados del 1 a hoy contra el mismo tramo del mes anterior.
// Si el mes anterior es más corto, su tramo llega hasta su último día.
export function monthComparison(attendance, today) {
  const y = today.getFullYear();
  const m = today.getMonth();
  const py = m === 0 ? y - 1 : y;
  const pm = m === 0 ? 11 : m - 1;
  const day = today.getDate();
  return {
    current: countInMonthUpTo(attendance, y, m, day),
    previous: countInMonthUpTo(attendance, py, pm, Math.min(day, daysInMonth(py, pm))),
  };
}

// Mensaje comparativo solo si se puede calcular con datos reales:
// hace falta asistencia en el mes anterior, y se muestra solo si mejoró.
export function comparisonMessage(attendance, today) {
  const { current, previous } = monthComparison(attendance, today);
  if (previous === 0 || current <= previous) return null;
  return `Vas mejor que el mes pasado: ${daysText(current)} contra ${daysText(previous)} a esta altura.`;
}
