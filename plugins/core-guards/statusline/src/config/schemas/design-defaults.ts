/**
 * Design Default Configuration - Colors and icons default values
 *
 * @description SRP: Separated from main defaults for file size compliance
 */

import type { StatuslineConfig } from "./index";

type DesignConfig = Pick<StatuslineConfig, "global" | "colors" | "icons">;

/** Default design configuration (global, colors, icons) */
export const defaultDesignConfig: DesignConfig = {
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
