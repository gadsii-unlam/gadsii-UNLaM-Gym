// Datos iniciales por usuario. Se aplican solo si no hay datos guardados
// para ese usuario en el celular (ver store.js).
//
// Formato de cada ejercicio: ex(id, nombre, series, cantidad, unidad)
//   - id: único y estable dentro del usuario (no se muestra).
//   - unidad: "reps" (se ve "4x10") o "seg" (se ve "3x40 seg").
// Un día de descanso lleva rest: true.
//
// attendance: fechas YYYY-MM-DD ya entrenadas. Para U1, U2 y U3 queda vacío:
// el historial arranca el día de la prueba.

const ex = (id, name, series, reps, unit = "reps") => ({ id, name, series, reps, unit });
const day = (...exercises) => ({ rest: false, exercises });
const rest = () => ({ rest: true, exercises: [] });

export const SEEDS = {
  // Rutina del wireframe. Se usa sin ?u= o con un valor desconocido.
  demo: {
    routine: {
      lun: day(
        ex("ex_d_lun1", "Sentadilla", 4, 10),
        ex("ex_d_lun2", "Prensa", 3, 12),
        ex("ex_d_lun3", "Extensión cuádriceps", 3, 15),
        ex("ex_d_lun4", "Zancadas", 4, 8),
      ),
      mar: day(
        ex("ex_d_mar1", "Press banca", 4, 8),
        ex("ex_d_mar2", "Press militar", 3, 10),
        ex("ex_d_mar3", "Fondos", 3, 12),
      ),
      mie: rest(),
      jue: day(
        ex("ex_d_jue1", "Peso muerto", 4, 8),
        ex("ex_d_jue2", "Remo", 3, 10),
        ex("ex_d_jue3", "Dominadas asistidas", 3, 8),
      ),
      vie: day(
        ex("ex_d_vie1", "Sentadilla búlgara", 3, 10),
        ex("ex_d_vie2", "Curl bíceps", 3, 12),
        ex("ex_d_vie3", "Plancha", 3, 40, "seg"),
      ),
      sab: rest(),
      dom: rest(),
    },
    // Opcional, solo para demo: historial precargado para mostrar racha,
    // calendario y comparación con el mes anterior.
    attendance: [
      "2026-09-02", "2026-09-04", "2026-09-09", "2026-09-11", "2026-09-16",
      "2026-09-18", "2026-09-23", "2026-09-25", "2026-09-30",
      "2026-10-01", "2026-10-03", "2026-10-05", "2026-10-07", "2026-10-08",
      "2026-10-12", "2026-10-14", "2026-10-15", "2026-10-19", "2026-10-21",
      "2026-10-22", "2026-10-26", "2026-10-28", "2026-10-29", "2026-10-30",
    ],
  },

  // TODO equipo: cargar la rutina real de U1
  U1: {
    routine: {
      lun: day(
        ex("ex_u1_01", "Sentadilla", 4, 10),
        ex("ex_u1_02", "Prensa", 3, 12),
        ex("ex_u1_03", "Estocadas", 3, 10),
      ),
      mar: rest(),
      mie: day(
        ex("ex_u1_04", "Press banca", 4, 8),
        ex("ex_u1_05", "Remo con barra", 4, 10),
        ex("ex_u1_06", "Plancha", 3, 30, "seg"),
      ),
      jue: rest(),
      vie: day(
        ex("ex_u1_07", "Peso muerto", 3, 8),
        ex("ex_u1_08", "Press militar", 3, 10),
      ),
      sab: rest(),
      dom: rest(),
    },
    attendance: [],
  },

  // TODO equipo: cargar la rutina real de U2
  U2: {
    routine: {
      lun: day(
        ex("ex_u2_01", "Press banca", 4, 10),
        ex("ex_u2_02", "Aperturas con mancuernas", 3, 12),
        ex("ex_u2_03", "Fondos", 3, 10),
      ),
      mar: day(
        ex("ex_u2_04", "Dominadas", 4, 6),
        ex("ex_u2_05", "Remo con mancuerna", 3, 12),
      ),
      mie: day(
        ex("ex_u2_06", "Sentadilla", 4, 10),
        ex("ex_u2_07", "Camilla de isquiotibiales", 3, 12),
      ),
      jue: day(
        ex("ex_u2_08", "Press militar", 4, 10),
        ex("ex_u2_09", "Elevaciones laterales", 3, 15),
      ),
      vie: day(
        ex("ex_u2_10", "Curl bíceps", 3, 12),
        ex("ex_u2_11", "Extensión de tríceps", 3, 12),
        ex("ex_u2_12", "Abdominales", 3, 20),
      ),
      sab: rest(),
      dom: rest(),
    },
    attendance: [],
  },

  // TODO equipo: cargar la rutina real de U3
  U3: {
    routine: {
      lun: day(
        ex("ex_u3_01", "Bicicleta fija", 1, 600, "seg"),
        ex("ex_u3_02", "Sentadilla con mancuerna", 3, 12),
        ex("ex_u3_03", "Puente de glúteos", 3, 15),
      ),
      mar: rest(),
      mie: day(
        ex("ex_u3_04", "Remo en máquina", 3, 12),
        ex("ex_u3_05", "Press de pecho en máquina", 3, 12),
        ex("ex_u3_06", "Plancha", 3, 30, "seg"),
      ),
      jue: rest(),
      vie: day(
        ex("ex_u3_07", "Cinta", 1, 600, "seg"),
        ex("ex_u3_08", "Prensa", 3, 12),
      ),
      sab: rest(),
      dom: rest(),
    },
    attendance: [],
  },
};
