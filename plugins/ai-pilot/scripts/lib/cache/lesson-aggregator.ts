/**
 * Lesson aggregation and deduplication helpers.
 * Handles loading, merging, and deduplicating lesson entries from cache files.
 */
import { readJsonFile, cacheBaseDir } from "../core";
import type { LessonEntry } from "../interfaces/cache.interface";
import { existsSync, readdirSync } from "node:fs";

/** Deduplicate lessons by error_type+pattern, summing counts. */
export function dedupLessons(lessons: LessonEntry[]): LessonEntry[] {
  const groups = new Map<string, LessonEntry[]>();
  for (const l of lessons) {
    const key = `${l.error_type}:${l.pattern}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(l);
  }
  return [...groups.values()].map((entries) => {
    const first = entries[0]!;
    return {
      error_type: first.error_type,
      pattern: first.pattern,
      fix: first.fix,
      last_seen: first.last_seen,
      count: entries.reduce((s, e) => s + e.count, 0),
      files: [...new Set(entries.flatMap((e) => e.files))],
      code: { line: [...new Set(entries.flatMap((e) => e.code?.line ?? []))].slice(0, 5) },
    };
  }).sort((a, b) => b.count - a.count);
}

/** Aggregate all local lesson JSON files into a flat deduplicated list. */
export async function aggregateLocalLessons(cacheDir: string): Promise<LessonEntry[]> {
  if (!existsSync(cacheDir)) return [];
  const files = readdirSync(cacheDir).filter((f) => f.endsWith(".json"));
  const all: LessonEntry[] = [];
  for (const f of files) {
    const data = await readJsonFile<{ errors?: LessonEntry[] }>(`${cacheDir}/${f}`);
    if (data?.errors) all.push(...data.errors);
  }
  return dedupLessons(all);
}

/** Load global lessons for a given stack (stack-specific + universal). */
export async function loadGlobalLessons(stack: string): Promise<LessonEntry[]> {
  const globalDir = `${cacheBaseDir()}/lessons/_global`;
  const result: LessonEntry[] = [];
  for (const name of [`${stack}.json`, "universal.json"]) {
    const data = await readJsonFile<LessonEntry[]>(`${globalDir}/${name}`);
    if (data) result.push(...data);
  }
  return result;
}

/** Merge local + global lessons, dedup by type+pattern, sort by count desc. */
export function mergeLessons(local: LessonEntry[], global: LessonEntry[]): LessonEntry[] {
  return dedupLessons([...local, ...global]);
}
