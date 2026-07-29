#!/usr/bin/env bun
/**
 * layout-check.ts — Contrôle de mise en page DÉTERMINISTE (point d'entrée CLI).
 *
 * Usage :
 *   bun run layout-check.ts <url-ou-chemin> [options]
 *
 * Options :
 *   --widths 360,768,1280     largeurs testées (défaut : 360,390,768,1024,1280,1440)
 *   --height 900              hauteur de viewport
 *   --exclude "sel,sel"       sélecteurs exclus de tous les contrôles
 *   --checks "overlap,contrast"  familles activées
 *   --cta "<sélecteur>"       sélecteur des CTA (contrôle cta-wrap)
 *   --allow-overlays false    ne plus considérer absolute/z-index comme volontaire
 *   --contrast 4.5 --contrast-large 3 --cta-factor 1.6 --overlap-ratio 0.1
 *   --config chemin.json      config JSON partielle (fusionnée sous les drapeaux)
 *   --out rapport.json        écrit aussi le JSON dans un fichier
 *   --quiet                   n'écrit rien sur stderr
 *
 * Sortie : JSON sur stdout. Code de sortie 0 = conforme, 1 = violations, 2 = erreur.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { applyFlags, DEFAULT_CONFIG, mergeConfig, parseFlags } from "./config";
import { runLayoutCheck } from "./runner";
import { formatSummary } from "./report";
import type { LayoutCheckConfig } from "./types";

/** Assemble la configuration effective : défauts → fichier `--config` → drapeaux. */
function resolveConfig(flags: Record<string, string>): LayoutCheckConfig {
  let config = DEFAULT_CONFIG;
  if (flags.config) {
    const patch = JSON.parse(readFileSync(flags.config, "utf8")) as Partial<LayoutCheckConfig>;
    config = mergeConfig(config, patch);
  }
  return applyFlags(config, flags);
}

const argv = process.argv.slice(2);
// La cible est TOUJOURS le premier argument : aucune ambiguïté avec les drapeaux booléens.
const target = argv[0] && !argv[0].startsWith("--") ? argv[0] : "";

if (!target) {
  console.error("Usage: bun run layout-check.ts <url-ou-chemin> [--widths 360,1280] [--out rapport.json]");
  process.exit(2);
}

try {
  const flags = parseFlags(argv);
  const report = await runLayoutCheck(target, resolveConfig(flags));
  const json = JSON.stringify(report, null, 2);
  console.log(json);
  if (flags.out) writeFileSync(flags.out, json);
  if (!flags.quiet) console.error(`\n${formatSummary(report)}`);
  process.exit(report.summary.pass ? 0 : 1);
} catch (error) {
  console.error(`Erreur : ${(error as Error).message}`);
  process.exit(2);
}
