/**
 * cache-sniper-lessons.ts - SubagentStop hook for sniper.
 * Captures error patterns + corrected code from sniper transcript as lessons.
 * Primary source: Edit tool_use entries. Secondary: text report.
 */
import { readStdin, projectHash, cacheBaseDir, ensureDir, writeJsonFile } from "./lib/core";
import { logCacheEvent } from "./lib/analytics";
import type { HookInput } from "./lib/interfaces/hook.interface";
import type { LessonEntry } from "./lib/interfaces/cache.interface";
import { detectStack, extractEdits, categorizeEdit, extractReport } from "./lib/cache/lesson-helpers";
import { detectProjectFromPaths } from "./lib/cache/project-detect";

/** Main entry: extract lessons from sniper transcript and save. */
async function main(): Promise<void> {
  const input = (await readStdin()) as HookInput;
  const agentType = input.agent_type ?? "";
  if (!agentType.includes("sniper")) return;

  const transcript = input.agent_transcript_path ?? "";
  if (!transcript) return;
  const file = Bun.file(transcript);
  if (!(await file.exists())) return;

  const edits = await extractEdits(transcript);
  if (edits.length === 0) return;

  const editPaths = edits.map((e) => e.file);
  const projectPath = detectProjectFromPaths(editPaths) ?? process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
  const pHash = projectHash(projectPath);
  const cacheDir = `${cacheBaseDir()}/lessons/${pHash}`;
  await ensureDir(cacheDir);

  const report = await extractReport(transcript);
  const timestamp = new Date().toISOString();

  const errors: LessonEntry[] = edits.map((edit) => {
    const basename = edit.file.split("/").pop() ?? edit.file;
    const descLine = report.split("\n").find((l) => l.toLowerCase().includes(basename.toLowerCase()));
    const errorType = categorizeEdit(edit);
    return {
      error_type: errorType,
      pattern: descLine ?? `Code correction in ${basename}`,
      fix: `Fix ${errorType} in ${basename}`,
      count: 1,
      last_seen: timestamp,
      files: [edit.file],
      code: { line: (edit.newStr ?? "").split("\n").filter(Boolean).slice(0, 10) },
    };
  });

  const safeName = timestamp.replace(/:/g, "-");
  await writeJsonFile(`${cacheDir}/${safeName}.json`, { project: projectPath, timestamp, errors }, true);

  const stack = detectStack(projectPath);
  const scriptDir = import.meta.dir;
  Bun.spawn(["bun", `${scriptDir}/promote-global-lessons.ts`, cacheDir, stack, pHash], {
    stdout: "ignore",
    stderr: "ignore",
  });

  await logCacheEvent("lessons", "hit", pHash, { count: edits.length });
}

main().catch(() => {});
