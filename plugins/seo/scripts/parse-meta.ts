#!/usr/bin/env bun
/**
 * parse-meta.ts — Extract meta/OG/Twitter/canonical from HTML
 * Usage: bun parse-meta.ts <url-or-path>
 */
import * as cheerio from "cheerio";

interface MetaReport {
  title: string | null;
  titleLength: number;
  description: string | null;
  descriptionLength: number;
  canonical: string | null;
  robots: string | null;
  og: Record<string, string>;
  twitter: Record<string, string>;
  h1Count: number;
}

/** Fetch HTML from URL or local path. Throws on non-2xx HTTP or missing file. */
async function fetchHtml(input: string): Promise<string> {
  if (/^https?:\/\//.test(input)) {
    const res = await fetch(input);
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${input}`);
    return res.text();
  }
  return Bun.file(input).text();
}

/** Extract SEO-relevant meta tags, OG, Twitter Cards, canonical from HTML. */
function parseMeta(html: string): MetaReport {
  const $ = cheerio.load(html);
  const og: Record<string, string> = {};
  const twitter: Record<string, string> = {};

  $("meta[property^='og:']").each((_, el) => {
    const $el = $(el);
    const k = $el.attr("property")?.replace("og:", "") ?? "";
    const v = $el.attr("content");
    if (k && v) og[k] = v;
  });
  $("meta[name^='twitter:']").each((_, el) => {
    const $el = $(el);
    const k = $el.attr("name")?.replace("twitter:", "") ?? "";
    const v = $el.attr("content");
    if (k && v) twitter[k] = v;
  });

  const title = $("title").text() || null;
  const description = $("meta[name='description']").attr("content") ?? null;
  return {
    title,
    titleLength: title?.length ?? 0,
    description,
    descriptionLength: description?.length ?? 0,
    canonical: $("link[rel='canonical']").attr("href") ?? null,
    robots: $("meta[name='robots']").attr("content") ?? null,
    og,
    twitter,
    h1Count: $("h1").length,
  };
}

const input = process.argv[2];
if (!input) {
  console.error("Usage: bun parse-meta.ts <url-or-path>");
  process.exit(1);
}

try {
  const html = await fetchHtml(input);
  console.log(JSON.stringify(parseMeta(html), null, 2));
} catch (e) {
  console.error(`Error: ${(e as Error).message}`);
  process.exit(1);
}
