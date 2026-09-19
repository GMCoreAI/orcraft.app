/* Top navigation: shows Sign in, or the signed-in email, depending on whether
   the visitor is signed in. The login and account pages keep the value current;
   every other page only reads it, so Clerk is not loaded site-wide. */

const KEY = "orcraft-signed-in";

export function rememberSignedIn(email) {
  try {
    if (email) localStorage.setItem(KEY, email);
    else localStorage.removeItem(KEY);
  } catch {
    /* storage unavailable: the link simply stays on Sign in */
  }
  updateAccountLinks();
}

function signedInEmail() {
  try {
    const value = localStorage.getItem(KEY);
    return value && value !== "1" ? value : null;
  } catch {
    return null;
  }
}

export function updateAccountLinks() {
  const email = signedInEmail();
  document.querySelectorAll("[data-nav-account]").forEach((link) => {
    const label = link.querySelector("[data-nav-account-label]") ?? link;
    link.setAttribute("href", email ? "/account/" : "/login/");
    link.classList.toggle("nav__account--signed-in", Boolean(email));
    label.replaceChildren();
    if (!email) {
      label.textContent = "Sign in";
      return;
    }
    const caption = document.createElement("small");
    caption.textContent = "Signed in as";
    const who = document.createElement("span");
    who.textContent = email;
    who.title = email;
    label.append(caption, who);
  });
}

export function initAccountLink() {
  updateAccountLinks();
  window.addEventListener("storage", (event) => {
    if (event.key === KEY || event.key === null) updateAccountLinks();
  });
}
