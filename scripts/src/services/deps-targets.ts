/**
 * Resolve the 3 self-heal targets from the marketplace layout.
 * Built-ins only — importable before node_modules exists.
 * @description SRP: compute {dir, marker, label} triples only, no I/O side effects.
 */
import { join } from "node:path";
import type { DepsTarget } from "../interfaces/ensure-deps";

/**
 * @param scriptsDir - Absolute dir of the running hooks-loader.ts (its own `import.meta.dir`)
 * @param pluginsDir - Absolute deployed `<marketplace>/plugins` dir
 * @returns the 3 managed deps targets: scripts/, plugins/ (shared harness), plugins/core-guards/statusline
 */
export function getManagedDepsTargets(scriptsDir: string, pluginsDir: string): DepsTarget[] {
	const statuslineDir = join(pluginsDir, "core-guards/statusline");
	return [
		{
			dir: scriptsDir,
			marker: join(scriptsDir, "node_modules/@clack/prompts/package.json"),
			label: "scripts",
		},
		{
			dir: pluginsDir,
			marker: join(pluginsDir, "node_modules/@fusengine/harness/dist/cli/bin.mjs"),
			label: "plugins (shared harness)",
		},
		{
			dir: statuslineDir,
			marker: join(statuslineDir, "node_modules"),
			label: "core-guards/statusline",
		},
	];
}
