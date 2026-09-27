/**
 * Daily Spend Segment - Displays daily spend
 *
 * @description SRP: Daily spend display only
 */

import type { StatuslineConfig } from "../config/schema";
import type { ISegment, SegmentContext } from "../interfaces";
import { colors, formatCost } from "../utils";

export class DailySpendSegment implements ISegment {
	readonly name = "dailySpend";
	readonly priority = 80;

	isEnabled(config: StatuslineConfig): boolean {
		return config.dailySpend.enabled;
	}

	async render(context: SegmentContext, config: StatuslineConfig): Promise<string> {
		if (!context.dailySpend) return "";

		const { dailySpend, global, icons } = config;
		const label = global.showLabels ? "Daily:" : `${icons.cost} D:`;
		let result = `${colors.orange(label)} ${colors.yellow(formatCost(context.dailySpend.cost))}`;

		if (dailySpend.showBudget && context.dailySpend.budget) {
			result += `${colors.gray("/")}${colors.gray(formatCost(context.dailySpend.budget))}`;
		}

		return result;
	}
}
