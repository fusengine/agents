/**
 * Limits Constants - Limites et intervalles
 */

export const TIME_INTERVALS = {
	FIVE_HOURS_MS: 5 * 60 * 60 * 1000,
	WEEK_MS: 7 * 24 * 60 * 60 * 1000,
	HOUR_MS: 60 * 60 * 1000,
	MINUTE_MS: 60 * 1000,
} as const;

export const TOKEN_LIMITS = {
	FREE: {
		MAX_PER_5_HOURS: 50_000,
	},
	PRO: {
		MAX_PER_5_HOURS: 1_000_000,
	},
	MAX: {
		MAX_PER_5_HOURS: 10_000_000,
	},
	WEEKLY_DEFAULT: 50_000_000,
	CONTEXT_WINDOW: 200_000,
} as const;

export const OVERHEAD_ESTIMATION = {
	SYSTEM_TOOLS: 16_000,
	MCP_PER_SERVER: 3_500,
	SYSTEM_PROMPT: 3_500,
	MEMORY_FILES: 500,
	AUTOCOMPACT_BUFFER: 33_000, // 16.5% de context_window
	DEFAULT_MCP_SERVERS: 5,
} as const;
