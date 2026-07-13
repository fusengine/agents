/**
 * Enforcement TTL service
 * Single Responsibility: let the user set FUSE_ENFORCE_TTL_SEC in ~/.claude/.env.
 */
import * as p from "@clack/prompts";
import { upsertEnvVar } from "./env-file";
import type { Settings } from "./settings-manager";

const TTL_KEY = "FUSE_ENFORCE_TTL_SEC";
const TTL_OPTIONS = [
	{ value: "120", label: "2 min (default)" },
	{ value: "240", label: "4 min" },
	{ value: "480", label: "8 min" },
	{ value: "600", label: "10 min" },
] as const;

/**
 * Prompt for the APEX/SOLID enforcement TTL and persist it to ~/.claude/.env.
 * @param settings - current settings object (returned unchanged, kept for chaining)
 */
export async function promptEnforceTtl(settings: Settings): Promise<Settings> {
	const choice = await p.select({
		message: "APEX/SOLID enforcement TTL (freshness window for hooks)?",
		options: TTL_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
		initialValue: "120",
	});
	if (p.isCancel(choice)) return settings;
	upsertEnvVar(TTL_KEY, choice as string);
	p.log.success(`Enforcement TTL set to ${Number(choice) / 60}min (${TTL_KEY}=${choice})`);
	return settings;
}
