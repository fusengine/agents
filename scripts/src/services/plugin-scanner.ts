/**
 * Plugin scanning service
 * Single Responsibility: Scan and load plugin configurations
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
	const plugins: PluginInfo[] = [];

	if (!existsSync(pluginsDir)) return plugins;

	for (const name of readdirSync(pluginsDir)) {
		const pluginPath = join(pluginsDir, name);
		const hooksFile = join(pluginPath, "hooks/hooks.json");

		const info: PluginInfo = {
			name,
			path: pluginPath,
			hasHooks: existsSync(hooksFile),
		};

		if (info.hasHooks) {
			try {
				info.config = JSON.parse(readFileSync(hooksFile, "utf8"));
			} catch {
				// Ignore parsing errors
			}
		}

		plugins.push(info);
	}

	return plugins;
}

/** Extract executable hooks for a given type */
export function extractHooks(
	plugins: PluginInfo[],
	hookType: string,
	toolName: string,
	notifType: string,
	agentType: string = "",
): ExecutableHook[] {
	const hooks: ExecutableHook[] = [];

	for (const plugin of plugins) {
		if (!plugin.config) continue;

		const entries: HookEntry[] = plugin.config.hooks?.[hookType] ?? [];

		for (const entry of entries) {
			if (
				!matchesFilter(entry.matcher, hookType, toolName, notifType, agentType)
			)
				continue;

			for (const hook of entry.hooks) {
				const command = hook.command.replace(
					/\$\{CLAUDE_PLUGIN_ROOT\}/g,
					plugin.path,
				);
				hooks.push({
					command,
					isAsync: command.startsWith("afplay"),
					pluginName: plugin.name,
				});
			}
		}
	}

	return hooks;
}

/** Check if a matcher matches */
function matchesFilter(
	matcher: string | undefined,
	hookType: string,
	toolName: string,
	notifType: string,
	agentType: string = "",
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
