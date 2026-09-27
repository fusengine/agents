/**
 * cta-wrap.ts — Check 3: CTA label wrapped onto a second line.
 * Mechanizes `design-web/references/layout-discipline.md` §6 ("Label fits on one line
 * at desktop… is a pre-flight fail").
 *
 * Predicate: content height > `ctaLineFactor × computed line-height` (default 1.6)
 * AND at least 2 line boxes taken by the TEXT (`Range.getClientRects()` on
 * text nodes only). Both conditions are necessary:
 *  - height alone flags every fixed-height button (`height: 42px` + centered flex)
 *    whose label fits on one line — 25 false positives out of 31 on a real page;
 *  - counting lines over ALL the content flags an "icon above the word" button.
 */
import type { LayoutCheckConfig, Violation } from "../types";
import type { CtaRow, PageLike } from "../page.types";

/**
 * Measures the CTA labels that take more than one line.
 *
 * @param page - Page already loaded and resized
 * @param config - Active configuration (CTA selector, line factor)
 * @param viewport - Current viewport width, in px
 * @returns One violation per CTA whose label exceeds one line
 */
export async function checkCtaWrap(
  page: PageLike,
  config: LayoutCheckConfig,
  viewport: number,
): Promise<Violation[]> {
  const rows = await page.evaluate(
    (args: { selector: string; exclude: string[]; factor: number }): CtaRow[] => {
      const out: CtaRow[] = [];
      const nodes = Array.prototype.slice.call(document.querySelectorAll(args.selector)) as Element[];
      for (const el of nodes) {
        if (!window.__lc.isVisible(el) || window.__lc.isExcluded(el, args.exclude)) continue;
        const label = (el.textContent || "").replace(/\s+/g, " ").trim();
        if (!label) continue;
        const style = getComputedStyle(el);
        const lineHeight = window.__lc.lineHeightOf(el) as number;
        const rect = el.getBoundingClientRect();
        const vertical =
          parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) +
          parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
        const contentHeight = rect.height - vertical;
        const lineBoxes = (window.__lc.textLineTops(el) as number[]).length;
        const limit = lineHeight * args.factor;
        if (contentHeight <= limit || lineBoxes < 2) continue;
        out.push({
          selector: window.__lc.cssPath(el),
          contentHeight: Math.round(contentHeight * 100) / 100,
          lineHeight: Math.round(lineHeight * 100) / 100,
          limit: Math.round(limit * 100) / 100,
          lineBoxes,
          label: label.slice(0, 60),
        });
      }
      return out;
    },
    { selector: config.ctaSelector, exclude: config.exclude, factor: config.thresholds.ctaLineFactor },
  );

  return rows.map((row) => ({
    type: "cta-wrap" as const,
    selector: row.selector,
    viewport,
    measured: {
      contentHeight: row.contentHeight,
      lineHeight: row.lineHeight,
      limit: row.limit,
      lineBoxes: row.lineBoxes,
      label: row.label,
    },
    delta: Math.round((row.contentHeight - row.limit) * 100) / 100,
    message:
      `label "${row.label}": height ${row.contentHeight}px > ${row.limit}px ` +
      `(${row.lineHeight}px × ${config.thresholds.ctaLineFactor}), ${row.lineBoxes} text lines measured`,
  }));
}
