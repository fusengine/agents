/**
 * Color Constants - Codes ANSI pour les couleurs
 */

export const ANSI_COLORS = {
	BLUE: "\x1b[0;34m",
	CYAN: "\x1b[0;36m",
	PURPLE: "\x1b[38;5;135m",
	YELLOW: "\x1b[0;33m",
	GREEN: "\x1b[0;32m",
	RED: "\x1b[0;31m",
	ORANGE: "\x1b[38;5;208m",
	WHITE: "\x1b[0;37m",
	MAGENTA: "\x1b[0;35m",
	GRAY: "\x1b[38;5;240m",
	RESET: "\x1b[0m",
} as const;

export const COLOR_THRESHOLDS = {
	WARNING: 70,
	CRITICAL: 90,
} as const;
