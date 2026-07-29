/**
 * report.ts — Agrégation du rapport final (résumé + tri stable).
 * Aucune appréciation : uniquement des compteurs.
 */
import type { LayoutCheckConfig, LayoutCheckReport, Violation, Warning } from "./types";
import { dedupeWarnings } from "./warnings";

/** Ordre de tri stable des familles, pour un JSON diffable d'une exécution à l'autre. */
const TYPE_ORDER = ["document-overflow", "overlap", "text-overflow", "cta-wrap", "contrast"];


/**
 * Construit le rapport JSON final à partir des violations collectées.
 *
 * @param target - URL absolue effectivement chargée
 * @param config - Configuration effective de l'exécution
 * @param violations - Violations de toutes les largeurs
 * @param warnings - Mesures non fiables (contraste sur dégradé, plafonds atteints)
 * @returns Rapport sérialisable, `summary.pass` à `true` si zéro violation
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
    // Un même couple de jetons colorés produit des dizaines de violations : le
    // regroupement transforme « 185 violations » en « 5 couples à corriger ».
    if (violation.type === "contrast") {
      const key = `${violation.measured.foreground} sur ${violation.measured.background} (min ${violation.measured.required}:1)`;
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
 * Résumé lisible en une poignée de lignes, destiné à stderr.
 *
 * @param report - Rapport déjà construit
 * @returns Texte multi-lignes, sans couleur ni emoji
 */
export function formatSummary(report: LayoutCheckReport): string {
  const lines = [
    `cible      : ${report.target}`,
    `largeurs   : ${report.config.widths.join(", ")}`,
    `violations : ${report.summary.total}`,
  ];
  for (const [type, count] of Object.entries(report.summary.byType)) lines.push(`  - ${type}: ${count}`);
  if (Object.keys(report.summary.byWidth).length > 0) {
    lines.push(`par largeur: ${Object.entries(report.summary.byWidth).map(([w, c]) => `${w}px=${c}`).join(" ")}`);
  }
  const pairs = Object.entries(report.summary.contrastPairs);
  if (pairs.length > 0) {
    lines.push(`couples de contraste (${pairs.length}) :`);
    for (const [pair, count] of pairs.sort((a, b) => b[1] - a[1])) lines.push(`  - ${pair} × ${count}`);
  }
  lines.push(`avertissements : ${report.summary.warnings}`);
  lines.push(`verdict    : ${report.summary.pass ? "CONFORME (exit 0)" : "VIOLATIONS (exit 1)"}`);
  return lines.join("\n");
}
