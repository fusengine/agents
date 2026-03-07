/**
 * OAuth Fetch - Single API call without retries
 *
 * @description SRP: HTTP fetch to OAuth usage endpoint only
 */

import { OAUTH_API_URL, OAUTH_HEADERS } from "../constants/oauth.constant";
import type { OAuthUsageResponse } from "../interfaces/oauth-usage.interface";

/** Failure reason for diagnostics */
export type OAuthFailReason =
	| "rate_limited"
	| "token_expired"
	| "no_credentials"
	| "api_unreachable"
	| null;

let lastFailReason: OAuthFailReason = null;

/** @returns Last failure reason for display in statusline */
export function getLastFailReason(): OAuthFailReason {
	return lastFailReason;
}

/** @param reason - Set failure reason from external callers */
export function setFailReason(reason: OAuthFailReason): void {
	lastFailReason = reason;
}

/** Reset failure state after successful fetch */
export function clearFailReason(): void {
	lastFailReason = null;
}

/**
 * Calls OAuth API once — no retries on 401/429
 * @param accessToken - OAuth access token
 * @returns Usage data or null
 */
export async function fetchUsage(accessToken: string): Promise<OAuthUsageResponse | null> {
	try {
		const response = await fetch(OAUTH_API_URL, {
			method: "GET",
			headers: { ...OAUTH_HEADERS, Authorization: `Bearer ${accessToken}` },
		});
		if (response.status === 429) {
			lastFailReason = "rate_limited";
			return null;
		}
		if (response.status === 401) {
			lastFailReason = "token_expired";
			return null;
		}
		if (!response.ok) {
			lastFailReason = "api_unreachable";
			return null;
		}
		return (await response.json()) as OAuthUsageResponse;
	} catch {
		lastFailReason = "api_unreachable";
		return null;
	}
}
