// Log de eventos para medir el uso. Cada evento se guarda primero en una
// cola en localStorage y después se envía a EVENTS_ENDPOINT cuando hay
// conexión. Ningún error de red puede romper ni frenar la UI.
// No se registran datos personales: solo el id U1, U2, U3 (o demo).
import { EVENTS_ENDPOINT } from "./config.js";
import { isoWithOffset, localDateKey } from "./logic.js";
import { PREFIX, readStorage, writeStorage } from "./store.js";

const QUEUE_KEY = PREFIX + "eventQueue";
const STATS_KEY = PREFIX + "eventStats";
const BATCH_SIZE = 50;
const MAX_QUEUE = 5000;

const ctx = { userId: "demo", screen: "hoy" };
let sending = false;

export function setContext(partial) {
  Object.assign(ctx, partial);
}

export function readQueue() {
  try {
    const q = JSON.parse(readStorage(QUEUE_KEY));
    return Array.isArray(q) ? q : [];
  } catch {
    return [];
  }
}

function writeQueue(queue) {
  writeStorage(QUEUE_KEY, JSON.stringify(queue.slice(-MAX_QUEUE)));
}

// Evento: { userId, type, ts (ISO con zona), localDate, screen, data }
export function track(type, data = {}) {
  try {
    const now = new Date();
    const event = { userId: ctx.userId, type, ts: isoWithOffset(now), localDate: localDateKey(now), screen: ctx.screen, data };
    writeQueue([...readQueue(), event]);
  } catch {
    // Sin almacenamiento disponible: el evento se pierde, la app sigue.
  }
  flush();
}

// Envía la cola por lotes. fetch con no-cors no deja leer la respuesta:
// si la petición se completa se da el lote por enviado; si falla (sin red)
// queda en la cola para el próximo intento.
export async function flush() {
  if (!EVENTS_ENDPOINT || sending) return;
  if (typeof navigator !== "undefined" && navigator.onLine === false) return;
  sending = true;
  try {
    for (;;) {
      const batch = readQueue().slice(0, BATCH_SIZE);
      if (batch.length === 0) break;
      await fetch(EVENTS_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        keepalive: true,
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ events: batch }),
      });
      writeQueue(readQueue().slice(batch.length));
      const stats = readStats();
      writeStorage(STATS_KEY, JSON.stringify({ sent: stats.sent + batch.length, lastSentAt: isoWithOffset(new Date()) }));
    }
  } catch {
    // Sin conexión o endpoint caído: se reintenta más tarde.
  } finally {
    sending = false;
  }
}

export function queueSize() {
  return readQueue().length;
}

// Eventos enviados desde este navegador y último envío.
export function readStats() {
  try {
    const s = JSON.parse(readStorage(STATS_KEY));
    return s && typeof s.sent === "number" ? s : { sent: 0, lastSentAt: null };
  } catch {
    return { sent: 0, lastSentAt: null };
  }
}

// app_open al cargar y al volver a la pestaña después de más de 30 minutos.
const REOPEN_MS = 30 * 60 * 1000;
let hiddenAt = null;

export function startEventLoop() {
  track("app_open", { reason: "load" });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      hiddenAt = Date.now();
      flush();
    } else if (hiddenAt !== null) {
      const away = Date.now() - hiddenAt;
      hiddenAt = null;
      if (away > REOPEN_MS) track("app_open", { reason: "resume", awayMin: Math.round(away / 60000) });
      else flush();
    }
  });
  window.addEventListener("online", () => flush());
  setInterval(() => flush(), 2 * 60 * 1000);
}
