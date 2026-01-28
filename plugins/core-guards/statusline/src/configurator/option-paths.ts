/**
 * Option Paths - Mapping of option keys to config paths
 *
 * @description OCP: Extensible without modification - just add new entries
 */

/**
 * Option path mapping
 * To add a new option: just add a new entry here, no code changes needed!
 */
export const OPTION_PATHS: Record<string, string> = {
	// CLAUDE
	"claude.enabled": "claude.enabled",
	"claude.version": "claude.showVersion",

	// MODEL
	"model.enabled": "model.enabled",
	"model.tokens": "model.showTokens",
	"model.maxTokens": "model.showMaxTokens",

	// CONTEXT
	"context.enabled": "context.enabled",
	"context.progressBar": "context.progressBar.enabled",

	// COST
	"cost.enabled": "cost.enabled",

	// 5-HOUR LIMITS
	"fiveHour.enabled": "fiveHour.enabled",
	"fiveHour.timeLeft": "fiveHour.showTimeLeft",
	"fiveHour.progressBar": "fiveHour.progressBar.enabled",

	// OAUTH LIMITS
	"limits.enabled": "limits.enabled",
	"limits.show5h": "limits.show5h",
	"limits.show7d": "limits.show7d",
	"limits.showResetTime": "limits.showResetTime",
	"limits.progressBar": "limits.progressBar.enabled",

	// WEEKLY LIMITS
	"weekly.enabled": "weekly.enabled",
	"weekly.timeLeft": "weekly.showTimeLeft",
	"weekly.cost": "weekly.showCost",
	"weekly.progressBar": "weekly.progressBar.enabled",

	// DIRECTORY/GIT
	"directory.enabled": "directory.enabled",
	"directory.git": "directory.showGit",
	"directory.branch": "directory.showBranch",
	"directory.dirty": "directory.showDirtyIndicator",
	"directory.staged": "directory.showStagedCount",
	"directory.unstaged": "directory.showUnstagedCount",

	// DAILY SPEND
	"daily.enabled": "dailySpend.enabled",
	"daily.budget": "dailySpend.showBudget",

	// GLOBAL
	"global.labels": "global.showLabels",
	"global.compact": "global.compactMode",

	// NODE & EDITS
	"node.enabled": "node.enabled",
	"edits.enabled": "edits.enabled",
};
