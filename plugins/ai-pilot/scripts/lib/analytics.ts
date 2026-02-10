/**
 * Analytics logging helper for cache event tracking.
 * Appends JSONL entries to sessions.jsonl for hit/miss analysis.
 */
import { appendFile } from "node:fs/promises";
import { cacheBaseDir, ensureDir } from "./core";

/**
 * Log a cache event to the analytics sessions file.
 * @param type - Cache type: "explore" | "doc" | "lessons" | "tests"
 * @param action - Event action: "hit" | "miss" | "blocked"
 * @param projHash - 16-char project hash identifier
 * @param extra - Optional additional fields to merge into the log entry
 */
export async function logCacheEvent(
  type: string,
  action: string,
  projHash: string,
  extra?: Record<string, unknown>,
): Promise<void> {
  const dir = `${cacheBaseDir()}/analytics`;
  await ensureDir(dir);
  const entry = {
    ts: new Date().toISOString(),
    session: String(Math.floor(Date.now() / 1000)),
    type,
    action,
    project_hash: projHash,
    ...extra,
  };
  await appendFile(`${dir}/sessions.jsonl`, JSON.stringify(entry) + "\n");
}
