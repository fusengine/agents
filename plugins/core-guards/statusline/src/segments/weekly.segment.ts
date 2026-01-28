/**
 * Weekly Segment - Affiche l'usage hebdomadaire
 *
 * @description SRP: Affichage limite 7j uniquement
 */

import type { StatuslineConfig } from "../config/schema";
import type { ISegment, SegmentContext } from "../interfaces";
import { colors, formatCost, formatTimeLeft, generateProgressBar, progressiveColor } from "../utils";

export class WeeklySegment implements ISegment {
	readonly name = "weekly";
	readonly priority = 70;

	isEnabled(config: StatuslineConfig): boolean {
		return config.weekly.enabled;
	}

	async render(context: SegmentContext, config: StatuslineConfig): Promise<string> {
		if (!context.weeklyUsage) return "";

		const { weekly, global, icons } = config;
		const { weeklyUsage } = context;
		const percentage = Math.round(weeklyUsage.percentage);

		const label = global.showLabels ? "Weekly:" : `${icons.usage} W:`;
		let result = `${colors.magenta(label)} ${progressiveColor(percentage, `${percentage}%`)}`;

		if (weekly.progressBar.enabled) {
			const bar = generateProgressBar(percentage, {
				style: weekly.progressBar.style,
				length: weekly.progressBar.length,
				useProgressiveColor: weekly.progressBar.useProgressiveColor,
			});
			result += ` ${bar}`;
		}

		if (weekly.showTimeLeft) {
			result += ` ${colors.gray(`(${formatTimeLeft(weeklyUsage.timeLeft)})`)}`;
		}

		if (weekly.showCost) {
			result += ` ${colors.yellow(formatCost(weeklyUsage.cost))}`;
		}

		return result;
	}
}
