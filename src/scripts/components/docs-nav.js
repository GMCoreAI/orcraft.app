/* Expand/collapse for the docs sidebar tree (partials/docs-nav.njk). */

import { qs, qsa, on } from "../core/dom.js";

export function initDocsNav() {
  qsa(".docs-nav__toggle[aria-expanded]").forEach((toggle) => {
    on(toggle, "click", () => {
      const list = qs(":scope > .docs-nav__list", toggle.closest(".docs-nav__item"));
      if (!list) return;

      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      list.hidden = expanded;
    });
  });
}
