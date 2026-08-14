/* Heading tree per page URL, parsed from the template sources at build time.
   Reading the sources (instead of the rendered collection content) keeps the
   docs sidebar free of the circular dependency it would otherwise create with
   the pages it links into. */

import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const INPUT_DIR = "src";
const SKIPPED_DIRS = new Set(["_data", "_includes", "assets", "styles", "scripts"]);
const HEADING = /<h([2-4])\b[^>]*\sid="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g;

function toUrl(filePath) {
  const relative = path.relative(INPUT_DIR, filePath).split(path.sep);
  const name = path.basename(relative.pop(), ".njk");
  const segments = name === "index" ? relative : [...relative, name];
  return segments.length ? `/${segments.join("/")}/` : "/";
}

function toText(html) {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function toTree(headings) {
  const root = [];
  const open = [];

  for (const { level, id, text } of headings) {
    const node = { id, text, children: [] };
    while (open.length && open.at(-1).level >= level) open.pop();
    (open.length ? open.at(-1).node.children : root).push(node);
    open.push({ level, node });
  }

  return root;
}

function collect(dir, pages) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!SKIPPED_DIRS.has(entry.name)) collect(entryPath, pages);
      continue;
    }

    if (!entry.name.endsWith(".njk")) continue;

    const matches = [...readFileSync(entryPath, "utf8").matchAll(HEADING)];
    if (!matches.length) continue;

    pages[toUrl(entryPath)] = toTree(
      matches.map(([, level, id, inner]) => ({ level: Number(level), id, text: toText(inner) }))
    );
  }

  return pages;
}

export default function () {
  return collect(INPUT_DIR, {});
}
