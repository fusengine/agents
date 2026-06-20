/**
 * inject-memory.ts - SessionStart + SubagentStart hook for fuse-lessons.
 * Reads <project-root>/MEMORY/LESSON.md and injects it into the agent context
 * via `additionalContext`, so past mistakes are never reproduced.
 * Non-fatal by design: any error exits 0 without blocking the session.
 */
import { existsSync } from "node:fs";
import { findProjectRoot, readInput } from "../lib/hook-io";

/** Main hook handler: load MEMORY/LESSON.md and emit it as additionalContext. */
async function main(): Promise<void> {
  const input = await readInput();
  const root = findProjectRoot(input.cwd ?? process.cwd());
  const lessonPath = `${root}/MEMORY/LESSON.md`;
  if (!existsSync(lessonPath)) return;

  const content = (await Bun.file(lessonPath).text()).trim();
  if (!content) return;

  const hookEventName = input.hook_event_name ?? "SessionStart";
  const additionalContext =
    `Project lessons — never reproduce these:\n${content}\n` +
    `You may append OR refine/merge/dedupe bullets in MEMORY/LESSON.md — keep it terse.`;

  console.log(JSON.stringify({
    hookSpecificOutput: { hookEventName, additionalContext },
  }));
}

main().catch(() => {});
