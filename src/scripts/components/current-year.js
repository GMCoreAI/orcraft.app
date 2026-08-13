import { qsa } from "../core/dom.js";

export function initCurrentYear() {
  const year = String(new Date().getFullYear());
  qsa("[data-current-year]").forEach((el) => {
    el.textContent = year;
  });
}
