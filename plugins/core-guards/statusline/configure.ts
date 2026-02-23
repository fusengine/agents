#!/usr/bin/env bun
/**
 * Statusline Configurator - Terminal-Kit entry point
 * Preview en temps réel + Navigation clavier
 */

import termkit from "terminal-kit";
import { ConfigManager } from "./src/config/manager";
import { OPTIONS, toggle } from "./src/configure/options";
import { renderUI } from "./src/configure/render";

const term = termkit.terminal;
const manager = new ConfigManager();

/**
 * Main configurator loop with keyboard and mouse input.
 * Handles numeric toggles, arrow navigation, mouse clicks, and save/reset/quit commands.
 */
async function main() {
	const config = await manager.load();
	let selected = 0;
	const render = () => renderUI(term, config);

	term.grabInput({ mouse: "button" });
	render();

	term.on("key", async (key: string) => {
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
		if (name !== "MOUSE_LEFT_BUTTON_PRESSED") return;
		const row = data.y - 9;
		const half = Math.ceil(OPTIONS.length / 2);
		if (row >= 0 && row < half) {
			const idx = row + (data.x < 40 ? 0 : 1) * half;
			if (idx < OPTIONS.length) {
				selected = idx;
				toggle(config, OPTIONS[idx].key);
				render();
			}
		}
	});
}

main().catch((err) => {
	term.red(`Error: ${err}\n`);
	process.exit(1);
});
