// Punto de entrada: arma la vista, conecta acciones y renderiza.
import { renderApp } from "./ui.js";
import { getState, initStore, resolveUserId } from "./store.js";

const userId = resolveUserId(location.search);
initStore(userId);

const view = { screen: "hoy" };

function rerender() {
  renderApp(getState(), view);
}

function go(screen) {
  if (view.screen === screen) return;
  view.screen = screen;
  rerender();
  window.scrollTo(0, 0);
}

const actions = {
  nav: el => go(el.dataset.screen),
};

document.addEventListener("click", e => {
  const el = e.target.closest("[data-action]");
  if (!el || !actions[el.dataset.action]) return;
  actions[el.dataset.action](el);
});

rerender();
