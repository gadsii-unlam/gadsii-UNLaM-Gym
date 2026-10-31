// Pantalla del equipo (?admin=1, sin link desde la UI).
// Muestra y administra los datos guardados en ESTE navegador: la app no tiene
// servidor, así que cada celular tiene sus propios datos. No registra eventos
// y no cambia el usuario del navegador.
import { EVENTS_ENDPOINT } from "./config.js";
import { flush, readQueue, readStats } from "./events.js";
import { ALL_USERS, activeUserId, peekState, resetUser, resolveUserId } from "./store.js";
import {
  DAY_KEYS, DAY_LABELS, completedIdsFor, constancy, countInMonthUpTo, dayKeyOf, dayStatus,
  isoWithOffset, localDateKey, parseDateKey, streak, streakText,
} from "./logic.js";
import { esc, showScreen } from "./ui.js";

const $ = id => document.getElementById(id);
const pad = n => String(n).padStart(2, "0");

const ui = {
  selected: resolveUserId(location.search, { persist: false }),
  confirmReset: false,
  message: "",
};

const fmtDate = key => { const d = parseDateKey(key); return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`; };
const fmtTs = ts => {
  const d = new Date(ts);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const adminLink = userId => `?u=${encodeURIComponent(userId)}&admin=1`;
const row = (label, value, cls = "") => `<div${cls ? ` class="${cls}"` : ""}><dt>${label}</dt><dd>${value}</dd></div>`;

function userSummary(s, now) {
  const todayKey = localDateKey(now);
  const todayDay = dayKeyOf(now);
  const day = s.routine[todayDay];
  const status = dayStatus(day);
  let todayText;
  if (status === "rest") todayText = "día de descanso";
  else if (status === "empty") todayText = "sin ejercicios cargados";
  else todayText = `${completedIdsFor(s.completed, todayKey, day.exercises).size} de ${day.exercises.length} completados`;

  const routine = DAY_KEYS.map(k => {
    const d = s.routine[k];
    return `${DAY_LABELS[k]} ${d.rest ? "desc." : d.exercises.length}`;
  }).join(" · ");

  const last = s.attendance.slice(-5).reverse().map(fmtDate).join(", ") || "—";
  return `
    <dl class="admin-dl">
      ${row("Racha actual", esc(streakText(streak(s.attendance, todayKey))))}
      ${row("Días entrenados este mes", countInMonthUpTo(s.attendance, now.getFullYear(), now.getMonth(), now.getDate()))}
      ${row("Constancia del mes", `${constancy(s.attendance, now)}%`)}
      ${row("Asistencias en total", s.attendance.length)}
      ${row("Últimas asistencias", esc(last))}
      ${row(`Hoy (${DAY_LABELS[todayDay]})`, esc(todayText))}
      ${row("Ejercicios por día", esc(routine))}
    </dl>`;
}

function render() {
  const now = new Date();
  const browserUser = activeUserId();
  const queue = readQueue();
  const stats = readStats();
  const sel = ui.selected;
  const selState = peekState(sel);
  const pendingOf = id => queue.filter(e => e.userId === id).length;

  const users = ALL_USERS.map(id => {
    const s = peekState(id);
    const info = s ? `${s.attendance.length} ${s.attendance.length === 1 ? "asistencia" : "asistencias"}` : "sin datos acá";
    const tags = [id === browserUser ? "usuario del navegador" : "", id === sel ? "viendo" : ""].filter(Boolean).join(", ");
    return `
      <div class="admin-user${id === sel ? " sel" : ""}">
        <span><b>${esc(id)}</b> · ${info}${tags ? ` <em>(${tags})</em>` : ""}</span>
        ${id === sel ? "" : `<a class="btn small-link" href="${adminLink(id)}">Ver</a>`}
      </div>`;
  }).join("");

  const resetBlock = ui.confirmReset
    ? `<div class="confirm-row">
        ¿Borrar los datos de ${esc(sel)} en este navegador y volver a su rutina inicial? Se pierden su
        historial de asistencia y sus cambios en la rutina.
        <div class="btn-row">
          <button type="button" class="btn danger" data-admin="reset-confirm">Sí, resetear</button>
          <button type="button" class="btn" data-admin="reset-cancel">Cancelar</button>
        </div>
      </div>`
    : `<button type="button" class="btn danger" data-admin="reset">Resetear ${esc(sel)} a su rutina inicial</button>`;

  $("adminContent").innerHTML = `
    <div class="box admin-intro">
      <div class="box-title">Qué muestra esta pantalla</div>
      <p>Los datos guardados <b>en este navegador</b>. La app no tiene servidor: cada celular guarda
      sus propios datos. Lo que hace U1 en su celular <b>solo se ve acá si abrís esta pantalla en el
      celular de U1</b>. Desde otra computadora o celular vas a ver otros datos (o ninguno).</p>
      <p>Para seguir el uso durante la semana sin tener el celular están los eventos en la Google Sheet.</p>
    </div>

    <div class="box">
      <div class="box-title">Este navegador</div>
      <dl class="admin-dl">
        ${row("Usuario del navegador", browserUser ? esc(browserUser) : "ninguno (la app entra con la rutina de ejemplo)")}
        ${EVENTS_ENDPOINT
          ? row("Envío de eventos", "configurado")
          : row("Envío de eventos", "NO configurado: los eventos no salen de este navegador", "warn")}
        ${row("Eventos pendientes de envío", queue.length)}
        ${row("Eventos ya enviados", stats.sent ? `${stats.sent} (último: ${esc(fmtTs(stats.lastSentAt))})` : "ninguno")}
      </dl>
    </div>

    <div class="box">
      <div class="box-title">Usuarios en este navegador</div>
      ${users}
    </div>

    <div class="box">
      <div class="box-title">Detalle de ${esc(sel)}</div>
      ${selState ? userSummary(selState, now) : `<p class="admin-msg">${esc(sel)} no abrió la app en este navegador.</p>`}
      <dl class="admin-dl">${row(`Eventos pendientes de ${esc(sel)}`, pendingOf(sel))}</dl>
    </div>

    <div class="box">
      <div class="box-title">Acciones</div>
      <button type="button" class="btn" data-admin="export">Exportar todo lo de este navegador (JSON)</button>
      <button type="button" class="btn" data-admin="flush">Reenviar eventos pendientes</button>
      ${resetBlock}
      <a class="btn ghost" href="./?u=${encodeURIComponent(sel)}">Abrir la app como ${esc(sel)}</a>
      ${ui.message ? `<div class="admin-msg" role="status">${esc(ui.message)}</div>` : ""}
    </div>

    <div class="box admin-intro">
      <div class="box-title">Para qué sirve</div>
      <p><b>Antes de la sesión:</b> en el celular del usuario abrir su link personal (por ejemplo
      <code>?u=U1</code>). Si ese celular ya se usó para pruebas, entrar a <code>?u=U1&amp;admin=1</code>
      y resetear.</p>
      <p><b>Juntar evidencia:</b> en el celular del usuario, abrir <code>?admin=1</code> y exportar.</p>
      <p><b>Ojo:</b> "Abrir la app como…" deja este navegador como ese usuario. Mirar un usuario con
      <code>&amp;u=</code> desde esta pantalla no cambia nada.</p>
    </div>`;
}

function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const actions = {
  export: () => {
    const now = new Date();
    const browserUser = activeUserId();
    const users = {};
    for (const id of ALL_USERS) {
      const s = peekState(id);
      if (s) users[id] = s;
    }
    downloadJson(`unlamgym-${browserUser || "sin-usuario"}-${localDateKey(now)}.json`, {
      exportedAt: isoWithOffset(now),
      browserUser,
      users,
      eventQueue: readQueue(),
      eventStats: readStats(),
    });
    ui.message = "Archivo exportado.";
  },

  flush: async () => {
    ui.message = "Enviando…";
    render();
    await flush();
    const left = readQueue().length;
    ui.message = !EVENTS_ENDPOINT
      ? "No hay endpoint en config.js: los eventos quedan guardados en este navegador."
      : left === 0 ? "Eventos enviados." : `No se pudo enviar todo: quedan ${left} (¿sin conexión?).`;
  },

  reset: () => { ui.confirmReset = true; ui.message = ""; },
  "reset-cancel": () => { ui.confirmReset = false; },
  "reset-confirm": () => {
    resetUser(ui.selected);
    ui.confirmReset = false;
    ui.message = `${ui.selected} volvió a su rutina inicial, sin asistencias.`;
  },
};

export function startAdmin() {
  showScreen("admin");
  document.addEventListener("click", async e => {
    const el = e.target.closest("[data-admin]");
    if (!el || !actions[el.dataset.admin]) return;
    await actions[el.dataset.admin]();
    render();
  });
  render();
}
