/**
 * Env routing helper
 * Single Responsibility: route a settings key to ~/.claude/.env (FUSE_-prefixed
 * keys, loaded directly by the harness) or the settings.json env block
 * (everything else). Shared by the harness gates/tuning prompts, which mix
 * both kinds of keys under one interactive flow.
 */
import { removeEnvVar, upsertEnvVar } from "./env-file";
import type { Settings } from "./settings-manager";

/** Read a key's current value from ~/.claude/.env (FUSE_*) or settings.env. */
export function readRoutedVar(
	settings: Settings,
	envFile: Record<string, string>,
	key: string,
): string | undefined {
	if (key.startsWith("FUSE_")) return envFile[key];
	return (settings.env as Record<string, string> | undefined)?.[key];
}

/**
 * Persist a key's value to ~/.claude/.env (FUSE_*) or settings.env.
 * `undefined` removes the key instead of writing it.
 */
export function writeRoutedVar(settings: Settings, key: string, value: string | undefined): void {
	if (key.startsWith("FUSE_")) {
		if (value === undefined) removeEnvVar(key);
		else upsertEnvVar(key, value);
		return;
	}
	const env = (settings.env as Record<string, string>) || {};
	if (value === undefined) delete env[key];
	else env[key] = value;
	settings.env = env;
}
