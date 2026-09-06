/* Same-origin content swapping: the masthead frame stays mounted, only
   [data-page-content] is replaced, so the logo animation never restarts.

   Because the content is swapped after an async fetch, the browser's own
   scroll restoration finds the wrong page and gives up. The router stamps
   every history entry with an id, remembers where each one was scrolled to,
   and restores that on Back/Forward - across pages and between headings of
   the same page alike. A fresh jump to a heading is left to the browser. */

import { qs, qsa, on } from "../core/dom.js";

const CONTENT_SELECTOR = "[data-page-content]";

function isInternalLink(anchor) {
  if (!anchor || anchor.target || anchor.hasAttribute("download")) return false;
  if (anchor.origin !== window.location.origin) return false;
  return anchor.protocol === "http:" || anchor.protocol === "https:";
}

function markCurrent(pathname) {
  qsa(".nav__link").forEach((link) => {
    const linkPath = new URL(link.href).pathname;
    const isCurrent = linkPath === pathname || (linkPath !== "/" && pathname.startsWith(linkPath));
    if (isCurrent) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

async function loadPage(url, { push, scrollY }) {
  const container = qs(CONTENT_SELECTOR);
  if (!container) return;

  container.classList.add("is-loading");

  const response = await fetch(url, { headers: { Accept: "text/html" } });
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);

  const doc = new DOMParser().parseFromString(await response.text(), "text/html");
  const incoming = doc.querySelector(CONTENT_SELECTOR);
  if (!incoming) throw new Error("Response has no page content region.");

  container.replaceChildren(...incoming.childNodes);
  container.classList.remove("is-loading");
  document.title = doc.title;
  document.body.dataset.page = doc.body.dataset.page ?? "";

  const target = new URL(url, window.location.origin);
  if (push) window.history.pushState({ entry: newEntryId() }, "", target);
  markCurrent(target.pathname);

  const anchored = target.hash && document.getElementById(target.hash.slice(1));
  if (typeof scrollY === "number") {
    // Back/forward: land where the reader left, without a smooth sweep across the page.
    window.scrollTo({ top: scrollY, behavior: "instant" });
  } else if (anchored) {
    anchored.scrollIntoView({ behavior: "smooth" });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return document.body.dataset.page;
}

/* Unique per entry, also across reloads: the ids live in history state, which
   outlives the page, while the remembered positions do not. */
function newEntryId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/* Gives the current history entry an id if it has none yet (the initial page
   load, or an entry the browser created for a jump to a heading). */
function stampEntry() {
  const state = window.history.state ?? {};
  if (!state.entry) {
    window.history.replaceState({ ...state, entry: newEntryId() }, "", window.location.href);
  }
  return window.history.state.entry;
}

export function initRouter(onPageLoaded) {
  if (!qs(CONTENT_SELECTOR)) return;

  const positions = new Map();
  let currentPath = window.location.pathname;
  let currentEntry = stampEntry();

  // Cheap enough per scroll event: one Map write, no history API call.
  on(window, "scroll", () => positions.set(currentEntry, window.scrollY), { passive: true });

  const navigate = (url, options) =>
    loadPage(url, options)
      .then((page) => {
        currentPath = window.location.pathname;
        currentEntry = stampEntry();
        onPageLoaded?.(page);
      })
      .catch(() => {
        window.location.href = url;
      });

  on(document, "click", (event) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const anchor = event.target.closest("a");
    if (!isInternalLink(anchor)) return;

    const url = new URL(anchor.href);
    if (url.pathname === window.location.pathname) return;

    event.preventDefault();
    // Kept in state as well, so the position survives a reload of the next page.
    window.history.replaceState(
      { ...(window.history.state ?? {}), scrollY: window.scrollY },
      "",
      window.location.href
    );
    navigate(url.href, { push: true });
  });

  on(window, "popstate", (event) => {
    if (!event.state?.entry) {
      // A fresh jump to a heading on this page: the browser scrolls to it, this
      // only adopts the entry it created so it can be restored later.
      currentEntry = stampEntry();
      return;
    }

    const entry = event.state.entry;
    const remembered = positions.get(entry) ?? event.state.scrollY;

    if (window.location.pathname !== currentPath) {
      navigate(window.location.href, { push: false, scrollY: remembered });
      return;
    }

    currentEntry = entry;
    if (typeof remembered === "number") {
      window.scrollTo({ top: remembered, behavior: "instant" });
    } else {
      const heading = window.location.hash && document.getElementById(window.location.hash.slice(1));
      if (heading) heading.scrollIntoView({ behavior: "smooth" });
    }
  });
}
