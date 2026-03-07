/**
 * OAuth Service - Cache orchestration and credential access
 *
 * @description SRP: Cache management and Keychain access only
 */

import { CACHE_TTL_MS, ERROR_CACHE_TTL_MS, KEYCHAIN_SERVICE } from "../constants/oauth.constant";
import type { OAuthCredentials, OAuthUsageResponse } from "../interfaces/oauth-usage.interface";
import { loadErrorState, saveErrorState } from "./error-state";
import { fetchUsage, getLastFailReason as getFetchReason } from "./oauth-fetch";

export { getErrorCooldownLeft, getLastFailReason } from "./error-state";
export type { OAuthFailReason } from "./oauth-fetch";
export { formatUsage } from "./oauth-formatter";

let cachedUsage: OAuthUsageResponse | null = null;
let cacheTimestamp = 0;

/**
 * Retrieves OAuth credentials from macOS Keychain
 * @returns Credentials or null if not found
 */
export async function getCredentialsFromKeychain(): Promise<OAuthCredentials | null> {
	try {
		const proc = Bun.spawn(["security", "find-generic-password", "-s", KEYCHAIN_SERVICE, "-w"], {
			stdout: "pipe",
			stderr: "pipe",
		});
		const output = await new Response(proc.stdout).text();
		const trimmed = output.trim();
		if (!trimmed) return null;
		return JSON.parse(trimmed) as OAuthCredentials;
	} catch {
		return null;
	}
}

/**
 * Retrieves usage limits with success cache and error cooldown
 * @returns Usage data or null
 */
export async function getUsageLimits(): Promise<OAuthUsageResponse | null> {
	const now = Date.now();
	if (cachedUsage && now - cacheTimestamp < CACHE_TTL_MS) {
		return cachedUsage;
	}
	const { errorTimestamp } = loadErrorState();
	if (errorTimestamp && now - errorTimestamp < ERROR_CACHE_TTL_MS) {
		return cachedUsage;
	}
	const credentials = await getCredentialsFromKeychain();
	if (!credentials?.claudeAiOauth?.accessToken) {
		saveErrorState(now, "no_credentials");
		return cachedUsage;
	}
	if (credentials.claudeAiOauth.expiresAt && now >= credentials.claudeAiOauth.expiresAt) {
		saveErrorState(now, "token_expired");
		return cachedUsage;
	}
	const usage = await fetchUsage(credentials.claudeAiOauth.accessToken);
	if (usage) {
		cachedUsage = usage;
		cacheTimestamp = now;
		saveErrorState(0, null);
	} else {
		saveErrorState(now, getFetchReason());
	}
	return usage ?? cachedUsage;
}
