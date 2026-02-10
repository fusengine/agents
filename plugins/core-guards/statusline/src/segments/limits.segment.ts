/**
 * Limits Segment - Affiche les vraies limites via OAuth
 *
 * @description SRP: Affichage limites OAuth uniquement
 */

import type { StatuslineConfig } from "../config/schema";
import type { ISegment, SegmentContext } from "../interfaces";
import { formatUsage, getUsageLimits } from "../services/oauth.service";
import { colors, formatTimeLeft, generateProgressBar, progressiveColor } from "../utils";

export class LimitsSegment implements ISegment {
	readonly name = "limits";
	readonly priority = 55;

	isEnabled(config: StatuslineConfig): boolean {
		return config.limits?.enabled ?? false;
	}

	async render(_context: SegmentContext, config: StatuslineConfig): Promise<string> {
		const usage = await getUsageLimits();
		if (!usage) return colors.gray("OAuth: N/A");

		const formatted = formatUsage(usage);
		const limitsConfig = config.limits ?? { show5h: true, show7d: true, showOpus: false };
		const parts: string[] = [];

		const barCfg = limitsConfig.progressBar ?? { enabled: true, style: "filled", length: 4 };

		if (limitsConfig.show5h !== false) {
			const pct = Math.round(formatted.fiveHour.percentage);
			const seg = [`${colors.cyan("5h:")} ${progressiveColor(pct, `${pct}%`)}`];
			if (barCfg.enabled) {
				seg.push(
					generateProgressBar(pct, {
						style: barCfg.style,
						length: barCfg.length,
						useProgressiveColor: true,
					}),
				);
			}
			if (formatted.fiveHour.timeLeft > 0) {
				seg.push(colors.gray(`(${formatTimeLeft(formatted.fiveHour.timeLeft)})`));
			}
			parts.push(seg.join(" "));
		}

		if (limitsConfig.show7d !== false) {
			const pct = Math.round(formatted.sevenDay.percentage);
			const seg = [`${colors.blue("7d:")} ${progressiveColor(pct, `${pct}%`)}`];
			if (barCfg.enabled) {
				seg.push(
					generateProgressBar(pct, {
						style: barCfg.style,
						length: barCfg.length,
						useProgressiveColor: true,
					}),
				);
			}
			if (formatted.sevenDay.timeLeft > 0) {
				seg.push(colors.gray(`(${formatTimeLeft(formatted.sevenDay.timeLeft)})`));
			}
			parts.push(seg.join(" "));
		}

		if (limitsConfig.showOpus) {
			const pct = Math.round(formatted.opus.percentage);
			const seg = [`${colors.magenta("Opus:")} ${progressiveColor(pct, `${pct}%`)}`];
			if (barCfg.enabled) {
				seg.push(
					generateProgressBar(pct, {
						style: barCfg.style,
						length: barCfg.length,
						useProgressiveColor: true,
					}),
				);
			}
			parts.push(seg.join(" "));
		}

		return parts.join(" ");
	}
}
