// Punto de entrada: arma la vista, conecta acciones y renderiza.
import { renderApp } from "./ui.js";
import { getState, initStore, refresh, resetToSeed, resolveUserId, storageKey, update } from "./store.js";
import { flush, queueSize, readQueue, setContext, startEventLoop, track } from "./events.js";
import { EVENTS_ENDPOINT } from "./config.js";
import {
  addExercise, allExerciseIds, dayKeyOf, deleteExercise, editExercise, findExercise,
  isoWithOffset, localDateKey, makeId, removeCompletedId, setRest, toggleAttendance, toggleCompleted, validateExercise,
} from "./logic.js";

const userId = resolveUserId(location.search);
initStore(userId);

function today() {
  const now = new Date();
  return { now, todayKey: localDateKey(now), todayDay: dayKeyOf(now) };
}

// Estado de la vista (no se persiste).
const view = {
  screen: "hoy",
  rutinaDay: today().todayDay,
  form: null,            // { mode: "add" | "edit", id, values, errors }
  confirmDeleteId: null,
};

setContext({ userId, screen: view.screen });

function rerender() {
  renderApp(getState(), view, today());
}

function go(screen) {
  if (view.screen === screen) return;
  view.screen = screen;
  setContext({ screen });
  rerender();
  window.scrollTo(0, 0);
  track("screen_view");
  if (screen === "cuota") track("cuota_view");
}

function focusForm(field = "fName") {
  const el = document.getElementById(field);
  if (el) { el.focus(); el.scrollIntoView({ block: "center" }); }
}

function openAdd() {
  view.form = { mode: "add", id: null, values: { name: "", series: "", reps: "", unit: "reps" }, errors: {} };
  view.confirmDeleteId = null;
  rerender();
  focusForm();
}

const exerciseData = (dayKey, ex) =>
  ({ day: dayKey, id: ex.id, name: ex.name, series: ex.series, reps: ex.reps, unit: ex.unit });

const actions = {
  nav: el => go(el.dataset.screen),

  "toggle-ex": el => {
    const { todayKey, todayDay } = today();
    const id = el.dataset.id;
    const s = update(st => ({ ...st, completed: toggleCompleted(st.completed, todayKey, id) }));
    rerender();
    const ex = findExercise(s.routine, todayDay, id);
    track("exercise_toggle", { id, name: ex ? ex.name : null, done: (s.completed[todayKey] || []).includes(id) });
  },

  // F01: el botón de Hoy y la celda de hoy en el Calendario son un toggle.
  "toggle-attendance": el => {
    const { todayKey } = today();
    let marked = false;
    update(s => {
      const r = toggleAttendance(s.attendance, todayKey);
      marked = r.marked;
      return { ...s, attendance: r.attendance };
    });
    rerender();
    track(marked ? "attendance_mark" : "attendance_unmark", { date: todayKey, source: el.dataset.source });
  },

  // Desde Hoy con el día vacío: abre Rutina en el día de hoy con el formulario.
  "go-add-today": () => {
    view.rutinaDay = today().todayDay;
    go("rutina");
    openAdd();
  },

  "select-day": el => {
    view.rutinaDay = el.dataset.day;
    view.form = null;
    view.confirmDeleteId = null;
    rerender();
  },

  "open-add": () => openAdd(),

  "open-edit": el => {
    const ex = findExercise(getState().routine, view.rutinaDay, el.dataset.id);
    if (!ex) return;
    view.form = {
      mode: "edit", id: ex.id,
      values: { name: ex.name, series: String(ex.series), reps: String(ex.reps), unit: ex.unit },
      errors: {},
    };
    view.confirmDeleteId = null;
    rerender();
    focusForm();
  },

  "cancel-form": () => {
    view.form = null;
    rerender();
  },

  "ask-delete": el => {
    view.confirmDeleteId = el.dataset.id;
    view.form = null;
    rerender();
  },

  "cancel-delete": () => {
    view.confirmDeleteId = null;
    rerender();
  },

  "toggle-rest": () => {
    const dayKey = view.rutinaDay;
    const s = update(st => ({ ...st, routine: setRest(st.routine, dayKey, !st.routine[dayKey].rest) }));
    view.form = null;
    view.confirmDeleteId = null;
    rerender();
    track("day_rest_toggle", { day: dayKey, rest: s.routine[dayKey].rest });
  },

  "confirm-delete": el => {
    const id = el.dataset.id;
    const dayKey = view.rutinaDay;
    const ex = findExercise(getState().routine, dayKey, id);
    update(s => ({
      ...s,
      routine: deleteExercise(s.routine, dayKey, id),
      completed: removeCompletedId(s.completed, id),
    }));
    view.confirmDeleteId = null;
    rerender();
    if (ex) track("exercise_delete", exerciseData(dayKey, ex));
  },
};

