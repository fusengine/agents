#!/usr/bin/env bun
/**
 * Statusline Configurator - Terminal-Kit
 * Preview en temps réel + Navigation clavier
 */

import termkit from "terminal-kit";
import { ConfigManager } from "./src/config/manager";
import type { StatuslineConfig } from "./src/config/schema";

const term = termkit.terminal;
const manager = new ConfigManager();

const OPTIONS = [
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

function getValue(c: StatuslineConfig, key: string): boolean {
	const parts = key.split(".");
	let v: unknown = c;
	for (const p of parts) v = (v as Record<string, unknown>)?.[p];
	return v as boolean;
}

function toggle(c: StatuslineConfig, key: string): void {
	if (key === "context.progressBar.style") {
		const styles = ["filled", "braille", "dots", "line", "blocks"] as const;
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
	const last = parts.pop()!;
	let obj: Record<string, unknown> = c;
	for (const p of parts) obj = obj[p] as Record<string, unknown>;
	obj[last] = !obj[last];
}

function renderPreview(c: StatuslineConfig): string {
	const parts: string[] = [];
	const sep = ` \x1b[38;5;240m${c.global.separator}\x1b[0m `;

	if (c.claude.enabled) parts.push("\x1b[34m◆\x1b[0m 2.0.76");
	if (c.directory.enabled) {
		let d = "\x1b[36m⌂\x1b[0m proj";
		if (c.directory.showBranch) d += " \x1b[38;5;240m⎇\x1b[0m main";
		if (c.directory.showDirtyIndicator) d += "\x1b[33m(*)\x1b[0m";
		parts.push(d);
	}
	if (c.model.enabled) {
		let m = "\x1b[35m⚙\x1b[0m Opus";
		if (c.model.showTokens) m += c.model.showMaxTokens ? " \x1b[33m[172K/200K]\x1b[0m" : " \x1b[33m[172K]\x1b[0m";
		parts.push(m);
	}
	if (c.context.enabled) {
		let ctx = "\x1b[32m86%\x1b[0m";
		if (c.context.progressBar.enabled) {
			const bars: Record<string, string> = {
				filled: "████████░░",
				braille: "⣿⣿⣿⣿⣿⣿⣿⣿⣀⣀",
				dots: "●●●●●●●●○○",
				line: "━━━━━━━━╌╌",
				blocks: "▰▰▰▰▰▰▰▰▱▱",
			};
			ctx += ` \x1b[32m${bars[c.context.progressBar.style] || bars.filled}\x1b[0m`;
		}
		parts.push(ctx);
	}
	if (c.cost.enabled) parts.push("\x1b[33m$\x1b[0m $1.25");
	if (c.fiveHour.enabled) {
		let f = "\x1b[36m5H:\x1b[0m 65%";
		if (c.fiveHour.progressBar.enabled) {
			const bars: Record<string, string> = {
				filled: "██████░░░░",
				braille: "⣿⣿⣿⣿⣿⣿⣀⣀⣀⣀",
				dots: "●●●●●●○○○○",
				line: "━━━━━━╌╌╌╌",
				blocks: "▰▰▰▰▰▰▱▱▱▱",
			};
			f += ` \x1b[32m${bars[c.fiveHour.progressBar.style] || bars.braille}\x1b[0m`;
		}
		if (c.fiveHour.showTimeLeft) f += " (3h22m)";
		parts.push(f);
	}
	if (c.weekly.enabled) parts.push("\x1b[35mW:\x1b[0m 42%");
	if (c.dailySpend.enabled) parts.push("\x1b[33mDay:\x1b[0m $2.40");
	if (c.node.enabled) parts.push("\x1b[32m⬢\x1b[0m v24");
	if (c.edits.enabled) parts.push("\x1b[36m±\x1b[0m \x1b[32m+42\x1b[0m/\x1b[31m-8\x1b[0m");

	return parts.join(sep);
}

async function main() {
	const config = await manager.load();
	let selected = 0;

	term.grabInput({ mouse: "button" });

	const render = () => {
		term.clear();
		term.moveTo(1, 1);

		// Header
		term.cyan("╔════════════════════════════════════════════════════════════════════════════════╗\n");
		term.cyan("║").white.bold("     🎨 STATUSLINE CONFIGURATOR - TAPE UN NUMÉRO POUR TOGGLE!                  ").cyan("║\n");
		term.cyan("╚════════════════════════════════════════════════════════════════════════════════╝\n\n");

		// Preview
		term.yellow.bold("📺 PREVIEW:\n");
		term.gray("┌────────────────────────────────────────────────────────────────────────────────┐\n");
		term(`│ ${renderPreview(config).padEnd(100)}│\n`);
		term.gray("└────────────────────────────────────────────────────────────────────────────────┘\n\n");

		// Options in 2 columns with numbers
		const half = Math.ceil(OPTIONS.length / 2);
		for (let i = 0; i < half; i++) {
			const left = OPTIONS[i];
			const right = OPTIONS[i + half];

			// Left column
			const valLeft = left.isStyle
				? `\x1b[33m${config.context.progressBar.style}\x1b[0m`
				: left.isSeparator
					? `\x1b[33m"${config.global.separator}"\x1b[0m`
					: getValue(config, left.key) ? "\x1b[32m✓\x1b[0m" : "\x1b[31m✗\x1b[0m";

			term.cyan.bold(` [${left.num}] `);
			term(`${valLeft} ${left.label}`.padEnd(30));

			// Right column
			if (right) {
				const valRight = right.isStyle
					? `\x1b[33m${config.context.progressBar.style}\x1b[0m`
					: right.isSeparator
						? `\x1b[33m"${config.global.separator}"\x1b[0m`
						: getValue(config, right.key) ? "\x1b[32m✓\x1b[0m" : "\x1b[31m✗\x1b[0m";

				term.cyan.bold(` [${right.num}] `);
				term(`${valRight} ${right.label}`.padEnd(30));
			}
			term("\n");
		}

		term("\n");
		term.green.bold(" [S] ").white("Sauvegarder  ");
		term.red.bold(" [Q] ").white("Quitter  ");
		term.yellow.bold(" [R] ").white("Reset\n");
		term.cyan("\n TAPE 1-9, 0, a-f pour toggle rapidement!\n");
	};

	render();

	term.on("key", async (key: string) => {
		// Numbered shortcuts: 1-9, 0, a-f
		const numKey = key.toLowerCase();
		const option = OPTIONS.find((o) => o.num === numKey);
		if (option) {
			toggle(config, option.key);
			render();
			return;
		}

		if (key === "UP") {
			selected = (selected - 1 + OPTIONS.length) % OPTIONS.length;
			render();
		} else if (key === "DOWN") {
			selected = (selected + 1) % OPTIONS.length;
			render();
		} else if (key === "ENTER") {
			toggle(config, OPTIONS[selected].key);
			render();
		} else if (numKey === "s") {
			await manager.save(config);
			term.clear();
			term.green("\n✓ Configuration sauvegardée!\n\n");
			process.exit(0);
		} else if (numKey === "q" || key === "ESCAPE" || key === "CTRL_C") {
			term.clear();
			term.cyan("\n✨ Bye!\n\n");
			process.exit(0);
		} else if (numKey === "r") {
			const reset = await manager.reset();
			Object.assign(config, reset);
			render();
		}
	});

	term.on("mouse", (name: string, data: { y: number; x: number }) => {
		if (name === "MOUSE_LEFT_BUTTON_PRESSED") {
			// Check if click is in options area (rows 9-18 approximately)
			const row = data.y - 9;
			if (row >= 0 && row < Math.ceil(OPTIONS.length / 2)) {
				const col = data.x < 40 ? 0 : 1;
				const idx = row + col * Math.ceil(OPTIONS.length / 2);
				if (idx < OPTIONS.length) {
					selected = idx;
					toggle(config, OPTIONS[idx].key);
					render();
				}
			}
		}
	});
}

main().catch((err) => {
	term.red(`Error: ${err}\n`);
	process.exit(1);
});
