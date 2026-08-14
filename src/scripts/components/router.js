/* Same-origin content swapping: the masthead frame stays mounted, only
   [data-page-content] is replaced, so the logo animation never restarts. */

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

async function loadPage(url, { push }) {
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
  if (push) window.history.pushState({}, "", target);
  markCurrent(target.pathname);

  const anchored = target.hash && document.getElementById(target.hash.slice(1));
  if (anchored) {
    anchored.scrollIntoView({ behavior: "smooth" });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return document.body.dataset.page;
}

export function initRouter(onPageLoaded) {
  if (!qs(CONTENT_SELECTOR)) return;

  const navigate = (url, options) =>
    loadPage(url, options)
      .then((page) => onPageLoaded?.(page))
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
    navigate(url.href, { push: true });
  });

  on(window, "popstate", () => navigate(window.location.href, { push: false }));
}
