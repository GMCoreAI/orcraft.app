import { qs, on } from "../core/dom.js";

// Hysteresis keeps the bar from flickering around a single threshold.
const SHOW_AT = 260;
const HIDE_AT = 160;

export function initTopbar() {
  const topbar = qs("[data-topbar]");
  if (!topbar) return;

  let queued = false;
  const update = () => {
    const visible = topbar.classList.contains("is-visible");
    topbar.classList.toggle("is-visible", window.scrollY > (visible ? HIDE_AT : SHOW_AT));
    queued = false;
  };

  on(
    window,
    "scroll",
    () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    },
    { passive: true }
  );

  update();
}
