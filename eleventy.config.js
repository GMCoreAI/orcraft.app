export default function (eleventyConfig) {
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
