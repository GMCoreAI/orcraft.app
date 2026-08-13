/* Site-wide script entry point. Loaded as: <script type="module" src="/scripts/main.js"> */

import { initNav } from "./components/nav.js";
import { initReveal } from "./components/reveal.js";
import { initCurrentYear } from "./components/current-year.js";
import { initPage } from "./pages/index.js";

function boot() {
  initNav();
  initReveal();
  initCurrentYear();
  initPage(document.body.dataset.page);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
