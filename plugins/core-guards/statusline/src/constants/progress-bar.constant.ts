/**
 * Progress Bar Constants - Caracteres pour les barres de progression
 */

export const PROGRESS_CHARS = {
	filled: { fill: "█", empty: "░" },
	braille: { fill: "⣿", empty: "⣀" },
	dots: { fill: "●", empty: "○" },
	line: { fill: "━", empty: "╌" },
	blocks: { fill: "▰", empty: "▱" },
	vertical: { fill: "▮", empty: "▯" },
} as const;

export const GRADIENT_BLOCKS = [
	" ",
	"\u258F",
	"\u258E",
	"\u258D",
	"\u258C",
	"\u258B",
	"\u258A",
	"\u2589",
	"\u2588",
] as const;
// " ", ▏, ▎, ▍, ▌, ▋, ▊, ▉, █

export const PROGRESS_BAR_DEFAULTS = {
	LENGTH: 10,
	STYLE: "filled" as const,
} as const;
