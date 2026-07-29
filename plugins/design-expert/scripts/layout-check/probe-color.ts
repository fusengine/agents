/**
 * probe-color.ts — Helpers couleur injectés dans la page (namespace `window.__lc`).
 * Les couleurs sont résolues en sRGB par le navigateur lui-même (canvas 1×1) :
 * cela couvre `oklch()`, `color-mix()`, `lab()`, les variables CSS et l'alpha,
 * là où un parsing de chaîne `rgb(...)` échouerait.
 */

/** Résout n'importe quelle couleur CSS calculée en `[r, g, b, a]` sRGB. */
function resolveRgba(css: string): number[] {
  const cache = (window.__lc.colorCache = window.__lc.colorCache || {});
  if (cache[css]) return cache[css];
  if (!css || css === "transparent" || css === "none") return (cache[css] = [0, 0, 0, 0]);
  const canvas = (window.__lc.canvas = window.__lc.canvas || document.createElement("canvas"));
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.globalCompositeOperation = "copy";
  ctx.fillStyle = "rgba(0,0,0,0)";
  ctx.fillStyle = css;
  ctx.fillRect(0, 0, 1, 1);
  const d = ctx.getImageData(0, 0, 1, 1).data;
  return (cache[css] = [d[0], d[1], d[2], d[3] / 255]);
}

/** Compose une couleur semi-transparente sur un fond opaque. */
function blend(fg: number[], bg: number[]): number[] {
  const a = fg[3] as number;
  return [
    (fg[0] as number) * a + (bg[0] as number) * (1 - a),
    (fg[1] as number) * a + (bg[1] as number) * (1 - a),
    (fg[2] as number) * a + (bg[2] as number) * (1 - a),
    1,
  ];
}

/** Luminance relative WCAG 2.x d'une couleur sRGB. */
function luminance(rgb: number[]): number {
  const chan = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * chan(rgb[0] as number) + 0.7152 * chan(rgb[1] as number) + 0.0722 * chan(rgb[2] as number);
}

/** Ratio de contraste WCAG entre deux couleurs opaques (1 → 21). */
function contrastRatio(a: number[], b: number[]): number {
  const la = window.__lc.luminance(a);
  const lb = window.__lc.luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/**
 * Fond effectif derrière un élément : remonte les ancêtres tant que le fond
 * est transparent, compose les couches, et signale le premier `background-image`
 * rencontré (dégradé/image : le fond n'est alors pas résoluble en une couleur).
 */
function effectiveBackground(el: Element): { rgb: number[]; image: string | null } {
  const layers: number[][] = [];
  let node: Element | null = el;
  let image: string | null = null;
  while (node && node.nodeType === 1) {
    const s = getComputedStyle(node);
    if (!image && s.backgroundImage && s.backgroundImage !== "none") image = window.__lc.cssPath(node);
    const color = window.__lc.resolveRgba(s.backgroundColor);
    if ((color[3] as number) > 0) {
      layers.push(color);
      if ((color[3] as number) >= 0.999) break;
    }
    node = node.parentElement;
  }
  const last = layers[layers.length - 1];
  if (!last || (last[3] as number) < 0.999) layers.push([255, 255, 255, 1]);
  let out = layers[layers.length - 1] as number[];
  for (let i = layers.length - 2; i >= 0; i--) out = window.__lc.blend(layers[i] as number[], out);
  return { rgb: out, image };
}

/** Source JS à injecter avant le chargement de la page. */
export const COLOR_PROBE_SOURCE = `window.__lc = Object.assign(window.__lc || {}, {
  resolveRgba: ${resolveRgba},
  blend: ${blend},
  luminance: ${luminance},
  contrastRatio: ${contrastRatio},
  effectiveBackground: ${effectiveBackground}
});`;
