/**
 * OAuth Service - Retrieves usage limits via OAuth
 *
 * @description SRP: Keychain access and OAuth API calls only
 */

import {
	CACHE_TTL_MS,
	KEYCHAIN_SERVICE,
	MAX_RETRIES,
	OAUTH_API_URL,
	OAUTH_HEADERS,
	RETRY_DELAY_MS,
} from "../constants/oauth.constant";
import type { OAuthCredentials, OAuthUsageResponse } from "../interfaces/oauth-usage.interface";

// Re-export formatUsage for backward compatibility
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
 * Calls OAuth API with retry logic
 * @param accessToken - OAuth access token
 * @param retries - Remaining retry attempts
 */
async function fetchWithRetry(
	accessToken: string,
	retries = MAX_RETRIES,
): Promise<OAuthUsageResponse | null> {
	try {
		const response = await fetch(OAUTH_API_URL, {
			method: "GET",
			headers: { ...OAUTH_HEADERS, Authorization: `Bearer ${accessToken}` },
		});
		if (!response.ok) {
			if (response.status === 401 && retries > 0) {
				await Bun.sleep(RETRY_DELAY_MS);
				return fetchWithRetry(accessToken, retries - 1);
			}
			return null;
		}
		return (await response.json()) as OAuthUsageResponse;
	} catch {
		if (retries > 0) {
			await Bun.sleep(RETRY_DELAY_MS);
			return fetchWithRetry(accessToken, retries - 1);
		}
		return null;
	}
}

/**
 * Retrieves usage limits with cache
 * @returns Usage data or null
 */
export async function getUsageLimits(): Promise<OAuthUsageResponse | null> {
	const now = Date.now();
	if (cachedUsage && now - cacheTimestamp < CACHE_TTL_MS) {
		return cachedUsage;
	}
	const credentials = await getCredentialsFromKeychain();
	if (!credentials?.claudeAiOauth?.accessToken) return null;
	const usage = await fetchWithRetry(credentials.claudeAiOauth.accessToken);
	if (usage) {
		cachedUsage = usage;
		cacheTimestamp = now;
	}
	return usage;
}
