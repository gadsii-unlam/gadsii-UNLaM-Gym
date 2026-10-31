// App del alumno: arma la vista, conecta acciones y renderiza.
import { renderApp } from "./ui.js";
import { getState, initStore, refresh, resolveUserId, update } from "./store.js";
import { setContext, startEventLoop, track } from "./events.js";
import {
  addExercise, allExerciseIds, dayKeyOf, deleteExercise, editExercise, findExercise, isMonthVisible,
  localDateKey, makeId, monthsAgo, removeCompletedId, setRest, shiftMonth, toggleAttendance, toggleCompleted,
  validateExercise,
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
  calMonth: null,        // { year, month } que se ve en Calendario; null = mes actual
};

setContext({ userId, screen: view.screen });

function rerender() {
  renderApp(getState(), view, today());
}

function go(screen) {
  if (view.screen === screen) return;
  view.screen = screen;
  view.calMonth = null; // el calendario siempre abre en el mes actual
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

function showCalMonth(to, now) {
  const ago = monthsAgo(now, to.year, to.month);
  view.calMonth = ago === 0 ? null : to;
  rerender();
  track("calendar_month_view", { month: `${to.year}-${String(to.month + 1).padStart(2, "0")}`, monthsAgo: ago });
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

  "cal-month": el => {
    const { now } = today();
    const from = view.calMonth || { year: now.getFullYear(), month: now.getMonth() };
    const to = shiftMonth(from.year, from.month, Number(el.dataset.delta));
    if (!isMonthVisible(now, to.year, to.month)) return;
    showCalMonth(to, now);
  },

  "cal-today": () => {
    const { now } = today();
    showCalMonth({ year: now.getFullYear(), month: now.getMonth() }, now);
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

rerender();
startEventLoop();
track("screen_view");
