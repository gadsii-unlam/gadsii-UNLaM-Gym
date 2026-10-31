// Render de las pantallas. Lee el estado y la vista; no modifica datos.
import {
  DAY_KEYS, DAY_LABELS, completedIdsFor, dayStatus, formatDose, formatHeaderDate, hasAttendance,
} from "./logic.js";

const $ = id => document.getElementById(id);
const EMPTY_DAY_TEXT = "Todavía no cargaste ejercicios para este día";

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
      <span class="ic" aria-hidden="true"></span>${n.label}
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

  // F05: el botón de asistencia está siempre visible, haya o no rutina ese día.
  const markBtn = attended
    ? `<button type="button" class="btn primary done" data-action="mark-attendance" data-source="hoy">✓ Viniste hoy</button>`
    : `<button type="button" class="btn primary" data-action="mark-attendance" data-source="hoy">Marcar que vine hoy</button>`;

  $("hoyContent").innerHTML = `
    <div class="box">
      <div class="box-title">Tu rutina de hoy — ${DAY_LABELS[ctx.todayDay]}</div>
      ${routineBox}
    </div>
    ${hint}
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
        <button type="button" class="icon-btn" data-action="open-edit" data-id="${esc(ex.id)}" aria-label="Editar ${esc(ex.name)}">✎</button>
        <button type="button" class="icon-btn danger" data-action="ask-delete" data-id="${esc(ex.id)}" aria-label="Eliminar ${esc(ex.name)}">×</button>
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

export function renderApp(state, view, ctx) {
  showScreen(view.screen);
  renderNav(view.screen);
  renderHoy(state, view, ctx);
  renderRutina(state, view, ctx);
}
