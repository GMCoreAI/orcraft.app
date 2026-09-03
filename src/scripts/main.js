/* Site-wide script entry point. Loaded as: <script type="module" src="/scripts/main.js"> */

import { initRouter } from "./components/router.js";
import { initTopbar } from "./components/topbar.js";
import { initLightbox } from "./components/lightbox.js";
import { initCopy } from "./components/copy.js";
import { initReveal } from "./components/reveal.js";
import { initCurrentYear } from "./components/current-year.js";
import { initDocsNav } from "./components/docs-nav.js";
import { initSearch } from "./components/search.js";
import { initPage } from "./pages/index.js";

function initContent(page) {
  initReveal();
  initCurrentYear();
  initDocsNav();
  initPage(page ?? document.body.dataset.page);
  // Router swaps content without a page load, so Prism's auto DOMContentLoaded highlight misses it.
  window.Prism?.highlightAllUnder(document.querySelector("[data-page-content]") ?? document.body);
}

function boot() {
  initRouter(initContent);
  initTopbar();
  initLightbox();
  initCopy();
  initSearch();
  initContent();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
