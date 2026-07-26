/**
 * Effort Segment - Affiche effort/thinking/fast_mode
 *
 * @description SRP: Affichage effort de raisonnement uniquement
 */

import type { StatuslineConfig } from "../config/schema";
import type { ISegment, SegmentContext } from "../interfaces";
import { colors } from "../utils";

export class EffortSegment implements ISegment {
	readonly name = "effort";
	readonly priority = 31;

	isEnabled(config: StatuslineConfig): boolean {
		return config.effort.enabled;
	}

	async render(context: SegmentContext, config: StatuslineConfig): Promise<string> {
		const { effort, thinking, fast_mode } = context.input;
		if (!effort && !thinking && !fast_mode) return "";

		const { icons, effort: effortConfig, global } = config;
		const icon = icons.effort ?? "◐";
		const label = global.showLabels ? " Effort:" : "";

		const parts: string[] = [];
		if (effortConfig.showLevel && effort?.level) parts.push(effort.level);
		if (effortConfig.showThinking && thinking?.enabled === true) parts.push("thinking");
		if (effortConfig.showFastMode && fast_mode === true) parts.push("fast");

		if (parts.length === 0) return "";

		return `${colors.orange(icon)}${colors.orange(label)} ${parts.join(" ")}`;
	}
}
