/**
 * document-overflow.ts — Contrôle transverse : débordement horizontal du document.
 * Prédicat : `document.documentElement.scrollWidth > largeur du viewport + tolérance`,
 * évalué à CHAQUE largeur testée. Les coupables sont les éléments feuilles dont le
 * bord droit dépasse le viewport (aucun de leurs enfants ne dépasse déjà).
 */
import type { LayoutCheckConfig, Violation } from "../types";
import type { DocumentOverflowRow, PageLike } from "../page.types";

/**
 * Mesure le débordement horizontal du document à la largeur courante.
 *
 * @param page - Page déjà chargée et redimensionnée
 * @param config - Configuration active (tolérance, exclusions)
 * @param viewport - Largeur de viewport courante, en px
 * @returns Zéro ou une violation, avec jusqu'à 5 éléments coupables
 */
export async function checkDocumentOverflow(
  page: PageLike,
  config: LayoutCheckConfig,
  viewport: number,
): Promise<Violation[]> {
  const row = await page.evaluate(
    (args: { exclude: string[]; tol: number }): DocumentOverflowRow | null => {
      const root = document.documentElement;
      const width = root.clientWidth;
      const delta = root.scrollWidth - width;
      if (delta <= args.tol) return null;
      // Preuve empirique : on tente réellement de faire défiler vers la droite.
      window.scrollTo(99_999, 0);
      const scrollXReached = Math.round(window.scrollX);
      window.scrollTo(0, 0);
      // Un élément dont un ancêtre rogne le débordement (marquee en `overflow:
      // hidden`, carrousel défilable) ne peut PAS faire défiler le document :
      // son rectangle dépasse, pas le flux.
      // `overflow-x: hidden` posé sur <body> (ou <html>) ne rogne rien : il se
      // propage au viewport — d'où le classique « la page défile quand même ».
      // La remontée s'arrête donc avant body.
      const clipped = (el: Element): boolean => {
        let node: Element | null = el.parentElement;
        while (node && node !== document.body && node !== document.documentElement) {
          const x = getComputedStyle(node).overflowX;
          if (x === "hidden" || x === "clip" || x === "auto" || x === "scroll") return true;
          node = node.parentElement;
        }
        return false;
      };
      const over = (window.__lc.candidates(args.exclude) as Element[]).filter(
        (el) => el.getBoundingClientRect().right > width + args.tol && !clipped(el),
      );
      // On ne garde que les plus profonds : un parent qui déborde parce que son
      // enfant déborde n'est pas la cause.
      const leaves = over.filter((el) => !over.some((other) => other !== el && el.contains(other)));
      const offenders = leaves
        .map((el) => ({
          selector: window.__lc.cssPath(el),
          right: Math.round(el.getBoundingClientRect().right),
          width: Math.round(el.getBoundingClientRect().width),
        }))
        .sort((a, b) => b.right - a.right)
        .slice(0, 5);
      return { scrollWidth: root.scrollWidth, clientWidth: width, delta, scrollXReached, offenders };
    },
    { exclude: config.exclude, tol: config.thresholds.documentOverflowTolerance },
  );

  if (!row) return [];
  return [
    {
      type: "document-overflow" as const,
      selector: "html",
      viewport,
      measured: {
        scrollWidth: row.scrollWidth,
        clientWidth: row.clientWidth,
        scrollXReached: row.scrollXReached,
        offenders: row.offenders.map((o) => `${o.selector} (right ${o.right}px, largeur ${o.width}px)`).join(" | "),
      },
      delta: row.delta,
      message:
        `document.scrollWidth ${row.scrollWidth}px > viewport ${row.clientWidth}px (+${row.delta}px), ` +
        `défilement horizontal réel atteint : ${row.scrollXReached}px`,
    },
  ];
}