function submitExerciseForm(form) {
  const data = new FormData(form);
  const values = {
    name: data.get("name") ?? "",
    series: data.get("series") ?? "",
    reps: data.get("reps") ?? "",
    unit: data.get("unit") ?? "reps",
  };
  const result = validateExercise(values);
  if (!result.ok) {
    view.form = { ...view.form, values, errors: result.errors };
    rerender();
    const first = ["name", "series", "reps", "unit"].find(f => result.errors[f]);
    focusForm({ name: "fName", series: "fSeries", reps: "fReps", unit: "fUnit" }[first]);
    return;
  }

  const dayKey = view.rutinaDay;
  const mode = view.form.mode;
  let id = view.form.id;
  if (mode === "edit") {
    update(s => ({ ...s, routine: editExercise(s.routine, dayKey, id, result.value) }));
  } else {
    update(s => {
      id = makeId(allExerciseIds(s.routine));
      return { ...s, routine: addExercise(s.routine, dayKey, result.value, id) };
    });
  }
  view.form = null;
  rerender();
  track(mode === "edit" ? "exercise_edit" : "exercise_add", exerciseData(dayKey, { id, ...result.value }));
}

/* ---------- Herramientas del equipo (?admin=1, sin link desde la UI) ---------- */

const isAdmin = new URLSearchParams(location.search).get("admin") === "1";

function adminInfo(extra = {}) {
  const s = getState();
  return {
    userId: s.userId,
    queueSize: queueSize(),
    endpoint: !!EVENTS_ENDPOINT,
    attendanceCount: s.attendance.length,
    storageKey: storageKey(s.userId),
    confirmReset: false,
    message: "",
    ...extra,
  };
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

Object.assign(actions, {
  "admin-export": () => {
    const now = new Date();
    const s = getState();
    downloadJson(`unlamgym-${s.userId}-${localDateKey(now)}.json`, {
      exportedAt: isoWithOffset(now),
      userId: s.userId,
      state: s,
      eventQueue: readQueue(),
    });
    view.admin = adminInfo({ message: "Archivo exportado." });
    rerender();
  },

  "admin-flush": async () => {
    view.admin = adminInfo({ message: "Enviando…" });
    rerender();
    await flush();
    const left = queueSize();
    const message = !EVENTS_ENDPOINT
      ? "EVENTS_ENDPOINT está vacío en config.js: los eventos quedan en la cola local."
      : left === 0 ? "Cola enviada." : `No se pudo enviar todo: quedan ${left} eventos (¿sin conexión?).`;
    view.admin = adminInfo({ message });
    rerender();
  },

  "admin-reset": () => {
    view.admin = adminInfo({ confirmReset: true });
    rerender();
  },

  "admin-reset-cancel": () => {
    view.admin = adminInfo();
    rerender();
  },

  "admin-reset-confirm": () => {
    resetToSeed();
    view.admin = adminInfo({ message: `Datos de ${getState().userId} reseteados.` });
    rerender();
  },
});

document.addEventListener("click", e => {
  const el = e.target.closest("[data-action]");
  if (!el || !actions[el.dataset.action]) return;
  actions[el.dataset.action](el);
});

document.addEventListener("submit", e => {
  if (e.target.id !== "exerciseForm") return;
  e.preventDefault();
  submitExerciseForm(e.target);
});

// Cambio de día con la app abierta: las marcas de completado se reinician
// solas y Hoy pasa a mostrar la rutina del nuevo día.
let renderedDay = today().todayKey;
function checkDayChange() {
  const { todayKey } = today();
  if (todayKey === renderedDay) return;
  renderedDay = todayKey;
  refresh();
  if (!view.form) view.rutinaDay = today().todayDay;
  rerender();
}
setInterval(checkDayChange, 60 * 1000);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") checkDayChange();
});

if (isAdmin) {
  // La pantalla del equipo no registra eventos para no ensuciar las métricas.
  view.screen = "admin";
  view.admin = adminInfo();
  rerender();
} else {
  rerender();
  startEventLoop();
  track("screen_view");
}
