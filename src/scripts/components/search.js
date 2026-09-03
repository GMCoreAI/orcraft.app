/* Site search: a modal over the Pagefind index that the build writes to
   /pagefind/ (see eleventy.config.js). Only pages carrying data-pagefind-body
   (the docs articles) are indexed. The Pagefind runtime is fetched on first
   use, so pages that never open the search never pay for it. */

import { qs, qsa, on } from "../core/dom.js";

const PAGEFIND_URL = "/pagefind/pagefind.js";
const MAX_PAGES = 8;
const MAX_SECTIONS_PER_PAGE = 3;
const DEBOUNCE_MS = 200;
const UNAVAILABLE = "Search is unavailable right now.";
const IDLE = "Type to search the docs.";

let dialog;
let input;
let list;
let status;
let lastFocused;
let pagefindPromise;
let activeIndex = -1;

function loadPagefind() {
  pagefindPromise ??= import(PAGEFIND_URL).then(async (pagefind) => {
    await pagefind.init();
    return pagefind;
  });
  return pagefindPromise;
}

function escapeHtml(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function setStatus(text) {
  status.textContent = text;
  status.hidden = !text;
}

function links() {
  return qsa(".search__link", list);
}

function setActive(index) {
  const items = links();
  if (!items.length) {
    activeIndex = -1;
    return;
  }

  activeIndex = (index + items.length) % items.length;
  items.forEach((item, i) => item.classList.toggle("is-active", i === activeIndex));
  items[activeIndex].scrollIntoView({ block: "nearest" });
}

/* One row per matching section. The page title is shown as a crumb only when
   the section has a heading of its own, so a whole-page hit is not labelled
   twice. Excerpts arrive from Pagefind already escaped, with <mark> around the
   matched terms. */
function renderSection(page, section) {
  const title = section.title || page.meta.title;
  const crumb = section.title && section.title !== page.meta.title ? page.meta.title : "";

  return `
    <li class="search__result">
      <a class="search__link" href="${escapeHtml(section.url)}">
        <span class="search__heading">
          <span class="search__title">${escapeHtml(title)}</span>
          ${crumb ? `<span class="search__crumb">${escapeHtml(crumb)}</span>` : ""}
        </span>
        <span class="search__excerpt">${section.excerpt}</span>
      </a>
    </li>`;
}

function render(pages, query) {
  const rows = pages.flatMap((page) => {
    const sections = page.sub_results?.length ? page.sub_results : [{ url: page.url, excerpt: page.excerpt }];
    return sections.slice(0, MAX_SECTIONS_PER_PAGE).map((section) => renderSection(page, section));
  });

  list.innerHTML = rows.join("");
  setStatus(rows.length ? "" : `No results for “${query}”.`);
  setActive(0);
}

function clear(message = IDLE) {
  list.innerHTML = "";
  activeIndex = -1;
  setStatus(message);
}

async function search(query) {
  const pagefind = await loadPagefind();

  // Resolves to null when a newer query superseded this one while it waited.
  const response = await pagefind.debouncedSearch(query, {}, DEBOUNCE_MS);
  if (response === null) return;

  const pages = await Promise.all(response.results.slice(0, MAX_PAGES).map((result) => result.data()));
  if (input.value.trim() !== query) return;
  render(pages, query);
}

function open() {
  if (dialog.open) return;

  lastFocused = document.activeElement;
  dialog.showModal();
  input.focus();
  input.select();
  loadPagefind().catch(() => clear(UNAVAILABLE));
}

function close() {
  if (dialog.open) dialog.close();
}

function isTypingTarget(element) {
  return Boolean(element?.matches?.("input, textarea, select, [contenteditable]"));
}

export function initSearch() {
  dialog = qs("[data-search]");
  if (!dialog) return;

  input = qs("[data-search-input]", dialog);
  list = qs("[data-search-results]", dialog);
  status = qs("[data-search-status]", dialog);

  if (/mac|iphone|ipad/i.test(navigator.platform)) {
    qsa("[data-search-shortcut]").forEach((kbd) => (kbd.textContent = "⌘ K"));
  }

  on(document, "click", (event) => {
    if (event.target.closest("[data-search-open]")) open();
  });

  // Fetch the runtime as soon as the user shows intent, so the first keystroke
  // already has an index to search.
  on(
    document,
    "pointerenter",
    (event) => {
      if (event.target.closest?.("[data-search-open]")) loadPagefind().catch(() => {});
    },
    true
  );

  on(document, "keydown", (event) => {
    const isShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";
    const isSlash = event.key === "/" && !dialog.open && !isTypingTarget(event.target);
    if (!isShortcut && !isSlash) return;

    event.preventDefault();
    if (isShortcut && dialog.open) {
      close();
    } else {
      open();
    }
  });

  on(qs("[data-search-close]", dialog), "click", close);

  // The panel fills the dialog, so a click that lands on the dialog element
  // itself is a click on the backdrop.
  on(dialog, "click", (event) => {
    if (event.target === dialog) close();
  });

  on(dialog, "close", () => {
    input.value = "";
    clear();
    lastFocused?.focus?.();
  });

  on(input, "input", () => {
    const query = input.value.trim();
    if (!query) {
      clear();
      return;
    }
    setStatus("Searching…");
    search(query).catch(() => clear(UNAVAILABLE));
  });

  on(input, "keydown", (event) => {
    // A search input eats the first Escape to clear itself; close instead,
    // so Escape always dismisses the dialog.
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive(activeIndex + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive(activeIndex - 1);
    }
  });

  on(qs("[data-search-form]", dialog), "submit", (event) => {
    event.preventDefault();
    links()[Math.max(activeIndex, 0)]?.click();
  });

  on(list, "pointermove", (event) => {
    const link = event.target.closest(".search__link");
    if (link) setActive(links().indexOf(link));
  });

  // Result links are ordinary same-origin anchors: the router picks the click
  // up after this handler and swaps the page in place. A same-page anchor falls
  // through to the browser's own jump.
  on(list, "click", (event) => {
    if (event.target.closest(".search__link")) close();
  });
}
