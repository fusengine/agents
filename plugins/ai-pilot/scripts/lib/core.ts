/**
 * Core utilities for all hook scripts.
 * Uses Bun native APIs for I/O. Provides init helpers to eliminate boilerplate.
 */
import { createHash } from "node:crypto";
import { mkdir } from "node:fs/promises";
import type { HookInput } from "./interfaces/hook.interface";
import { compactJson } from "./json";

/** Generate a 16-char hex SHA-256 hash from text */
export function hashText(text: string): string {
  return createHash("sha256").update(text).digest("hex").slice(0, 16);
}

/** Calculate age in seconds from an ISO timestamp */
export function cacheAge(timestamp: string): number {
  return Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
}

/** Read stdin as text, parse as JSON. Returns empty object on failure */
export async function readStdin(): Promise<Record<string, unknown>> {
  const text = await Bun.stdin.text();
  if (!text.trim()) return {};
  try { return JSON.parse(text); } catch { return {}; }
}

/** Read and parse a JSON file. Returns null if missing or invalid */
export async function readJsonFile<T>(path: string): Promise<T | null> {
  try {
    const file = Bun.file(path);
    if (!(await file.exists())) return null;
    return (await file.json()) as T;
  } catch { return null; }
}

/** Write data as JSON to a file. Use compact=true for cache files (inline nested) */
export async function writeJsonFile(path: string, data: unknown, compact = false): Promise<void> {
  await Bun.write(path, compact ? compactJson(data) : JSON.stringify(data, null, 2));
}

/** Write raw text content to a file */
export async function writeTextFile(path: string, content: string): Promise<void> {
  await Bun.write(path, content);
}

/** Compute a 16-char project hash from its absolute path */
export function projectHash(projectPath: string): string {
  return hashText(projectPath);
}

/** Get the fusengine-cache base directory path */
export function cacheBaseDir(): string {
  return `${process.env.HOME}/.claude/fusengine-cache`;
}

/** Ensure a directory exists, creating parents as needed */
export async function ensureDir(dir: string): Promise<void> {
  await mkdir(dir, { recursive: true });
}

/** Output a hook JSON response to stdout */
export function outputHookResponse(response: unknown): void {
  console.log(JSON.stringify(response));
}

/** Read a text file safely, return empty string if missing */
export async function readTextFile(path: string): Promise<string> {
  try {
    const file = Bun.file(path);
    if (!(await file.exists())) return "";
    return await file.text();
  } catch { return ""; }
}

/** Compute full SHA-256 hex checksum of a file */
export async function fileChecksum(path: string): Promise<string> {
  try {
    return createHash("sha256").update(await Bun.file(path).text()).digest("hex");
  } catch { return ""; }
}

/** Initialize cache hook context - eliminates boilerplate in cache scripts */
export async function initCacheContext(cacheType: string) {
  const input = (await readStdin()) as HookInput;
  const projPath = input.cwd ?? process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
  const pHash = projectHash(projPath);
  const cacheDir = `${cacheBaseDir()}/${cacheType}/${pHash}`;
  return { input, projPath, pHash, cacheDir };
}

/** Initialize APEX hook context - eliminates boilerplate in APEX scripts */
export async function initApexContext() {
  const input = (await readStdin()) as HookInput;
  const projectRoot = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
  return { input, projectRoot };
}
