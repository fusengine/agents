/**
 * Cost Segment - Affiche le cout de session
 *
 * @description SRP: Affichage cout uniquement
 */

import type { StatuslineConfig } from "../config/schema";
import type { ISegment, SegmentContext } from "../interfaces";
import { colors, formatCost } from "../utils";

export class CostSegment implements ISegment {
	readonly name = "cost";
	readonly priority = 50;

	isEnabled(config: StatuslineConfig): boolean {
		return config.cost.enabled;
	}

	async render(context: SegmentContext, config: StatuslineConfig): Promise<string> {
		const { icons, global, cost } = config;
		const totalCost = context.input.cost.total_cost_usd;

		let label = icons.cost;
		if (global.showLabels || cost.showLabel) {
			label = "cost:";
		}

		return `${colors.yellow(label)} ${formatCost(totalCost, cost.decimals)}`;
	}
}
