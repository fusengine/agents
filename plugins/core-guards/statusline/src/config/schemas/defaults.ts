/**
 * Default Configuration - All default values explicitly set
 */

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
	node: { enabled: true },
	edits: { enabled: true, showLabel: false },
	global: {
		separator: "·",
		showLabels: false,
		compactMode: false,
		twoLineMode: true,
		lineSplitPriority: 45,
	},
	colors: {
		blue: "\x1b[0;34m",
		cyan: "\x1b[0;36m",
		purple: "\x1b[38;5;135m",
		yellow: "\x1b[0;33m",
		green: "\x1b[0;32m",
		red: "\x1b[0;31m",
		orange: "\x1b[38;5;208m",
		white: "\x1b[0;37m",
		magenta: "\x1b[0;35m",
		gray: "\x1b[38;5;240m",
		reset: "\x1b[0m",
	},
	icons: {
		agent: "◈",
		claude: "◆",
		directory: "⌂",
		git: "⎇",
		model: "⚙",
		node: "⬢",
		cost: "$",
		edits: "±",
		usage: "⏱",
		time: "",
		warning: "⚠",
		check: "✓",
		cross: "✗",
		arrow: "❯",
	},
};
