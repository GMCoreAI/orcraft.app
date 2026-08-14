/* Site-wide script entry point. Loaded as: <script type="module" src="/scripts/main.js"> */

import { initRouter } from "./components/router.js";
import { initTopbar } from "./components/topbar.js";
import { initLightbox } from "./components/lightbox.js";
import { initCopy } from "./components/copy.js";
import { initReveal } from "./components/reveal.js";
import { initCurrentYear } from "./components/current-year.js";
import { initDocsNav } from "./components/docs-nav.js";
import { initPage } from "./pages/index.js";

function initContent(page) {
  initReveal();
  initCurrentYear();
  initDocsNav();
  initPage(page ?? document.body.dataset.page);
}

function boot() {
  initRouter(initContent);
  initTopbar();
  initLightbox();
  initCopy();
  initContent();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
