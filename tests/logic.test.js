// Ejecutar con: node --test tests/logic.test.js
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  localDateKey, parseDateKey, addDays, dayKeyOf, formatHeaderDate, formatMonthTitle, isoWithOffset,
  normalizeAttendance, pruneCompleted, stateFromSeed, isValidState, DAY_KEYS,
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
