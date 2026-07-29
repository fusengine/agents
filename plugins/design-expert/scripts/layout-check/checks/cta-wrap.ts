/**
 * cta-wrap.ts — Contrôle 3 : libellé de CTA passé à la ligne.
 * Mécanise `design-web/references/layout-discipline.md` §6 (« Label fits on one line
 * at desktop… is a pre-flight fail »).
 *
 * Prédicat : hauteur du contenu > `ctaLineFactor × line-height` calculé (défaut 1,6)
 * ET au moins 2 boîtes de ligne occupées par le TEXTE (`Range.getClientRects()` sur
 * les seuls nœuds texte). Les deux conditions sont nécessaires :
 *  - la hauteur seule accuse tout bouton à hauteur fixe (`height: 42px` + flex centré)
 *    dont le libellé tient sur une ligne — 25 faux positifs sur 31 sur une page réelle ;
 *  - compter les lignes sur TOUT le contenu accuse un bouton « icône au-dessus du mot ».
 */
import type { LayoutCheckConfig, Violation } from "../types";
import type { CtaRow, PageLike } from "../page.types";

/**
 * Mesure les libellés de CTA qui occupent plus d'une ligne.
 *
 * @param page - Page déjà chargée et redimensionnée
 * @param config - Configuration active (sélecteur CTA, facteur de ligne)
 * @param viewport - Largeur de viewport courante, en px
 * @returns Une violation par CTA dont le libellé dépasse une ligne
 */
export async function checkCtaWrap(
  page: PageLike,
  config: LayoutCheckConfig,
  viewport: number,
): Promise<Violation[]> {
  const rows = await page.evaluate(
    (args: { selector: string; exclude: string[]; factor: number }): CtaRow[] => {
      const out: CtaRow[] = [];
      const nodes = Array.prototype.slice.call(document.querySelectorAll(args.selector)) as Element[];
      for (const el of nodes) {
        if (!window.__lc.isVisible(el) || window.__lc.isExcluded(el, args.exclude)) continue;
        const label = (el.textContent || "").replace(/\s+/g, " ").trim();
        if (!label) continue;
        const style = getComputedStyle(el);
        const lineHeight = window.__lc.lineHeightOf(el) as number;
        const rect = el.getBoundingClientRect();
        const vertical =
          parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) +
          parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
        const contentHeight = rect.height - vertical;
        const lineBoxes = (window.__lc.textLineTops(el) as number[]).length;
        const limit = lineHeight * args.factor;
        if (contentHeight <= limit || lineBoxes < 2) continue;
        out.push({
          selector: window.__lc.cssPath(el),
          contentHeight: Math.round(contentHeight * 100) / 100,
          lineHeight: Math.round(lineHeight * 100) / 100,
          limit: Math.round(limit * 100) / 100,
          lineBoxes,
          label: label.slice(0, 60),
        });
      }
      return out;
    },
    { selector: config.ctaSelector, exclude: config.exclude, factor: config.thresholds.ctaLineFactor },
  );

  return rows.map((row) => ({
    type: "cta-wrap" as const,
    selector: row.selector,
    viewport,
    measured: {
      contentHeight: row.contentHeight,
      lineHeight: row.lineHeight,
      limit: row.limit,
      lineBoxes: row.lineBoxes,
      label: row.label,
    },
    delta: Math.round((row.contentHeight - row.limit) * 100) / 100,
    message:
      `libellé « ${row.label} » : hauteur ${row.contentHeight}px > ${row.limit}px ` +
      `(${row.lineHeight}px × ${config.thresholds.ctaLineFactor}), ${row.lineBoxes} lignes de texte mesurées`,
  }));
}
