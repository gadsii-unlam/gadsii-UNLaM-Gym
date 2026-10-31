// Ejecutar con: node --test tests/logic.test.js
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  localDateKey, parseDateKey, addDays, dayKeyOf, formatHeaderDate, formatMonthTitle, isoWithOffset,
  normalizeAttendance, pruneCompleted, stateFromSeed, isValidState, DAY_KEYS,
  validateExercise, formatDose, makeId, addExercise, editExercise, deleteExercise,
  setRest, dayStatus, toggleCompleted, completedIdsFor, removeCompletedId, addAttendance, hasAttendance,
  calendarOffset, calendarMonth, countInMonthUpTo, toggleAttendance,
  streak, streakText, constancy, monthComparison, comparisonMessage,
} from "../app/js/logic.js";
import { SEEDS } from "../app/js/seeds.js";

test("localDateKey usa la fecha local cerca de la medianoche", () => {
  assert.equal(localDateKey(new Date(2026, 9, 31, 21, 30)), "2026-10-31");
  assert.equal(localDateKey(new Date(2026, 9, 31, 23, 59, 59, 999)), "2026-10-31");
  assert.equal(localDateKey(new Date(2026, 10, 1, 0, 0, 0)), "2026-11-01");
  assert.equal(localDateKey(new Date(2026, 0, 5)), "2026-01-05");
});

test("parseDateKey y addDays cruzan meses y años", () => {
  assert.equal(localDateKey(parseDateKey("2026-10-31")), "2026-10-31");
  assert.equal(addDays("2026-10-31", 1), "2026-11-01");
  assert.equal(addDays("2026-03-01", -1), "2026-02-28");
  assert.equal(addDays("2027-01-01", -1), "2026-12-31");
});

test("dayKeyOf mapea con semana que arranca en lunes", () => {
  assert.equal(dayKeyOf(new Date(2026, 9, 26)), "lun");
  assert.equal(dayKeyOf(new Date(2026, 9, 31)), "sab");
  assert.equal(dayKeyOf(new Date(2026, 10, 1)), "dom");
});

test("formatos de fecha para la UI", () => {
  assert.equal(formatHeaderDate(new Date(2026, 9, 31)), "Sáb · 31 oct");
  assert.equal(formatMonthTitle(2026, 9), "Octubre 2026");
});

test("isoWithOffset conserva la fecha y hora local con zona", () => {
  const d = new Date(2026, 9, 31, 21, 5, 9, 7);
  const iso = isoWithOffset(d);
  assert.match(iso, /^2026-10-31T21:05:09\.007[+-]\d{2}:\d{2}$/);
  assert.equal(new Date(iso).getTime(), d.getTime());
});

test("normalizeAttendance ordena, saca duplicados y fechas inválidas", () => {
  assert.deepEqual(
    normalizeAttendance(["2026-10-05", "2026-10-02", "2026-10-05", "basura"]),
    ["2026-10-02", "2026-10-05"],
  );
});

test("pruneCompleted conserva solo las marcas de hoy", () => {
  const completed = { "2026-10-30": ["a"], "2026-10-31": ["b", "b"] };
  assert.deepEqual(pruneCompleted(completed, "2026-10-31"), { "2026-10-31": ["b"] });
  assert.deepEqual(pruneCompleted(completed, "2026-11-01"), {});
});

test("los seeds generan un estado válido sin modificar el seed", () => {
  for (const userId of ["demo", "U1", "U2", "U3"]) {
    const s = stateFromSeed(userId, SEEDS[userId]);
    assert.ok(isValidState(s, userId), userId);
    assert.deepEqual(Object.keys(s.routine), DAY_KEYS);
    const ids = DAY_KEYS.flatMap(k => s.routine[k].exercises.map(e => e.id));
    assert.equal(new Set(ids).size, ids.length, `ids únicos en ${userId}`);
    s.routine.lun.exercises.push({ id: "x" });
    assert.notEqual(SEEDS[userId].routine.lun.exercises.at(-1).id, "x");
  }
  assert.deepEqual(stateFromSeed("U1", SEEDS.U1).attendance, []);
});

