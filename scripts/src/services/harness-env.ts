/**
 * Harness env service
 * Single Responsibility: aggregate every plugin's SOLID references into one dir
 * and point @fusengine/harness at it — a fast recursive scan (~150 files, not the
 * thousands under plugins/), covering all languages AND frameworks.
 */
import { readdirSync, mkdirSync, copyFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import * as p from "@clack/prompts";
import type { Settings } from "./settings-manager";

/** readdirSync that returns [] instead of throwing on a missing dir. */
function readEntries(dir: string): string[] {
	try { return readdirSync(dir); } catch { return []; }
}

/** Copy every solid-language reference markdown (per plugin) under dest, flattened. */
function aggregate(pluginsDir: string, dest: string): number {
	rmSync(dest, { recursive: true, force: true });
	let n = 0;
	for (const plugin of readEntries(pluginsDir)) {
		for (const skill of readEntries(join(pluginsDir, plugin, "skills"))) {
			if (!skill.startsWith("solid-")) continue;
			const refs = join(pluginsDir, plugin, "skills", skill, "references");
			let files: string[];
			try { files = readdirSync(refs, { recursive: true }) as string[]; } catch { continue; }
			const out = join(dest, `${plugin}--${skill}`);
			for (const f of files) {
				if (!f.endsWith(".md")) continue;
				mkdirSync(out, { recursive: true });
				copyFileSync(join(refs, f), join(out, f.replace(/[/\\]/g, "--")));
				n++;
			}
		}
	}
	return n;
}

/** Aggregate all SOLID refs into <marketplace>/.harness-refs and set FUSE_HARNESS_REFS. */
export function setHarnessRefs(settings: Settings, marketplace: string): Settings {
	const dest = join(marketplace, ".harness-refs");
	const n = aggregate(join(marketplace, "plugins"), dest);
	const env = (settings.env as Record<string, string>) || {};
	env.FUSE_HARNESS_REFS = dest;
	settings.env = env;
	p.log.success(`Harness SOLID refs aggregated (${n} files → FUSE_HARNESS_REFS=${dest})`);
	return settings;
}
