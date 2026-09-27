/**
 * Extra Usage Segment - Displays extra usage spend via OAuth
 *
 * @description SRP: Overage billing display from the OAuth API
 */

import type { StatuslineConfig } from "../config/schema";
import type { ISegment, SegmentContext } from "../interfaces";
import { getUsageLimits } from "../services/oauth.service";
import { colors, generateProgressBar, progressiveColor } from "../utils";

export class ExtraUsageSegment implements ISegment {
	readonly name = "extraUsage";
	readonly priority = 75;

	/** Checks whether the segment is enabled in the config */
	isEnabled(config: StatuslineConfig): boolean {
		return config.extraUsage?.enabled ?? false;
	}

	/** Renders the extra usage segment from the OAuth API */
	async render(_context: SegmentContext, config: StatuslineConfig): Promise<string> {
		const usage = await getUsageLimits();
		if (!usage?.extra_usage?.is_enabled) return "";

		const extra = usage.extra_usage;
		const extraCfg = config.extraUsage;
		const parts: string[] = [];
		const pct = Math.round(extra.utilization);
		const usedDollars = extra.used_credits / 100;
		const limitDollars = extra.monthly_limit / 100;

		parts.push(colors.green("extra:"));

		if (extraCfg?.showPercentage !== false) {
			parts.push(progressiveColor(pct, `${pct}%`));
		}

		const barCfg = extraCfg?.progressBar ?? { enabled: true, style: "filled", length: 4 };
		if (barCfg.enabled) {
			parts.push(
				generateProgressBar(pct, {
					style: barCfg.style,
					length: barCfg.length,
					useProgressiveColor: true,
				}),
			);
		}

		if (extraCfg?.showSpending !== false) {
			parts.push(colors.yellow(`$${usedDollars.toFixed(2)}/$${limitDollars.toFixed(2)}`));
		}

		return parts.join(" ");
	}
}
