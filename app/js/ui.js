// Render de las pantallas. Lee el estado y la vista; no modifica datos.
import {
  DAY_KEYS, DAY_LABELS, calendarMonth, completedIdsFor, dayStatus, formatDose, formatHeaderDate,
  formatMonthTitle, hasAttendance, comparisonMessage, constancy, streak, streakText,
} from "./logic.js";

const $ = id => document.getElementById(id);
const EMPTY_DAY_TEXT = "Todavía no cargaste ejercicios para este día";
const FLAME_SVG = `<svg viewBox="0 0 24 24"><path d="M12 2c1 3-3 4-3 8a3 3 0 0 0 6 0c1 1 2 2 2 4a5 5 0 0 1-10 0c0-4 3-5 3-9 0-1 1-2 2-3z"/></svg>`;

// Íconos de trazo (24×24), heredan el color del texto.
const icon = paths => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths}</svg>`;
const ICONS = {
  hoy: icon(`<path d="M6.5 7v10M3.5 9.5v5M17.5 7v10M20.5 9.5v5M6.5 12h11"/>`),
  rutina: icon(`<rect x="5" y="4" width="14" height="17" rx="1"/><path d="M9 4V2.8h6V4M8.5 9.5h7M8.5 13.5h7M8.5 17.5h4"/>`),
  calendario: icon(`<rect x="3.5" y="5" width="17" height="15.5" rx="1"/><path d="M3.5 10h17M8 3v4M16 3v4"/>`),
  cuota: icon(`<rect x="3" y="6" width="18" height="12.5" rx="1.5"/><path d="M3 10.5h18M6.5 15h4"/>`),
  edit: icon(`<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>`),
  trash: icon(`<path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13M10 11v5.5M14 11v5.5"/>`),
  prev: icon(`<path d="M14.5 5.5L8 12l6.5 6.5"/>`),
  next: icon(`<path d="M9.5 5.5L16 12l-6.5 6.5"/>`),
};

const NAV = [
  { id: "hoy", label: "Hoy" },
  { id: "rutina", label: "Rutina" },
  { id: "calendario", label: "Calendario" },
  { id: "cuota", label: "Cuota" },
];

