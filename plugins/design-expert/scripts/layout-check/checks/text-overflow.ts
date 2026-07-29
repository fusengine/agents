/**
 * text-overflow.ts — Contrôle 1 : texte qui déborde de sa boîte.
 *
 * DEUX prédicats, parce qu'un seul ne suffit pas (mesuré dans Chromium) :
 *  1. `scrollWidth > clientWidth + tolérance` — la région de débordement défilable.
 *     Elle ignore le côté START : sur un `text-indent` négatif ou en `direction: rtl`,
 *     elle vaut 0 alors que l'encre sort de 40px. Elle sous-estime aussi l'ampleur
 *     (13px rapportés pour 21px d'encre réellement hors boîte).
 *  2. Débordement de l'ENCRE : union des rectangles du texte propre de l'élément
 *     comparée à sa boîte de contenu, des deux côtés. C'est ce que l'œil voit.
 *
 * Une violation suffit sur l'un des deux ; les deux mesures sont toujours reportées.
 */
import type { LayoutCheckConfig, Violation } from "../types";
import type { InkBox, OverflowRow, PageLike } from "../page.types";

/**
 * Mesure les débordements de texte à la largeur de viewport courante.
 *
 * @param page - Page déjà chargée et redimensionnée
 * @param config - Configuration active (exclusions, tolérances)
 * @param viewport - Largeur de viewport courante, en px
 * @returns Une violation par élément dont le contenu sort de sa boîte
 */
export async function checkTextOverflow(
  page: PageLike,
  config: LayoutCheckConfig,
  viewport: number,
): Promise<Violation[]> {
  const rows = await page.evaluate(
    (args: { exclude: string[]; tol: number; inkTol: number }): OverflowRow[] => {
      const out: OverflowRow[] = [];
      for (const el of window.__lc.candidates(args.exclude) as Element[]) {
        const text = window.__lc.ownText(el) as string;
        if (!text) continue;
        const style = getComputedStyle(el);
        // Un conteneur défilable déborde par conception : hors périmètre.
        if (style.overflowX === "auto" || style.overflowX === "scroll") continue;
        // scrollWidth/clientWidth valent 0 sur une boîte inline : seule l'encre compte.
        const isInline = style.display === "inline";
        const scrollDelta = isInline ? 0 : el.scrollWidth - el.clientWidth;
        const ink = window.__lc.ownTextInk(el) as InkBox | null;
        const inkDelta = ink ? Math.max(ink.start, ink.end) : 0;
        // Débordement VERTICAL : le texte sort par le haut ou par le bas de la
        // hauteur qui lui est allouée. Ni `scrollWidth` ni `scrollHeight` ne le
        // voient en `overflow: visible` (mesuré : 0 et 0 pour 6px d'encre hors
        // boîte de chaque côté). `clientHeight` inclut les paddings : on les ôte.
        //
        // Tolérance : une boîte de ligne est plus haute que le `line-height` quand
        // celui-ci est serré (< 1) — l'encre déborde alors NATURELLEMENT d'un
        // demi-débord de chaque côté. On ne compte que ce qui excède ce demi-débord,
        // sinon tout titre à line-height serré serait accusé à tort.
        const contentHeight =
          el.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
        let vertDelta = 0;
        if (ink && !isInline && contentHeight > 0 && ink.lines > 0) {
          const inkHeight = contentHeight + ink.top + ink.bottom;
          const lineBox = inkHeight / ink.lines;
          const naturel = Math.max(0, (lineBox - (window.__lc.lineHeightOf(el) as number)) / 2);
          vertDelta = Math.max(ink.top, ink.bottom) - naturel;
        }
        if (scrollDelta <= args.tol && inkDelta <= args.inkTol && vertDelta <= args.inkTol) continue;
        out.push({
          selector: window.__lc.cssPath(el),
          scrollWidth: el.scrollWidth,
          clientWidth: el.clientWidth,
          delta: Math.max(scrollDelta, Math.round(inkDelta), Math.round(vertDelta)),
          inkStart: ink ? Math.round(ink.start) : 0,
          inkEnd: ink ? Math.round(ink.end) : 0,
          lines: ink ? ink.lines : 0,
          vertOverflow: Math.round(vertDelta),
          clipped: style.overflowX === "hidden" || style.overflowX === "clip",
          ellipsis: style.textOverflow === "ellipsis",
          text: text.slice(0, 60),
        });
      }
      return out;
    },
    {
      exclude: config.exclude,
      tol: config.thresholds.overflowTolerance,
      inkTol: config.thresholds.inkTolerance,
    },
  );

  return rows.map((row) => ({
    type: "text-overflow" as const,
    selector: row.selector,
    viewport,
    measured: {
      scrollWidth: row.scrollWidth,
      clientWidth: row.clientWidth,
      inkStart: row.inkStart,
      inkEnd: row.inkEnd,
      lines: row.lines,
      vertOverflow: row.vertOverflow,
      clipped: row.clipped,
      ellipsis: row.ellipsis,
      text: row.text,
    },
    delta: row.delta,
    message:
      `scrollWidth ${row.scrollWidth}px / clientWidth ${row.clientWidth}px — ` +
      `encre hors boîte : ${row.inkEnd}px à droite, ${row.inkStart}px à gauche ; ` +
      `${row.lines} ligne(s) de texte pour la hauteur allouée (${row.vertOverflow}px de trop)`,
  }));
}
