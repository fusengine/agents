/**
 * throttle.ts - Per-project reminder throttle state for fuse-lessons.
 * Persists `{ lastRemindedAt, lastCodeEditAt }` in <project-root>/MEMORY/state.json
 * (next to LESSON.md). All helpers are non-throwing and never clobber the
 * sibling field (read-modify-write).
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { ensureMemoryGitignore } from "./gitignore";

/** Per-project throttle state. */
export interface ReminderState {
  lastRemindedAt: number;
  lastCodeEditAt: number;
}

/**
 * Absolute path of the per-project throttle state file.
 * @param root - Project root.
 * @returns Absolute path to `<root>/MEMORY/state.json`.
 */
export function stateFileFor(root: string): string {
  return `${root}/MEMORY/state.json`;
}

/**
 * Read both throttle timestamps from a state file.
 * @param file - Absolute path to the state file.
 * @returns State with missing/corrupt fields defaulted to 0.
 */
export function readState(file: string): ReminderState {
  try {
    const parsed = JSON.parse(readFileSync(file, "utf8")) as Partial<ReminderState>;
    return { lastRemindedAt: num(parsed?.lastRemindedAt), lastCodeEditAt: num(parsed?.lastCodeEditAt) };
  } catch {
    return { lastRemindedAt: 0, lastCodeEditAt: 0 };
  }
}

/** Coerce an unknown value to a finite number, else 0. */
function num(v: unknown): number {
  return typeof v === "number" && Number.isFinite(v) ? v : 0;
}

/**
 * Persist one state field without clobbering the other (read-modify-write).
 * @param file - Absolute path to the state file.
 * @param key - Field to update.
 * @param value - Epoch ms to record.
 */
export function setStateField(file: string, key: keyof ReminderState, value: number): void {
  const next: ReminderState = { ...readState(file), [key]: value };
  const dir = dirname(file);
  mkdirSync(dir, { recursive: true });
  ensureMemoryGitignore(dir);
  writeFileSync(file, JSON.stringify(next satisfies ReminderState));
}

/**
 * Local wall-clock timestamp for a lesson bullet, zero-padded.
 * @returns Current local time as `YYYY-MM-DD HH:MM`.
 */
export function nowStamp(): string {
  const d = new Date();
  const p = (n: number): string => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ` +
    `${p(d.getHours())}:${p(d.getMinutes())}`;
}

/**
 * Resolve the throttle window from FUSE_LESSONS_THROTTLE_MIN (default 5 min).
 * @returns Throttle window in milliseconds (>= 0).
 */
export function throttleMs(): number {
  const raw = process.env.FUSE_LESSONS_THROTTLE_MIN?.trim();
  const min = raw ? Number(raw) : 5;
  return (Number.isFinite(min) ? Math.max(0, min) : 5) * 60_000;
}
