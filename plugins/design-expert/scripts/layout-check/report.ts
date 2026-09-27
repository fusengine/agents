/**
 * report.ts — Aggregation of the final report (summary + stable sort).
 * No judgment: counters only.
 */
import type { LayoutCheckConfig, LayoutCheckReport, Violation, Warning } from "./types";
import { dedupeWarnings } from "./warnings";

/** Stable sort order of the families, for a JSON that diffs cleanly from one run to the next. */
const TYPE_ORDER = ["document-overflow", "overlap", "text-overflow", "cta-wrap", "contrast"];


/**
 * Builds the final JSON report from the collected violations.
 *
 * @param target - Absolute URL actually loaded
 * @param config - Effective configuration of the run
 * @param violations - Violations from every width
 * @param warnings - Unreliable measurements (contrast on a gradient, caps reached)
 * @returns Serializable report, `summary.pass` set to `true` if zero violations
 */
export function buildReport(
  target: string,
  config: LayoutCheckConfig,
  violations: Violation[],
  rawWarnings: Warning[],
): LayoutCheckReport {
  const warnings = dedupeWarnings(rawWarnings);
  const sorted = [...violations].sort(
    (a, b) =>
      a.viewport - b.viewport ||
      TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type) ||
      a.selector.localeCompare(b.selector),
  );
  const byType: Record<string, number> = {};
  const byWidth: Record<string, number> = {};
  const contrastPairs: Record<string, number> = {};
  for (const violation of sorted) {
    byType[violation.type] = (byType[violation.type] ?? 0) + 1;
    byWidth[String(violation.viewport)] = (byWidth[String(violation.viewport)] ?? 0) + 1;
    // One color-token pair produces dozens of violations: grouping turns
    // "185 violations" into "5 pairs to fix".
    if (violation.type === "contrast") {
      const key = `${violation.measured.foreground} on ${violation.measured.background} (min ${violation.measured.required}:1)`;
      contrastPairs[key] = (contrastPairs[key] ?? 0) + 1;
    }
  }
  return {
    target,
    generatedAt: new Date().toISOString(),
    config,
    summary: {
      total: sorted.length,
      byType,
      byWidth,
      contrastPairs,
      warnings: warnings.length,
      pass: sorted.length === 0,
    },
    violations: sorted,
    warnings,
  };
}

/**
 * Readable summary in a handful of lines, meant for stderr.
 *
 * @param report - Already built report
 * @returns Multi-line text, no color or emoji
 */
export function formatSummary(report: LayoutCheckReport): string {
  const lines = [
    `target     : ${report.target}`,
    `widths     : ${report.config.widths.join(", ")}`,
    `violations : ${report.summary.total}`,
  ];
  for (const [type, count] of Object.entries(report.summary.byType)) lines.push(`  - ${type}: ${count}`);
  if (Object.keys(report.summary.byWidth).length > 0) {
    lines.push(`by width   : ${Object.entries(report.summary.byWidth).map(([w, c]) => `${w}px=${c}`).join(" ")}`);
  }
  const pairs = Object.entries(report.summary.contrastPairs);
  if (pairs.length > 0) {
    lines.push(`contrast pairs (${pairs.length}):`);
    for (const [pair, count] of pairs.sort((a, b) => b[1] - a[1])) lines.push(`  - ${pair} × ${count}`);
  }
  lines.push(`warnings   : ${report.summary.warnings}`);
  lines.push(`verdict    : ${report.summary.pass ? "PASS (exit 0)" : "VIOLATIONS (exit 1)"}`);
  return lines.join("\n");
}
