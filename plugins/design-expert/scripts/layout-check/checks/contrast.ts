/**
 * contrast.ts — Contrôle 4 : ratio de contraste WCAG sur couleurs RÉSOLUES.
 * Les couleurs viennent de `getComputedStyle`, puis sont converties en sRGB par le
 * navigateur lui-même (canvas 1×1) : `oklch()`, `color-mix()`, variables CSS et alpha
 * sont donc gérés. Le fond effectif est reconstitué en remontant les ancêtres tant
 * qu'il est transparent (voir probe-color.ts).
 *
 * Limite assumée : si un `background-image` (dégradé, photo) intervient dans la
 * chaîne, le ratio ne porte que sur la couche couleur — le cas est reporté en
 * AVERTISSEMENT, jamais en violation, et doit être tranché à l'œil sur capture.
 */
import type { LayoutCheckConfig, Violation, Warning } from "../types";
import type { PageLike } from "../page.types";
import { contrastProbe } from "./contrast.probe";

/**
 * Mesure les contrastes texte/fond à la largeur de viewport courante.
 *
 * @param page - Page déjà chargée et redimensionnée
 * @param config - Configuration active (seuils WCAG, exclusions)
 * @param viewport - Largeur de viewport courante, en px
 * @returns Les violations franches et les mesures non fiables
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
    message: `contraste ${row.ratio}:1 < ${row.required}:1 requis (${row.foreground} sur ${row.background}, ${row.fontSize}px/${row.fontWeight})`,
  }));

  const warnings = result.unresolved.map((row) => ({
    type: "contrast" as const,
    selector: row.selector,
    viewport,
    reason: row.unresolvedImageAt
      ? `fond non résoluble (background-image sur ${row.unresolvedImageAt}) — ratio couche couleur ${row.ratio}:1 < ${row.required}:1, à vérifier sur capture`
      : `couleur de texte transparente (probable background-clip: text) — ratio non mesurable`,
  }));

  return { violations, warnings };
}
