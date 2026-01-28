/**
 * OAuth Service - Récupération des limites d'usage via OAuth
 *
 * @description SRP: Accès Keychain macOS et API OAuth uniquement
 */

import {
	CACHE_TTL_MS,
	KEYCHAIN_SERVICE,
	MAX_RETRIES,
	OAUTH_API_URL,
	OAUTH_HEADERS,
	RETRY_DELAY_MS,
} from "../constants/oauth.constant";
import type {
	FormattedUsage,
	OAuthCredentials,
	OAuthUsageResponse,
} from "../interfaces/oauth-usage.interface";

let cachedUsage: OAuthUsageResponse | null = null;
let cacheTimestamp = 0;

/**
 * Récupère les credentials OAuth depuis le Keychain macOS
 * @returns Credentials ou null si non trouvés
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
 * Appelle l'API OAuth avec retry
 * @param accessToken Token OAuth
 * @param retries Nombre de retries restants
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
 * Récupère les limites d'usage avec cache
 * @returns Données d'usage ou null
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

/**
 * Formate les données d'usage pour affichage
 * @param usage Données brutes
 */
export function formatUsage(usage: OAuthUsageResponse): FormattedUsage {
	const now = Date.now();
	const parseReset = (iso: string | null): { date: Date | null; timeLeft: number } => {
		if (!iso) return { date: null, timeLeft: 0 };
		const date = new Date(iso);
		return { date, timeLeft: Math.max(0, date.getTime() - now) };
	};
	const fiveHour = parseReset(usage.five_hour.resets_at);
	const sevenDay = parseReset(usage.seven_day.resets_at);
	const opus = parseReset(usage.seven_day_opus?.resets_at ?? null);
	return {
		fiveHour: {
			percentage: usage.five_hour.utilization,
			resetsAt: fiveHour.date,
			timeLeft: fiveHour.timeLeft,
		},
		sevenDay: {
			percentage: usage.seven_day.utilization,
			resetsAt: sevenDay.date,
			timeLeft: sevenDay.timeLeft,
		},
		opus: { percentage: usage.seven_day_opus?.utilization ?? 0, resetsAt: opus.date },
	};
}
