/**
 * runner.ts — Orchestration: loads the page once, measures it at every width.
 * Adding a check family = adding an entry here + a module in `checks/`.
 */
import { launchBrowser, loadPlaywright, toTargetUrl } from "./browser";
import { DOM_PROBE_SOURCE } from "./probe-dom";
import { COLOR_PROBE_SOURCE } from "./probe-color";
import { LAYOUT_PROBE_SOURCE } from "./probe-layout";
import { TEXT_PROBE_SOURCE } from "./probe-text";
import { checkTextOverflow } from "./checks/text-overflow";
import { checkOverlap } from "./checks/overlap";
import { checkCtaWrap } from "./checks/cta-wrap";
import { checkContrast } from "./checks/contrast";
import { checkDocumentOverflow } from "./checks/document-overflow";
import { checkHiddenText } from "./checks/hidden-text";
import { warmupScroll } from "./warmup";
import { buildReport } from "./report";
import type { LayoutCheckConfig, LayoutCheckReport, Violation, Warning } from "./types";
import type { BrowserLike, PageLike } from "./page.types";

/** Layout settling delay after a resize, in ms. */
const SETTLE_MS = 150;

/** Measures every enabled family at a given width. */
async function measureWidth(
  page: PageLike,
  config: LayoutCheckConfig,
  width: number,
  sink: { violations: Violation[]; warnings: Warning[] },
): Promise<void> {
  await page.setViewportSize({ width, height: config.height });
  await page.waitForTimeout(SETTLE_MS);
  if (config.warmup) await warmupScroll(page, config.height);
  sink.warnings.push(...(await checkHiddenText(page, width)));
  const enabled = (name: string): boolean => config.checks.indexOf(name as never) >= 0;
  if (enabled("document-overflow")) sink.violations.push(...(await checkDocumentOverflow(page, config, width)));
  if (enabled("text-overflow")) sink.violations.push(...(await checkTextOverflow(page, config, width)));
  if (enabled("overlap")) sink.violations.push(...(await checkOverlap(page, config, width)));
  if (enabled("cta-wrap")) sink.violations.push(...(await checkCtaWrap(page, config, width)));
  if (enabled("contrast")) {
    const result = await checkContrast(page, config, width);
    sink.violations.push(...result.violations);
    sink.warnings.push(...result.warnings);
  }
}

/**
 * Runs the full check on a target (http(s) URL or local path).
 *
 * @param target - URL or file path; a path is converted to `file://`
 * @param config - Effective configuration (widths, thresholds, exclusions)
 * @returns The full JSON report
 * @throws if Playwright cannot be found or the page does not load
 */
export async function runLayoutCheck(
  target: string,
  config: LayoutCheckConfig,
): Promise<LayoutCheckReport> {
  const url = toTargetUrl(target);
  const { chromium } = await loadPlaywright();
  const browser = (await launchBrowser(chromium)) as BrowserLike;
  const sink = { violations: [] as Violation[], warnings: [] as Warning[] };
  try {
    // `reducedMotion: reduce` by default: a page that reveals its content on
    // scroll then renders it statically, otherwise everything would be measured at opacity 0.
    const page = await browser.newPage({
      reducedMotion: config.reducedMotion ? "reduce" : "no-preference",
    });
    // Injected BEFORE loading: available to every measurement, and not
    // subject to the page's CSP (unlike a <script> tag added afterwards).
    await page.addInitScript({ content: DOM_PROBE_SOURCE });
    await page.addInitScript({ content: COLOR_PROBE_SOURCE });
    await page.addInitScript({ content: LAYOUT_PROBE_SOURCE });
    await page.addInitScript({ content: TEXT_PROBE_SOURCE });
    await page.goto(url, { waitUntil: "load", timeout: 30_000 });
    await page.waitForTimeout(SETTLE_MS);
    for (const width of config.widths) await measureWidth(page, config, width, sink);
  } finally {
    await browser.close();
  }
  return buildReport(url, config, sink.violations, sink.warnings);
}
