import { readFileSync } from "node:fs";

const ICON_DIR = "src/assets/icons/ui";

export default function (eleventyConfig) {
  // Inlined so icons inherit currentColor and size from their container.
  eleventyConfig.addShortcode("icon", (name) =>
    readFileSync(`${ICON_DIR}/${name}.svg`, "utf8")
      .replace(/\s+class="[^"]*"/, "")
      .replace("<svg", '<svg class="icon" aria-hidden="true" focusable="false"')
  );

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
