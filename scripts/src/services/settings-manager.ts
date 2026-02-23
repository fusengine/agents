/**
 * Settings management service
 * Single Responsibility: Read/write ~/.claude/settings.json
 */
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { HOOK_TYPES } from "../interfaces/hooks";

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

/** Configure hooks in settings */
export function configureHooks(
	settings: Settings,
	loaderPath: string,
): Settings {
	settings.hooks = {};

	for (const hookType of HOOK_TYPES) {
		settings.hooks[hookType] = [
			{
				matcher: "",
				hooks: [{ type: "command", command: `bun ${loaderPath} ${hookType}` }],
			},
		];
	}

	return settings;
}

/** Supported languages for Claude Code responses */
export const SUPPORTED_LANGUAGES = [
	{ value: "english", label: "English" },
	{ value: "french", label: "French" },
	{ value: "german", label: "German" },
	{ value: "spanish", label: "Spanish" },
	{ value: "italian", label: "Italian" },
	{ value: "portuguese", label: "Portuguese" },
	{ value: "dutch", label: "Dutch" },
	{ value: "japanese", label: "Japanese" },
	{ value: "chinese", label: "Chinese" },
	{ value: "korean", label: "Korean" },
] as const;

/** Default language when none selected */
export const DEFAULT_LANGUAGE = "english";

/** Configure default parameters */
export function configureDefaults(
	settings: Settings,
	language?: string,
): Settings {
	settings.language = language ?? settings.language ?? DEFAULT_LANGUAGE;
	settings.attribution = { commit: "", pr: "" };
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
