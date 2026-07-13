/**
 * Harness env service
 * Single Responsibility: point @fusengine/harness at every plugin's SOLID
 * reference dir — FUSE_HARNESS_REFS is a path-delimiter list of dirs (no copying,
 * no aggregation): the harness scans each one directly. Persisted to
 * ~/.claude/.env (not settings.json — the harness loads .env directly).
 */
import { readdirSync, existsSync } from "node:fs";
import { join, delimiter } from "node:path";
import * as p from "@clack/prompts";
import { upsertEnvVar } from "./env-file";
import type { Settings } from "./settings-manager";

/** readdirSync that returns [] instead of throwing on a missing dir. */
function readEntries(dir: string): string[] {
	try {
		return readdirSync(dir);
	} catch {
		return [];
	}
}

/** Every existing plugins/<plugin>/skills/solid-<x>/references directory. */
function solidRefDirs(pluginsDir: string): string[] {
	const dirs: string[] = [];
	for (const plugin of readEntries(pluginsDir)) {
		for (const skill of readEntries(join(pluginsDir, plugin, "skills"))) {
			if (!skill.startsWith("solid-")) continue;
			const refs = join(pluginsDir, plugin, "skills", skill, "references");
			if (existsSync(refs)) dirs.push(refs);
		}
	}
	return dirs;
}

/** Set FUSE_HARNESS_REFS (~/.claude/.env) to every solid-* refs dir. */
export function setHarnessRefs(settings: Settings, marketplace: string): Settings {
	const dirs = solidRefDirs(join(marketplace, "plugins"));
	upsertEnvVar("FUSE_HARNESS_REFS", dirs.join(delimiter));
	p.log.success(`Harness SOLID refs set (${dirs.length} skill dirs, FUSE_HARNESS_REFS)`);
	return settings;
}
