#!/usr/bin/env bun
/**
 * layout-check.ts — DETERMINISTIC layout check (CLI entry point).
 *
 * Usage:
 *   bun run layout-check.ts <url-or-path> [options]
 *
 * Options:
 *   --widths 360,768,1280     widths tested (default: 360,390,768,1024,1280,1440)
 *   --height 900              viewport height
 *   --exclude "sel,sel"       selectors excluded from every check
 *   --checks "overlap,contrast"  enabled families
 *   --cta "<selector>"        CTA selector (cta-wrap check)
 *   --allow-overlays false    stop treating absolute/z-index as intentional
 *   --contrast 4.5 --contrast-large 3 --cta-factor 1.6 --overlap-ratio 0.1
 *   --config path.json        partial JSON config (merged under the flags)
 *   --out report.json         also writes the JSON to a file
 *   --quiet                   writes nothing to stderr
 *
 * Output: JSON on stdout. Exit code 0 = pass, 1 = violations, 2 = error.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { applyFlags, DEFAULT_CONFIG, mergeConfig, parseFlags } from "./config";
import { runLayoutCheck } from "./runner";
import { formatSummary } from "./report";
import type { LayoutCheckConfig } from "./types";

/** Builds the effective configuration: defaults → `--config` file → flags. */
function resolveConfig(flags: Record<string, string>): LayoutCheckConfig {
  let config = DEFAULT_CONFIG;
  if (flags.config) {
    const patch = JSON.parse(readFileSync(flags.config, "utf8")) as Partial<LayoutCheckConfig>;
    config = mergeConfig(config, patch);
  }
  return applyFlags(config, flags);
}

const argv = process.argv.slice(2);
// The target is ALWAYS the first argument: no ambiguity with boolean flags.
const target = argv[0] && !argv[0].startsWith("--") ? argv[0] : "";

if (!target) {
  console.error("Usage: bun run layout-check.ts <url-or-path> [--widths 360,1280] [--out report.json]");
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
  console.error(`Error: ${(error as Error).message}`);
  process.exit(2);
}
