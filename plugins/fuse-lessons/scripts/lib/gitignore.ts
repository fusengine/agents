/**
 * gitignore.ts - Auto-maintain <project>/MEMORY/.gitignore for fuse-lessons.
 * Guarantees the machine-local throttle counter `state.json` is never committed,
 * while keeping the committed `LESSON.md` tracked. All helpers are non-throwing.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";

/** Ignore rule that must always be present in MEMORY/.gitignore. */
const STATE_RULE = "state.json";

/** Full default body when the file does not exist yet. */
const DEFAULT_BODY =
  "# fuse-lessons: machine-local throttle counter — never commit. LESSON.md IS committed.\n" +
  `${STATE_RULE}\n`;

/**
 * Ensure `<memoryDir>/.gitignore` exists and ignores `state.json` (idempotent).
 * Creates it with the default body if absent; appends the rule once if present
 * but missing it. Never throws — gitignore upkeep must not break the hook.
 * @param memoryDir - Absolute path to the project's MEMORY/ directory.
 */
export function ensureMemoryGitignore(memoryDir: string): void {
  try {
    const file = `${memoryDir}/.gitignore`;
    if (!existsSync(file)) {
      writeFileSync(file, DEFAULT_BODY, "utf8");
      return;
    }
    const current = readFileSync(file, "utf8");
    if (current.split("\n").some((line) => line.trim() === STATE_RULE)) return;
    const prefix = current.length > 0 && !current.endsWith("\n") ? "\n" : "";
    writeFileSync(file, `${current}${prefix}${STATE_RULE}\n`, "utf8");
  } catch {
    // Non-fatal: failing to write .gitignore must never block state persistence.
  }
}
