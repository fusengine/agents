/**
 * Preview Sections - Renders individual statusline sections
 *
 * Responsibility: Single Responsibility Principle (SRP)
 * - Only responsible for rendering individual preview sections
 */

import type { StatuslineConfig } from "../config/schema";
import { getProgressBarStyle } from "./progress-bar.utils";

/** Renders directory section with git info */
export function renderDirectory(config: StatuslineConfig): string {
	const { colors, icons, global } = config;
	const label = global.showLabels ? " dir:" : "";
	let part = `${colors.cyan}${icons.directory}${label}${colors.reset} statusline`;
	if (config.directory.showGit) {
		let git = ` ${colors.gray}${icons.git}${colors.reset}`;
		if (config.directory.showBranch) git += ` main`;
		if (config.directory.showDirtyIndicator) git += `${colors.yellow}(*)${colors.reset}`;
		if (config.directory.showStagedCount) git += ` ${colors.green}+3${colors.reset}`;
		if (config.directory.showUnstagedCount) git += ` ${colors.red}~2${colors.reset}`;
		part += git;
	}
	return part;
}

/** Renders 5-hour limits section */
export function renderFiveHour(config: StatuslineConfig): string {
	const { colors } = config;
	let text = `${colors.cyan}5H:${colors.reset} 65%`;
	if (config.fiveHour.progressBar.enabled) {
		text += ` ${colors.green}${getProgressBarStyle(config.fiveHour.progressBar.style)}${colors.reset}`;
	}
	if (config.fiveHour.showTimeLeft) text += ` (3h22m)`;
	return text;
}

/** Renders weekly limits section */
export function renderWeekly(config: StatuslineConfig): string {
	const { colors } = config;
	let text = `${colors.magenta}Weekly:${colors.reset} 42%`;
	if (config.weekly.progressBar.enabled) {
		text += ` ${colors.green}${getProgressBarStyle(config.weekly.progressBar.style)}${colors.reset}`;
	}
	if (config.weekly.showTimeLeft) text += ` (4d18h)`;
	if (config.weekly.showCost) text += ` ${colors.yellow}$12.50${colors.reset}`;
	return text;
}

/** Renders daily spend section */
export function renderDailySpend(config: StatuslineConfig): string {
	const { colors } = config;
	let text = `${colors.orange}Daily:${colors.reset} ${colors.yellow}$2.40${colors.reset}`;
	if (config.dailySpend.showBudget && config.dailySpend.budget) {
		text += `/${colors.gray}$${config.dailySpend.budget}${colors.reset}`;
	}
	return text;
}
