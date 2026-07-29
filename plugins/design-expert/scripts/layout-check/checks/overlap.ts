/**
 * overlap.ts — Contrôle 2 : deux éléments visibles se recouvrent.
 * Playwright n'expose aucune API de chevauchement (microsoft/playwright#34778) et
 * `isVisible()` reste `true` sur un élément entièrement recouvert (#9923) : on
 * calcule l'intersection des `getBoundingClientRect()` à la main (voir overlap.probe.ts).
 *
 * Superposition VOLONTAIRE vs ACCIDENTELLE — un chevauchement est ignoré quand l'un
 * des deux éléments (ou un de ses 6 premiers ancêtres) est positionné
 * `absolute`/`fixed`/`sticky`, porte un `z-index` explicite non nul, ou est en
 * `pointer-events: none` : signature d'un halo, d'un badge ou d'un calque décoratif.
 * Désactivable avec `--allow-overlays false`.
 */
import type { LayoutCheckConfig, Violation } from "../types";
import type { PageLike } from "../page.types";
import { overlapProbe } from "./overlap.probe";

/**
 * Balises retenues MÊME sans texte propre : contrôles de formulaire et images.
 * Tout élément portant son propre texte est retenu quelle que soit sa balise.
 */
const TAGS = "A,BUTTON,INPUT,SELECT,TEXTAREA,IMG";

/**
 * Mesure les paires d'éléments qui se recouvrent à la largeur courante.
 *
 * @param page - Page déjà chargée et redimensionnée
 * @param config - Configuration active (seuils, exclusions, plafond d'éléments)
 * @param viewport - Largeur de viewport courante, en px
 * @returns Une violation par paire dont l'intersection dépasse les deux seuils
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
      `(${Math.round(row.ratio * 100)}% de l'aire du plus petit élément)`,
  }));
}
