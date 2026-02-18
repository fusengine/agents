/**
 * Default Configuration - All default values explicitly set
 *
 * @description SRP: Segment defaults only, design defaults in design-defaults.ts
 */

import { defaultDesignConfig } from "./design-defaults";
import type { StatuslineConfig } from "./index";

const defaultProgressBar = {
	enabled: true,
	style: "blocks" as const,
	length: 4,
	color: "progressive" as const,
	useProgressiveColor: true,
};
const defaultBrailleBar = { ...defaultProgressBar, style: "braille" as const, length: 4 };

export const defaultConfig: StatuslineConfig = {
	version: "1.0.0",
	agent: { enabled: true },
	claude: { enabled: true, showVersion: true },
	directory: {
		enabled: true,
		showGit: true,
		showBranch: true,
		showDirtyIndicator: true,
		showStagedCount: true,
		showUnstagedCount: true,
		pathStyle: "truncated",
	},
	model: { enabled: true, showTokens: true, showMaxTokens: true, showDecimals: true },
	context: {
		enabled: true,
		progressBar: defaultProgressBar,
		estimateOverhead: true,
		overheadTokens: 37000,
	},
	cost: { enabled: true, decimals: 2, showLabel: false },
	time: { enabled: true, showDate: true, showTime: true },
	fiveHour: {
		enabled: true,
		showTimeLeft: true,
		showCost: false,
		showPercentage: true,
		progressBar: defaultBrailleBar,
	},
	limits: {
		enabled: false,
		show5h: true,
		show7d: true,
		showOpus: false,
		showSonnet: false,
		showResetTime: true,
		progressBar: { ...defaultProgressBar, length: 4 },
	},
	weekly: {
		enabled: true,
		showTimeLeft: true,
		showCost: false,
		showPercentage: true,
		progressBar: defaultBrailleBar,
	},
	dailySpend: { enabled: true, showBudget: false, warnThreshold: 80 },
	extraUsage: {
		enabled: false,
		showPercentage: true,
		showSpending: true,
		showResetDate: true,
		progressBar: { ...defaultProgressBar, style: "filled" as const, length: 4 },
	},
	node: { enabled: true },
	edits: { enabled: true, showLabel: false },
	...defaultDesignConfig,
};
