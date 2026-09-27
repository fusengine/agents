/**
 * probe-dom.ts — DOM helpers injected into the page (namespace `window.__lc`).
 * The functions are written in TypeScript then serialized via `toString()`:
 * they must reference NO module variable, only `window.__lc`.
 */
declare global {
  interface Window {
    __lc: any;
  }
}

/** Short, readable CSS selector identifying an element (4 levels max). */
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

/** Visible when rendered: non-zero box, and no hiding display/visibility/opacity ancestor. */
function isVisible(el: Element): boolean {
  const r = el.getBoundingClientRect();
  // A 1px box shows no text: this is the `sr-only` pattern
  // (`position:absolute; width:1px; height:1px; clip-path: inset(50%)`),
  // reserved for screen readers and outside the scope of a visual check.
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

/** Text carried DIRECTLY by the element (not its descendants'), normalized. */
function ownText(el: Element): string {
  let text = "";
  const nodes = el.childNodes;
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    if (n && n.nodeType === 3) text += n.textContent || "";
  }
  return text.replace(/\s+/g, " ").trim();
}

/** The element (or an ancestor) matches an exclusion selector. */
function isExcluded(el: Element, selectors: string[]): boolean {
  for (let i = 0; i < selectors.length; i++) {
    try {
      if (el.matches(selectors[i] as string) || el.closest(selectors[i] as string)) return true;
    } catch {
      /* invalid selector supplied by the user: ignored */
    }
  }
  return false;
}

/** Every visible, non-excluded element of the page. */
function candidates(exclude: string[]): Element[] {
  const all = Array.prototype.slice.call(document.querySelectorAll("*")) as Element[];
  return all.filter((el) => window.__lc.isVisible(el) && !window.__lc.isExcluded(el, exclude));
}

/** JS source to inject before the page loads. */
export const DOM_PROBE_SOURCE = `window.__lc = Object.assign(window.__lc || {}, {
  cssPath: ${cssPath},
  isVisible: ${isVisible},
  ownText: ${ownText},
  isExcluded: ${isExcluded},
  candidates: ${candidates}
});`;
