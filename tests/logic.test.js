// Ejecutar con: node --test tests/logic.test.js
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  localDateKey, parseDateKey, addDays, dayKeyOf, formatHeaderDate, formatMonthTitle, isoWithOffset,
  normalizeAttendance, pruneCompleted, stateFromSeed, isValidState, DAY_KEYS,
  validateExercise, formatDose, makeId, addExercise, editExercise, deleteExercise,
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
