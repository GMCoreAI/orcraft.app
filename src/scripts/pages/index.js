/* Page module registry. Keyed by <body data-page="..."> . */

const pages = {
  home: () => import("./home.js"),
  contact: () => import("./contact.js"),
};

export function initPage(name) {
  const loader = pages[name];
  if (!loader) return;
  loader().then((module) => module.init?.());
}
