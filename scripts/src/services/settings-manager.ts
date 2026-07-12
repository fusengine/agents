/**
 * Settings management service
 * Single Responsibility: Read/write ~/.claude/settings.json
 */
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { HOOK_TYPES } from "../interfaces/hooks";
import { mergeHookType } from "./hook-merge";

export {
	SUPPORTED_LANGUAGES,
	DEFAULT_LANGUAGE,
	configureDefaults,
} from "./settings-language";

export interface Settings {
	language?: string;
	attribution?: { commit: string; pr: string };
	hooks?: Record<string, unknown[]>;
	statusLine?: { type: string; command: string; padding: number };
	[key: string]: unknown;
}

/** Load existing settings */
export async function loadSettings(path: string): Promise<Settings> {
	if (!existsSync(path)) return {};
	return await Bun.file(path).json();
}

/** Save settings */
export async function saveSettings(
	path: string,
	settings: Settings,
): Promise<void> {
	mkdirSync(dirname(path), { recursive: true });
	await Bun.write(path, `${JSON.stringify(settings, null, 2)}\n`);
}

/** Create a settings backup */
export function backupSettings(path: string): void {
	if (!existsSync(path)) return;
	const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
	copyFileSync(path, `${path}.backup.${timestamp}`);
}

/**
 * Configure fusengine hooks in settings without clobbering user customisations.
 * For each managed hook type the previous loader entry is replaced and any
 * user-authored entry (foreign command, or a hook type absent from HOOK_TYPES)
 * is preserved in place. Idempotent: re-running yields no duplicates.
 *
 * @param settings - Settings object to mutate.
 * @param loaderPath - Absolute path to hooks-loader.ts.
 * @returns The same settings object with hooks merged.
 */
export function configureHooks(
	settings: Settings,
	loaderPath: string,
): Settings {
	const hooks = settings.hooks ?? {};

	for (const hookType of HOOK_TYPES) {
		hooks[hookType] = mergeHookType(hooks[hookType], loaderPath, hookType);
	}

	settings.hooks = hooks;
	return settings;
}

/** Enable Agent Teams experimental feature */
export function enableAgentTeams(settings: Settings): Settings {
	const env = (settings.env as Record<string, string>) || {};
	env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS = "1";
	settings.env = env;
	return settings;
}

/** Check if Agent Teams is already enabled */
export function isAgentTeamsEnabled(settings: Settings): boolean {
	const env = settings.env as Record<string, string> | undefined;
	return env?.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS === "1";
}

/** Configure the statusline */
export function configureStatusLine(
	settings: Settings,
	statuslineDir: string,
): Settings {
	if (!settings.statusLine) {
		settings.statusLine = {
			type: "command",
			command: `bun ${statuslineDir}/src/index.ts`,
			padding: 0,
		};
	}
	return settings;
}
