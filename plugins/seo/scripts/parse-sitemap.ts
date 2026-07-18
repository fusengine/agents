#!/usr/bin/env bun
/**
 * parse-sitemap.ts — Validate sitemap.xml structure
 * Usage: bun parse-sitemap.ts <url-or-path>
 */
import { XMLParser } from "fast-xml-parser";

interface SitemapEntry { loc: string; lastmod?: string }
interface Report { type: "sitemap"|"sitemapindex"|"unknown"; urlCount: number; issues: string[]; entries: SitemapEntry[] }

/** Fetch XML from URL or local path. Throws on non-2xx HTTP or missing file. */
async function fetchXml(i: string): Promise<string> {
  if (/^https?:\/\//.test(i)) {
    const r = await fetch(i);
    if (!r.ok) throw new Error(`HTTP ${r.status} for ${i}`);
    return r.text();
  }
  return Bun.file(i).text();
}

/** Parse and validate sitemap XML. Returns structured report. */
function parseSitemap(xml: string): Report {
  const parser = new XMLParser({
    ignoreAttributes: false,
    isArray: (_n, jpath) => typeof jpath === "string" && ["urlset.url", "sitemapindex.sitemap"].includes(jpath),
  });
  const parsed = parser.parse(xml);
  const issues: string[] = [];
  const report: Report = { type: "unknown", urlCount: 0, issues, entries: [] };
  if (parsed.urlset) {
    report.type = "sitemap";
    const urls = (parsed.urlset.url ?? []) as SitemapEntry[];
    report.entries = urls;
    report.urlCount = urls.length;
    if (urls.length > 50000) issues.push("Exceeds 50,000 URL limit");
    for (const e of urls) {
      if (!e.loc) issues.push("Entry missing <loc>");
      else if (!e.loc.startsWith("http")) issues.push(`Non-absolute URL: ${e.loc}`);
    }
  } else if (parsed.sitemapindex) {
    report.type = "sitemapindex";
    const maps = (parsed.sitemapindex.sitemap ?? []) as SitemapEntry[];
    report.urlCount = maps.length;
  } else {
    issues.push("Root is not <urlset> or <sitemapindex>");
  }
  return report;
}

const input = process.argv[2];
if (!input) { console.error("Usage: bun parse-sitemap.ts <url-or-path>"); process.exit(1); }

try {
  console.log(JSON.stringify(parseSitemap(await fetchXml(input)), null, 2));
} catch (e) {
  console.error(`Error: ${(e as Error).message}`);
  process.exit(1);
}
