/**
 * Statusline configurator - Options constants and toggle logic
 * @module configure/options
 */

import type { StatuslineConfig } from "../config/schema";

/** Menu options with keyboard shortcuts. */
export const OPTIONS = [
	{ key: "claude.enabled", label: "◆ Claude", num: "1" },
	{ key: "directory.enabled", label: "⌂ Directory", num: "2" },
	{ key: "model.enabled", label: "⚙ Model", num: "3" },
	{ key: "context.enabled", label: "📊 Context", num: "4" },
	{ key: "context.progressBar.style", label: "Style", num: "5", isStyle: true },
	{ key: "cost.enabled", label: "$ Cost", num: "6" },
	{ key: "fiveHour.enabled", label: "⏰ 5-Hour", num: "7" },
	{ key: "weekly.enabled", label: "📅 Weekly", num: "8" },
	{ key: "dailySpend.enabled", label: "💰 Daily", num: "9" },
	{ key: "global.separator", label: "🔗 Separator", num: "0", isSeparator: true },
	{ key: "node.enabled", label: "⬢ Node", num: "a" },
	{ key: "edits.enabled", label: "± Edits", num: "b" },
	{ key: "global.showLabels", label: "🏷️ Labels", num: "c" },
	{ key: "directory.showBranch", label: "Branch", num: "d" },
	{ key: "model.showTokens", label: "Tokens", num: "e" },
	{ key: "fiveHour.showTimeLeft", label: "TimeLeft", num: "f" },
];

/** Get a nested config value by dot-separated key path. */
export function getValue(c: StatuslineConfig, key: string): boolean {
	const parts = key.split(".");
	let v: unknown = c;
	for (const p of parts) v = (v as Record<string, unknown>)?.[p];
	return v as boolean;
}

/** Toggle a config value (boolean, style cycle, or separator cycle). */
export function toggle(c: StatuslineConfig, key: string): void {
	if (key === "context.progressBar.style") {
		const styles = ["filled", "braille", "dots", "line", "blocks", "vertical"] as const;
		const i = styles.indexOf(c.context.progressBar.style);
		c.context.progressBar.style = styles[(i + 1) % styles.length];
		c.fiveHour.progressBar.style = c.context.progressBar.style;
		return;
	}
	if (key === "global.separator") {
		const seps = ["|", "-", "│", "·", " "];
		const i = seps.indexOf(c.global.separator);
		c.global.separator = seps[(i + 1) % seps.length];
		return;
	}
	const parts = key.split(".");
	const last = parts.at(-1);
	if (!last) return;
	let obj: Record<string, unknown> = c;
	for (const p of parts.slice(0, -1)) obj = obj[p] as Record<string, unknown>;
	obj[last] = !obj[last];
}
