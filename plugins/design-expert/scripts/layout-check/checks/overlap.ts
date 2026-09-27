/**
 * overlap.ts — Check 2: two visible elements overlap.
 * Playwright exposes no overlap API (microsoft/playwright#34778) and
 * `isVisible()` stays `true` on a fully covered element (#9923): we
 * compute the intersection of the `getBoundingClientRect()` by hand (see overlap.probe.ts).
 *
 * INTENTIONAL vs ACCIDENTAL overlap — an overlap is ignored when one
 * of the two elements (or one of its first 6 ancestors) is positioned
 * `absolute`/`fixed`/`sticky`, carries an explicit non-zero `z-index`, or is
 * `pointer-events: none`: the signature of a halo, a badge or a decorative layer.
 * Can be disabled with `--allow-overlays false`.
 */
import type { LayoutCheckConfig, Violation } from "../types";
import type { PageLike } from "../page.types";
import { overlapProbe } from "./overlap.probe";

/**
 * Tags kept EVEN without their own text: form controls and images.
 * Every element carrying its own text is kept whatever its tag.
 */
const TAGS = "A,BUTTON,INPUT,SELECT,TEXTAREA,IMG";

/**
 * Measures the pairs of elements that overlap at the current width.
 *
 * @param page - Page already loaded and resized
 * @param config - Active configuration (thresholds, exclusions, element cap)
 * @param viewport - Current viewport width, in px
 * @returns One violation per pair whose intersection exceeds both thresholds
 */
export async function checkOverlap(
  page: PageLike,
  config: LayoutCheckConfig,
  viewport: number,
): Promise<Violation[]> {
  const rows = await page.evaluate(overlapProbe, {
    exclude: config.exclude,
    tags: TAGS,
    minPx: config.thresholds.overlapMinPx,
    minRatio: config.thresholds.overlapMinRatio,
    max: config.overlapMaxElements,
    skipIntentional: config.ignoreIntentionalOverlap,
  });

  return rows.map((row) => ({
    type: "overlap" as const,
    selector: `${row.selectorA} ⟷ ${row.selectorB}`,
    viewport,
    measured: {
      intersectWidth: row.intersectWidth,
      intersectHeight: row.intersectHeight,
      intersectArea: row.intersectArea,
      smallerArea: row.smallerArea,
      ratio: row.ratio,
      textA: row.textA,
      textB: row.textB,
    },
    delta: row.intersectArea,
    message:
      `intersection ${row.intersectWidth}×${row.intersectHeight}px = ${row.intersectArea}px² ` +
      `(${Math.round(row.ratio * 100)}% of the smaller element's area)`,
  }));
}
