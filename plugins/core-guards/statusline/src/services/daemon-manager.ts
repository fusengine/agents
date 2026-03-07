/**
 * Daemon Manager - Start/stop/check background OAuth fetch daemon
 *
 * @description SRP: PID file management and daemon lifecycle only
 */

import { existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const DATA_DIR = join(homedir(), ".claude", "statusline-data");
const PID_FILE = join(DATA_DIR, "daemon.pid");

/** @returns true if process with given PID is alive (POSIX signal 0) */
function isProcessAlive(pid: number): boolean {
	try {
		process.kill(pid, 0);
		return true;
	} catch {
		return false;
	}
}

/** @returns Running daemon PID or null. Cleans stale PID files. */
export function getDaemonPid(): number | null {
	if (!existsSync(PID_FILE)) return null;
	const pid = Number.parseInt(readFileSync(PID_FILE, "utf-8").trim(), 10);
	if (Number.isNaN(pid) || !isProcessAlive(pid)) {
		try {
			unlinkSync(PID_FILE);
		} catch {
			/* ignore */
		}
		return null;
	}
	return pid;
}

/** @returns true if daemon is currently running */
export function isDaemonRunning(): boolean {
	return getDaemonPid() !== null;
}

/** Saves daemon PID to disk */
export function saveDaemonPid(pid: number): void {
	writeFileSync(PID_FILE, String(pid), "utf-8");
}

/** Removes PID file on shutdown */
export function removeDaemonPid(): void {
	try {
		if (existsSync(PID_FILE)) unlinkSync(PID_FILE);
	} catch {
		/* ignore */
	}
}

/** Spawns daemon as detached background process. Returns PID. */
export function spawnDaemon(): number | null {
	const daemonPath = join(import.meta.dir, "..", "..", "daemon.ts");
	try {
		const proc = Bun.spawn(["bun", daemonPath], {
			stdio: ["ignore", "ignore", "ignore"],
			env: { ...process.env },
		});
		proc.unref();
		saveDaemonPid(proc.pid);
		return proc.pid;
	} catch {
		return null;
	}
}

/** Ensures daemon is running — spawns if not. */
export function ensureDaemon(): void {
	if (!isDaemonRunning()) {
		spawnDaemon();
	}
}
