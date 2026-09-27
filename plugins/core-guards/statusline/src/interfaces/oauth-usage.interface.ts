/**
 * OAuth Usage Interfaces - Types for the Claude Code OAuth API
 *
 * @description Types for fetching usage limits via OAuth
 */

/**
 * OAuth credentials stored in the macOS Keychain
 */
export interface OAuthCredentials {
	claudeAiOauth: {
		accessToken: string;
		refreshToken: string;
		expiresAt: number;
		scopes?: string[];
	};
}

/**
 * Individual usage limit
 */
export interface UsageLimit {
	/** Utilization percentage (0.0 - 1.0) */
	utilization: number;
	/** ISO timestamp of the next reset */
	resets_at: string | null;
}

/**
 * Extra usage data (overage billing)
 */
export interface ExtraUsageLimits {
	is_enabled: boolean;
	monthly_limit: number;
	used_credits: number;
	utilization: number;
}

/**
 * OAuth /usage API response
 */
export interface OAuthUsageResponse {
	/** Rolling 5-hour limit */
	five_hour: UsageLimit;
	/** Weekly limit, all models */
	seven_day: UsageLimit;
	/** Weekly limit, Opus only */
	seven_day_opus: UsageLimit;
	/** OAuth apps limit (nullable) */
	seven_day_oauth_apps?: UsageLimit | null;
	/** Extra usage / overage billing (nullable) */
	extra_usage?: ExtraUsageLimits | null;
}

/**
 * Usage formatted for display
 */
export interface FormattedUsage {
	fiveHour: {
		percentage: number;
		resetsAt: Date | null;
		timeLeft: number;
	};
	sevenDay: {
		percentage: number;
		resetsAt: Date | null;
		timeLeft: number;
	};
	opus: {
		percentage: number;
		resetsAt: Date | null;
	};
}
