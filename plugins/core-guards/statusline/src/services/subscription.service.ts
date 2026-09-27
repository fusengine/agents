/**
 * Subscription Service - Plan detection and token limits
 *
 * @description SRP: Subscription detection only
 */

import { TOKEN_LIMITS } from "../constants";
import type { SubscriptionType } from "../interfaces";

interface SessionRecord {
	modelId?: string;
}

/**
 * Detect the user's subscription plan based on model usage
 * @param modelId - Current model identifier
 * @param sessions - Historical session records
 * @param configPlan - Optional plan override from config
 * @returns Detected subscription type
 */
export function detectSubscription(
	modelId: string,
	sessions: SessionRecord[],
	configPlan?: SubscriptionType,
): SubscriptionType {
	// If the plan is defined in the config, it takes priority
	if (configPlan) return configPlan;

	// If the current model is Opus, the plan is necessarily max
	if (modelId.includes("opus")) return "max";

	// Check history to detect whether the user has already used Opus
	const hasUsedOpus = sessions.some((s) => s.modelId?.includes("opus"));
	if (hasUsedOpus) return "max";

	// Default: pro plan
	return "pro";
}

/**
 * Get maximum token allowance for a subscription plan
 * @param subscription - The subscription type
 * @returns Maximum tokens per 5-hour window
 */
export function getMaxTokens(subscription: SubscriptionType): number {
	switch (subscription) {
		case "free":
			return TOKEN_LIMITS.FREE.MAX_PER_5_HOURS;
		case "pro":
			return TOKEN_LIMITS.PRO.MAX_PER_5_HOURS;
		case "max":
			return TOKEN_LIMITS.MAX.MAX_PER_5_HOURS;
	}
}
