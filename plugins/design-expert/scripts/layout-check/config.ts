/**
 * config.ts — Valeurs par défaut + fusion (fichier de config, drapeaux CLI).
 * Le script doit tourner sans aucune configuration : tout a un défaut raisonnable.
 */
import type { LayoutCheckConfig, ViolationType } from "./types";

/** Configuration par défaut : largeurs mobiles → desktop, seuils WCAG AA. */
export const DEFAULT_CONFIG: LayoutCheckConfig = {
  widths: [360, 390, 768, 1024, 1280, 1440],
  height: 900,
  exclude: ["script", "style", "noscript", "svg *", "[aria-hidden='true']"],
  ctaSelector:
    "button, [role='button'], a.btn, a.button, a.cta, a[class*='btn'], a[class*='button'], a[class*='cta']",
  ignoreIntentionalOverlap: true,
  overlapMaxElements: 400,
  reducedMotion: true,
  warmup: false,
  checks: ["text-overflow", "overlap", "cta-wrap", "contrast", "document-overflow"],
  thresholds: {
    overflowTolerance: 1,
    inkTolerance: 2,
    documentOverflowTolerance: 1,
    overlapMinPx: 2,
    overlapMinRatio: 0.1,
    ctaLineFactor: 1.6,
    contrastNormal: 4.5,
    contrastLarge: 3,
  },
};

/** Découpe une liste séparée par des virgules en tableau nettoyé. */
function splitList(value: string): string[] {
  return value.split(",").map((v) => v.trim()).filter(Boolean);
}

/** Applique un fichier de config JSON partiel par-dessus les défauts. */
export function mergeConfig(
  base: LayoutCheckConfig,
  patch: Partial<LayoutCheckConfig>,
): LayoutCheckConfig {
  return {
    ...base,
    ...patch,
    thresholds: { ...base.thresholds, ...(patch.thresholds ?? {}) },
  };
}

/** Applique les drapeaux CLI (priorité maximale) sur une config déjà fusionnée. */
export function applyFlags(
  config: LayoutCheckConfig,
  flags: Record<string, string>,
): LayoutCheckConfig {
  const out = { ...config, thresholds: { ...config.thresholds } };
  if (flags.widths) out.widths = splitList(flags.widths).map(Number).filter((n) => n > 0);
  if (flags.height) out.height = Number(flags.height);
  if (flags.exclude) out.exclude = [...out.exclude, ...splitList(flags.exclude)];
  if (flags.cta) out.ctaSelector = flags.cta;
  if (flags.checks) out.checks = splitList(flags.checks) as ViolationType[];
  if (flags["max-elements"]) out.overlapMaxElements = Number(flags["max-elements"]);
  if (flags["allow-overlays"] === "false") out.ignoreIntentionalOverlap = false;
  if (flags.motion === "true" || flags.motion === "no-preference") out.reducedMotion = false;
  if (flags.warmup === "true") out.warmup = true;
  if (flags.contrast) out.thresholds.contrastNormal = Number(flags.contrast);
  if (flags["contrast-large"]) out.thresholds.contrastLarge = Number(flags["contrast-large"]);
  if (flags["cta-factor"]) out.thresholds.ctaLineFactor = Number(flags["cta-factor"]);
  if (flags["overlap-ratio"]) out.thresholds.overlapMinRatio = Number(flags["overlap-ratio"]);
  if (flags.ink) out.thresholds.inkTolerance = Number(flags.ink);
  return out;
}

/** Parse `--cle valeur` et `--drapeau` (⇒ "true") depuis argv. */
export function parseFlags(argv: string[]): Record<string, string> {
  const flags: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg?.startsWith("--")) continue;
    const [key, inline] = arg.slice(2).split("=");
    if (!key) continue;
    const next = argv[i + 1];
    if (inline !== undefined) flags[key] = inline;
    else if (next && !next.startsWith("--")) { flags[key] = next; i++; }
    else flags[key] = "true";
  }
  return flags;
}
