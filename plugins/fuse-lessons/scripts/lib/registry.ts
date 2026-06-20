/**
 * registry.ts - Global registry of project roots touched by code edits.
 * Persists a deduplicated JSON array of absolute roots in
 * `${HOME}/.claude/fusengine-cache/lessons/roots.json`, so the Stop hook can
 * remind across EVERY project edited during a session, not just the cwd.
 * All helpers are non-throwing (memory must never block a session).
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

/**
 * Absolute path of the global roots registry, or null when HOME is unusable.
 * @returns Path to roots.json, or null if $HOME is empty/relative.
 */
export function registryFile(): string | null {
  const home = process.env.HOME?.trim();
  if (!home || !home.startsWith("/")) return null;
  return `${home}/.claude/fusengine-cache/lessons/roots.json`;
}

/**
 * Read the registered project roots (deduplicated string entries only).
 * @returns Absolute roots array, or [] if absent/corrupt/HOME-less.
 */
export function readRoots(): string[] {
  const file = registryFile();
  if (!file) return [];
  try {
    const parsed: unknown = JSON.parse(readFileSync(file, "utf8"));
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((e): e is string => typeof e === "string");
  } catch {
    return [];
  }
}

/**
 * Register a project root once (deduplicated, read-modify-write).
 * @param root - Absolute project root to record.
 */
export function addRoot(root: string): void {
  const file = registryFile();
  if (!file) return;
  try {
    const roots = new Set(readRoots());
    if (roots.has(root)) return; // already tracked → no write
    roots.add(root);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, JSON.stringify([...roots]));
  } catch {
    /* non-fatal: a missed root never blocks the session */
  }
}
