/**
 * hidden-text.ts — Guard against a "dead check".
 * Every check ignores invisible elements. If a page reveals its
 * content on scroll (opacity 0 until it enters the viewport) and does not honor
 * `prefers-reduced-motion`, the page would be measured almost empty and wrongly
 * declared passing. We therefore count what stays hidden, and REPORT it.
 */
import type { Warning } from "../types";
import type { PageLike } from "../page.types";

/**
 * Counts the text-bearing elements made invisible by opacity.
 *
 * @param page - Already loaded page
 * @param viewport - Current viewport width, in px
 * @returns Zero or one warning summarizing the unmeasurable text
 */
export async function checkHiddenText(page: PageLike, viewport: number): Promise<Warning[]> {
  const result = await page.evaluate((): { hidden: number; total: number; sample: string } => {
    let hidden = 0;
    let total = 0;
    let sample = "";
    const all = Array.prototype.slice.call(document.querySelectorAll("*")) as Element[];
    for (const el of all) {
      const text = window.__lc.ownText(el) as string;
      if (!text) continue;
      total++;
      let node: Element | null = el;
      let invisible = false;
      while (node && !invisible) {
        const s = getComputedStyle(node);
        // `display: none` is a deliberate hide (closed menu, inactive tab):
        // only hiding by opacity/visibility signals a pending reveal.
        if (s.display === "none") break;
        if (Number(s.opacity) <= 0.05 || s.visibility === "hidden") invisible = true;
        node = node.parentElement;
      }
      if (invisible) {
        hidden++;
        if (!sample) sample = `${window.__lc.cssPath(el)} "${text.slice(0, 40)}"`;
      }
    }
    return { hidden, total, sample };
  }, undefined);

  if (result.hidden === 0) return [];
  return [
    {
      type: "probe" as const,
      selector: result.sample,
      viewport,
      reason:
        `${result.hidden}/${result.total} text-bearing elements are invisible ` +
        `(opacity/visibility) and therefore NOT measured — likely a scroll reveal. ` +
        `Check that --motion has not disabled the reduced-motion emulation, then ` +
        `rerun with --warmup; whatever stays hidden must be judged on a screenshot.`,
    },
  ];
}
