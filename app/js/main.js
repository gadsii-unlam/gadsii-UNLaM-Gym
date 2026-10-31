// Punto de entrada. Con ?admin=1 abre la pantalla del equipo (sin link
// desde la UI); si no, la app del alumno.
const isAdmin = new URLSearchParams(location.search).get("admin") === "1";

if (isAdmin) {
  import("./admin.js").then(m => m.startAdmin());
} else {
  import("./app.js");
}
