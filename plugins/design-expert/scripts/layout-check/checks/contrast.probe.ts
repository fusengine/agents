/**
 * contrast.probe.ts — Function executed IN the page for the `contrast` check.
 * Serialized by Playwright: no reference to any module variable, only
 * the argument and `window.__lc`.
 */
import type { ContrastRow } from "../page.types";

/** Serializable argument passed to the probe. */
export interface ContrastProbeArgs {
  exclude: string[];
  normal: number;
  large: number;
}

/** Result: clear-cut violations on one side, unreliable measurements on the other. */
export interface ContrastProbeResult {
  failed: ContrastRow[];
  unresolved: ContrastRow[];
}

/**
 * Computes the WCAG ratio of every text-bearing element, on resolved colors.
 *
 * @param args - Thresholds and exclusions, serialized from Node
 * @returns The contrast failures and the cases whose background cannot be resolved
 */
export function contrastProbe(args: ContrastProbeArgs): ContrastProbeResult {
  const failed: ContrastRow[] = [];
  const unresolved: ContrastRow[] = [];
  for (const el of window.__lc.candidates(args.exclude) as Element[]) {
    const text = window.__lc.ownText(el) as string;
    if (!text) continue;
    const style = getComputedStyle(el);
    const rawFg = window.__lc.resolveRgba(style.color) as number[];
    const bg = window.__lc.effectiveBackground(el) as { rgb: number[]; image: string | null };
    const fg = (rawFg[3] as number) < 0.999 ? (window.__lc.blend(rawFg, bg.rgb) as number[]) : rawFg;
    const fontSize = parseFloat(style.fontSize);
    const fontWeight = Number(style.fontWeight) || 400;
    // WCAG "large text": >= 24px, or >= 18.66px bold (>= 700).
    const largeText = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
    const required = largeText ? args.large : args.normal;
    const ratio = Number((window.__lc.contrastRatio(fg, bg.rgb) as number).toFixed(2));
    const row: ContrastRow = {
      selector: window.__lc.cssPath(el),
      ratio,
      required,
      foreground: `rgb(${Math.round(fg[0] as number)}, ${Math.round(fg[1] as number)}, ${Math.round(fg[2] as number)})`,
      background: `rgb(${Math.round(bg.rgb[0] as number)}, ${Math.round(bg.rgb[1] as number)}, ${Math.round(bg.rgb[2] as number)})`,
      fontSize,
      fontWeight,
      largeText,
      unresolvedImageAt: bg.image,
      text: text.slice(0, 60),
    };
    // Text painted by a gradient (background-clip: text): color not measurable.
    if ((rawFg[3] as number) === 0) {
      unresolved.push(row);
      continue;
    }
    // Background carried by an image/a gradient: the computed ratio only covers the color layer.
    if (bg.image) {
      if (ratio < required) unresolved.push(row);
      continue;
    }
    if (ratio < required) failed.push(row);
  }
  return { failed, unresolved };
}
