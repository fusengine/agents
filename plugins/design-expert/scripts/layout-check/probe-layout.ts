/**
 * probe-layout.ts — Layout helpers injected into the page (`window.__lc`).
 * Shared by the `overlap` and `cta-wrap` checks (DRY): serialized via
 * `toString()`, they reference only their argument and `window.__lc`.
 */

/**
 * INTENTIONAL overlap: the element or one of its first 6 ancestors is out of
 * flow, carries an explicit non-zero z-index, or is not clickable (decorative layer).
 *
 * @param el - Candidate element
 * @returns `true` if the overlap is deliberate
 */
function isIntentionalOverlay(el: Element): boolean {
  let node: Element | null = el;
  for (let depth = 0; node && depth < 6; depth++) {
    const s = getComputedStyle(node);
    if (s.position === "absolute" || s.position === "fixed" || s.position === "sticky") return true;
    if (s.zIndex !== "auto" && Number(s.zIndex) !== 0) return true;
    if (s.pointerEvents === "none") return true;
    // An explicit `transform` is an AUTHOR displacement (composition of rotated
    // images, scene offset): the resulting overlap is intended.
    if (s.transform && s.transform !== "none") return true;
    node = node.parentElement;
  }
  return false;
}

/**
 * Nearest block container.
 *
 * @param el - Element whose line context is sought
 * @returns The nearest block ancestor, `document.body` otherwise
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
 * Computed line-height, in px.
 *
 * @param el - Measured element
 * @returns The numeric value, or 1.2 × font-size if `line-height: normal`
 */
function lineHeightOf(el: Element): number {
  const style = getComputedStyle(el);
  const parsed = parseFloat(style.lineHeight);
  return isFinite(parsed) ? parsed : parseFloat(style.fontSize) * 1.2;
}

/** JS source to inject before the page loads. */
export const LAYOUT_PROBE_SOURCE = `window.__lc = Object.assign(window.__lc || {}, {
  isIntentionalOverlay: ${isIntentionalOverlay},
  blockOwner: ${blockOwner},
  lineHeightOf: ${lineHeightOf}
});`;
