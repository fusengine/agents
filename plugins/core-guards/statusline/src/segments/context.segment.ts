/**
 * Context Segment - Displays the context percentage
 *
 * @description SRP: Context display only
 */

import type { StatuslineConfig } from "../config/schema";
import { OVERHEAD_ESTIMATION } from "../constants";
import type { ISegment, SegmentContext } from "../interfaces";
import { colors, generateProgressBar, progressiveColor } from "../utils";

/**
 * Computes the ALERT percentage (used for the color only) from the real
 * percentage of context used and the REAL window size.
 * The autocompact buffer is ABSOLUTE (33K tokens, not proportional to the window)
 * @see https://github.com/anthropics/claude-code/issues/27037 - autoCompact.ts /
 * getAutocompactBufferTokens. Rescales so that 100% alert matches the
 * estimated autocompact point, whatever the window size (200K, 1M, ...).
 * Never affects the DISPLAYED percentage or the bar.
 */
function calculateAlertPercentage(realPercentage: number, windowSize: number): number {
	// Defensive clamp: a window <= buffer (absurd) must never produce a
	// division by zero or by a negative number.
	const usableWindow = Math.max(windowSize - OVERHEAD_ESTIMATION.AUTOCOMPACT_BUFFER, 1);
	return Math.min((realPercentage * windowSize) / usableWindow, 100);
}

export class ContextSegment implements ISegment {
	readonly name = "context";
	readonly priority = 40;

	isEnabled(config: StatuslineConfig): boolean {
		return config.context.enabled;
	}

	async render(context: SegmentContext, config: StatuslineConfig): Promise<string> {
		const { global } = config;
		const percentage = Math.round(context.context.percentage);
		const alertPercentage = Math.round(
			calculateAlertPercentage(context.context.percentage, context.context.maxTokens),
		);
		const labelPart = global.showLabels ? `${colors.magenta("context:")} ` : "";

		let result = `${labelPart}${progressiveColor(alertPercentage, `${percentage}%`)}`;

		if (config.context.progressBar.enabled) {
			let bar = generateProgressBar(percentage, {
				style: config.context.progressBar.style,
				length: config.context.progressBar.length,
				useProgressiveColor: false,
			});
			if (config.context.progressBar.useProgressiveColor) {
				bar = progressiveColor(alertPercentage, bar);
			}
			result += ` ${bar}`;
		}

		return result;
	}
}
