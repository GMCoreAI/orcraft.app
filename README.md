# Orcraft

Orcraft is a code-first test orchestration platform for validation and engineering teams.

It provides centralized control for configuring, running, and monitoring tests across multiple execution targets, with live and historical logging and aggregated results.

## Project status

This repository hosts a **temporary public landing page** for [orcraft.app](https://orcraft.app), served via GitHub Pages.

It is a placeholder and will be replaced once the complete website is ready. The Orcraft source code is proprietary and maintained in private repositories.

The full site is being built on the `dev` branch. `main` remains the live placeholder.

## Structure

Static site built with [Eleventy](https://www.11ty.dev/). Source lives in `src/`,
the build writes plain static files to `_site/` (git-ignored).

```
eleventy.config.js    Build config: input src/, output _site/, passthrough copies, search index
package.json          npm run dev | watch | build

src/
  index.njk           Landing page
  <page>.njk          One file per page → clean URLs (/platform/, /docs/, ...)
  legal/<page>.njk    Privacy policy, terms of use
  404.njk             Not-found page
  coming-soon.njk     Previous placeholder page, kept for reference
  sitemap.njk         Generated from the page list

  _data/site.json     Name, URL, description, slogan, company details
  _data/nav.json      Primary and footer menus
  _includes/layouts/  base.njk (site frame), standalone.njk (no frame)
  _includes/partials/ masthead.njk, footer.njk

  styles/
    main.css          Single CSS entry point (@imports everything below)
    base/             Design tokens, reset, typography
    layout/           Container, section, masthead, footer
    components/       Reusable blocks: nav, button, card, steps, logo
    utilities/        Small helper classes
    pages/            Page-specific styles

  scripts/
    main.js           Single JS entry point (ES module)
    core/             Shared helpers
    components/       Router, scroll reveal, current year, search
    pages/            Page modules, dispatched by <body data-page="...">

  assets/
    icons/            Favicons and app icons
    icons/ui/         Tabler icon set (MIT), inlined by the `icon` shortcode
    images/           Logo and wordmark
```

Text that appears on every page — description, slogan, menus, footer — is edited
once in `src/_data/`, not in each page.

UI icons are used as `{% raw %}{% icon "shield-lock" %}{% endraw %}`, which inlines the SVG so it
inherits `currentColor` and the surrounding font size. To add one, drop the file
into `src/assets/icons/ui/` — the whole set lives at
[tabler.io/icons](https://tabler.io/icons).

## Search

The docs are searchable through [Pagefind](https://pagefind.app/). After every
build (`npm run build` as well as `dev`/`watch`) the `eleventy.after` hook in
`eleventy.config.js` indexes `_site/` and writes the index to `_site/pagefind/`,
which is deployed with the rest of the site. Only content wrapped in
`data-pagefind-body` is indexed: the docs articles (via the docs layout) and the
home page, whose capabilities and "how it works" sections are not written up
anywhere else. Demo, login, contact and legal pages stay out of the results.

The search box lives in the topbar (`partials/search-trigger.njk`) and opens a
modal (`partials/search-dialog.njk`, `scripts/components/search.js`); `Ctrl K`
(`⌘ K` on macOS) or `/` opens it from anywhere. The Pagefind runtime is fetched
on first use, not on page load.

## The persistent frame

`layouts/base.njk` wraps every page in the same masthead (spinning logo,
wordmark, description, slogan and menu) and puts page content inside
`<main data-page-content>`.

[src/scripts/components/router.js](src/scripts/components/router.js) intercepts
clicks on same-origin links, fetches the target page and replaces only that
region, so the masthead stays mounted and the logo animation never restarts.
Every page is still a complete document: with JavaScript off, or on a direct hit
or a refresh, the browser loads it normally and the result is identical.

## Local preview

```powershell
npm install
npm run dev      # Eleventy dev server with live reload
```

To preview through nginx exactly as GitHub Pages serves it, run `npm run watch`
and start the `orcraft-site` stack in the `virtual-lab` repo (http://localhost:8090).

## Deployment

Pushes to `main` trigger [.github/workflows/deploy.yml](.github/workflows/deploy.yml),
which builds the site and publishes `_site` to GitHub Pages. This requires the
repository's **Settings → Pages → Source** to be set to **GitHub Actions**.

## License

© 2026 GM Core Ltd. All rights reserved.  
No license is granted to use, modify, or distribute the software.  
Orcraft™ is a trademark of GM Core Ltd. The Orcraft name, logo, and branding assets are proprietary and may not be used without prior written permission.

UI icons in `src/assets/icons/ui/` are from [Tabler Icons](https://tabler.io/icons),
MIT licensed — see the LICENSE file in that folder.

## Website

https://orcraft.app
