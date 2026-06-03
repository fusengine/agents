#!/usr/bin/env bun
/**
 * analyze-keywords.ts — SEO Content Intelligence CLI (local-first, zero third-party API).
 * Usage: bun analyze-keywords.ts <url-or-path> --keyword "main keyword" [--synonyms a,b] [--locations c1,c2] [--brand name] [--allow-brand-title] [--format json|markdown]
 */
import { type CliOptions, type OutputFormat } from "./lib/content-intel-types";
import { buildReport, markdown } from "./lib/content-intel-report";

function requireValue(argv: string[], index: number, flag: string): string {
  const value = argv[index];
  if (!value || value.startsWith("--")) throw new Error(`Missing value for ${flag}`);
  return value;
}

function parseFormat(value: string): OutputFormat {
  if (value !== "json" && value !== "markdown") throw new Error("--format must be json or markdown");
  return value;
}

function splitList(value: string): string[] {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

/** Parse argv into typed CLI options. Throws on missing input/keyword. */
function parseArgs(argv: string[]): CliOptions {
  const opts: CliOptions = { input: "", keyword: "", synonyms: [], locations: [], brand: null, allowBrandTitle: false, format: "json" };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--") && !opts.input) { opts.input = arg; continue; }
    if (arg === "--allow-brand-title") opts.allowBrandTitle = true;
    else if (arg === "--keyword" || arg === "--primary") opts.keyword = requireValue(argv, ++i, arg);
    else if (arg === "--synonyms") opts.synonyms = splitList(requireValue(argv, ++i, arg));
    else if (arg === "--locations") opts.locations = splitList(requireValue(argv, ++i, arg));
    else if (arg === "--brand") opts.brand = requireValue(argv, ++i, arg);
    else if (arg === "--format") opts.format = parseFormat(requireValue(argv, ++i, arg));
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (!opts.input) throw new Error("Missing input URL or local file path");
  if (!opts.keyword) throw new Error("Missing required --keyword");
  return opts;
}

const usage = "Usage: bun analyze-keywords.ts <url-or-path> --keyword <keyword> [--synonyms a,b] [--locations city1,city2] [--brand name] [--allow-brand-title] [--format json|markdown]";

try {
  const opts = parseArgs(process.argv.slice(2));
  const report = await buildReport(opts);
  console.log(opts.format === "markdown" ? markdown(report) : JSON.stringify(report, null, 2));
} catch (e) {
  console.error(`Error: ${(e as Error).message}`);
  console.error(usage);
  process.exit(1);
}
