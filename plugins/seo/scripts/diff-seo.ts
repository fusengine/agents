#!/usr/bin/env bun
/**
 * diff-seo.ts — SEO drift via git diff
 * Compares meta/schema/canonical between two git refs
 * Usage: bun diff-seo.ts [old-ref] [new-ref]
 */
import { spawnSync } from "node:child_process";
import * as cheerio from "cheerio";

interface Diff {
  path: string;
  changes: {
    title?: { from: string; to: string };
    description?: { from: string; to: string };
    canonical?: { from: string; to: string };
    schemaCountDelta?: number;
  };
}

/** Read file content at a given git ref. Returns empty string if file doesn't exist at ref. */
function fileAt(ref: string, path: string): string {
  const r = spawnSync("git", ["show", `${ref}:${path}`], { encoding: "utf-8" });
  return r.status === 0 ? r.stdout : "";
}

/** List files matching SEO-relevant extensions changed between two refs. */
function changedFiles(oldRef: string, newRef: string): string[] {
  const r = spawnSync("git", ["diff", "--name-only", oldRef, newRef, "--", "*.html", "*.astro", "*.tsx", "*.vue", "*.blade.php"], { encoding: "utf-8" });
  return r.stdout.split("\n").filter(Boolean);
}

/** Extract SEO metadata fingerprint from HTML for diffing. */
function extract(html: string) {
  const $ = cheerio.load(html);
  return {
    title: $("title").text(),
    description: $("meta[name='description']").attr("content") ?? "",
    canonical: $("link[rel='canonical']").attr("href") ?? "",
    schemaCount: $("script[type='application/ld+json']").length,
  };
}

const oldRef = process.argv[2] ?? "HEAD~1";
const newRef = process.argv[3] ?? "HEAD";

try {
  const files = changedFiles(oldRef, newRef);
  const diffs: Diff[] = [];
  for (const path of files) {
    const o = extract(fileAt(oldRef, path));
    const n = extract(fileAt(newRef, path));
    const d: Diff = { path, changes: {} };
    if (o.title !== n.title) d.changes.title = { from: o.title, to: n.title };
    if (o.description !== n.description) d.changes.description = { from: o.description, to: n.description };
    if (o.canonical !== n.canonical) d.changes.canonical = { from: o.canonical, to: n.canonical };
    if (o.schemaCount !== n.schemaCount) d.changes.schemaCountDelta = n.schemaCount - o.schemaCount;
    if (Object.keys(d.changes).length > 0) diffs.push(d);
  }
  console.log(JSON.stringify({ oldRef, newRef, filesChanged: files.length, seoChanges: diffs.length, diffs }, null, 2));
} catch (e) {
  console.error(`Error: ${(e as Error).message}`);
  process.exit(1);
}
