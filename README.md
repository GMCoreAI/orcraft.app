# Orcraft

Orcraft is a code-first test orchestration platform for validation and engineering teams.

It provides centralized control for configuring, running, and monitoring tests across multiple execution targets, with live and historical logging and aggregated results.

## Project status

This repository hosts a **temporary public landing page** for [orcraft.app](https://orcraft.app), served via GitHub Pages.

It is a placeholder and will be replaced once the complete website is ready. The Orcraft source code is proprietary and maintained in private repositories.

The full site is being built on the `dev` branch. `main` remains the live placeholder.

## Structure

Plain static site — no build step, no dependencies. GitHub Pages serves the repository root as-is.

```
index.html            Landing page (site entry point)
coming-soon.html      Previous placeholder page, kept for reference
404.html              Not-found page
<section>/index.html  One folder per page → clean URLs (/platform/, /docs/, ...)
legal/<page>/         Privacy policy, terms of use

styles/
  main.css            Single CSS entry point (@imports everything below)
  base/               Design tokens, reset, typography
  layout/             Container, section, header, footer
  components/         Reusable blocks: nav, button, card, hero, steps, logo
  utilities/          Small helper classes
  pages/              Page-specific styles, linked per page

scripts/
  main.js             Single JS entry point (ES module)
  core/               Shared helpers and site config
  components/         Behaviour for reusable blocks
  pages/              Page modules, dispatched by <body data-page="...">

assets/
  icons/              Favicons and app icons
  images/             Logo and wordmark
```

Pages link `/styles/main.css`, optionally one file from `styles/pages/`, and `/scripts/main.js`.

## Local preview

Serve the folder over HTTP (ES modules and absolute paths do not work from `file://`):

```powershell
python -m http.server 8000
```

Then open http://localhost:8000.

## License

© 2026 GM Core Ltd. All rights reserved.  
No license is granted to use, modify, or distribute the software.  
Orcraft™ is a trademark of GM Core Ltd. The Orcraft name, logo, and branding assets are proprietary and may not be used without prior written permission.

## Website

https://orcraft.app
