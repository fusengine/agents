/**
 * Plugin scanning service
 * @description SRP: Scan and load plugin configurations
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type {
	ExecutableHook,
	HookEntry,
	PluginInfo,
	ScannerConfig,
} from "../interfaces/hooks";

/** Scan plugins and return their configurations */
export function scanPlugins(config: ScannerConfig): PluginInfo[] {
	const { pluginsDir } = config;
	if (!existsSync(pluginsDir)) return [];

	return readdirSync(pluginsDir).map((name) => {
		const path = join(pluginsDir, name);
		const hooksFile = join(path, "hooks/hooks.json");
		const hasHooks = existsSync(hooksFile);
		let config: PluginInfo["config"];
		if (hasHooks) {
			try {
				config = JSON.parse(readFileSync(hooksFile, "utf8"));
			} catch {
				/* ignore parse errors */
			}
		}
		return { name, path, hasHooks, config };
	});
}

/** Extract executable hooks for a given type */
export function extractHooks(
	plugins: PluginInfo[],
	hookType: string,
	toolName: string,
	notifType: string,
	agentType = "",
): ExecutableHook[] {
	const hooks: ExecutableHook[] = [];

	for (const plugin of plugins) {
		if (!plugin.config) continue;
		const entries: HookEntry[] = plugin.config.hooks?.[hookType] ?? [];

		for (const entry of entries) {
			if (!matchesFilter(entry.matcher, hookType, toolName, notifType, agentType)) continue;

			for (const hook of entry.hooks) {
				if (hook.type && hook.type !== "command") continue;
				const command = hook.command.replace(/\$\{CLAUDE_PLUGIN_ROOT\}/g, plugin.path);
				hooks.push({ command, isAsync: command.startsWith("afplay"), pluginName: plugin.name });
			}
		}
	}

	return hooks;
}

/** Check if a matcher matches the current context */
function matchesFilter(
	matcher: string | undefined,
	hookType: string,
	toolName: string,
	notifType: string,
	agentType = "",
): boolean {
	if (!matcher) return true;

	const testValue =
		hookType === "Notification"
			? notifType
			: hookType === "SubagentStart" || hookType === "SubagentStop"
				? agentType
				: toolName;
	try {
		return new RegExp(matcher).test(testValue);
	} catch {
		return false;
	}
}
