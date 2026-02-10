#!/usr/bin/env bun
/**
 * cache-analytics-save.ts - SessionEnd hook for cache analytics aggregation
 * Aggregates hits/misses from sessions.jsonl, estimates tokens saved, updates summary.json.
 * Replaces cache-analytics-save.sh
 */
import { cacheBaseDir, ensureDir, readJsonFile, writeJsonFile } from "./lib/core";

interface SessionEntry { ts: string; type: string; action: string; session?: string }

interface Summary {
  updated: string;
  total_sessions: number;
  cache_hits: Record<string, number>;
  cache_misses: Record<string, number>;
  hit_rates: Record<string, string>;
  estimated_tokens_saved: number;
}

const TOKEN_WEIGHTS: Record<string, number> = { explore: 15000, doc: 10000, lessons: 3000, tests: 5000 };
const CATEGORIES = ["explore", "doc", "lessons", "tests"] as const;

/** Count entries matching type and action */
function countBy(entries: SessionEntry[], type: string, action: string): number {
  return entries.filter((e) => e.type === type && e.action === action).length;
}

/** Calculate hit rate percentage string */
function hitRate(hits: number, misses: number): string {
  const total = hits + misses;
  return total === 0 ? "0%" : `${Math.floor((hits * 100) / total)}%`;
}

/** Main: aggregate session data into summary */
async function main(): Promise<void> {
  const dir = `${cacheBaseDir()}/analytics`;
  const sessionsFile = `${dir}/sessions.jsonl`;
  const summaryFile = `${dir}/summary.json`;
  await ensureDir(dir);

  const file = Bun.file(sessionsFile);
  if (!(await file.exists())) process.exit(0);
  const raw = await file.text();
  if (!raw.trim()) process.exit(0);

  const entries: SessionEntry[] = raw.split("\n").filter(Boolean).map((line) => {
    try { return JSON.parse(line); } catch { return null; }
  }).filter(Boolean) as SessionEntry[];
  if (entries.length === 0) process.exit(0);

  const hits: Record<string, number> = {};
  const misses: Record<string, number> = {};
  for (const cat of CATEGORIES) {
    hits[cat] = countBy(entries, cat, "hit") + (cat === "doc" ? countBy(entries, cat, "blocked") : 0);
    misses[cat] = countBy(entries, cat, "miss");
  }

  const tokensSaved = CATEGORIES.reduce((sum, c) => sum + (hits[c] ?? 0) * (TOKEN_WEIGHTS[c] ?? 0), 0);
  const sessionCount = new Set(entries.map((e) => e.session).filter(Boolean)).size;

  const old = await readJsonFile<Summary>(summaryFile);
  const merged: Summary = {
    updated: new Date().toISOString(),
    total_sessions: (old?.total_sessions ?? 0) + sessionCount,
    cache_hits: {}, cache_misses: {}, hit_rates: {},
    estimated_tokens_saved: (old?.estimated_tokens_saved ?? 0) + tokensSaved,
  };

  for (const cat of CATEGORIES) {
    merged.cache_hits[cat] = (old?.cache_hits?.[cat] ?? 0) + (hits[cat] ?? 0);
    merged.cache_misses[cat] = (old?.cache_misses?.[cat] ?? 0) + (misses[cat] ?? 0);
    merged.hit_rates[cat] = hitRate(merged.cache_hits[cat] ?? 0, merged.cache_misses[cat] ?? 0);
  }

  await writeJsonFile(summaryFile, merged, true);

  // Cleanup entries older than 30 days
  const cutoff = new Date(Date.now() - 30 * 86400 * 1000).toISOString();
  const kept = entries.filter((e) => e.ts >= cutoff);
  await Bun.write(sessionsFile, kept.map((e) => JSON.stringify(e)).join("\n") + "\n");
}

await main();
