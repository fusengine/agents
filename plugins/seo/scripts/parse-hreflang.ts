#!/usr/bin/env bun
/**
 * parse-hreflang.ts — Validate hreflang tags
 * Usage: bun parse-hreflang.ts <url-or-path>
 */
import * as cheerio from "cheerio";

const LANGS = new Set(["en","fr","de","es","it","pt","nl","ja","zh","ko","ar","ru","x-default"]);

interface Entry { hreflang: string; href: string }
interface Report {
  entries: Entry[];
  hasXDefault: boolean;
  hasSelfReference: boolean;
  issues: string[];
}

/** Fetch HTML from URL or local path. Throws on non-2xx HTTP or missing file. */
async function fetchHtml(i: string): Promise<string> {
  if (/^https?:\/\//.test(i)) {
    const r = await fetch(i);
    if (!r.ok) throw new Error(`HTTP ${r.status} for ${i}`);
    return r.text();
  }
  return Bun.file(i).text();
}

/** Extract and validate hreflang link tags from HTML. */
function parseHreflang(html: string, input: string): Report {
  const $ = cheerio.load(html);
  const entries: Entry[] = [];
  const issues: string[] = [];
  $("link[rel='alternate'][hreflang]").each((_, el) => {
    const hreflang = $(el).attr("hreflang") ?? "";
    const href = $(el).attr("href") ?? "";
    entries.push({ hreflang, href });
    const base = hreflang.split("-")[0];
    if (base && hreflang !== "x-default" && !LANGS.has(base)) issues.push(`Unknown lang: ${hreflang}`);
    if (!href.startsWith("http")) issues.push(`Non-absolute href: ${href}`);
  });
  const hasXDefault = entries.some(e => e.hreflang === "x-default");
  const hasSelfReference = entries.some(e => e.href === input);
  if (entries.length > 0 && !hasXDefault) issues.push("Missing x-default");
  if (entries.length > 0 && !hasSelfReference) issues.push("Missing self-reference");
  const protocols = new Set(entries.map(e => e.href.startsWith("https") ? "https" : "http"));
  if (protocols.size > 1) issues.push("Mixed HTTP/HTTPS in alternates");
  return { entries, hasXDefault, hasSelfReference, issues };
}

const input = process.argv[2];
if (!input) { console.error("Usage: bun parse-hreflang.ts <url-or-path>"); process.exit(1); }

try {
  console.log(JSON.stringify(parseHreflang(await fetchHtml(input), input), null, 2));
} catch (e) {
  console.error(`Error: ${(e as Error).message}`);
  process.exit(1);
}
