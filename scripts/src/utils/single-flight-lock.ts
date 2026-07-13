/**
 * Single-flight file lock — built-ins only (must survive a node_modules wipe,
 * since this is the primitive `ensure-deps.ts` uses to repair node_modules).
 * Uses atomic `wx` (O_CREAT|O_EXCL) create as the race-free primitive; a lock
 * older than `staleMs` is treated as abandoned and reclaimed once.
 */
import { closeSync, mkdirSync, openSync, readFileSync, rmSync, writeSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const LOCK_DIR = join(tmpdir(), "fusengine-ensure-deps");
const DEFAULT_STALE_MS = 120_000;

function lockPathFor(key: string): string {
	const slug = key.replace(/[^a-zA-Z0-9]+/g, "_");
	return join(LOCK_DIR, `${slug}.lock`);
}

/** Age of an existing lock file in ms; a corrupt/unreadable lock is maximally stale. */
function readLockAgeMs(lockPath: string): number {
	try {
		const { ts } = JSON.parse(readFileSync(lockPath, "utf8")) as { ts: number };
		return Date.now() - ts;
	} catch {
		return Number.POSITIVE_INFINITY;
	}
}

/** Atomically create the lock file; false means another process already holds it. */
function createLockFile(lockPath: string): boolean {
	try {
		const fd = openSync(lockPath, "wx");
		writeSync(fd, JSON.stringify({ pid: process.pid, ts: Date.now() }));
		closeSync(fd);
		return true;
	} catch {
		return false;
	}
}

/**
 * Try to atomically acquire a single-flight lock for `key`.
 * Reclaims a stale lock (older than `staleMs`) exactly once before giving up,
 * so a crashed holder can never wedge the lock forever.
 *
 * @param key - Unique identifier for the resource being locked (e.g. a dir path)
 * @param staleMs - Age after which an abandoned lock is force-reclaimed
 * @returns a release function if acquired, or `null` if another process holds it
 */
export function tryAcquireLock(key: string, staleMs = DEFAULT_STALE_MS): (() => void) | null {
	mkdirSync(LOCK_DIR, { recursive: true });
	const lockPath = lockPathFor(key);

	if (createLockFile(lockPath)) {
		return () => rmSync(lockPath, { force: true });
	}
	if (readLockAgeMs(lockPath) > staleMs) {
		rmSync(lockPath, { force: true });
		if (createLockFile(lockPath)) {
			return () => rmSync(lockPath, { force: true });
		}
	}
	return null;
}
