#!/usr/bin/env bun
/**
 * validate-schema.ts — Extract and validate JSON-LD blocks against schema.org
 * Usage: bun validate-schema.ts <url-or-path>
 */
import * as cheerio from "cheerio";

const KNOWN = new Set(["Article","NewsArticle","BlogPosting","Product","Offer","AggregateRating","Review","LocalBusiness","Organization","Person","BreadcrumbList","ListItem","FAQPage","VideoObject","Event","Recipe","HowTo","WebSite","WebPage"]);
const DEPRECATED = new Set(["HowTo","SpecialAnnouncement"]);
const RESTRICTED = new Set(["FAQPage"]);

interface Issue { index: number; type: string; level: "error"|"warning"|"info"; message: string }

/** Fetch HTML from URL or local path. Throws on non-2xx HTTP or missing file. */
async function fetchHtml(i: string): Promise<string> {
  if (/^https?:\/\//.test(i)) {
    const r = await fetch(i);
    if (!r.ok) throw new Error(`HTTP ${r.status} for ${i}`);
    return r.text();
  }
  return Bun.file(i).text();
}

/** Extract all JSON-LD blocks from HTML. Returns parse errors as objects. */
function extract(html: string): unknown[] {
  const $ = cheerio.load(html);
  const blocks: unknown[] = [];
  $("script[type='application/ld+json']").each((_, el) => {
    try { blocks.push(JSON.parse($(el).text().trim())); }
    catch (e) { blocks.push({ __parseError: (e as Error).message }); }
  });
  return blocks;
}

/** Validate a single JSON-LD block. Returns list of issues with severity. */
function validate(block: unknown, i: number): Issue[] {
  const out: Issue[] = [];
  if (typeof block !== "object" || block === null) {
    out.push({ index: i, type: "?", level: "error", message: "Not an object" });
    return out;
  }
  const obj = block as Record<string, unknown>;
  if (obj.__parseError) {
    out.push({ index: i, type: "?", level: "error", message: `JSON parse: ${obj.__parseError}` });
    return out;
  }
  const t = (obj["@type"] ?? "?") as string;
  if (!obj["@context"]) out.push({ index: i, type: t, level: "error", message: "Missing @context" });
  if (!obj["@type"]) out.push({ index: i, type: "?", level: "error", message: "Missing @type" });
  else if (!KNOWN.has(t)) out.push({ index: i, type: t, level: "warning", message: `Uncommon type "${t}"` });
  if (DEPRECATED.has(t)) out.push({ index: i, type: t, level: "warning", message: `"${t}" deprecated` });
  if (RESTRICTED.has(t)) out.push({ index: i, type: t, level: "info", message: `"${t}" restricted to gov/health` });
  return out;
}

const input = process.argv[2];
if (!input) { console.error("Usage: bun validate-schema.ts <url-or-path>"); process.exit(1); }

try {
  const blocks = extract(await fetchHtml(input));
  const issues = blocks.flatMap((b, i) => validate(b, i));
  console.log(JSON.stringify({
    blocksFound: blocks.length,
    types: blocks.map(b => (b as Record<string, unknown>)?.["@type"] ?? "?"),
    issues,
    valid: issues.filter(x => x.level === "error").length === 0,
  }, null, 2));
} catch (e) {
  console.error(`Error: ${(e as Error).message}`);
  process.exit(1);
}
