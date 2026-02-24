/**
 * Preview Renderer - Renders live statusline preview
 *
 * Responsibility: Single Responsibility Principle (SRP)
 * - Orchestrates section rendering, delegates to preview-sections
 */

import type { StatuslineConfig } from "../config/schema";
import {
	renderDailySpend,
	renderDirectory,
	renderFiveHour,
	renderWeekly,
} from "./preview-sections";
import { getProgressBarStyle } from "./progress-bar.utils";

/**
 * Renders a live preview of the statusline based on configuration
 */
export function renderStatuslinePreview(config: StatuslineConfig): string {
	const { colors, icons, global } = config;
	const sep = ` ${colors.gray}${global.separator}${colors.reset} `;
	const showLabels = global.showLabels;
	const parts: string[] = [];

	if (config.claude.enabled) {
		const label = showLabels ? " Claude:" : "";
		parts.push(`${colors.blue}${icons.claude}${label}${colors.reset} 2.0.76`);
	}

	if (config.directory.enabled) parts.push(renderDirectory(config));

	if (config.model.enabled) {
		const label = showLabels ? " model:" : "";
		let part = `${colors.purple}${icons.model}${label}${colors.reset} Opus 4.5`;
		if (config.model.showTokens) {
			part += config.model.showMaxTokens
				? ` ${colors.yellow}[172K/200K]${colors.reset}`
				: ` ${colors.yellow}[172K]${colors.reset}`;
		}
		parts.push(part);
	}

	if (config.context.enabled) {
		const label = showLabels ? "context:" : "";
		let part = `${label} ${colors.green}86%${colors.reset}`;
		if (config.context.progressBar.enabled) {
			part += ` ${colors.green}${getProgressBarStyle(config.context.progressBar.style)}${colors.reset}`;
		}
		parts.push(part);
	}

	if (config.cost.enabled) {
		const label = showLabels ? "cost:" : icons.cost;
		parts.push(`${colors.yellow}${label}${colors.reset} $1.25`);
	}

	if (config.fiveHour.enabled) parts.push(renderFiveHour(config));
	if (config.weekly.enabled) parts.push(renderWeekly(config));
	if (config.dailySpend.enabled) parts.push(renderDailySpend(config));

	if (config.node.enabled) {
		const label = showLabels ? " node:" : "";
		parts.push(`${colors.green}${icons.node}${label}${colors.reset} v24.3.0`);
	}

	if (config.edits.enabled) {
		const label = showLabels ? " edits:" : "";
		parts.push(
			`${colors.cyan}${icons.edits}${label}${colors.reset} ${colors.green}+42${colors.reset}/${colors.red}-8${colors.reset}`,
		);
	}

	return parts.join(sep);
}
