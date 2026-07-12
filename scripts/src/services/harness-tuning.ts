/**
 * Harness tuning service
 * Single Responsibility: opt-in advanced harness knobs (TTLs, caches, Graphiti
 * endpoint) in settings.env. Persists a value only when it differs from the sane
 * default, so an untouched tuning run leaves settings.env clean.
 */
import * as p from "@clack/prompts";
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

const NEURAL: readonly Field[] = [
	{ key: "NEURAL_MEMORY_HOST", label: "Neural Memory (Graphiti) host", def: "localhost", numeric: false },
	{ key: "GRAPHITI_PORT", label: "Graphiti port", def: "8000", numeric: true },
];

/** Reject anything that is not a whole number (empty allowed → falls back to default). */
function numericValidator(v: string | undefined): string | undefined {
	const s = (v ?? "").trim();
	return s === "" || /^\d+$/.test(s) ? undefined : "Enter a whole number";
}

/** Prompt each field pre-filled with its current/default value; keep only non-default entries. */
async function promptFields(env: Record<string, string>, fields: readonly Field[]): Promise<boolean> {
	for (const f of fields) {
		const value = await p.text({
			message: f.label,
			initialValue: env[f.key] ?? f.def,
			validate: f.numeric ? numericValidator : undefined,
		});
		if (p.isCancel(value)) return false;
		const v = value.trim();
		if (v && v !== f.def) env[f.key] = v;
		else delete env[f.key];
	}
	return true;
}

/**
 * Prompt for advanced harness tuning (TTLs, caches) and the optional Neural
 * Memory (Graphiti) endpoint. Both sections are opt-in and default to skipped;
 * only values differing from the defaults are written to settings.env.
 * @param settings - current settings object (mutated + returned)
 */
export async function promptHarnessTuning(settings: Settings): Promise<Settings> {
	const wants = await p.confirm({
		message: "Configure advanced harness tuning? (TTLs, caches — sane defaults otherwise)",
		initialValue: false,
	});
	if (p.isCancel(wants) || !wants) return settings;

	const env = (settings.env as Record<string, string>) || {};
	if (!(await promptFields(env, TUNING))) return settings;
	settings.env = env;

	const neural = await p.confirm({
		message: "Configure Neural Memory (Graphiti) endpoint?",
		initialValue: false,
	});
	if (p.isCancel(neural) || !neural) return settings;
	await promptFields(env, NEURAL);
	settings.env = env;
	return settings;
}
