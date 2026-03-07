/**
 * Error State - Persisted error cooldown for OAuth rate limiting
 *
 * @description SRP: File-based error state persistence only
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { ERROR_CACHE_TTL_MS } from "../constants/oauth.constant";
import type { OAuthFailReason } from "./oauth-fetch";

const DATA_DIR = join(homedir(), ".claude", "statusline-data");
const ERROR_FILE = join(DATA_DIR, "error-state.json");

interface ErrorState {
	errorTimestamp: number;
	reason: OAuthFailReason;
}

/** @returns Persisted error state from disk */
export function loadErrorState(): ErrorState {
	try {
		if (!existsSync(ERROR_FILE)) return { errorTimestamp: 0, reason: null };
		const data = JSON.parse(readFileSync(ERROR_FILE, "utf-8"));
		return { errorTimestamp: data.errorTimestamp ?? 0, reason: data.reason ?? null };
	} catch {
		return { errorTimestamp: 0, reason: null };
	}
}

/**
 * Saves error state to disk
 * @param ts - Error timestamp (0 to clear)
 * @param reason - Failure reason or null to clear
 */
export function saveErrorState(ts: number, reason: OAuthFailReason): void {
	if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
	writeFileSync(ERROR_FILE, JSON.stringify({ errorTimestamp: ts, reason }));
}

/** @returns Remaining error cooldown in ms, or 0 if no cooldown active */
export function getErrorCooldownLeft(): number {
	const { errorTimestamp } = loadErrorState();
	if (!errorTimestamp) return 0;
	const left = ERROR_CACHE_TTL_MS - (Date.now() - errorTimestamp);
	return left > 0 ? left : 0;
}

/** @returns Persisted failure reason from disk */
export function getLastFailReason(): OAuthFailReason {
	return loadErrorState().reason;
}