export function esc(value) {
  return String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

export function showScreen(screen) {
  document.querySelectorAll(".screen").forEach(el => {
    el.hidden = el.dataset.screen !== screen;
  });
  $("navbar").hidden = screen === "admin";
}

export function renderNav(screen) {
  $("navbar").innerHTML = NAV.map(n => `
    <button type="button" class="navitem${n.id === screen ? " active" : ""}" data-action="nav" data-screen="${n.id}"${n.id === screen ? ' aria-current="page"' : ""}>
      ${ICONS[n.id]}${n.label}
    </button>`).join("");
}

/* ---------- Hoy ---------- */

function renderHoy(state, view, ctx) {
  const day = state.routine[ctx.todayDay];
  const status = dayStatus(day);
  const attended = hasAttendance(state.attendance, ctx.todayKey);

  $("hoyDate").textContent = formatHeaderDate(ctx.now);

  let routineBox;
  let allDone = false;
  if (status === "rest") {
    routineBox = `<div class="empty-state">Hoy es tu día de descanso. ¡A recuperar energías!</div>`;
  } else if (status === "empty") {
    routineBox = `
      <div class="empty-state">${EMPTY_DAY_TEXT}
        <button type="button" class="btn ghost" data-action="go-add-today">+ Agregar ejercicio</button>
      </div>`;
  } else {
    const done = completedIdsFor(state.completed, ctx.todayKey, day.exercises);
    const total = day.exercises.length;
    const pct = Math.round((done.size / total) * 100);
    allDone = done.size === total;
    const rows = day.exercises.map(ex => {
      const isDone = done.has(ex.id);
      return `
        <button type="button" class="ex-row${isDone ? " done" : ""}" data-action="toggle-ex" data-id="${esc(ex.id)}" aria-pressed="${isDone}">
          <span class="ex-check" aria-hidden="true">${isDone ? "✓" : ""}</span>
          <span class="ex-name">${esc(ex.name)}</span>
          <span class="tag">${esc(formatDose(ex))}</span>
        </button>`;
    }).join("");
    routineBox = `
      <div class="progress-wrap">
        <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
        <div class="progress-label">${done.size} de ${total} ejercicios completados</div>
      </div>
      ${rows}`;
  }

  const hint = allDone && !attended
    ? `<div class="hint">¡Completaste tu rutina de hoy! No te olvides de marcar tu asistencia.</div>` : "";

  // F07: racha, festejo y comparación salen de state.attendance.
  const n = streak(state.attendance, ctx.todayKey);
  const badge = `
    <div class="streak-badge">
      <span class="flame" aria-hidden="true">${FLAME_SVG}</span>
      <span>${esc(streakText(n))}</span>
    </div>`;
  const comparison = comparisonMessage(state.attendance, ctx.now);
  const celebrate = attended
    ? `<div class="celebrate" role="status">
        <div class="msg">¡${esc(streakText(n))}!</div>
        ${comparison ? `<div class="sub">${esc(comparison)}</div>` : ""}
      </div>` : "";

  // F05: el botón de asistencia está siempre visible, haya o no rutina ese día.
  // F01: es un toggle y el texto refleja el estado.
  const markBtn = attended
    ? `<button type="button" class="btn primary done" data-action="toggle-attendance" data-source="hoy" aria-pressed="true">✓ Viniste hoy · tocar para deshacer</button>`
    : `<button type="button" class="btn primary" data-action="toggle-attendance" data-source="hoy" aria-pressed="false">Marcar que vine hoy</button>`;

  $("hoyContent").innerHTML = `
    ${badge}
    <div class="box">
      <div class="box-title">Tu rutina de hoy — ${DAY_LABELS[ctx.todayDay]}</div>
      ${routineBox}
    </div>
    ${hint}
    ${celebrate}
    ${markBtn}`;
}

/* ---------- Rutina ---------- */

function exerciseFormHtml(form) {
  const v = form.values;
  const e = form.errors || {};
  const err = (field) => e[field]
    ? `<div class="field-error" id="err-${field}">${esc(e[field])}</div>` : "";
  const aria = (field) => e[field] ? ` aria-invalid="true" aria-describedby="err-${field}"` : "";
  const inv = (field) => e[field] ? " invalid" : "";
  return `
    <form class="box" id="exerciseForm" novalidate>
      <div class="box-title">${form.mode === "edit" ? "Editar ejercicio" : "Nuevo ejercicio"}</div>
      <div class="field">
        <label for="fName">Nombre</label>
        <input id="fName" name="name" class="form-input${inv("name")}" type="text" autocomplete="off"
          placeholder="Ej: Curl de bíceps" value="${esc(v.name)}"${aria("name")}>
        ${err("name")}
      </div>
      <div class="field">
        <label for="fSeries">Series</label>
        <input id="fSeries" name="series" class="form-input${inv("series")}" type="text" inputmode="numeric"
          autocomplete="off" placeholder="Ej: 3" value="${esc(v.series)}"${aria("series")}>
        ${err("series")}
      </div>
      <div class="field">
        <label for="fReps">Repeticiones o segundos</label>
        <div class="field-inline">
          <input id="fReps" name="reps" class="form-input${inv("reps")}" type="text" inputmode="numeric"
            autocomplete="off" placeholder="Ej: 12" value="${esc(v.reps)}"${aria("reps")}>
          <select id="fUnit" name="unit" class="form-input${inv("unit")}" aria-label="Unidad">
            <option value="reps"${v.unit === "reps" ? " selected" : ""}>reps</option>
            <option value="seg"${v.unit === "seg" ? " selected" : ""}>seg</option>
          </select>
        </div>
        ${err("reps")}${err("unit")}
      </div>
      <div class="btn-row">
        <button type="submit" class="btn primary">Guardar</button>
        <button type="button" class="btn" data-action="cancel-form">Cancelar</button>
      </div>
    </form>`;
}

function rutinaRowHtml(ex, view) {
  if (view.confirmDeleteId === ex.id) {
    return `
      <div class="confirm-row">
        ¿Eliminar "${esc(ex.name)}"?
        <div class="btn-row">
          <button type="button" class="btn danger" data-action="confirm-delete" data-id="${esc(ex.id)}">Sí, eliminar</button>
          <button type="button" class="btn" data-action="cancel-delete">Cancelar</button>
        </div>
      </div>`;
  }
  return `
    <div class="row">
      <span class="row-name">${esc(ex.name)}</span>
      <div class="row-actions">
        <span class="tag">${esc(formatDose(ex))}</span>
        <button type="button" class="icon-btn" data-action="open-edit" data-id="${esc(ex.id)}" aria-label="Editar ${esc(ex.name)}">${ICONS.edit}</button>
        <button type="button" class="icon-btn danger" data-action="ask-delete" data-id="${esc(ex.id)}" aria-label="Eliminar ${esc(ex.name)}">${ICONS.trash}</button>
      </div>
    </div>`;
}

function renderRutina(state, view, ctx) {
  const dayKey = view.rutinaDay;
  const day = state.routine[dayKey];

  const tabs = DAY_KEYS.map(k => `
    <button type="button" class="tabday${k === dayKey ? " sel" : ""}${k === ctx.todayDay ? " today" : ""}"
      data-action="select-day" data-day="${k}" aria-pressed="${k === dayKey}">${DAY_LABELS[k]}</button>`).join("");

  const status = dayStatus(day);
  let body;
  if (status === "rest") body = `<div class="empty-state">Día de descanso.</div>`;
  else if (status === "empty") body = `<div class="empty-state">${EMPTY_DAY_TEXT}</div>`;
  else body = day.exercises.map(ex => rutinaRowHtml(ex, view)).join("");

  const form = view.form ? exerciseFormHtml(view.form) : "";
  const addBtn = !day.rest && !view.form
    ? `<button type="button" class="btn ghost" data-action="open-add">+ Agregar ejercicio</button>` : "";

  $("rutinaContent").innerHTML = `
    <div class="tabs">${tabs}</div>
    <div class="box">
      <div class="box-head">
        <div class="box-title">${DAY_LABELS[dayKey]}</div>
        <button type="button" class="switch" data-action="toggle-rest" aria-pressed="${day.rest}">
          <span class="box-ind" aria-hidden="true">${day.rest ? "✓" : ""}</span>Día de descanso
        </button>
      </div>
      ${body}
    </div>
    ${addBtn}
    ${form}`;
}

/* ---------- Calendario ---------- */

function renderCalendario(state, view, ctx) {
  const cal = calendarMonth(state.attendance, ctx.now);
  $("calMonth").textContent = formatMonthTitle(cal.year, cal.month);

  const heads = ["L", "M", "M", "J", "V", "S", "D"].map(d => `<div class="cal-head" aria-hidden="true">${d}</div>`).join("");
  const blanks = `<div class="cal-day blank"></div>`.repeat(cal.offset);
  const days = cal.days.map(d => {
    const cls = `cal-day${d.marked ? " marked" : ""}${d.isToday ? " today" : ""}`;
    const label = `${d.day}${d.marked ? ", entrenado" : ""}`;
    return d.isToday
      ? `<button type="button" class="${cls}" data-action="toggle-attendance" data-source="calendario" aria-label="Hoy ${label}" aria-pressed="${d.marked}">${d.day}</button>`
      : `<div class="${cls}" aria-label="${label}">${d.day}</div>`;
  }).join("");

  const count = cal.days.filter(d => d.marked).length;

  $("calContent").innerHTML = `
    <div class="box">
      <div class="cal-grid">${heads}${blanks}${days}</div>
      <div class="legend"><span>● día entrenado</span><span>▢ hoy</span></div>
    </div>
    <div class="box">
      <div class="box-title">Resumen</div>
      <div class="row"><span>Días entrenados este mes</span><span class="tag">${count}</span></div>
      <div class="row"><span>Constancia</span><span class="tag">${constancy(state.attendance, ctx.now)}%</span></div>
    </div>`;
}

/* ---------- Admin (?admin=1) ---------- */

function renderAdmin(admin) {
  const resetBtn = admin.confirmReset
    ? `<div class="confirm-row">
        ¿Borrar los datos de ${esc(admin.userId)} en este celular y volver a la rutina inicial?
        <div class="btn-row">
          <button type="button" class="btn danger" data-action="admin-reset-confirm">Sí, resetear</button>
          <button type="button" class="btn" data-action="admin-reset-cancel">Cancelar</button>
        </div>
      </div>`
    : `<button type="button" class="btn danger" data-action="admin-reset">Resetear datos del usuario</button>`;

  $("adminContent").innerHTML = `
    <div class="box">
      <div class="box-title">Estado</div>
      <dl class="admin-dl">
        <div><dt>Usuario activo</dt><dd>${esc(admin.userId)}</dd></div>
        <div><dt>Eventos en cola (todos los usuarios del celular)</dt><dd>${admin.queueSize}</dd></div>
        <div><dt>Endpoint</dt><dd>${admin.endpoint ? "configurado" : "vacío (solo cola local)"}</dd></div>
        <div><dt>Días con asistencia</dt><dd>${admin.attendanceCount}</dd></div>
        <div><dt>Clave</dt><dd>${esc(admin.storageKey)}</dd></div>
      </dl>
    </div>
    <div class="box">
      <div class="box-title">Acciones</div>
      <button type="button" class="btn" data-action="admin-export">Exportar estado y eventos (JSON)</button>
      <button type="button" class="btn" data-action="admin-flush">Reenviar cola de eventos</button>
      ${resetBtn}
      ${admin.message ? `<div class="admin-msg" role="status">${esc(admin.message)}</div>` : ""}
    </div>
    <div class="box">
      <div class="box-title">Links</div>
      <div class="admin-msg">Usuario: agregar ?u=U1, ?u=U2 o ?u=U3 a la URL (con &amp;admin=1 para volver acá).</div>
      <a class="btn ghost" href="./">Abrir la app</a>
    </div>`;
}

export function renderApp(state, view, ctx) {
  showScreen(view.screen);
  if (view.screen === "admin") {
    renderAdmin(view.admin);
    return;
  }
  renderNav(view.screen);
  renderHoy(state, view, ctx);
  renderRutina(state, view, ctx);
  renderCalendario(state, view, ctx);
}
