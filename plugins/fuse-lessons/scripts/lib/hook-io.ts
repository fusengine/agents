/**
 * hook-io.ts - Shared stdin + project-root helpers for fuse-lessons hooks.
 * Used by inject-memory.ts and remind-write.ts to stay DRY.
 */
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";

/** Hook payload received on stdin (only the fields we use). */
export interface HookInput {
  cwd?: string;
  hook_event_name?: string;
  tool_input?: { file_path?: string };
}

/** Source-code file extensions worth tracking as "code was written". */
const CODE_EXT =
  /\.(ts|tsx|js|jsx|py|php|swift|go|rs|rb|java|vue|svelte|astro|css|kt|dart|cpp|c)$/;
/** Generated/vendored directories that must never count as code edits. */
const SKIP_DIRS = /(node_modules|vendor|dist|build|\.next|DerivedData|\.git)/;

/**
 * Tell whether a path is a source-code file worth tracking.
 * @param p - File path (absolute or relative).
 * @returns True for code files outside generated/vendored dirs.
 */
export function isCodeFile(p: string): boolean {
  return CODE_EXT.test(p) && !SKIP_DIRS.test(p);
}

/**
 * Walk up from a directory to the first ancestor containing `marker`.
 * @param dir - Absolute directory to start from.
 * @param marker - Filesystem entry (file or dir) that flags a root.
 * @returns Absolute path of the matching ancestor, or null if none.
 */
function walkUpFor(dir: string, marker: string): string | null {
  let current = resolve(dir);
  while (current !== "/") {
    if (existsSync(`${current}/${marker}`)) return current;
    current = dirname(current);
  }
  return null;
}

/**
 * Resolve the project root for a directory, preferring the repo boundary.
 * Pass 1 returns the nearest ancestor holding `.git` (repo or submodule root);
 * only when no `.git` exists anywhere above does pass 2 fall back to the
 * nearest `package.json` — this avoids nested `package.json` files (scripts/,
 * statusline/, …) being mistaken for roots inside a monorepo.
 * @param dir - Absolute directory to start from.
 * @returns Absolute project root path, or null if no marker is reached.
 */
export function findRootOrNull(dir: string): string | null {
  return walkUpFor(dir, ".git") ?? walkUpFor(dir, "package.json");
}

/**
 * Walk up from a directory until a project marker, with a cwd fallback.
 * @param dir - Absolute directory to start from.
 * @returns Absolute project root path, or process.cwd() as a fallback.
 */
export function findProjectRoot(dir: string): string {
  return findRootOrNull(dir) ?? process.cwd();
}

/**
 * Read the full stdin payload and parse it as JSON.
 * @returns Parsed hook input, or an empty object on empty/invalid input.
 */
export async function readInput(): Promise<HookInput> {
  const text = await Bun.stdin.text();
  if (!text.trim()) return {};
  try {
    const parsed: unknown = JSON.parse(text);
    if (typeof parsed !== "object" || parsed === null) return {};
    return parsed as HookInput;
  } catch {
    return {};
  }
}
