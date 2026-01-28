/**
 * Context Segment - Affiche le pourcentage de contexte
 *
 * @description SRP: Affichage contexte uniquement
 */

import type { StatuslineConfig } from "../config/schema";
import type { ISegment, SegmentContext } from "../interfaces";
import { colors, generateProgressBar, progressiveColor } from "../utils";

export class ContextSegment implements ISegment {
	readonly name = "context";
	readonly priority = 40;

	isEnabled(config: StatuslineConfig): boolean {
		return config.context.enabled;
	}

	async render(context: SegmentContext, config: StatuslineConfig): Promise<string> {
		const { global } = config;
		const percentage = Math.round(context.context.percentage);
		const labelPart = global.showLabels ? `${colors.magenta("context:")} ` : "";

		let result = `${labelPart}${progressiveColor(percentage, `${percentage}%`)}`;

		if (config.context.progressBar.enabled) {
			const bar = generateProgressBar(percentage, {
				style: config.context.progressBar.style,
				length: config.context.progressBar.length,
				useProgressiveColor: config.context.progressBar.useProgressiveColor,
			});
			result += ` ${bar}`;
		}

		return result;
	}
}
