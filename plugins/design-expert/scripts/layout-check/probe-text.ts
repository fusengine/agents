/**
 * probe-text.ts — Measures the text INK, injected into the page (`window.__lc`).
 *
 * Why `scrollWidth` alone is not enough: measured in Chromium, on a
 * `width:90px; white-space:nowrap; overflow:visible` box, `scrollWidth −
 * clientWidth` is **13** while the ink overflows by **21px**; and on an
 * overflow toward the START (`direction:rtl`, negative `text-indent`) it is
 * **0** while the ink overflows by **40px**. The scrollable overflow region
 * ignores the start side — text leaving on the left is invisible to it.
 */

/**
 * Distinct y-coordinates of the line boxes taken by the element's TEXT.
 * Only text nodes are measured: an icon placed above the label
 * (hamburger button "bars + Menu") therefore does not count as a second line.
 *
 * @param el - Element whose text lines are counted
 * @returns The rounded `top` values, one per line actually taken
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
 * Overflow of the element's OWN text ink outside its content box.
 * Only DIRECT child text nodes are measured: the text of a positioned
 * descendant legitimately leaves its ancestor's box, that is not a defect.
 *
 * @param el - Text-bearing element
 * @returns Overflow in px on each side (negative = remaining margin), or `null`
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

/** JS source to inject before the page loads. */
export const TEXT_PROBE_SOURCE = `window.__lc = Object.assign(window.__lc || {}, {
  textLineTops: ${textLineTops},
  ownTextInk: ${ownTextInk}
});`;
