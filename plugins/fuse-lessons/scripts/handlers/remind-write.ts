/**
 * remind-write.ts - Stop hook for fuse-lessons (anti-nag, multi-project).
 * Walks the global root registry and reminds (via `additionalContext`) to
 * append/sharpen compact lessons for EVERY project that has unsaved code edits.
 * Per project, skip when throttled OR when no code was written since the last
 * reminder. Emits a single reminder listing each pending project's LESSON.md.
 * Non-fatal by design: any error exits 0 without blocking.
 */
import { readInput } from "../lib/hook-io";
import { readRoots } from "../lib/registry";
import { nowStamp, readState, setStateField, stateFileFor, throttleMs } from "../lib/throttle";

/** Select roots with unsaved code edits past the throttle, bumping their state. */
function collectPending(now: number, window: number): string[] {
  const pending: string[] = [];
  for (const root of readRoots()) {
    const stateFile = stateFileFor(root);
    const { lastRemindedAt, lastCodeEditAt } = readState(stateFile);
    if (lastCodeEditAt <= lastRemindedAt) continue; // nothing new to learn
    if (now - lastRemindedAt < window) continue; // recently reminded
    pending.push(root);
    setStateField(stateFile, "lastRemindedAt", now);
  }
  return pending;
}

/** Main hook handler: emit one reminder covering all pending projects. */
async function main(): Promise<void> {
  await readInput();
  const pending = collectPending(Date.now(), throttleMs());
  if (pending.length === 0) return; // nothing to remind → silence

  const stamp = nowStamp();
  const targets = pending.map((r) => `- ${r}/MEMORY/LESSON.md`).join("\n");
  const additionalContext =
    `Before ending: if this session hit a mistake/blocker worth never ` +
    `reproducing, append 1-3 COMPACT bullets OR sharpen/merge existing ones ` +
    `(format \`- [${stamp}] what went wrong → do instead\`, use exactly this ` +
    `timestamp) in each project's lessons file below. Skip if nothing ` +
    `notable.\n${targets}`;

  console.log(JSON.stringify({
    hookSpecificOutput: { hookEventName: "Stop", additionalContext },
  }));
}

main().catch(() => {});
