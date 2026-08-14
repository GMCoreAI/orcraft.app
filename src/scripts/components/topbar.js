import { qs, on } from "../core/dom.js";

// Hysteresis keeps the bar from flickering around a single threshold.
const HYSTERESIS = 100;

export function initTopbar() {
  const topbar = qs("[data-topbar]");
  const masthead = qs(".masthead");
  if (!topbar || !masthead) return;

  // Reveal only once the masthead's own nav has fully scrolled out of view,
  // so the two menus are never on screen at the same time.
  let showAt = 0;
  let hideAt = 0;
  const measure = () => {
    showAt = masthead.getBoundingClientRect().bottom + window.scrollY;
    hideAt = Math.max(showAt - HYSTERESIS, 0);
  };

  let queued = false;
  const update = () => {
    const visible = topbar.classList.contains("is-visible");
    topbar.classList.toggle("is-visible", window.scrollY > (visible ? hideAt : showAt));
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

  on(window, "resize", () => {
    measure();
    update();
  }, { passive: true });

  measure();
  update();
}
