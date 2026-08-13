import { qs, on } from "../core/dom.js";

let overlay;
let image;
let caption;
let lastFocused;

function build() {
  overlay = document.createElement("div");
  overlay.className = "lightbox";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.innerHTML = `
    <button class="lightbox__close" type="button" aria-label="Close">&times;</button>
    <figure class="lightbox__figure">
      <img class="lightbox__image" alt="" />
      <figcaption class="lightbox__caption"></figcaption>
    </figure>`;

  image = qs(".lightbox__image", overlay);
  caption = qs(".lightbox__caption", overlay);
  document.body.append(overlay);

  on(overlay, "click", (event) => {
    if (event.target !== caption) close();
  });
}

function open(source) {
  if (!overlay) build();

  lastFocused = document.activeElement;
  image.src = source.currentSrc || source.src;
  image.alt = source.alt;
  caption.textContent = source.alt;

  overlay.classList.add("is-open");
  document.body.classList.add("has-lightbox");
  qs(".lightbox__close", overlay).focus();
}

function close() {
  if (!overlay?.classList.contains("is-open")) return;

  overlay.classList.remove("is-open");
  document.body.classList.remove("has-lightbox");
  lastFocused?.focus();
}

export function initLightbox() {
  on(document, "click", (event) => {
    const trigger = event.target.closest("[data-lightbox]");
    const source = trigger?.querySelector("img");
    if (source) open(source);
  });

  on(document, "keydown", (event) => {
    if (event.key === "Escape") close();
  });
}
