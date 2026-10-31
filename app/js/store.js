// Persistencia y estado único de la app.
// Todo se guarda en localStorage bajo una clave por usuario: unlamgym:v1:<userId>.
import { SEEDS } from "./seeds.js";
import { isValidState, localDateKey, normalizeAttendance, pruneCompleted, stateFromSeed } from "./logic.js";

export const PREFIX = "unlamgym:v1:";
const ACTIVE_USER_KEY = PREFIX + "activeUser";
export const KNOWN_USERS = ["U1", "U2", "U3"];

let state = null;

// localStorage puede fallar (modo privado, cuota llena): la app sigue en memoria.
export function readStorage(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}
export function writeStorage(key, value) {
  try { localStorage.setItem(key, value); return true; } catch { return false; }
}

export const storageKey = userId => PREFIX + userId;

// ?u=U1 / U2 / U3 elige el usuario y lo recuerda para los próximos ingresos
// sin parámetro (favoritos, pantalla de inicio). Sin parámetro o con un
// valor desconocido entra como "demo".
export function resolveUserId(search) {
  const raw = new URLSearchParams(search).get("u");
  if (raw !== null) {
    const id = raw.trim().toUpperCase();
    if (KNOWN_USERS.includes(id)) {
      writeStorage(ACTIVE_USER_KEY, id);
      return id;
    }
    return "demo";
  }
  const saved = readStorage(ACTIVE_USER_KEY);
  return KNOWN_USERS.includes(saved) ? saved : "demo";
}

function seedState(userId) {
  return stateFromSeed(userId, SEEDS[userId] || SEEDS.demo);
}

function load(userId) {
  try {
    const parsed = JSON.parse(readStorage(storageKey(userId)));
    return isValidState(parsed, userId) ? parsed : null;
  } catch {
    return null;
  }
}

function save() {
  state.attendance = normalizeAttendance(state.attendance);
  state.completed = pruneCompleted(state.completed, localDateKey(new Date()));
  writeStorage(storageKey(state.userId), JSON.stringify(state));
}

// El seed se aplica solo si no hay datos guardados para ese usuario.
export function initStore(userId) {
  state = load(userId) || seedState(userId);
  save();
  return state;
}

export function getState() {
  return state;
}

// fn recibe el estado actual y devuelve el nuevo; se guarda en el acto.
export function update(fn) {
  state = fn(state);
  save();
  return state;
}

// Vuelve a guardar (descarta marcas de completado de días anteriores).
export function refresh() {
  save();
  return state;
}

export function resetToSeed() {
  state = seedState(state.userId);
  save();
  return state;
}
