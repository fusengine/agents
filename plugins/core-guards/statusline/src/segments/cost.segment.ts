/**
 * Cost Segment - Displays the session cost
 *
 * @description SRP: Cost display only
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
		const { global, cost } = config;
		// The JSON payload (stdin) is not type-safe: total_cost_usd may be null
		// or a string despite the typing. `?? 0` alone does not catch a string
		// and would crash formatCost (`cost.toFixed is not a function`).
		const rawCost = context.input.cost?.total_cost_usd;
		const totalCost = typeof rawCost === "number" && Number.isFinite(rawCost) ? rawCost : 0;
		const costStr = formatCost(totalCost, cost.decimals);

		// Text label (cost:): show label + cost
		// $ icon (default): formatCost already includes the $, no label needed
		if (global.showLabels || cost.showLabel) {
			return `${colors.yellow("cost:")} ${costStr}`;
		}

		return colors.yellow(costStr);
	}
}
