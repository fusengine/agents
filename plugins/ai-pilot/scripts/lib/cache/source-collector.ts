/**
 * source-collector.ts - Shared utilities for scanning source files in projects.
 * Supports monorepos (apps/*, packages/*) with configurable patterns and limits.
 */
import { Glob } from "bun";

/** Source file patterns for monorepo support. Separate patterns avoid Bun.Glob wildcards-in-braces limitation. */
export const SRC_PATTERNS = [
  "src/**/*.{ts,tsx,js,jsx}",
  "app/**/*.{ts,tsx,js,jsx}",
  "apps/*/src/**/*.{ts,tsx,js,jsx}",
  "packages/*/src/**/*.{ts,tsx,js,jsx}",
] as const;

/**
 * Scan source files in project (supports monorepos).
 *
 * @param projectPath - Absolute path to project root
 * @param maxFiles - Maximum files to collect (default 200)
 * @returns Array of absolute file paths matching SRC_PATTERNS
 */
export async function collectSourceFiles(projectPath: string, maxFiles = 200): Promise<string[]> {
  const files: string[] = [];
  for (const pattern of SRC_PATTERNS) {
    const glob = new Glob(pattern);
    try {
      for await (const p of glob.scan({ cwd: projectPath, absolute: true })) {
        if (p.includes("node_modules")) continue;
        files.push(p);
        if (files.length >= maxFiles) break;
      }
    } catch { /* dir may not exist */ }
    if (files.length >= maxFiles) break;
  }
  return files;
}
