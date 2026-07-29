/**
 * probe-text.ts — Mesure de l'ENCRE du texte, injectée dans la page (`window.__lc`).
 *
 * Pourquoi ne pas se contenter de `scrollWidth` : mesuré dans Chromium, sur une
 * boîte `width:90px; white-space:nowrap; overflow:visible`, `scrollWidth −
 * clientWidth` vaut **13** alors que l'encre sort de **21px** ; et sur un
 * débordement vers le START (`direction:rtl`, `text-indent` négatif) il vaut
 * **0** alors que l'encre sort de **40px**. La région de débordement défilable
 * ignore le côté start — un texte qui sort par la gauche lui est invisible.
 */

/**
 * Ordonnées distinctes des boîtes de ligne occupées par le TEXTE de l'élément.
 * Seuls les nœuds texte sont mesurés : une icône placée au-dessus du libellé
 * (bouton hamburger « barres + Menu ») ne compte donc pas comme une seconde ligne.
 *
 * @param el - Élément dont on compte les lignes de texte
 * @returns Les `top` arrondis, un par ligne réellement occupée
 */
function textLineTops(el: Element): number[] {
  const tops: number[] = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    if ((node.textContent || "").trim()) {
      const range = document.createRange();
      range.selectNodeContents(node);
      const rects = Array.prototype.slice.call(range.getClientRects()) as DOMRect[];
      for (const r of rects) {
        const top = Math.round(r.top);
        if (r.width > 0 && r.height > 0 && tops.indexOf(top) < 0) tops.push(top);
      }
    }
    node = walker.nextNode();
  }
  return tops;
}

/**
 * Débordement de l'encre du texte PROPRE de l'élément hors de sa boîte de contenu.
 * Seuls les nœuds texte enfants DIRECTS sont mesurés : le texte d'un descendant
 * positionné sort légitimement de la boîte de son ancêtre, ce n'est pas un défaut.
 *
 * @param el - Élément porteur de texte
 * @returns Débordement en px de chaque côté (négatif = marge restante), ou `null`
 */
function ownTextInk(
  el: Element,
): { start: number; end: number; top: number; bottom: number; lines: number } | null {
  const style = getComputedStyle(el);
  const rect = el.getBoundingClientRect();
  const left = rect.left + parseFloat(style.paddingLeft) + parseFloat(style.borderLeftWidth);
  const right = rect.right - parseFloat(style.paddingRight) - parseFloat(style.borderRightWidth);
  const top = rect.top + parseFloat(style.paddingTop) + parseFloat(style.borderTopWidth);
  const bottom = rect.bottom - parseFloat(style.paddingBottom) - parseFloat(style.borderBottomWidth);
  let inkLeft = Infinity;
  let inkRight = -Infinity;
  let inkTop = Infinity;
  let inkBottom = -Infinity;
  const tops: number[] = [];
  const nodes = el.childNodes;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (!node || node.nodeType !== 3 || !(node.textContent || "").trim()) continue;
    const range = document.createRange();
    range.selectNodeContents(node);
    const rects = Array.prototype.slice.call(range.getClientRects()) as DOMRect[];
    for (const r of rects) {
      if (r.width <= 0 || r.height <= 0) continue;
      inkLeft = Math.min(inkLeft, r.left);
      inkRight = Math.max(inkRight, r.right);
      inkTop = Math.min(inkTop, r.top);
      inkBottom = Math.max(inkBottom, r.bottom);
      const line = Math.round(r.top);
      if (tops.indexOf(line) < 0) tops.push(line);
    }
  }
  if (inkRight === -Infinity) return null;
  return {
    start: left - inkLeft,
    end: inkRight - right,
    top: top - inkTop,
    bottom: inkBottom - bottom,
    lines: tops.length,
  };
}

/** Source JS à injecter avant le chargement de la page. */
export const TEXT_PROBE_SOURCE = `window.__lc = Object.assign(window.__lc || {}, {
  textLineTops: ${textLineTops},
  ownTextInk: ${ownTextInk}
});`;
