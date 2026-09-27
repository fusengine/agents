/**
 * text-overflow.ts — Check 1: text overflowing its box.
 *
 * TWO predicates, because one is not enough (measured in Chromium):
 *  1. `scrollWidth > clientWidth + tolerance` — the scrollable overflow region.
 *     It ignores the START side: on a negative `text-indent` or with `direction: rtl`,
 *     it is 0 while the ink overflows by 40px. It also underestimates the extent
 *     (13px reported for 21px of ink actually outside the box).
 *  2. INK overflow: union of the rectangles of the element's own text
 *     compared with its content box, on both sides. That is what the eye sees.
 *
 * A violation on either one is enough; both measurements are always reported.
 */
import type { LayoutCheckConfig, Violation } from "../types";
import type { InkBox, OverflowRow, PageLike } from "../page.types";

/**
 * Measures text overflows at the current viewport width.
 *
 * @param page - Page already loaded and resized
 * @param config - Active configuration (exclusions, tolerances)
 * @param viewport - Current viewport width, in px
 * @returns One violation per element whose content leaves its box
 */
export async function checkTextOverflow(
  page: PageLike,
  config: LayoutCheckConfig,
  viewport: number,
): Promise<Violation[]> {
  const rows = await page.evaluate(
    (args: { exclude: string[]; tol: number; inkTol: number }): OverflowRow[] => {
      const out: OverflowRow[] = [];
      for (const el of window.__lc.candidates(args.exclude) as Element[]) {
        const text = window.__lc.ownText(el) as string;
        if (!text) continue;
        const style = getComputedStyle(el);
        // A scrollable container overflows by design: out of scope.
        if (style.overflowX === "auto" || style.overflowX === "scroll") continue;
        // scrollWidth/clientWidth are 0 on an inline box: only the ink counts.
        const isInline = style.display === "inline";
        const scrollDelta = isInline ? 0 : el.scrollWidth - el.clientWidth;
        const ink = window.__lc.ownTextInk(el) as InkBox | null;
        const inkDelta = ink ? Math.max(ink.start, ink.end) : 0;
        // VERTICAL overflow: the text leaves through the top or the bottom of the
        // height allotted to it. Neither `scrollWidth` nor `scrollHeight`
        // sees it with `overflow: visible` (measured: 0 and 0 for 6px of ink outside the
        // box on each side). `clientHeight` includes the paddings: we subtract them.
        //
        // Tolerance: a line box is taller than the `line-height` when
        // the latter is tight (< 1) — the ink then NATURALLY overflows by
        // half the excess on each side. Only what exceeds that half-excess is counted,
        // otherwise every tight line-height heading would be wrongly flagged.
        const contentHeight =
          el.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
        let vertDelta = 0;
        if (ink && !isInline && contentHeight > 0 && ink.lines > 0) {
          const inkHeight = contentHeight + ink.top + ink.bottom;
          const lineBox = inkHeight / ink.lines;
          const natural = Math.max(0, (lineBox - (window.__lc.lineHeightOf(el) as number)) / 2);
          vertDelta = Math.max(ink.top, ink.bottom) - natural;
        }
        if (scrollDelta <= args.tol && inkDelta <= args.inkTol && vertDelta <= args.inkTol) continue;
        out.push({
          selector: window.__lc.cssPath(el),
          scrollWidth: el.scrollWidth,
          clientWidth: el.clientWidth,
          delta: Math.max(scrollDelta, Math.round(inkDelta), Math.round(vertDelta)),
          inkStart: ink ? Math.round(ink.start) : 0,
          inkEnd: ink ? Math.round(ink.end) : 0,
          lines: ink ? ink.lines : 0,
          vertOverflow: Math.round(vertDelta),
          clipped: style.overflowX === "hidden" || style.overflowX === "clip",
          ellipsis: style.textOverflow === "ellipsis",
          text: text.slice(0, 60),
        });
      }
      return out;
    },
    {
      exclude: config.exclude,
      tol: config.thresholds.overflowTolerance,
      inkTol: config.thresholds.inkTolerance,
    },
  );

  return rows.map((row) => ({
    type: "text-overflow" as const,
    selector: row.selector,
    viewport,
    measured: {
      scrollWidth: row.scrollWidth,
      clientWidth: row.clientWidth,
      inkStart: row.inkStart,
      inkEnd: row.inkEnd,
      lines: row.lines,
      vertOverflow: row.vertOverflow,
      clipped: row.clipped,
      ellipsis: row.ellipsis,
      text: row.text,
    },
    delta: row.delta,
    message:
      `scrollWidth ${row.scrollWidth}px / clientWidth ${row.clientWidth}px — ` +
      `ink outside the box: ${row.inkEnd}px on the right, ${row.inkStart}px on the left; ` +
      `${row.lines} text line(s) for the allotted height (${row.vertOverflow}px too many)`,
  }));
}
