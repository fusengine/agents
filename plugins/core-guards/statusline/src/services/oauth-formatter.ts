/**
 * OAuth Formatter - Formats usage data for display
 *
 * Responsibility: Single Responsibility Principle (SRP)
 * - Only responsible for formatting raw OAuth usage data
 */

import type { FormattedUsage, OAuthUsageResponse } from "../interfaces/oauth-usage.interface";

/**
 * Parse ISO date string into date and time left
 * @param iso - ISO date string or null
 * @returns Parsed date and time left in milliseconds
 */
function parseReset(iso: string | null): { date: Date | null; timeLeft: number } {
	if (!iso) return { date: null, timeLeft: 0 };
	const date = new Date(iso);
	return { date, timeLeft: Math.max(0, date.getTime() - Date.now()) };
}

/**
 * Formats raw OAuth usage data for display
 * @param usage - Raw usage response from API
 * @returns Formatted usage with percentages and time left
 */
export function formatUsage(usage: OAuthUsageResponse): FormattedUsage {
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
