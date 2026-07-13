/**
 * Settings env purge service
 * Single Responsibility: strip residual FUSE_-prefixed keys from settings.json's
 * env block. FUSE_* config now lives in ~/.claude/.env (see env-file.ts) — a
 * leftover FUSE_* key in settings.json would otherwise take priority over .env
 * and resurrect stale config. Native CLAUDE_CODE_* keys and the
 * _FUSENGINE_PERF_ASKED marker are untouched (they stay in settings.json).
 */
import type { Settings } from "./settings-manager";

/**
 * Remove every FUSE_-prefixed key from settings.env, in place.
 * Idempotent: a settings.env already free of FUSE_* keys is left unchanged.
 * @param settings - current settings object (mutated + returned)
 */
export function purgeFuseEnvVars(settings: Settings): Settings {
	const env = settings.env as Record<string, string> | undefined;
	if (!env) return settings;
	for (const key of Object.keys(env)) {
		if (key.startsWith("FUSE_")) delete env[key];
	}
	settings.env = env;
	return settings;
}
