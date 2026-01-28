/**
 * Five Hour Segment - Affiche l'usage 5h
 *
 * @description SRP: Affichage limite 5h uniquement
 */

import type { StatuslineConfig } from "../config/schema";
import type { ISegment, SegmentContext } from "../interfaces";
import { colors, formatTimeLeft, generateProgressBar, progressiveColor } from "../utils";

export class FiveHourSegment implements ISegment {
	readonly name = "fiveHour";
	readonly priority = 60;

	isEnabled(config: StatuslineConfig): boolean {
		return config.fiveHour.enabled;
	}

	async render(context: SegmentContext, config: StatuslineConfig): Promise<string> {
		const { fiveHour, global, icons } = config;
		const { fiveHourUsage } = context;
		const percentage = Math.round(fiveHourUsage.percentage);

		const label = global.showLabels ? "5-Hour:" : `${icons.usage} 5H:`;
		const parts: string[] = [colors.cyan(label)];

		if (fiveHour.showPercentage) {
			parts.push(progressiveColor(percentage, `${percentage}%`));
		}

		if (fiveHour.progressBar.enabled) {
			const bar = generateProgressBar(percentage, {
				style: fiveHour.progressBar.style,
				length: fiveHour.progressBar.length,
				useProgressiveColor: fiveHour.progressBar.useProgressiveColor,
			});
			parts.push(bar);
		}

		if (fiveHour.showTimeLeft) {
			parts.push(colors.gray(`(${formatTimeLeft(fiveHourUsage.timeLeft)})`));
		}

		if (fiveHour.showCost && fiveHourUsage.cost !== undefined) {
			parts.push(colors.yellow(`$${fiveHourUsage.cost.toFixed(2)}`));
		}

		return parts.join(" ");
	}
}
