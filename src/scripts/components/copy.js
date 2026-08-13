import { on } from "../core/dom.js";

const RESET_DELAY = 1600;

export function initCopy() {
  on(document, "click", async (event) => {
    const button = event.target.closest("[data-copy]");
    if (!button) return;

    try {
      await navigator.clipboard.writeText(button.dataset.copy);
    } catch {
      return;
    }

    button.classList.add("is-copied");
    setTimeout(() => button.classList.remove("is-copied"), RESET_DELAY);
  });
}
