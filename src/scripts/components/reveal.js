import { qsa, prefersReducedMotion } from "../core/dom.js";

/* A [data-reveal-group] container reveals all of its .reveal descendants as
   soon as its own top edge enters the viewport, so a tall block never shows
   an empty frame while its rows wait to scroll in one by one. The rows keep
   their CSS stagger, so they still fill top to bottom. */
export function initReveal() {
  const targets = qsa(".reveal");
  if (!targets.length) return;

  if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const groups = qsa("[data-reveal-group]");
  const inGroup = (el) => groups.some((group) => group.contains(el));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -10%" }
  );

  const groupObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      qsa(".reveal", entry.target).forEach((el) => el.classList.add("is-visible"));
      groupObserver.unobserve(entry.target);
    });
  });

  targets.filter((el) => !inGroup(el)).forEach((el) => observer.observe(el));
  groups.forEach((group) => groupObserver.observe(group));
}