/* ---------- F02: validación del formulario ---------- */

const valid = { name: "Sentadilla", series: "4", reps: "10", unit: "reps" };

test("F02: acepta datos válidos y recorta el nombre", () => {
  const r = validateExercise({ ...valid, name: "  Sentadilla  " });
  assert.equal(r.ok, true);
  assert.deepEqual(r.value, { name: "Sentadilla", series: 4, reps: 10, unit: "reps" });
  assert.equal(validateExercise({ ...valid, name: "x".repeat(40) }).ok, true);
  assert.equal(validateExercise({ ...valid, series: "1", reps: "1" }).ok, true);
  assert.equal(validateExercise({ ...valid, series: "20", reps: "600", unit: "seg" }).ok, true);
});

test("F02: rechaza nombre vacío, solo espacios o de más de 40 caracteres", () => {
  assert.ok(validateExercise({ ...valid, name: "" }).errors.name);
  assert.ok(validateExercise({ ...valid, name: "    " }).errors.name);
  assert.ok(validateExercise({ ...valid, name: "x".repeat(41) }).errors.name);
});

test("F02: series entero de 1 a 20", () => {
  for (const series of ["0", "21", "3x12", "2.5", "-1", "", "abc"]) {
    const r = validateExercise({ ...valid, series });
    assert.equal(r.ok, false, series);
    assert.ok(r.errors.series, series);
    assert.equal(r.value, null);
  }
});

test("F02: repeticiones o segundos entero de 1 a 600 y unidad válida", () => {
  for (const reps of ["0", "601", "10seg", "1e2", ""]) {
    assert.ok(validateExercise({ ...valid, reps }).errors.reps, reps);
  }
  assert.ok(validateExercise({ ...valid, unit: "kg" }).errors.unit);
});

test("formatDose muestra reps o segundos", () => {
  assert.equal(formatDose({ series: 4, reps: 10, unit: "reps" }), "4x10");
  assert.equal(formatDose({ series: 3, reps: 40, unit: "seg" }), "3x40 seg");
});

test("makeId genera ids únicos con formato estable", () => {
  const ids = new Set(["ex_aaaaaa"]);
  let calls = 0;
  const seq = [0.5, 0.0123456789, 0.987654321]; // 0.5 da un id corto y se descarta
  const id = makeId(ids, () => seq[calls++]);
  assert.match(id, /^ex_[0-9a-z]{6}$/);
  assert.ok(!ids.has(id));
});

test("editar conserva el id y eliminar saca solo ese ejercicio", () => {
  const routine = stateFromSeed("demo", SEEDS.demo).routine;
  const added = addExercise(routine, "sab", { name: "Remo", series: 3, reps: 10, unit: "reps" }, "ex_nuevo1");
  assert.equal(added.sab.exercises[0].id, "ex_nuevo1");
  assert.equal(routine.sab.exercises.length, 0, "no muta la rutina original");
  const edited = editExercise(added, "lun", "ex_d_lun2", { name: "Prensa 45°", series: 4, reps: 12, unit: "reps" });
  assert.deepEqual(edited.lun.exercises[1], { id: "ex_d_lun2", name: "Prensa 45°", series: 4, reps: 12, unit: "reps" });
  const deleted = deleteExercise(edited, "lun", "ex_d_lun1");
  assert.deepEqual(deleted.lun.exercises.map(e => e.id), ["ex_d_lun2", "ex_d_lun3", "ex_d_lun4"]);
});

/* ---------- F04: descanso como flag del día ---------- */

test("F04: el descanso es un flag y un día sin ejercicios queda vacío", () => {
  const routine = stateFromSeed("demo", SEEDS.demo).routine;
  assert.equal(dayStatus(routine.mie), "rest");
  assert.equal(dayStatus(routine.lun), "exercises");
  const sinLunes = ["ex_d_lun1", "ex_d_lun2", "ex_d_lun3", "ex_d_lun4"]
    .reduce((r, id) => deleteExercise(r, "lun", id), routine);
  assert.equal(dayStatus(sinLunes.lun), "empty");
  assert.equal(sinLunes.lun.rest, false, "vaciar un día no lo convierte en descanso");

  const descanso = setRest(routine, "lun", true);
  assert.equal(dayStatus(descanso.lun), "rest");
  assert.equal(descanso.lun.exercises.length, 4, "los ejercicios se conservan");
  assert.equal(dayStatus(setRest(descanso, "lun", false).lun), "exercises");
});

