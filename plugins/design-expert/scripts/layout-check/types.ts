/**
 * types.ts — Output contract of the deterministic layout check.
 * No logic here: shared interfaces only (repo SOLID rule).
 */

/** Check families. One family = one module in `checks/`. */
export type ViolationType =
  | "text-overflow"
  | "overlap"
  | "cta-wrap"
  | "contrast"
  | "document-overflow";

/** One measured violation, at a given viewport width. */
export interface Violation {
  /** Family of the check that produced the violation. */
  type: ViolationType;
  /** CSS selector of the offending element (pair joined by " ⟷ " for `overlap`). */
  selector: string;
  /** Viewport width (px) at which the measurement was taken. */
  viewport: number;
  /** Raw values measured in the page (numbers only, no judgment). */
  measured: Record<string, number | string | boolean>;
  /** Distance to the threshold, in px (or in ratio points for contrast). */
  delta: number;
  /** One-line factual summary, no judgment. */
  message: string;
}

/** Non-blocking information: measurement impossible, limit reached. */
export interface Warning {
  type: ViolationType | "probe";
  selector: string;
  viewport: number;
  reason: string;
}

/** Numeric thresholds. Everything is tunable; the defaults live in `config.ts`. */
export interface Thresholds {
  /** px tolerance on scrollWidth − clientWidth. */
  overflowTolerance: number;
  /** px tolerance on the text ink overflowing its box. */
  inkTolerance: number;
  /** px tolerance on documentElement.scrollWidth − viewport. */
  documentOverflowTolerance: number;
  /** Minimum width/height (px) of an intersection for it to be kept. */
  overlapMinPx: number;
  /** Minimum share of the smaller element's area covered by the intersection. */
  overlapMinRatio: number;
  /** line-height multiplier beyond which a label sits on 2 lines. */
  ctaLineFactor: number;
  /** Minimum WCAG ratio for body text. */
  contrastNormal: number;
  /** Minimum WCAG ratio for large text (>= 24px, or >= 18.66px bold). */
  contrastLarge: number;
}

/** Full configuration of one run. */
export interface LayoutCheckConfig {
  /** Viewport widths tested, in px. */
  widths: number[];
  /** Viewport height, in px. */
  height: number;
  /** Selectors excluded from ALL checks. */
  exclude: string[];
  /** Selectors treated as CTAs by the `cta-wrap` check. */
  ctaSelector: string;
  /** Treat positioned/z-indexed elements as intentional overlaps. */
  ignoreIntentionalOverlap: boolean;
  /** Max number of elements compared pairwise by the `overlap` check. */
  overlapMaxElements: number;
  /** Emulate `prefers-reduced-motion: reduce` (neutralizes scroll reveals). */
  reducedMotion: boolean;
  /** Scroll the page top to bottom before measuring (triggers JS reveals). */
  warmup: boolean;
  /** Enabled check families. */
  checks: ViolationType[];
  /** Numeric thresholds. */
  thresholds: Thresholds;
}

/** Final report serialized as JSON on stdout. */
export interface LayoutCheckReport {
  target: string;
  generatedAt: string;
  config: LayoutCheckConfig;
  summary: {
    total: number;
    byType: Record<string, number>;
    byWidth: Record<string, number>;
    /** Contrast violations grouped by resolved color pair. */
    contrastPairs: Record<string, number>;
    warnings: number;
    pass: boolean;
  };
  violations: Violation[];
  warnings: Warning[];
}
