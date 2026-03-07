#!/usr/bin/env bun
/**
 * OAuth Usage Daemon - Background process that fetches API every 2 minutes
 *
 * @description Writes to ~/.claude/statusline-data/usage-cache.json
 * Statusline reads from cache — zero API calls at render time.
 * Auto-exits if PID file is deleted or after 24h.
 */

import { existsSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { CACHE_TTL_MS, KEYCHAIN_SERVICE } from "./src/constants/oauth.constant";
import { removeDaemonPid, saveDaemonPid } from "./src/services/daemon-manager";
import { saveErrorState } from "./src/services/error-state";
import { clearFailReason, fetchUsage, getLastFailReason } from "./src/services/oauth-fetch";

const DATA_DIR = join(homedir(), ".claude", "statusline-data");
const PID_FILE = join(DATA_DIR, "daemon.pid");
const USAGE_FILE = join(DATA_DIR, "usage-cache.json");
const MAX_LIFETIME_MS = 24 * 60 * 60 * 1000;
const startTime = Date.now();

if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
saveDaemonPid(process.pid);

/** @returns OAuth access token from macOS Keychain or null */
async function getToken(): Promise<string | null> {
	try {
		const proc = Bun.spawn(["security", "find-generic-password", "-s", KEYCHAIN_SERVICE, "-w"], {
			stdout: "pipe",
			stderr: "pipe",
		});
		const raw = await new Response(proc.stdout).text();
		const creds = JSON.parse(raw.trim());
		return creds?.claudeAiOauth?.accessToken ?? null;
	} catch {
		return null;
	}
}

/** Single fetch cycle: get token → call API → write cache */
async function refresh(): Promise<void> {
	const token = await getToken();
	if (!token) {
		saveErrorState(Date.now(), "no_credentials");
		return;
	}
	const usage = await fetchUsage(token);
	if (usage) {
		Bun.write(USAGE_FILE, JSON.stringify({ data: usage, timestamp: Date.now() }));
		saveErrorState(0, null);
		clearFailReason();
	} else {
		saveErrorState(Date.now(), getLastFailReason());
	}
}

process.on("SIGTERM", () => {
	clearInterval(intervalId);
	removeDaemonPid();
	process.exit(0);
});
process.on("SIGINT", () => {
	clearInterval(intervalId);
	removeDaemonPid();
	process.exit(0);
});

await refresh();

const intervalId = setInterval(async () => {
	if (!existsSync(PID_FILE)) {
		clearInterval(intervalId);
		process.exit(0);
	}
	if (Date.now() - startTime > MAX_LIFETIME_MS) {
		clearInterval(intervalId);
		removeDaemonPid();
		process.exit(0);
	}
	await refresh();
}, CACHE_TTL_MS);
