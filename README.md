# UNLaM-Gym

Integrantes: Máximo Justiniano, Leandro Raúl Mallia, Cristian Miguel Ozimo, Jeremías Portilla Martínez

Producto: El producto se denominará UNLaM-Gym, una plataforma web orientada a la gestión y seguimiento de la actividad de los alumnos del gimnasio de la Universidad Nacional de La Matanza.

Segmento de la comunidad UNLaM: El segmento seleccionado de la Universidad Nacional de La Matanza (UNLaM) está compuesto por los alumnos o miembros de la comunidad que utilizan o tienen interés en utilizar el gimnasio de la Universidad, considerando principalmente a aquellos que realizan actividades de entrenamiento físico y requieren organizar y realizar un seguimiento de sus rutinas y concurrencia.
Este segmento se caracteriza por ser un grupo de estudiantes que, además de sus actividades académicas, realizan actividad física dentro de las instalaciones de la UNLaM o también interesados en asistir al gimnasio sin necesidad de ser estudiantes de la universidad. Los usuarios presentan la necesidad de acceder de manera sencilla a la información relacionada con sus entrenamientos, conocer las rutinas asignadas por los entrenadores, registrar su asistencia y gestionar el pago de la suscripción al gimnasio.
El segmento se encuentra acompañado por otros actores directamente relacionados con el funcionamiento del gimnasio, principalmente los entrenadores encargados de diseñar y asignar las rutinas de entrenamiento y los administradores responsables de gestionar los ejercicios, usuarios y aspectos generales de la plataforma.

## MVP TP5

Web app mobile-first en HTML, CSS y JavaScript con ES modules, sin frameworks, sin build y sin dependencias en runtime. Tiene cuatro pantallas: Hoy, Rutina, Calendario y Cuota. Los datos se guardan en el `localStorage` del celular, separados por usuario.

```
app/                  la web app (se publica tal cual)
  index.html, manifest.webmanifest, icon.svg, icon-*.png
  css/styles.css
  js/logic.js         funciones puras (fechas, racha, constancia, calendario, validación, rutina)
  js/store.js         estado único y persistencia por usuario
  js/seeds.js         rutinas iniciales por usuario
  js/events.js        log de eventos con cola offline
  js/config.js        EVENTS_ENDPOINT
  js/ui.js            render de las pantallas
  js/main.js          punto de entrada
tests/logic.test.js   tests unitarios (node --test)
tools/apps-script/    receptor de eventos en Google Sheets
```

### Correrlo localmente

Los ES modules no funcionan con `file://`, así que hace falta un servidor estático:

```bash
npx serve app                  # o bien:
python -m http.server 8000 -d app
```

Abrir `http://localhost:3000/?u=U1` (con Python, `http://localhost:8000/?u=U1`). Para ver la vista de celular, usar las herramientas de desarrollo del navegador con 360 a 375 px de ancho.

Para correr los tests (Node 20 o superior):

```bash
node --test tests/logic.test.js     # o: npm test
```

### Publicarlo en GitHub Pages

La opción "Deploy from a branch" de GitHub Pages solo publica la raíz del repo o `/docs`. Por eso se incluye un workflow que publica `app/`:

1. Mergear la rama `MVP` a `main`.
2. En GitHub, ir a **Settings → Pages → Build and deployment → Source** y elegir **GitHub Actions**.
3. El workflow [`.github/workflows/pages.yml`](.github/workflows/pages.yml) se ejecuta con cada push a `main` que toque `app/`. También se puede lanzar a mano desde **Actions → Publicar MVP en GitHub Pages → Run workflow**.
4. La app queda en `https://gadsii-unlam.github.io/gadsii-UNLaM-Gym/`. El contenido de `app/` se publica en la raíz del sitio, así que la URL no lleva `/app/`.

### Links por usuario

| Usuario | Link |
|---|---|
| U1 | `https://gadsii-unlam.github.io/gadsii-UNLaM-Gym/?u=U1` |
| U2 | `https://gadsii-unlam.github.io/gadsii-UNLaM-Gym/?u=U2` |
| U3 | `https://gadsii-unlam.github.io/gadsii-UNLaM-Gym/?u=U3` |

- El primer ingreso con `?u=` queda guardado en el celular. Si después la abren sin el parámetro, desde favoritos o desde el ícono en la pantalla de inicio, siguen siendo el mismo usuario.
- Sin parámetro, o con un valor desconocido, la app entra con la rutina de ejemplo del wireframe.
- Las rutinas iniciales están en `app/js/seeds.js`, marcadas con `// TODO equipo`. Se aplican solo si ese usuario no tiene datos guardados en el celular. Si cambian el seed después de que alguien la abrió, usen el reset de `?admin=1`.

### Pantalla del equipo: `?admin=1`

No tiene ningún link desde la app. Se abre agregando `?admin=1` a la URL, por ejemplo `.../?u=U1&admin=1`. Permite:

- ver el usuario activo y la cantidad de eventos en cola;
- **exportar** el estado y la cola de eventos como `unlamgym-<usuario>-<fecha>.json`, como evidencia para `docs/evidencia/tp5/`;
- **resetear** los datos del usuario al seed, con confirmación, para preparar el celular antes de la sesión;
- **reenviar** la cola de eventos al endpoint.

La pantalla admin no registra eventos.

### Eventos de uso

Cada evento tiene la forma `{ userId, type, ts, localDate, screen, data }` y se guarda primero en una cola local. Si `EVENTS_ENDPOINT` en `app/js/config.js` tiene una URL, la cola se envía a una Google Sheet. Para configurarlo, ver [tools/apps-script/README.md](tools/apps-script/README.md). Los tipos de evento son `app_open`, `screen_view`, `exercise_toggle`, `attendance_mark`, `attendance_unmark`, `exercise_add`, `exercise_edit`, `exercise_delete`, `day_rest_toggle` y `cuota_view`.

