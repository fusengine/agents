/**
 * overlap.probe.ts — Function executed IN the page for the `overlap` check.
 * Serialized by Playwright: it references only its argument and `window.__lc`.
 */
import type { OverlapRow } from "../page.types";

/** Serializable argument passed to the probe. */
export interface OverlapProbeArgs {
  exclude: string[];
  tags: string;
  minPx: number;
  minRatio: number;
  max: number;
  skipIntentional: boolean;
}

/**
 * Computes every pair of visible elements whose rectangles intersect.
 *
 * @param args - Thresholds and exclusions, serialized from Node
 * @returns The pairs kept, with their raw measurements
 */
export function overlapProbe(args: OverlapProbeArgs): OverlapRow[] {
  const allowed = args.tags.split(",");
  // Kept: every element carrying ITS OWN text (whatever its tag — a
  // label often lives in a div or a span), plus the elements without text but
  // carrying meaning (form controls, images).
  const items = (window.__lc.candidates(args.exclude) as Element[])
    .filter((el) => window.__lc.ownText(el) || allowed.indexOf(el.tagName) >= 0)
    .filter((el) => !(args.skipIntentional && window.__lc.isIntentionalOverlay(el)))
    .slice(0, args.max)
    .map((el) => ({
      el,
      rect: el.getBoundingClientRect(),
      text: window.__lc.ownText(el) as string,
      inline: getComputedStyle(el).display === "inline",
      owner: window.__lc.blockOwner(el) as Element,
      lineHeight: window.__lc.lineHeightOf(el) as number,
    }));

  const out: OverlapRow[] = [];
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const a = items[i] as (typeof items)[number];
      const b = items[j] as (typeof items)[number];
      // An ancestor/descendant relation is never an overlap.
      if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
      // Two inlines of the same block share the same line grid: an element
      // that really overlaps would be positioned, hence no longer `display: inline`.
      if (a.inline && b.inline && a.owner === b.owner) continue;
      const w = Math.min(a.rect.right, b.rect.right) - Math.max(a.rect.left, b.rect.left);
      const h = Math.min(a.rect.bottom, b.rect.bottom) - Math.max(a.rect.top, b.rect.top);
      if (w <= args.minPx || h <= args.minPx) continue;
      // Line-box bleed: two STACKED boxes that bite into each other
      // by less than half a line (descenders of a tight line-height heading). No
      // ink pixel collides — observed on real headings.
      const stacked =
        Math.abs((a.rect.top + a.rect.bottom) / 2 - (b.rect.top + b.rect.bottom) / 2) >
        Math.min(a.rect.height, b.rect.height) * 0.5;
      if (stacked && h < Math.min(a.lineHeight, b.lineHeight) * 0.5) continue;
      const area = w * h;
      const smaller = Math.min(a.rect.width * a.rect.height, b.rect.width * b.rect.height);
      const ratio = smaller > 0 ? area / smaller : 0;
      if (ratio < args.minRatio) continue;
      out.push({
        selectorA: window.__lc.cssPath(a.el),
        selectorB: window.__lc.cssPath(b.el),
        intersectWidth: Math.round(w),
        intersectHeight: Math.round(h),
        intersectArea: Math.round(area),
        smallerArea: Math.round(smaller),
        ratio: Number(ratio.toFixed(3)),
        textA: a.text.slice(0, 40),
        textB: b.text.slice(0, 40),
      });
    }
  }
  return out;
}
