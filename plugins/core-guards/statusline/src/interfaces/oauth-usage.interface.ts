/**
 * OAuth Usage Interfaces - Types pour l'API OAuth Claude Code
 *
 * @description Types pour la récupération des limites d'usage via OAuth
 */

/**
 * Credentials OAuth stockés dans le Keychain macOS
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
 * Limite d'usage individuelle
 */
export interface UsageLimit {
	/** Pourcentage d'utilisation (0.0 - 1.0) */
	utilization: number;
	/** Timestamp ISO du prochain reset */
	resets_at: string | null;
}

/**
 * Données extra usage (overage billing)
 */
export interface ExtraUsageLimits {
	is_enabled: boolean;
	monthly_limit: number;
	used_credits: number;
	utilization: number;
}

/**
 * Réponse de l'API OAuth /usage
 */
export interface OAuthUsageResponse {
	/** Limite glissante de 5 heures */
	five_hour: UsageLimit;
	/** Limite hebdomadaire tous modèles */
	seven_day: UsageLimit;
	/** Limite hebdomadaire Opus uniquement */
	seven_day_opus: UsageLimit;
	/** Limite OAuth apps (nullable) */
	seven_day_oauth_apps?: UsageLimit | null;
	/** Extra usage / overage billing (nullable) */
	extra_usage?: ExtraUsageLimits | null;
}

/**
 * Usage formaté pour affichage
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
