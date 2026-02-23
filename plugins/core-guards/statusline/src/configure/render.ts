/**
 * Statusline configurator - Terminal render helpers
 * @module configure/render
 */

import type { Terminal } from "terminal-kit";
import type { StatuslineConfig } from "../config/schema";
import { getValue, OPTIONS } from "./options";
import { renderPreview } from "./preview";

/** Render the option value display (checkmark, style name, or separator). */
function formatValue(config: StatuslineConfig, opt: (typeof OPTIONS)[number]): string {
	if (opt.isStyle) return `\x1b[33m${config.context.progressBar.style}\x1b[0m`;
	if (opt.isSeparator) return `\x1b[33m"${config.global.separator}"\x1b[0m`;
	return getValue(config, opt.key) ? "\x1b[32m✓\x1b[0m" : "\x1b[31m✗\x1b[0m";
}

/** Render full configurator UI to terminal. */
export function renderUI(term: Terminal, config: StatuslineConfig): void {
	term.clear();
	term.moveTo(1, 1);
	term.cyan("╔════════════════════════════════════════════════════════════════════════════════╗\n");
	term
		.cyan("║")
		.white.bold("     🎨 STATUSLINE CONFIGURATOR - TAPE UN NUMÉRO POUR TOGGLE!                  ")
		.cyan("║\n");
	term.cyan(
		"╚════════════════════════════════════════════════════════════════════════════════╝\n\n",
	);

	term.yellow.bold("📺 PREVIEW:\n");
	term.gray("┌────────────────────────────────────────────────────────────────────────────────┐\n");
	term(`│ ${renderPreview(config).padEnd(100)}│\n`);
	term.gray(
		"└────────────────────────────────────────────────────────────────────────────────┘\n\n",
	);

	const half = Math.ceil(OPTIONS.length / 2);
	for (let i = 0; i < half; i++) {
		const left = OPTIONS[i];
		const right = OPTIONS[i + half];

		term.cyan.bold(` [${left.num}] `);
		term(`${formatValue(config, left)} ${left.label}`.padEnd(30));

		if (right) {
			term.cyan.bold(` [${right.num}] `);
			term(`${formatValue(config, right)} ${right.label}`.padEnd(30));
		}
		term("\n");
	}

	term("\n");
	term.green.bold(" [S] ").white("Sauvegarder  ");
	term.red.bold(" [Q] ").white("Quitter  ");
	term.yellow.bold(" [R] ").white("Reset\n");
	term.cyan("\n TAPE 1-9, 0, a-f pour toggle rapidement!\n");
}
