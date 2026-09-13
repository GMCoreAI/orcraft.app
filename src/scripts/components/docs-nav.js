/* Expand/collapse and active-heading marking for the docs sidebar tree
   (partials/docs-nav.njk). */

import { qs, qsa, on } from "../core/dom.js";

let hashListenerAttached = false;

/* A heading inside a collapsed <details> (an FAQ question) is opened when linked to,
   so the answer is visible on arrival in every browser. Its open siblings are
   closed, so a link lands on one answer rather than in the middle of several. */
function revealHeading(hash) {
  const target = hash && document.getElementById(hash.slice(1));
  const details = target?.closest("details");
  if (!details) return;

  const group = details.closest(".faq") ?? details.parentElement;
  qsa("details[open]", group).forEach((other) => {
    if (other !== details) other.open = false;
  });
  details.open = true;
}

function markCurrentHeading() {
  revealHeading(window.location.hash);
  markCurrentLink();
}

function markCurrentLink() {
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

/* An answer opened by hand names itself in the URL hash, without a scroll and
   without a new history entry, so the page comes back with that answer open
   after a link in it was followed and the reader pressed Back. The router
   keeps its own entry id in the history state, so the state is carried over. */
function rememberOpenAnswer(details) {
  const heading = qs("[id]", details);
  if (!heading) return;

  const hash = `#${heading.id}`;
  const url = window.location.pathname + window.location.search;
  if (details.open) {
    if (window.location.hash === hash) return;
    window.history.replaceState(window.history.state, "", url + hash);
  } else if (window.location.hash === hash) {
    window.history.replaceState(window.history.state, "", url);
  } else {
    return;
  }
  markCurrentLink();
}

export function initDocsNav() {
  if (!qs(".docs-nav")) return;

  qsa(".faq details").forEach((details) => {
    on(details, "toggle", () => rememberOpenAnswer(details));
  });

  qsa(".docs-nav__toggle[aria-expanded]").forEach((toggle) => {
    on(toggle, "click", () => {
      const list = qs(":scope > .docs-nav__list", toggle.closest(".docs-nav__item"));
      if (!list) return;

      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      list.hidden = expanded;
    });
  });

  // Same-page sidebar links: open the answer on the click itself, since a repeat
  // click on the current hash fires no hashchange.
  qsa(".docs-nav__link").forEach((link) => {
    on(link, "click", () => {
      const target = new URL(link.href);
      if (target.pathname === window.location.pathname) revealHeading(target.hash);
    });
  });

  if (!hashListenerAttached) {
    on(window, "hashchange", markCurrentHeading);
    hashListenerAttached = true;
  }

  markCurrentHeading();
}
