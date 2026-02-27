/**
 * lessons-cache-inject.ts - SubagentStart hook: inject cached lessons into ALL agents.
 * Reads project + global lessons, aggregates, deduplicates, injects known issues.
 */
import { readStdin, projectHash, cacheBaseDir, outputHookResponse } from "./lib/core";
import { logCacheEvent } from "./lib/analytics";
import type { LessonEntry } from "./lib/interfaces/cache.interface";
import { detectStack, aggregateLocalLessons, loadGlobalLessons, mergeLessons } from "./lib/cache/lesson-helpers";
import { readdirSync, statSync, unlinkSync } from "node:fs";

const MAX_AGE_MS = 30 * 86_400_000;
const MAX_LESSONS = 10;

/** Remove JSON files older than MAX_AGE_MS from cache dir. */
function pruneOldFiles(dir: string): void {
  try {
    const cutoff = Date.now() - MAX_AGE_MS;
    for (const f of readdirSync(dir).filter((n) => n.endsWith(".json"))) {
      const path = `${dir}/${f}`;
      try {
        if (statSync(path).mtimeMs < cutoff) unlinkSync(path);
      } catch { /* skip */ }
    }
  } catch { /* dir may not exist */ }
}

/** Build a readable text list of lessons with scope tags. */
function formatLessonList(lessons: LessonEntry[]): string {
  return lessons.map((l, i) => {
    const code = l.code?.line?.length ? `\n     Code: ${l.code.line.join(" | ").slice(0, 200)}` : "";
    return `${i + 1}. [${l.count}x] | ${l.pattern ?? "unknown"} -> ${l.fix ?? "see docs"}${code}`;
  }).join("\n");
}

/** Main entry: aggregate and inject lessons context. */
async function main(): Promise<void> {
  await readStdin();
  const projectPath = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
  const pHash = projectHash(projectPath);
  const cacheDir = `${cacheBaseDir()}/lessons/${pHash}`;
  const stack = detectStack(projectPath);

  pruneOldFiles(cacheDir);
  let localLessons: LessonEntry[] = [];
  try {
    localLessons = await aggregateLocalLessons(cacheDir);
  } catch { /* no local lessons */ }

  const globalLessons = await loadGlobalLessons(stack);
  if (localLessons.length === 0 && globalLessons.length === 0) {
    outputHookResponse({ systemMessage: "lessons-cache: empty", hookSpecificOutput: { hookEventName: "SubagentStart" } });
    return;
  }

  const merged = mergeLessons(localLessons, globalLessons).slice(0, MAX_LESSONS);
  if (merged.length === 0) return;

  const lessonList = formatLessonList(merged);
  await logCacheEvent("lessons", "hit", pHash, { count: merged.length, stack });

  const ctx = `## KNOWN PROJECT ISSUES (from previous sniper validations)
These errors have been found and fixed before. AVOID them:
${lessonList}

INSTRUCTION: Check your code against these known issues BEFORE submitting.`;

  outputHookResponse({
    hookSpecificOutput: { hookEventName: "SubagentStart", additionalContext: ctx },
  });
}

main().catch(() => {});
