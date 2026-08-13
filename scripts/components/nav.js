import { qs, on } from "../core/dom.js";

export function initNav() {
  const toggle = qs("[data-nav-toggle]");
  const nav = qs("[data-nav]");
  if (!toggle || !nav) return;

  const mobile = window.matchMedia("(max-width: 860px)");

  const setOpen = (open) => {
    nav.hidden = mobile.matches ? !open : false;
    toggle.setAttribute("aria-expanded", String(open));
  };

  setOpen(false);
  on(toggle, "click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
  on(mobile, "change", () => setOpen(false));
}
