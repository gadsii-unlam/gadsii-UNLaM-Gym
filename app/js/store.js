// Persistencia y estado único de la app.
// Todo se guarda en localStorage bajo una clave por usuario: unlamgym:v1:<userId>.
import { SEEDS } from "./seeds.js";
import { isValidState, localDateKey, normalizeAttendance, pruneCompleted, stateFromSeed } from "./logic.js";

export const PREFIX = "unlamgym:v1:";
const ACTIVE_USER_KEY = PREFIX + "activeUser";
export const KNOWN_USERS = ["U1", "U2", "U3"];
export const ALL_USERS = [...KNOWN_USERS, "demo"];

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
// valor desconocido entra como "demo". Con persist: false (pantalla admin)
// solo se lee, sin cambiar el usuario guardado.
export function resolveUserId(search, { persist = true } = {}) {
  const raw = new URLSearchParams(search).get("u");
  if (raw !== null) {
    const id = raw.trim().toUpperCase();
    if (KNOWN_USERS.includes(id)) {
      if (persist) writeStorage(ACTIVE_USER_KEY, id);
      return id;
    }
    return "demo";
  }
  return activeUserId() || "demo";
}

// Usuario guardado en este navegador (null si nunca se abrió con ?u=).
export function activeUserId() {
  const saved = readStorage(ACTIVE_USER_KEY);
  return KNOWN_USERS.includes(saved) ? saved : null;
}

// Lee los datos guardados de un usuario sin crearlos (null si no hay).
export function peekState(userId) {
  return load(userId);
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

// Reemplaza los datos guardados del usuario por los del seed.
export function resetUser(userId) {
  const fresh = seedState(userId);
  writeStorage(storageKey(userId), JSON.stringify(fresh));
  if (state && state.userId === userId) state = fresh;
  return fresh;
}
