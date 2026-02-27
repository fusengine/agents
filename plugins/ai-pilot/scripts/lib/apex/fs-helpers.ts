/**
 * Filesystem helpers for APEX hooks.
 * Project root detection via directory traversal.
 */
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";

/**
 * Find the project root by walking up from a directory.
 * @param dir - Absolute directory path to start from
 * @returns Absolute path to the project root (contains package.json or .git)
 */
export function findProjectRoot(dir: string): string {
  let current = resolve(dir);
  while (current !== "/") {
    if (existsSync(`${current}/package.json`) || existsSync(`${current}/.git`)) return current;
    current = dirname(current);
  }
  return process.cwd();
}
