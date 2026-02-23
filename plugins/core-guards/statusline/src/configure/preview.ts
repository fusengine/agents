/**
 * Statusline configurator - Live preview rendering
 * @module configure/preview
 */

import type { StatuslineConfig } from "../config/schema";

const ESC = "\x1b";
const DIM = `${ESC}[38;5;240m`;
const RST = `${ESC}[0m`;

/** Bar characters per progress bar style. */
const BARS: Record<string, string> = {
	filled: "████████░░",
	braille: "⣿⣿⣿⣿⣿⣿⣿⣿⣀⣀",
	dots: "●●●●●●●●○○",
	line: "━━━━━━━━╌╌",
	blocks: "▰▰▰▰▰▰▰▰▱▱",
	vertical: "▮▮▮▮▮▮▮▮▯▯",
};

/** Render a colored statusline preview string. */
export function renderPreview(c: StatuslineConfig): string {
	const parts: string[] = [];
	const sep = ` ${DIM}${c.global.separator}${RST} `;

	if (c.claude.enabled) parts.push(`${ESC}[34m◆${RST} 2.0.76`);
	if (c.directory.enabled) {
		let d = `${ESC}[36m⌂${RST} proj`;
		if (c.directory.showBranch) d += ` ${DIM}⎇${RST} main`;
		if (c.directory.showDirtyIndicator) d += `${ESC}[33m(*)${RST}`;
		parts.push(d);
	}
	if (c.model.enabled) {
		let m = `${ESC}[35m⚙${RST} Opus`;
		if (c.model.showTokens) {
			m += c.model.showMaxTokens ? ` ${ESC}[33m[172K/200K]${RST}` : ` ${ESC}[33m[172K]${RST}`;
		}
		parts.push(m);
	}
	if (c.context.enabled) {
		let ctx = `${ESC}[32m86%${RST}`;
		if (c.context.progressBar.enabled) {
			const bar = BARS[c.context.progressBar.style] || BARS.filled;
			ctx += ` ${ESC}[32m${bar}${RST}`;
		}
		parts.push(ctx);
	}
	if (c.cost.enabled) parts.push(`${ESC}[33m$${RST} $1.25`);
	if (c.fiveHour.enabled) {
		let f = `${ESC}[36m5H:${RST} 65%`;
		if (c.fiveHour.progressBar.enabled) {
			const bar = BARS[c.fiveHour.progressBar.style] || BARS.braille;
			f += ` ${ESC}[32m${bar}${RST}`;
		}
		if (c.fiveHour.showTimeLeft) f += " (3h22m)";
		parts.push(f);
	}
	if (c.weekly.enabled) parts.push(`${ESC}[35mW:${RST} 42%`);
	if (c.dailySpend.enabled) parts.push(`${ESC}[33mDay:${RST} $2.40`);
	if (c.node.enabled) parts.push(`${ESC}[32m⬢${RST} v24`);
	if (c.edits.enabled) {
		parts.push(`${ESC}[36m±${RST} ${ESC}[32m+42${RST}/${ESC}[31m-8${RST}`);
	}

	return parts.join(sep);
}