/* ---------- F08: completado por id ---------- */

test("F08: eliminar un ejercicio no transfiere su marca a otro", () => {
  const today = "2026-10-26";
  let routine = stateFromSeed("demo", SEEDS.demo).routine;
  let completed = toggleCompleted({}, today, "ex_d_lun1"); // Sentadilla, primer ejercicio
  assert.deepEqual([...completedIdsFor(completed, today, routine.lun.exercises)], ["ex_d_lun1"]);

  routine = deleteExercise(routine, "lun", "ex_d_lun1");
  completed = removeCompletedId(completed, "ex_d_lun1");
  // Con índices, "Prensa" (ahora en la posición 0) habría heredado la marca.
  assert.equal(completedIdsFor(completed, today, routine.lun.exercises).size, 0);
});

test("F08: reordenar no mueve marcas y un id que ya no existe no cuenta", () => {
  const today = "2026-10-26";
  const exs = stateFromSeed("demo", SEEDS.demo).routine.lun.exercises;
  const completed = { [today]: ["ex_d_lun3", "ex_borrado"] };
  const done = completedIdsFor(completed, today, [...exs].reverse());
  assert.deepEqual([...done], ["ex_d_lun3"]);
});

test("F08: toggleCompleted marca y desmarca solo en la fecha indicada", () => {
  let c = toggleCompleted({}, "2026-10-31", "a");
  c = toggleCompleted(c, "2026-10-31", "b");
  c = toggleCompleted(c, "2026-10-31", "a");
  assert.deepEqual(c, { "2026-10-31": ["b"] });
  assert.equal(completedIdsFor(c, "2026-11-01", [{ id: "b" }]).size, 0, "al otro día arranca sin marcas");
});

/* ---------- F05: asistencia en cualquier día ---------- */

test("F05: se puede registrar asistencia en un día de descanso", () => {
  const s = stateFromSeed("U1", SEEDS.U1);
  assert.equal(dayStatus(s.routine.sab), "rest");
  const att = addAttendance(s.attendance, "2026-10-31");
  assert.ok(hasAttendance(att, "2026-10-31"));
  assert.deepEqual(addAttendance(att, "2026-10-31"), ["2026-10-31"], "sin duplicados");
});

/* ---------- F03: offset del calendario ---------- */

test("F03: octubre 2026 arranca jueves → 3 celdas vacías", () => {
  assert.equal(calendarOffset(2026, 9), 3);
});

test("F03: mes que arranca en lunes → 0 celdas vacías (junio 2026)", () => {
  assert.equal(new Date(2026, 5, 1).getDay(), 1);
  assert.equal(calendarOffset(2026, 5), 0);
});

test("F03: mes que arranca en domingo → 6 celdas vacías (noviembre 2026)", () => {
  assert.equal(new Date(2026, 10, 1).getDay(), 0);
  assert.equal(calendarOffset(2026, 10), 6);
});

test("F03: el offset no depende del día de hoy", () => {
  // En el wireframe salía de now.getDay(): el 31/10/2026 (sábado) daba 5.
  for (const day of [1, 15, 31]) {
    assert.equal(calendarMonth([], new Date(2026, 9, day)).offset, 3);
  }
});

test("calendarMonth marca días entrenados y hoy", () => {
  const cal = calendarMonth(["2026-09-30", "2026-10-02", "2026-10-31"], new Date(2026, 9, 31, 22, 0));
  assert.equal(cal.days.length, 31);
  assert.deepEqual(cal.days.filter(d => d.marked).map(d => d.day), [2, 31]);
  assert.deepEqual(cal.days.filter(d => d.isToday).map(d => d.day), [31]);
  assert.equal(countInMonthUpTo(["2026-10-02", "2026-10-20", "2026-09-02"], 2026, 9, 15), 1);
});

