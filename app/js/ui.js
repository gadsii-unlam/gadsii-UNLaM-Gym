// Render de las pantallas. Lee el estado y la vista; no modifica datos.

const $ = id => document.getElementById(id);

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

export function renderApp(view) {
  showScreen(view.screen);
  renderNav(view.screen);
}
