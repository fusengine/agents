#!/usr/bin/env bun
/**
 * validate-seo.ts — PostToolUse hook
 * Validates meta + schema + OG on edited HTML-like files.
 * Opt-in via `.fuse-seo` marker at project root.
 * Reads PostToolUse JSON payload from stdin; exits 0 (allow), 2 (block with stderr).
 */
import * as cheerio from "cheerio";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";

interface PostToolUsePayload { tool_input?: { file_path?: string }; cwd?: string }

/** Locate `.fuse-seo` marker by walking up from a starting directory. */
function findMarker(start: string): string | null {
  let dir = resolve(start);
  while (dir !== "/") {
    if (existsSync(`${dir}/.fuse-seo`)) return dir;
    dir = dirname(dir);
  }
  return null;
}

/** Check meta/OG/schema completeness on HTML-like content. Returns missing items. */
function validate(html: string): string[] {
  const $ = cheerio.load(html);
  const missing: string[] = [];
  if (!$("title").text().trim()) missing.push("<title>");
  if (!$("meta[name='description']").attr("content")) missing.push("<meta name='description'>");
  if (!$("meta[property='og:title']").attr("content")) missing.push("og:title");
  if (!$("meta[property='og:description']").attr("content")) missing.push("og:description");
  if (!$("meta[property='og:image']").attr("content")) missing.push("og:image");
  if (!$("link[rel='canonical']").attr("href")) missing.push("canonical");
  if ($("script[type='application/ld+json']").length === 0) missing.push("JSON-LD schema");
  return missing;
}

async function main(): Promise<void> {
  const raw = await Bun.stdin.text();
  let payload: PostToolUsePayload;
  try { payload = JSON.parse(raw); } catch { process.exit(0); }
  const path = payload.tool_input?.file_path;
  if (!path) process.exit(0);
  if (!/\.(html|astro|tsx|vue|blade\.php)$/.test(path)) process.exit(0);
  if (!findMarker(payload.cwd ?? dirname(path))) process.exit(0);

  try {
    const content = await Bun.file(path).text();
    const missing = validate(content);
    if (missing.length > 0) {
      console.error(`fuse-seo: missing SEO elements in ${path}:\n  - ${missing.join("\n  - ")}`);
      process.exit(2);
    }
  } catch {
    process.exit(0);
  }
}

await main();
