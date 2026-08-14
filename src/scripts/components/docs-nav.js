/* Expand/collapse and active-heading marking for the docs sidebar tree
   (partials/docs-nav.njk). */

import { qs, qsa, on } from "../core/dom.js";

let hashListenerAttached = false;

function markCurrentHeading() {
  const current = window.location.pathname + window.location.hash;

  qsa(".docs-nav__link").forEach((link) => {
    const target = new URL(link.href);
    if (target.hash && target.pathname + target.hash === current) {
      link.setAttribute("aria-current", "location");
    } else if (target.hash) {
      link.removeAttribute("aria-current");
    }
  });
}

export function initDocsNav() {
  if (!qs(".docs-nav")) return;

  qsa(".docs-nav__toggle[aria-expanded]").forEach((toggle) => {
    on(toggle, "click", () => {
      const list = qs(":scope > .docs-nav__list", toggle.closest(".docs-nav__item"));
      if (!list) return;

      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      list.hidden = expanded;
    });
  });

  if (!hashListenerAttached) {
    on(window, "hashchange", markCurrentHeading);
    hashListenerAttached = true;
  }

  markCurrentHeading();
}
