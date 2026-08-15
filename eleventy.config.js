import { readFileSync } from "node:fs";
import { AnsiUp } from "ansi_up";

const ICON_DIR = "src/assets/icons/ui";
const DOCS_ARTICLE = /(<article class="docs__article">)([\s\S]*?)(<\/article>)/;
const DOCS_HEADING = /<h([2-4])\b[^>]*>[\s\S]*?<\/h\1>/g;

/* Nests each heading and the content that follows it in a <section>, so the
   docs stylesheet can indent whole sections by their heading level. */
function wrapDocsSections(inner) {
  const headings = [...inner.matchAll(DOCS_HEADING)];
  if (!headings.length) return inner;

  const open = [];
  let out = inner.slice(0, headings[0].index);

  headings.forEach((heading, index) => {
    const level = Number(heading[1]);

    while (open.length && open.at(-1) >= level) {
      out += "</section>";
      open.pop();
    }
    open.push(level);

    const end = headings[index + 1]?.index ?? inner.length;
    out += `<section class="docs-section docs-section--h${level}">`;
    out += inner.slice(heading.index, end);
  });

  return out + "</section>".repeat(open.length);
}

export default function (eleventyConfig) {
  // Inlined so icons inherit currentColor and size from their container.
  eleventyConfig.addShortcode("icon", (name) =>
    readFileSync(`${ICON_DIR}/${name}.svg`, "utf8")
      .replace(/\s+class="[^"]*"/, "")
      .replace("<svg", '<svg class="icon" aria-hidden="true" focusable="false"')
  );

  // Renders a captured .ansi controller log (src/_includes/data/*.ansi) as HTML,
  // so CLI output docs reproduce the real colors and spacing instead of hand-placed spans.
  eleventyConfig.addShortcode("ansiOutput", (filename) => {
    const raw = readFileSync(`src/_includes/data/${filename}`, "utf8").replace(/^\n+|\n+$/g, "");
    const html = new AnsiUp().ansi_to_html(raw);
    return `<div class="code-block-wrap"><pre class="code-block"><code>${html}</code></pre></div>`;
  });

  eleventyConfig.addTransform("docsSections", function (content) {
    if (!this.page.outputPath?.endsWith(".html")) return content;

    return content.replace(
      DOCS_ARTICLE,
      (_match, open, inner, close) => open + wrapDocsSections(inner) + close
    );
  });

  // Everything below is served as-is; only .njk files are rendered.
  for (const path of [
    "src/assets",
    "src/styles",
    "src/scripts",
    "src/favicon.ico",
    "src/site.webmanifest",
    "src/robots.txt",
    "src/CNAME",
    "src/.nojekyll",
  ]) {
    eleventyConfig.addPassthroughCopy(path);
  }

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
