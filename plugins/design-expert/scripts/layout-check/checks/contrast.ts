/**
 * contrast.ts — Check 4: WCAG contrast ratio on RESOLVED colors.
 * Colors come from `getComputedStyle`, then are converted to sRGB by the
 * browser itself (1×1 canvas): `oklch()`, `color-mix()`, CSS variables and alpha
 * are therefore handled. The effective background is rebuilt by walking up the ancestors
 * while it is transparent (see probe-color.ts).
 *
 * Accepted limit: if a `background-image` (gradient, photo) is part of the
 * chain, the ratio only covers the color layer — the case is reported as a
 * WARNING, never as a violation, and must be decided by eye on a screenshot.
 */
import type { LayoutCheckConfig, Violation, Warning } from "../types";
import type { PageLike } from "../page.types";
import { contrastProbe } from "./contrast.probe";

/**
 * Measures text/background contrasts at the current viewport width.
 *
 * @param page - Page already loaded and resized
 * @param config - Active configuration (WCAG thresholds, exclusions)
 * @param viewport - Current viewport width, in px
 * @returns The clear-cut violations and the unreliable measurements
 */
export async function checkContrast(
  page: PageLike,
  config: LayoutCheckConfig,
  viewport: number,
): Promise<{ violations: Violation[]; warnings: Warning[] }> {
  const result = await page.evaluate(contrastProbe, {
    exclude: config.exclude,
    normal: config.thresholds.contrastNormal,
    large: config.thresholds.contrastLarge,
  });

  const violations = result.failed.map((row) => ({
    type: "contrast" as const,
    selector: row.selector,
    viewport,
    measured: {
      ratio: row.ratio,
      required: row.required,
      foreground: row.foreground,
      background: row.background,
      fontSize: row.fontSize,
      fontWeight: row.fontWeight,
      largeText: row.largeText,
      text: row.text,
    },
    delta: Math.round((row.required - row.ratio) * 100) / 100,
    message: `contrast ${row.ratio}:1 < ${row.required}:1 required (${row.foreground} on ${row.background}, ${row.fontSize}px/${row.fontWeight})`,
  }));

  const warnings = result.unresolved.map((row) => ({
    type: "contrast" as const,
    selector: row.selector,
    viewport,
    reason: row.unresolvedImageAt
      ? `background not resolvable (background-image on ${row.unresolvedImageAt}) — color-layer ratio ${row.ratio}:1 < ${row.required}:1, check on a screenshot`
      : `transparent text color (likely background-clip: text) — ratio not measurable`,
  }));

  return { violations, warnings };
}
