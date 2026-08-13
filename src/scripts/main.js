/* Site-wide script entry point. Loaded as: <script type="module" src="/scripts/main.js"> */

import { initRouter } from "./components/router.js";
import { initReveal } from "./components/reveal.js";
import { initCurrentYear } from "./components/current-year.js";
import { initPage } from "./pages/index.js";

function initContent(page) {
  initReveal();
  initCurrentYear();
  initPage(page ?? document.body.dataset.page);
}

function boot() {
  initRouter(initContent);
  initContent();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
