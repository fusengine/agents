/**
 * document-overflow.ts — Cross-cutting check: horizontal overflow of the document.
 * Predicate: `document.documentElement.scrollWidth > viewport width + tolerance`,
 * evaluated at EVERY tested width. The offenders are the leaf elements whose
 * right edge exceeds the viewport (none of their children already exceeds it).
 */
import type { LayoutCheckConfig, Violation } from "../types";
import type { DocumentOverflowRow, PageLike } from "../page.types";

/**
 * Measures the document's horizontal overflow at the current width.
 *
 * @param page - Page already loaded and resized
 * @param config - Active configuration (tolerance, exclusions)
 * @param viewport - Current viewport width, in px
 * @returns Zero or one violation, with up to 5 offending elements
 */
export async function checkDocumentOverflow(
  page: PageLike,
  config: LayoutCheckConfig,
  viewport: number,
): Promise<Violation[]> {
  const row = await page.evaluate(
    (args: { exclude: string[]; tol: number }): DocumentOverflowRow | null => {
      const root = document.documentElement;
      const width = root.clientWidth;
      const delta = root.scrollWidth - width;
      if (delta <= args.tol) return null;
      // Empirical proof: actually try to scroll to the right.
      window.scrollTo(99_999, 0);
      const scrollXReached = Math.round(window.scrollX);
      window.scrollTo(0, 0);
      // An element whose ancestor clips the overflow (marquee in `overflow:
      // hidden`, scrollable carousel) CANNOT scroll the document:
      // its rectangle overflows, not the flow.
      // `overflow-x: hidden` set on <body> (or <html>) clips nothing: it
      // propagates to the viewport — hence the classic "the page scrolls anyway".
      // The walk up therefore stops before body.
      const clipped = (el: Element): boolean => {
        let node: Element | null = el.parentElement;
        while (node && node !== document.body && node !== document.documentElement) {
          const x = getComputedStyle(node).overflowX;
          if (x === "hidden" || x === "clip" || x === "auto" || x === "scroll") return true;
          node = node.parentElement;
        }
        return false;
      };
      const over = (window.__lc.candidates(args.exclude) as Element[]).filter(
        (el) => el.getBoundingClientRect().right > width + args.tol && !clipped(el),
      );
      // Keep only the deepest ones: a parent that overflows because its
      // child overflows is not the cause.
      const leaves = over.filter((el) => !over.some((other) => other !== el && el.contains(other)));
      const offenders = leaves
        .map((el) => ({
          selector: window.__lc.cssPath(el),
          right: Math.round(el.getBoundingClientRect().right),
          width: Math.round(el.getBoundingClientRect().width),
        }))
        .sort((a, b) => b.right - a.right)
        .slice(0, 5);
      return { scrollWidth: root.scrollWidth, clientWidth: width, delta, scrollXReached, offenders };
    },
    { exclude: config.exclude, tol: config.thresholds.documentOverflowTolerance },
  );

  if (!row) return [];
  return [
    {
      type: "document-overflow" as const,
      selector: "html",
      viewport,
      measured: {
        scrollWidth: row.scrollWidth,
        clientWidth: row.clientWidth,
        scrollXReached: row.scrollXReached,
        offenders: row.offenders.map((o) => `${o.selector} (right ${o.right}px, width ${o.width}px)`).join(" | "),
      },
      delta: row.delta,
      message:
        `document.scrollWidth ${row.scrollWidth}px > viewport ${row.clientWidth}px (+${row.delta}px), ` +
        `actual horizontal scroll reached: ${row.scrollXReached}px`,
    },
  ];
}
