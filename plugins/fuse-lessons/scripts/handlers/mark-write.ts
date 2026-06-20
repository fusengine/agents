/**
 * mark-write.ts - PostToolUse hook for fuse-lessons.
 * The project root is derived from the EDITED file (not the cwd), so a single
 * session can feed lessons into several projects. Three cases:
 *  - file IS <its-root>/MEMORY/LESSON.md → bump that root's lastRemindedAt.
 *  - file is source code under a real project root → bump lastCodeEditAt and
 *    register the root in the global registry.
 *  - no project root / non-code / outside any project → no-op.
 * Non-fatal by design: any error exits 0 without blocking the session.
 */
import { dirname, resolve } from "node:path";
import { findRootOrNull, isCodeFile, readInput } from "../lib/hook-io";
import { addRoot } from "../lib/registry";
import { setStateField, stateFileFor } from "../lib/throttle";

/** Main hook handler: record the relevant timestamp for the edited file. */
async function main(): Promise<void> {
  const input = await readInput();
  const filePath = input.tool_input?.file_path;
  if (!filePath) return;

  const abs = resolve(filePath); // file_path is absolute for Write/Edit
  const root = findRootOrNull(dirname(abs)); // root OF the edited file
  if (!root) return; // no .git/package.json above → no-op

  const now = Date.now();
  const stateFile = stateFileFor(root);

  if (abs === resolve(root, "MEMORY", "LESSON.md")) {
    setStateField(stateFile, "lastRemindedAt", now); // lessons written → silence
  } else if (isCodeFile(abs)) {
    setStateField(stateFile, "lastCodeEditAt", now); // project code → arm reminder
    addRoot(root); // remember this project for the Stop hook
  }
}

main().catch(() => {});
