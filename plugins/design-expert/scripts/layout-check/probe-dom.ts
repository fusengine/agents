/**
 * probe-dom.ts — Helpers DOM injectés dans la page (namespace `window.__lc`).
 * Les fonctions sont écrites en TypeScript puis sérialisées via `toString()` :
 * elles ne doivent référencer AUCUNE variable de module, seulement `window.__lc`.
 */
declare global {
  interface Window {
    __lc: any;
  }
}

/** Sélecteur CSS court et lisible identifiant un élément (4 niveaux max). */
function cssPath(el: Element): string {
  if (!el || el.nodeType !== 1) return "";
  if (el.id) return "#" + el.id;
  const parts: string[] = [];
  let node: Element | null = el;
  let depth = 0;
  while (node && node.nodeType === 1 && depth < 4) {
    const current: Element = node;
    let part = current.tagName.toLowerCase();
    const cls = (current.getAttribute("class") || "").trim().split(/\s+/).filter(Boolean).slice(0, 2);
    if (cls.length) part += "." + cls.join(".");
    const parent: Element | null = current.parentElement;
    if (parent) {
      const same = Array.prototype.filter.call(parent.children, (c: Element) => c.tagName === current.tagName);
      if (same.length > 1) part += ":nth-of-type(" + (same.indexOf(current) + 1) + ")";
    }
    parts.unshift(current.id ? "#" + current.id : part);
    if (current.id) break;
    node = parent;
    depth++;
  }
  return parts.join(" > ");
}

/** Visible au rendu : boîte non nulle, et aucun ancêtre display/visibility/opacity masquant. */
function isVisible(el: Element): boolean {
  const r = el.getBoundingClientRect();
  // Une boîte de 1px ne montre aucun texte : c'est le motif `sr-only`
  // (`position:absolute; width:1px; height:1px; clip-path: inset(50%)`),
  // réservé aux lecteurs d'écran et hors périmètre d'un contrôle visuel.
  if (r.width <= 1 || r.height <= 1) return false;
  const own = getComputedStyle(el);
  if (own.clipPath && own.clipPath !== "none" && own.clipPath.indexOf("inset(50%") === 0) return false;
  let node: Element | null = el;
  while (node && node.nodeType === 1) {
    const s = getComputedStyle(node);
    if (s.display === "none" || s.visibility === "hidden" || Number(s.opacity) <= 0.05) return false;
    node = node.parentElement;
  }
  return true;
}

/** Texte porté DIRECTEMENT par l'élément (pas celui de ses descendants), normalisé. */
function ownText(el: Element): string {
  let text = "";
  const nodes = el.childNodes;
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    if (n && n.nodeType === 3) text += n.textContent || "";
  }
  return text.replace(/\s+/g, " ").trim();
}

/** L'élément (ou un ancêtre) correspond à un sélecteur d'exclusion. */
function isExcluded(el: Element, selectors: string[]): boolean {
  for (let i = 0; i < selectors.length; i++) {
    try {
      if (el.matches(selectors[i] as string) || el.closest(selectors[i] as string)) return true;
    } catch {
      /* sélecteur invalide fourni par l'utilisateur : ignoré */
    }
  }
  return false;
}

/** Tous les éléments visibles non exclus de la page. */
function candidates(exclude: string[]): Element[] {
  const all = Array.prototype.slice.call(document.querySelectorAll("*")) as Element[];
  return all.filter((el) => window.__lc.isVisible(el) && !window.__lc.isExcluded(el, exclude));
}

/** Source JS à injecter avant le chargement de la page. */
export const DOM_PROBE_SOURCE = `window.__lc = Object.assign(window.__lc || {}, {
  cssPath: ${cssPath},
  isVisible: ${isVisible},
  ownText: ${ownText},
  isExcluded: ${isExcluded},
  candidates: ${candidates}
});`;