/* ---------- F01: asistencia como toggle ---------- */

test("F01: marcar y desmarcar la asistencia de hoy", () => {
  const att = ["2026-10-29", "2026-10-30"];
  const marked = toggleAttendance(att, "2026-10-31");
  assert.equal(marked.marked, true);
  assert.deepEqual(marked.attendance, ["2026-10-29", "2026-10-30", "2026-10-31"]);

  const unmarked = toggleAttendance(marked.attendance, "2026-10-31");
  assert.equal(unmarked.marked, false);
  assert.deepEqual(unmarked.attendance, att);
  assert.deepEqual(att, ["2026-10-29", "2026-10-30"], "no muta el arreglo original");
});

test("F01: desmarcar recalcula el calendario", () => {
  const today = new Date(2026, 9, 31);
  const { attendance } = toggleAttendance(["2026-10-30", "2026-10-31"], "2026-10-31");
  const cal = calendarMonth(attendance, today);
  assert.equal(cal.days.find(d => d.isToday).marked, false);
  assert.equal(cal.days.filter(d => d.marked).length, 1);
});

/* ---------- F07: racha, constancia y mensaje desde attendance ---------- */

test("racha: termina hoy si hoy está marcado", () => {
  assert.equal(streak(["2026-10-29", "2026-10-30", "2026-10-31"], "2026-10-31"), 3);
});

test("racha: si hoy no marcó, cuenta la que termina ayer", () => {
  assert.equal(streak(["2026-10-29", "2026-10-30"], "2026-10-31"), 2);
});

test("racha: cortada por un día sin asistencia", () => {
  assert.equal(streak(["2026-10-27", "2026-10-28", "2026-10-30", "2026-10-31"], "2026-10-31"), 2);
  assert.equal(streak(["2026-10-28", "2026-10-29"], "2026-10-31"), 0, "sin ayer ni hoy es 0");
});

test("racha: vacía y cruzando meses", () => {
  assert.equal(streak([], "2026-10-31"), 0);
  assert.equal(streak(["2026-09-30", "2026-10-01"], "2026-10-01"), 2);
});

test("textos de racha en singular y plural", () => {
  assert.equal(streakText(0), "Empezá tu racha hoy");
  assert.equal(streakText(1), "1 día seguido");
  assert.equal(streakText(3), "3 días seguidos");
});

test("constancia: días con asistencia del mes / días transcurridos, redondeado", () => {
  const att = ["2026-09-30", "2026-10-01", "2026-10-02", "2026-10-03"];
  assert.equal(constancy(att, new Date(2026, 9, 3)), 100);
  assert.equal(constancy(att, new Date(2026, 9, 6)), 50);
  assert.equal(constancy(att, new Date(2026, 9, 31)), 10); // 3/31 = 9,67 → 10
  assert.equal(constancy([], new Date(2026, 9, 1)), 0);
});

test("F07: el mensaje comparativo usa el mismo tramo del mes anterior", () => {
  const att = ["2026-09-02", "2026-09-20", "2026-10-02", "2026-10-05"];
  assert.deepEqual(monthComparison(att, new Date(2026, 9, 10)), { current: 2, previous: 1 });
  assert.match(comparisonMessage(att, new Date(2026, 9, 10)), /2 días contra 1 día/);
  // A fin de mes septiembre suma 2: empate → sin mensaje.
  assert.equal(comparisonMessage(att, new Date(2026, 9, 31)), null);
  // Marzo 31 contra febrero (28 días): el tramo anterior llega hasta el 28.
  assert.deepEqual(monthComparison(["2026-02-28", "2026-03-31"], new Date(2026, 2, 31)), { current: 1, previous: 1 });
  // Enero contra diciembre del año anterior.
  assert.deepEqual(monthComparison(["2025-12-01", "2026-01-01"], new Date(2026, 0, 1)), { current: 1, previous: 1 });
});

test("F07: sin datos del mes anterior el mensaje no aparece", () => {
  assert.equal(comparisonMessage(["2026-10-01", "2026-10-02"], new Date(2026, 9, 5)), null);
  assert.equal(comparisonMessage([], new Date(2026, 9, 5)), null);
});
