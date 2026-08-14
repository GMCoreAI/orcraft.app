import { qs, on } from "../core/dom.js";

// Small thresholds with hysteresis: the bar appears as soon as scrolling starts.
const SHOW_AT = 4;
const HIDE_AT = 0;

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
