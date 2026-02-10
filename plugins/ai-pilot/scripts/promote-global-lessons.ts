/**
 * promote-global-lessons.ts - Promote high-frequency errors to global lessons.
 * Called by cache-sniper-lessons after saving per-project lessons.
 * Errors with count >= 3 get promoted to global stack-specific file.
 */
import { readJsonFile, writeJsonFile, ensureDir, cacheBaseDir } from "./lib/core";
import { logCacheEvent } from "./lib/analytics";
import type { LessonEntry } from "./lib/interfaces/cache.interface";
import { readdirSync } from "node:fs";

interface GlobalLesson extends LessonEntry {
  source_projects: string[];
}

const MIN_COUNT = 3;
const MAX_GLOBAL = 25;

/** Aggregate all lesson errors from project JSON files in cacheDir. */
async function aggregateErrors(cacheDir: string): Promise<LessonEntry[]> {
  let files: string[];
  try {
    files = readdirSync(cacheDir).filter((f) => f.endsWith(".json"));
  } catch {
    return [];
  }
  const all: LessonEntry[] = [];
  for (const file of files) {
    const data = await readJsonFile<{ errors?: LessonEntry[] }>(`${cacheDir}/${file}`);
    if (data?.errors) all.push(...data.errors);
  }
  return all;
}

/** Group lessons by type+pattern, return those with total count >= MIN_COUNT. */
function filterFrequent(lessons: LessonEntry[]): LessonEntry[] {
  const groups = new Map<string, LessonEntry[]>();
  for (const l of lessons) {
    const key = `${l.error_type}:${l.pattern}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(l);
  }
  const result: LessonEntry[] = [];
  for (const entries of groups.values()) {
    if (entries.length < MIN_COUNT) continue;
    const first = entries[0]!;
    const allFiles = [...new Set(entries.flatMap((e) => e.files))];
    const allCode = [...new Set(entries.flatMap((e) => e.code?.line ?? []))].slice(0, 5);
    result.push({ error_type: first.error_type, pattern: first.pattern, fix: first.fix, last_seen: first.last_seen, count: entries.length, files: allFiles, code: { line: allCode } });
  }
  return result;
}

/** Merge candidates into existing global file, dedup, cap at MAX_GLOBAL. */
function mergeGlobal(existing: GlobalLesson[], candidates: LessonEntry[], projHash: string): GlobalLesson[] {
  const tagged: GlobalLesson[] = candidates.map((c) => ({ ...c, source_projects: [projHash] }));
  const combined = [...existing, ...tagged];
  const groups = new Map<string, GlobalLesson[]>();
  for (const item of combined) {
    const key = `${item.error_type}:${item.pattern}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(item);
  }
  const merged: GlobalLesson[] = [];
  for (const entries of groups.values()) {
    const first = entries[0]!;
    merged.push({
      error_type: first.error_type,
      pattern: first.pattern,
      fix: first.fix,
      last_seen: first.last_seen,
      count: entries.reduce((sum, e) => sum + e.count, 0),
      files: [...new Set(entries.flatMap((e) => e.files))],
      code: { line: [...new Set(entries.flatMap((e) => e.code?.line ?? []))].slice(0, 5) },
      source_projects: [...new Set(entries.flatMap((e) => e.source_projects ?? []))],
    });
  }
  return merged.sort((a, b) => b.count - a.count).slice(0, MAX_GLOBAL);
}

/** Main entry: promote high-frequency lessons to global cache. */
async function main(): Promise<void> {
  const [cacheDir, stack, projHash] = Bun.argv.slice(2);
  if (!cacheDir || !stack || !projHash) return;

  const globalDir = `${cacheBaseDir()}/lessons/_global`;
  await ensureDir(globalDir);

  const allLessons = await aggregateErrors(cacheDir);
  const candidates = filterFrequent(allLessons);
  if (candidates.length === 0) return;

  const globalFile = `${globalDir}/${stack}.json`;
  const existing = (await readJsonFile<GlobalLesson[]>(globalFile)) ?? [];
  const merged = mergeGlobal(existing, candidates, projHash);

  await writeJsonFile(globalFile, merged, true);
  await logCacheEvent("lessons", "promoted", projHash, { count: merged.length, stack });
}

main().catch(() => {});
