// Punto de entrada: arma la vista, conecta acciones y renderiza.
import { renderApp } from "./ui.js";
import { getState, initStore, resolveUserId, update } from "./store.js";
import {
  addExercise, allExerciseIds, dayKeyOf, deleteExercise, editExercise, findExercise,
  localDateKey, makeId, setRest, validateExercise,
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

function rerender() {
  renderApp(getState(), view, today());
}

function go(screen) {
  if (view.screen === screen) return;
  view.screen = screen;
  rerender();
  window.scrollTo(0, 0);
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

const actions = {
  nav: el => go(el.dataset.screen),

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
    update(s => ({ ...s, routine: setRest(s.routine, dayKey, !s.routine[dayKey].rest) }));
    view.form = null;
    view.confirmDeleteId = null;
    rerender();
  },

  "confirm-delete": el => {
    const id = el.dataset.id;
    const dayKey = view.rutinaDay;
    update(s => ({ ...s, routine: deleteExercise(s.routine, dayKey, id) }));
    view.confirmDeleteId = null;
    rerender();
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
  if (view.form.mode === "edit") {
    const id = view.form.id;
    update(s => ({ ...s, routine: editExercise(s.routine, dayKey, id, result.value) }));
  } else {
    update(s => {
      const id = makeId(allExerciseIds(s.routine));
      return { ...s, routine: addExercise(s.routine, dayKey, result.value, id) };
    });
  }
  view.form = null;
  rerender();
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

rerender();
