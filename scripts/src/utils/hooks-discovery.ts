/**
 * Plugin hooks discovery
 * Single Responsibility: locate `hooks.json` for every plugin dir
 */
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Dynamically lists every `pluginsDir/<name>/hooks/hooks.json` — no hardcoded
 * plugin names, except `memory-neural`: it's .gitignore'd (owner's dormant WIP,
 * out of distribution) and intentionally left on the old ${CLAUDE_PLUGIN_ROOT}
 * path, so discovery must skip it.
 *
 * @param pluginsDir - Directory holding plugin subfolders
 * @returns Absolute paths of existing plugin hooks.json files
 */
export function discoverHooksFiles(pluginsDir: string): string[] {
	return readdirSync(pluginsDir, { withFileTypes: true })
		.filter((entry) => entry.isDirectory() && entry.name !== "memory-neural")
		.map((entry) => join(pluginsDir, entry.name, "hooks", "hooks.json"))
		.filter((path) => existsSync(path));
}
