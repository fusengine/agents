/**
 * warmup.ts — Scroll pre-pass.
 * Some pages reveal their content via IntersectionObserver without honoring
 * `prefers-reduced-motion`. We then scroll the page top to bottom to trigger
 * the reveals, and return to the top before measuring.
 */
import type { PageLike } from "./page.types";

/** Scroll step, as a fraction of the viewport height. */
const STEP_RATIO = 0.8;
/** Pause between two steps, in ms. */
const STEP_MS = 60;

/**
 * Scrolls the page top to bottom, then returns to the origin.
 *
 * @param page - Already loaded page
 * @param viewportHeight - Height of the current viewport, in px
 * @returns Nothing; the page is left at position (0, 0)
 */
export async function warmupScroll(page: PageLike, viewportHeight: number): Promise<void> {
  const total = await page.evaluate(() => document.documentElement.scrollHeight, undefined);
  const step = Math.max(1, Math.round(viewportHeight * STEP_RATIO));
  for (let y = 0; y < total; y += step) {
    await page.evaluate((offset: number) => window.scrollTo(0, offset), y);
    await page.waitForTimeout(STEP_MS);
  }
  await page.evaluate(() => window.scrollTo(0, 0), undefined);
  await page.waitForTimeout(STEP_MS);
}
