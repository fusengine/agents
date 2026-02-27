/**
 * APEX state file management with directory-based locking.
 * Handles state read/write for enforce-apex-phases hook.
 * Task manipulation helpers are in apex/task-helpers.ts.
 */
import { mkdir, rmdir } from "node:fs/promises";
import { readJsonFile, writeJsonFile } from "../core";
import type { AuthEntry } from "./doc-helpers";

const HOME = process.env.HOME ?? "";

/** Default empty APEX state structure */
const DEFAULT_STATE = {
  $schema: "apex-state-v1",
  description: "APEX/SOLID state - sessions[] + 2min expiry",
  target: {} as Record<string, string>,
  authorizations: {} as Record<string, AuthEntry & { doc_consulted?: string }>,
};

/** APEX state type */
export type ApexState = typeof DEFAULT_STATE;

/**
 * Acquire a directory-based lock with timeout.
 * @param lockDir - Path to the lock directory
 * @param timeoutMs - Max wait in ms (default 5000)
 * @returns Cleanup function, or null if lock acquisition failed
 */
export async function acquireLock(
  lockDir: string, timeoutMs = 5000,
): Promise<(() => Promise<void>) | null> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      await mkdir(lockDir, { recursive: false });
      return async () => { try { await rmdir(lockDir); } catch { /* noop */ } };
    } catch { await Bun.sleep(100); }
  }
  return null;
}

/** Get the state file path for today */
export function stateFilePath(): string {
  const today = new Date().toISOString().slice(0, 10);
  return `${HOME}/.claude/logs/00-apex/${today}-state.json`;
}

/** Ensure state directory exists and return its path */
export async function ensureStateDir(): Promise<string> {
  const dir = `${HOME}/.claude/logs/00-apex`;
  await mkdir(dir, { recursive: true });
  return dir;
}

/** Load current APEX state or return default */
export async function loadState(path: string): Promise<ApexState> {
  return (await readJsonFile<ApexState>(path)) ?? { ...DEFAULT_STATE };
}

/** Save APEX state to file */
export async function saveState(path: string, state: ApexState): Promise<void> {
  await writeJsonFile(path, state);
}

export { taskCreate, taskStart, taskComplete } from "./task-helpers";
