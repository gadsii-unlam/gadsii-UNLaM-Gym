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
