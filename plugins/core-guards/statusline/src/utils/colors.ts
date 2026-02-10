/**
 * Colors Module - FORCE ANSI colors (ignore TTY detection)
 */

import { COLOR_THRESHOLDS } from "../constants";

export type ColorFn = (text: string) => string;

// FORCE ANSI codes - toujours actif!
const ansi = (code: string) => (text: string) => `\x1b[${code}m${text}\x1b[0m`;
const ansi256 = (code: number) => (text: string) => `\x1b[38;5;${code}m${text}\x1b[0m`;

export const colors = {
	// Basic colors - FORCED
	blue: ansi("0;34"),
	cyan: ansi("0;36"),
	green: ansi("0;32"),
	yellow: ansi("0;33"),
	red: ansi("0;31"),
	magenta: ansi("0;35"),
	white: ansi("0;37"),
	gray: ansi256(240),

	// Extended 256 colors
	purple: ansi256(135),
	orange: ansi256(208),

	// Bright/Bold versions
	brightRed: ansi("1;91"), // Bold + bright red
	brightYellow: ansi("1;93"), // Bold + bright yellow
	brightGreen: ansi("1;92"), // Bold + bright green

	// Styles
	bold: ansi("1"),
	dim: ansi("2"),

	// Reset
	reset: "\x1b[0m",

	// Always true - we force colors
	isSupported: true,
};

export function progressiveColor(value: number, text: string): string {
	if (value >= COLOR_THRESHOLDS.CRITICAL) return colors.brightRed(text);
	if (value >= COLOR_THRESHOLDS.WARNING) return colors.brightYellow(text);
	return colors.green(text);
}

export default colors;
