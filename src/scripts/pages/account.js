/* Account page: the signed-in home; fills up as the account features are built. */

import { loadClerk } from "./login.js";
import { rememberSignedIn } from "../components/account-link.js";

export async function init() {
  const section = document.querySelector(".account");
  if (!section) return;
  const find = (name) => section.querySelector(`[data-account-${name}]`);

  let clerk;
  try {
    clerk = await loadClerk(section);
    await clerk.load();
  } catch (error) {
    find("lead").textContent = error.message;
    return;
  }

  rememberSignedIn(Boolean(clerk.user));
  if (!clerk.user) {
    location.replace("/login/");
    return;
  }
  find("lead").hidden = true;
  find("email").textContent = clerk.user.primaryEmailAddress.emailAddress;
  find("card").hidden = false;
  find("signout").addEventListener("click", () => {
    rememberSignedIn(false);
    clerk.signOut({ redirectUrl: "/" });
  });
}
