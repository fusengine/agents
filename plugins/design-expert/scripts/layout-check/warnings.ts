/**
 * warnings.ts — Processing of warnings before they are reported.
 * A warning is not a violation: it is what the script cannot decide.
 * It must therefore stay READABLE, or it will be ignored — and an ignored
 * unmeasurable case is exactly the hole we are trying to close.
 */
import type { Warning } from "./types";

/**
 * Merges identical warnings across widths.
 * A gradient background or hidden text does not depend on the viewport width:
 * repeating it at every width multiplies an already non-actionable output by six
 * (measured: 60 lines on a real page, 15 after merging). The affected widths
 * are kept in the reason.
 *
 * @param warnings - Raw warnings, all widths combined
 * @returns One warning per (type, selector, reason) tuple
 */
export function dedupeWarnings(warnings: Warning[]): Warning[] {
  const groups = new Map<string, { warning: Warning; widths: number[] }>();
  for (const warning of warnings) {
    const key = `${warning.type}|${warning.selector}|${warning.reason}`;
    const found = groups.get(key);
    if (found) found.widths.push(warning.viewport);
    else groups.set(key, { warning, widths: [warning.viewport] });
  }
  return [...groups.values()].map(({ warning, widths }) => ({
    ...warning,
    reason: widths.length > 1 ? `${warning.reason} [widths: ${widths.join(", ")}]` : warning.reason,
  }));
}
