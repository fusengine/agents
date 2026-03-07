/**
 * OAuth Service - Read-only cache reader + daemon launcher
 *
 * @description SRP: Reads usage-cache.json written by daemon. Never fetches API directly.
 */

import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import type { OAuthUsageResponse } from "../interfaces/oauth-usage.interface";
import { ensureDaemon } from "./daemon-manager";

export { getErrorCooldownLeft, getLastFailReason } from "./error-state";
export type { OAuthFailReason } from "./oauth-fetch";
export { formatUsage } from "./oauth-formatter";

const USAGE_FILE = join(homedir(), ".claude", "statusline-data", "usage-cache.json");

interface PersistedCache {
	data: OAuthUsageResponse;
	timestamp: number;
}

/** @returns Cached usage from disk or null */
function loadUsageCache(): PersistedCache | null {
	try {
		if (!existsSync(USAGE_FILE)) return null;
		return JSON.parse(readFileSync(USAGE_FILE, "utf-8")) as PersistedCache;
	} catch {
		return null;
	}
}

const disk = loadUsageCache();
let cachedUsage: OAuthUsageResponse | null = disk?.data ?? null;
let cacheTimestamp = disk?.timestamp ?? 0;

/**
 * Returns usage limits from disk cache. Daemon refreshes in background.
 * @returns Usage data or null if no cache exists yet
 */
export async function getUsageLimits(): Promise<OAuthUsageResponse | null> {
	ensureDaemon();
	const fresh = loadUsageCache();
	if (fresh && fresh.timestamp > cacheTimestamp) {
		cachedUsage = fresh.data;
		cacheTimestamp = fresh.timestamp;
	}
	return cachedUsage;
}
