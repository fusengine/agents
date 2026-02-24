/**
 * Progress Bar Utilities - Pure style helpers for progress bars
 *
 * Responsibility: Single Responsibility Principle (SRP)
 * - Only responsible for progress bar character styles
 */

/**
 * Get progress bar style characters for a given style type
 * @param style - The progress bar visual style
 * @returns String of characters representing the progress bar
 */
export function getProgressBarStyle(
	style: "filled" | "braille" | "dots" | "line" | "blocks" | "vertical",
): string {
	switch (style) {
		case "filled":
			return "████████▓▓";
		case "braille":
			return "⣿⣿⣿⣿⣿⣿⣿⣿⣀⣀";
		case "dots":
			return "●●●●●●●●○○";
		case "line":
			return "━━━━━━━━╌╌";
		case "blocks":
			return "▰▰▰▰▰▰▰▰▱▱";
		case "vertical":
			return "▁▂▃▄▅▆▇█▇▅";
	}
}
