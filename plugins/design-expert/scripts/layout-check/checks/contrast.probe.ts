/**
 * contrast.probe.ts — Fonction exécutée DANS la page pour le contrôle `contrast`.
 * Sérialisée par Playwright : aucune référence à une variable de module, uniquement
 * l'argument et `window.__lc`.
 */
import type { ContrastRow } from "../page.types";

/** Argument sérialisable passé à la sonde. */
export interface ContrastProbeArgs {
  exclude: string[];
  normal: number;
  large: number;
}

/** Résultat : violations franches d'un côté, mesures non fiables de l'autre. */
export interface ContrastProbeResult {
  failed: ContrastRow[];
  unresolved: ContrastRow[];
}

/**
 * Calcule le ratio WCAG de chaque élément portant du texte, sur couleurs résolues.
 *
 * @param args - Seuils et exclusions, sérialisés depuis Node
 * @returns Les échecs de contraste et les cas dont le fond n'est pas résoluble
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
    // WCAG « large text » : >= 24px, ou >= 18.66px en gras (>= 700).
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
    // Texte peint par un dégradé (background-clip: text) : couleur non mesurable.
    if ((rawFg[3] as number) === 0) {
      unresolved.push(row);
      continue;
    }
    // Fond porté par une image/un dégradé : le ratio calculé n'engage que la couche couleur.
    if (bg.image) {
      if (ratio < required) unresolved.push(row);
      continue;
    }
    if (ratio < required) failed.push(row);
  }
  return { failed, unresolved };
}
