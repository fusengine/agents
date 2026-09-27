/**
 * browser.ts — Playwright resolution and browser launch.
 * No dependency is added to the repo: we reuse the `playwright-core`
 * already present (local install, global install, or the one bundled by @playwright/mcp)
 * and the system Google Chrome via `channel: "chrome"`.
 */
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

/** Candidate paths for an already installed `playwright-core` module. */
function candidates(): string[] {
  const list: string[] = [];
  const override = process.env.LAYOUT_CHECK_PLAYWRIGHT;
  if (override) list.push(override);
  list.push("playwright", "playwright-core");
  try {
    const root = execFileSync("npm", ["root", "-g"], { encoding: "utf8" }).trim();
    list.push(join(root, "playwright", "index.js"));
    list.push(join(root, "playwright-core", "index.js"));
    list.push(join(root, "@playwright", "mcp", "node_modules", "playwright-core", "index.js"));
  } catch {
    /* npm missing: fall back to module-name resolution only */
  }
  return list;
}

/**
 * Imports the first resolvable Playwright.
 * @throws if no `playwright`/`playwright-core` is installed on the machine.
 */
export async function loadPlaywright(): Promise<{ chromium: any; source: string }> {
  const tried: string[] = [];
  for (const path of candidates()) {
    if (path.includes("/") && !existsSync(path)) { tried.push(path); continue; }
    try {
      const mod: any = await import(path);
      const chromium = mod.chromium ?? mod.default?.chromium;
      if (chromium) return { chromium, source: path };
    } catch {
      tried.push(path);
    }
  }
  throw new Error(
    `Playwright not found. Tried: ${tried.join(", ")}. ` +
      `Install it (npm i -g playwright) or point LAYOUT_CHECK_PLAYWRIGHT at an index.js.`,
  );
}

/**
 * Launches headless Chromium: system Chrome first (no download),
 * then Playwright's bundled Chromium as a fallback.
 */
export async function launchBrowser(chromium: any): Promise<any> {
  try {
    return await chromium.launch({ headless: true, channel: "chrome" });
  } catch {
    return await chromium.launch({ headless: true });
  }
}

/** Normalizes a target: http(s) URL left as is, local path → file://. */
export function toTargetUrl(input: string): string {
  if (/^(https?|file):\/\//.test(input)) return input;
  const abs = input.startsWith("/") ? input : join(process.cwd(), input);
  if (!existsSync(abs)) throw new Error(`File not found: ${abs}`);
  return `file://${abs}`;
}
