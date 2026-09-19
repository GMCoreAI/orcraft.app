/* Login page: sign in through Clerk and, when the address carries a code,
   approve the controller that is waiting with that code. */

import { rememberSignedIn } from "../components/account-link.js";

let clerkLoading;

export function loadClerk(section) {
  clerkLoading ??= new Promise((resolve, reject) => {
    if (window.Clerk) {
      resolve(window.Clerk);
      return;
    }
    const script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.dataset.clerkPublishableKey = section.dataset.clerkPublishableKey;
    script.src = `${section.dataset.clerkFrontendApi}/npm/@clerk/clerk-js@5/dist/clerk.browser.js`;
    script.onload = () => resolve(window.Clerk);
    script.onerror = () => reject(new Error("the sign-in service could not be loaded"));
    document.head.append(script);
  });
  return clerkLoading;
}

/* Dress the Clerk widget in the site's own colours, read from the CSS tokens. */
function clerkAppearance() {
  const token = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return {
    variables: {
      colorBackground: token("--color-surface"),
      colorInputBackground: token("--color-bg"),
      colorInputText: token("--color-text"),
      colorText: token("--color-text"),
      colorTextSecondary: token("--color-text-muted"),
      colorNeutral: token("--color-text"),
      colorPrimary: token("--color-accent"),
      colorDanger: token("--color-danger"),
      borderRadius: token("--radius-sm"),
      fontFamily: token("--font-sans"),
    },
    elements: {
      cardBox: { boxShadow: "none", border: `1px solid ${token("--color-border")}` },
      card: { boxShadow: "none" },
      footer: { background: token("--color-surface-alt") },
      // The sign-in / sign-up switch is rendered by the page instead.
      footerAction: { display: "none" },
      // Provider logos are drawn for light backgrounds; GitHub's is black.
      socialButtonsProviderIcon__github: { filter: "invert(1)" },
    },
  };
}

export async function init() {
  const section = document.querySelector(".login");
  if (!section) return;

  const find = (name) => section.querySelector(`[data-login-${name}]`);
  const codeInput = find("code");
  const requestBox = find("request");
  const status = find("status");
  const say = (text) => { status.textContent = text; };

  const code = (new URLSearchParams(location.search).get("code") || "").toUpperCase();
  const approvingController = code !== "";
  if (approvingController) {
    find("controller").hidden = false;
    codeInput.value = code;
  }

  let clerk;
  try {
    clerk = await loadClerk(section);
    await clerk.load();
  } catch (error) {
    say(error.message);
    return;
  }

  rememberSignedIn(Boolean(clerk.user));
  if (!clerk.user) {
    // Sign-in and sign-up are both embedded here; ?mode=signup shows the second.
    // Hash routing keeps every step, including the return from GitHub, on this page.
    const here = new URL(location.href);
    const signUp = here.searchParams.get("mode") === "signup";
    const other = new URL(here);
    if (signUp) other.searchParams.delete("mode"); else other.searchParams.set("mode", "signup");
    other.hash = "";
    const done = new URL(here);
    done.searchParams.delete("mode");
    done.hash = "";
    // Absolute return addresses with their trailing slash: Clerk strips the slash
    // from paths, and the redirect that adds it back is not reliable everywhere.
    const options = {
      routing: "hash",
      forceRedirectUrl: done.href,
      signInForceRedirectUrl: done.href,
      signUpForceRedirectUrl: done.href,
      appearance: clerkAppearance(),
    };
    if (signUp) clerk.mountSignUp(find("signin"), options);
    else clerk.mountSignIn(find("signin"), options);
    // The switch between the two forms is our own link, so it keeps the exact address.
    const link = document.createElement("a");
    link.className = "text-accent";
    link.href = other.pathname + other.search;
    link.target = "_self";
    link.textContent = signUp ? "Sign in" : "Sign up";
    const switchBox = find("switch");
    switchBox.textContent = signUp ? "Already have an account? " : "Don't have an account? ";
    switchBox.append(link);
    return;
  }

  if (!approvingController) {
    location.replace("/account/");
    return;
  }

  async function call(action) {
    const token = await clerk.session.getToken();
    const response = await fetch(`${section.dataset.backendUrl}/device-approve`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify({ user_code: codeInput.value.trim(), action }),
    });
    const body = await response.json();
    if (!response.ok) throw new Error(body.message || "the request failed");
    return body;
  }

  async function showRequest() {
    requestBox.hidden = true;
    if (codeInput.value.trim().length < 9) {
      say("Enter the code shown by the controller.");
      return;
    }
    say("Looking up the code…");
    try {
      const request = await call("inspect");
      find("hostname").textContent = request.hostname;
      find("os").textContent = request.os;
      find("when").textContent = new Date(request.requested_at).toLocaleString();
      find("account").textContent = clerk.user.primaryEmailAddress.emailAddress;
      requestBox.hidden = false;
      say("");
    } catch (error) {
      say(error.message);
    }
  }

  find("approve").addEventListener("click", async () => {
    say("Approving…");
    try {
      await call("approve");
      requestBox.hidden = true;
      codeInput.disabled = true;
      say("Approved. You can go back to the controller; it signs in on its own within a few seconds.");
    } catch (error) {
      say(error.message);
    }
  });
  find("signout").addEventListener("click", () => {
    rememberSignedIn(false);
    clerk.signOut({ redirectUrl: location.href });
  });
  codeInput.addEventListener("change", showRequest);
  await showRequest();
}
