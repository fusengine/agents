/**
 * Harness tuning service
 * Single Responsibility: opt-in advanced harness knobs (TTLs, caches).
 * FUSE_-prefixed knobs persist to ~/.claude/.env (the harness loads .env
 * directly); non-FUSE_ knobs (FUSENGINE_CACHE_TTL_MIN) stay in settings.env.
 * Persists a value only when it differs from the sane default, so an
 * untouched tuning run leaves both files clean.
 */
import * as p from "@clack/prompts";
import { loadEnvFile } from "./env-file";
import { readRoutedVar, writeRoutedVar } from "./env-route";
import type { Settings } from "./settings-manager";

interface Field {
	key: string;
	label: string;
	def: string;
	numeric: boolean;
}

const TUNING: readonly Field[] = [
	{ key: "FUSE_LESSONS_THROTTLE_MIN", label: "Lessons write-reminder throttle (minutes)", def: "5", numeric: true },
	{ key: "FUSE_MCP_TTL_SEC", label: "Cached MCP doc freshness (seconds)", def: "172800", numeric: true },
	{ key: "FUSE_WEBFETCH_TTL_SEC", label: "WebFetch cache freshness (seconds)", def: "86400", numeric: true },
	{ key: "FUSENGINE_CACHE_TTL_MIN", label: "Subagent context cache TTL (minutes)", def: "30", numeric: true },
	{ key: "FUSE_HARNESS_MARKETPLACES", label: "Harness marketplaces (comma-separated)", def: "fusengine-plugins", numeric: false },
];

/** Reject anything that is not a whole number (empty allowed → falls back to default). */
function numericValidator(v: string | undefined): string | undefined {
	const s = (v ?? "").trim();
	return s === "" || /^\d+$/.test(s) ? undefined : "Enter a whole number";
}

/** Prompt each field pre-filled with its current/default value; keep only non-default entries. */
async function promptFields(
	settings: Settings,
	envFile: Record<string, string>,
	fields: readonly Field[],
): Promise<boolean> {
	for (const f of fields) {
		const value = await p.text({
			message: f.label,
			initialValue: readRoutedVar(settings, envFile, f.key) ?? f.def,
			validate: f.numeric ? numericValidator : undefined,
		});
		if (p.isCancel(value)) return false;
		const v = value.trim();
		writeRoutedVar(settings, f.key, v && v !== f.def ? v : undefined);
	}
	return true;
}

/**
 * Prompt for advanced harness tuning (TTLs, caches). Opt-in and defaults to
 * skipped; only values differing from the defaults are persisted.
 * @param settings - current settings object (mutated + returned)
 */
export async function promptHarnessTuning(settings: Settings): Promise<Settings> {
	const wants = await p.confirm({
		message: "Configure advanced harness tuning? (TTLs, caches — sane defaults otherwise)",
		initialValue: false,
	});
	if (p.isCancel(wants) || !wants) return settings;

	const envFile = loadEnvFile();
	await promptFields(settings, envFile, TUNING);
	return settings;
}
