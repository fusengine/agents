/**
 * probe-layout.ts — Helpers de mise en page injectés dans la page (`window.__lc`).
 * Partagés par les contrôles `overlap` et `cta-wrap` (DRY) : sérialisés via
 * `toString()`, ils ne référencent que leur argument et `window.__lc`.
 */

/**
 * Superposition VOLONTAIRE : l'élément ou l'un de ses 6 premiers ancêtres est hors
 * flux, porte un z-index explicite non nul, ou n'est pas cliquable (calque décoratif).
 *
 * @param el - Élément candidat
 * @returns `true` si la superposition est délibérée
 */
function isIntentionalOverlay(el: Element): boolean {
  let node: Element | null = el;
  for (let depth = 0; node && depth < 6; depth++) {
    const s = getComputedStyle(node);
    if (s.position === "absolute" || s.position === "fixed" || s.position === "sticky") return true;
    if (s.zIndex !== "auto" && Number(s.zIndex) !== 0) return true;
    if (s.pointerEvents === "none") return true;
    // Un `transform` explicite est un déplacement AUTEUR (composition d'images
    // pivotées, décalage de scène) : la superposition qui en résulte est voulue.
    if (s.transform && s.transform !== "none") return true;
    node = node.parentElement;
  }
  return false;
}

/**
 * Conteneur de bloc le plus proche.
 *
 * @param el - Élément dont on cherche le contexte de lignes
 * @returns L'ancêtre bloc le plus proche, `document.body` à défaut
 */
function blockOwner(el: Element): Element {
  let node: Element | null = el.parentElement;
  while (node) {
    const display = getComputedStyle(node).display;
    if (display !== "inline" && display !== "contents") return node;
    node = node.parentElement;
  }
  return document.body;
}

/**
 * Line-height calculé, en px.
 *
 * @param el - Élément mesuré
 * @returns La valeur numérique, ou 1,2 × font-size si `line-height: normal`
 */
function lineHeightOf(el: Element): number {
  const style = getComputedStyle(el);
  const parsed = parseFloat(style.lineHeight);
  return isFinite(parsed) ? parsed : parseFloat(style.fontSize) * 1.2;
}

/** Source JS à injecter avant le chargement de la page. */
export const LAYOUT_PROBE_SOURCE = `window.__lc = Object.assign(window.__lc || {}, {
  isIntentionalOverlay: ${isIntentionalOverlay},
  blockOwner: ${blockOwner},
  lineHeightOf: ${lineHeightOf}
});`;
