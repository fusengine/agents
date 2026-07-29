/**
 * overlap.probe.ts — Fonction exécutée DANS la page pour le contrôle `overlap`.
 * Sérialisée par Playwright : elle ne référence que son argument et `window.__lc`.
 */
import type { OverlapRow } from "../page.types";

/** Argument sérialisable passé à la sonde. */
export interface OverlapProbeArgs {
  exclude: string[];
  tags: string;
  minPx: number;
  minRatio: number;
  max: number;
  skipIntentional: boolean;
}

/**
 * Calcule toutes les paires d'éléments visibles dont les rectangles s'intersectent.
 *
 * @param args - Seuils et exclusions, sérialisés depuis Node
 * @returns Les paires retenues, avec leurs mesures brutes
 */
export function overlapProbe(args: OverlapProbeArgs): OverlapRow[] {
  const allowed = args.tags.split(",");
  // Retenus : tout élément portant SON PROPRE texte (quelle que soit sa balise — un
  // libellé vit souvent dans un div ou un span), plus les éléments sans texte mais
  // porteurs de sens (contrôles de formulaire, images).
  const items = (window.__lc.candidates(args.exclude) as Element[])
    .filter((el) => window.__lc.ownText(el) || allowed.indexOf(el.tagName) >= 0)
    .filter((el) => !(args.skipIntentional && window.__lc.isIntentionalOverlay(el)))
    .slice(0, args.max)
    .map((el) => ({
      el,
      rect: el.getBoundingClientRect(),
      text: window.__lc.ownText(el) as string,
      inline: getComputedStyle(el).display === "inline",
      owner: window.__lc.blockOwner(el) as Element,
      lineHeight: window.__lc.lineHeightOf(el) as number,
    }));

  const out: OverlapRow[] = [];
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const a = items[i] as (typeof items)[number];
      const b = items[j] as (typeof items)[number];
      // Une relation ancêtre/descendant n'est jamais un chevauchement.
      if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
      // Deux inline du même bloc partagent la même grille de lignes : un élément
      // réellement superposé serait positionné, donc plus `display: inline`.
      if (a.inline && b.inline && a.owner === b.owner) continue;
      const w = Math.min(a.rect.right, b.rect.right) - Math.max(a.rect.left, b.rect.left);
      const h = Math.min(a.rect.bottom, b.rect.bottom) - Math.max(a.rect.top, b.rect.top);
      if (w <= args.minPx || h <= args.minPx) continue;
      // Bavure de boîte de ligne : deux boîtes EMPILÉES qui mordent l'une sur l'autre
      // de moins d'une demi-ligne (jambages d'un titre à line-height serré). Aucun
      // pixel d'encre en collision — constaté sur des titres réels.
      const stacked =
        Math.abs((a.rect.top + a.rect.bottom) / 2 - (b.rect.top + b.rect.bottom) / 2) >
        Math.min(a.rect.height, b.rect.height) * 0.5;
      if (stacked && h < Math.min(a.lineHeight, b.lineHeight) * 0.5) continue;
      const area = w * h;
      const smaller = Math.min(a.rect.width * a.rect.height, b.rect.width * b.rect.height);
      const ratio = smaller > 0 ? area / smaller : 0;
      if (ratio < args.minRatio) continue;
      out.push({
        selectorA: window.__lc.cssPath(a.el),
        selectorB: window.__lc.cssPath(b.el),
        intersectWidth: Math.round(w),
        intersectHeight: Math.round(h),
        intersectArea: Math.round(area),
        smallerArea: Math.round(smaller),
        ratio: Number(ratio.toFixed(3)),
        textA: a.text.slice(0, 40),
        textB: b.text.slice(0, 40),
      });
    }
  }
  return out;
}
