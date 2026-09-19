/* Top navigation: shows Login or Account depending on whether the visitor is
   signed in. The login and account pages keep the flag current; every other
   page only reads it, so Clerk is not loaded site-wide. */

const KEY = "orcraft-signed-in";

export function rememberSignedIn(signedIn) {
  try {
    if (signedIn) localStorage.setItem(KEY, "1");
    else localStorage.removeItem(KEY);
  } catch {
    /* storage unavailable: the link simply stays on Login */
  }
  updateAccountLinks();
}

export function updateAccountLinks() {
  let signedIn = false;
  try {
    signedIn = localStorage.getItem(KEY) === "1";
  } catch {
    signedIn = false;
  }
  document.querySelectorAll("[data-nav-account]").forEach((link) => {
    link.textContent = signedIn ? "Account" : "Login";
    link.setAttribute("href", signedIn ? "/account/" : "/login/");
  });
}

export function initAccountLink() {
  updateAccountLinks();
  window.addEventListener("storage", (event) => {
    if (event.key === KEY || event.key === null) updateAccountLinks();
  });
}
