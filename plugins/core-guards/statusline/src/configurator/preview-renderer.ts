/**
 * Preview Renderer - Renders live statusline preview
 *
 * Responsibility: Single Responsibility Principle (SRP)
 * - Only responsible for rendering the statusline preview
 */

import type { StatuslineConfig } from "../config/schema";

/**
 * Renders a live preview of the statusline based on configuration
 */
export function renderStatuslinePreview(config: StatuslineConfig): string {
	const { colors, icons, global } = config;
	const sep = ` ${colors.gray}${global.separator}${colors.reset} `;
	const showLabels = global.showLabels;

	const parts: string[] = [];

	// Claude version
	if (config.claude.enabled) {
		const claudeLabel = showLabels ? " Claude:" : "";
		parts.push(`${colors.blue}${icons.claude}${claudeLabel}${colors.reset} 2.0.76`);
	}

	// Directory + Git
	if (config.directory.enabled) {
		const dirLabel = showLabels ? " dir:" : "";
		let dirPart = `${colors.cyan}${icons.directory}${dirLabel}${colors.reset} statusline`;
		if (config.directory.showGit) {
			let gitInfo = ` ${colors.gray}${icons.git}${colors.reset}`;
			if (config.directory.showBranch) {
				gitInfo += ` main`;
			}
			if (config.directory.showDirtyIndicator) {
				gitInfo += `${colors.yellow}(*)${colors.reset}`;
			}
			if (config.directory.showStagedCount) {
				gitInfo += ` ${colors.green}+3${colors.reset}`;
			}
			if (config.directory.showUnstagedCount) {
				gitInfo += ` ${colors.red}~2${colors.reset}`;
			}
			dirPart += gitInfo;
		}
		parts.push(dirPart);
	}

	// Model + Tokens
	if (config.model.enabled) {
		const modelLabel = showLabels ? " model:" : "";
		let modelPart = `${colors.purple}${icons.model}${modelLabel}${colors.reset} Opus 4.5`;
		if (config.model.showTokens) {
			if (config.model.showMaxTokens) {
				modelPart += ` ${colors.yellow}[172K/200K]${colors.reset}`;
			} else {
				modelPart += ` ${colors.yellow}[172K]${colors.reset}`;
			}
		}
		parts.push(modelPart);
	}

	// Context percentage with progress bar
	if (config.context.enabled) {
		const contextLabel = showLabels ? "context:" : "";
		let contextPart = `${contextLabel} ${colors.green}86%${colors.reset}`;
		if (config.context.progressBar.enabled) {
			const bar = getProgressBarStyle(config.context.progressBar.style);
			contextPart += ` ${colors.green}${bar}${colors.reset}`;
		}
		parts.push(contextPart);
	}

	// Cost
	if (config.cost.enabled) {
		const costLabel = showLabels ? "cost:" : icons.cost;
		parts.push(`${colors.yellow}${costLabel}${colors.reset} $1.25`);
	}

	// 5-hour limits
	if (config.fiveHour.enabled) {
		let limitsText = `${colors.cyan}5H:${colors.reset} 65%`;
		if (config.fiveHour.progressBar.enabled) {
			const bar = getProgressBarStyle(config.fiveHour.progressBar.style);
			limitsText += ` ${colors.green}${bar}${colors.reset}`;
		}
		if (config.fiveHour.showTimeLeft) {
			limitsText += ` (3h22m)`;
		}
		parts.push(limitsText);
	}

	// Weekly limits
	if (config.weekly.enabled) {
		let weeklyText = `${colors.magenta}Weekly:${colors.reset} 42%`;
		if (config.weekly.progressBar.enabled) {
			const bar = getProgressBarStyle(config.weekly.progressBar.style);
			weeklyText += ` ${colors.green}${bar}${colors.reset}`;
		}
		if (config.weekly.showTimeLeft) {
			weeklyText += ` (4d18h)`;
		}
		if (config.weekly.showCost) {
			weeklyText += ` ${colors.yellow}$12.50${colors.reset}`;
		}
		parts.push(weeklyText);
	}

	// Daily spend
	if (config.dailySpend.enabled) {
		let dailyText = `${colors.orange}Daily:${colors.reset} ${colors.yellow}$2.40${colors.reset}`;
		if (config.dailySpend.showBudget && config.dailySpend.budget) {
			dailyText += `/${colors.gray}$${config.dailySpend.budget}${colors.reset}`;
		}
		parts.push(dailyText);
	}

	// Node version
	if (config.node.enabled) {
		const nodeLabel = showLabels ? " node:" : "";
		parts.push(`${colors.green}${icons.node}${nodeLabel}${colors.reset} v24.3.0`);
	}

	// Edits count
	if (config.edits.enabled) {
		const editsLabel = showLabels ? " edits:" : "";
		parts.push(
			`${colors.cyan}${icons.edits}${editsLabel}${colors.reset} ${colors.green}+42${colors.reset}/${colors.red}-8${colors.reset}`,
		);
	}

	return parts.join(sep);
}

/**
 * Helper: Get progress bar style characters
 */
function getProgressBarStyle(
	style: "filled" | "braille" | "dots" | "line" | "blocks" | "vertical",
): string {
	switch (style) {
		case "filled":
			return "████████▓▓";
		case "braille":
			return "⣿⣿⣿⣿⣿⣿⣿⣿⣀⣀";
		case "dots":
			return "●●●●●●●●○○";
		case "line":
			return "━━━━━━━━╌╌";
		case "blocks":
			return "▰▰▰▰▰▰▰▰▱▱";
		case "vertical":
			return "▁▂▃▄▅▆▇█▇▅";
	}
}
