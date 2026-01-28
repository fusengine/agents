/**
 * Progress Bar Module - Generation de barres de progression
 *
 * @description SRP: Responsabilite unique de generation de barres
 */

import { GRADIENT_BLOCKS, PROGRESS_BAR_DEFAULTS, PROGRESS_CHARS } from "../constants";
import { progressiveColor } from "./colors";

export interface ProgressBarOptions {
	style?: keyof typeof PROGRESS_CHARS;
	length?: number;
	useProgressiveColor?: boolean;
	showPercentage?: boolean;
}

export function generateProgressBar(
	percentage: number,
	options: ProgressBarOptions = {},
): string {
	const {
		style = PROGRESS_BAR_DEFAULTS.STYLE,
		length = PROGRESS_BAR_DEFAULTS.LENGTH,
		useProgressiveColor = false,
		showPercentage = false,
	} = options;

	const safePercent = Math.max(0, Math.min(100, Number.isNaN(percentage) ? 0 : percentage));
	const filledCount = Math.round((safePercent / 100) * length);
	const emptyCount = Math.max(0, length - filledCount);

	const chars = PROGRESS_CHARS[style];
	let bar = chars.fill.repeat(filledCount) + chars.empty.repeat(emptyCount);

	if (useProgressiveColor) {
		bar = progressiveColor(safePercent, bar);
	}

	if (showPercentage) {
		const pctText = `${Math.round(safePercent)}%`;
		bar += ` ${useProgressiveColor ? progressiveColor(safePercent, pctText) : pctText}`;
	}

	return bar;
}

export function generateGradientBar(percentage: number, length: number = 10): string {
	const safePercent = Math.max(0, Math.min(100, Number.isNaN(percentage) ? 0 : percentage));
	const exactFilled = (safePercent / 100) * length;
	const fullBlocks = Math.floor(exactFilled);
	const remainder = exactFilled - fullBlocks;

	let bar = GRADIENT_BLOCKS[8].repeat(fullBlocks);

	if (fullBlocks < length && remainder > 0) {
		const partialIndex = Math.floor(remainder * 8);
		bar += GRADIENT_BLOCKS[partialIndex];
	}

	const remaining = length - bar.length;
	if (remaining > 0) {
		bar += " ".repeat(remaining);
	}

	return progressiveColor(safePercent, bar);
}
