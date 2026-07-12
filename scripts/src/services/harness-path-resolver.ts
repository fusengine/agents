/**
 * Harness path resolver service
 * SRP: at install time, resolve the literal `$HOME` placeholder inside every
 * deployed `plugins/<name>/hooks/hooks.json` into an absolute, OS-aware home
 * path. The repo SOURCE keeps `$HOME` (portable, versionable); this resolution
 * runs once, only on the deployed marketplace copy under `pluginsDir`.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { discoverHooksFiles } from "../utils/hooks-discovery";

/** Absolute home dir, OS-aware — same fallback chain as env-file/install-hooks. */
const HOME = process.env.HOME || process.env.USERPROFILE || "";

/**
 * Substitute `${HOME}` then `$HOME` with the resolved absolute home path using
 * literal `replaceAll` (no regex escaping). Idempotent by construction: an
 * absolute home path holds no `$HOME`, so re-running leaves the file untouched.
 *
 * @param content - Raw hooks.json file content
 * @returns Content with every HOME placeholder resolved to an absolute path
 */
function substituteHome(content: string): string {
	return content.replaceAll("${HOME}", HOME).replaceAll("$HOME", HOME);
}

/**
 * Resolve `$HOME` to an absolute path across every deployed
 * `pluginsDir/<name>/hooks/hooks.json`, rewriting a file only when it changes.
 * Idempotent: a second run finds no placeholder left and reports 0.
 *
 * @param pluginsDir - Deployed marketplace plugins directory
 * @returns Count of hooks.json files actually rewritten
 */
export async function resolveHomeInHooks(pluginsDir: string): Promise<number> {
	let rewritten = 0;
	for (const hooksFile of discoverHooksFiles(pluginsDir)) {
		const before = readFileSync(hooksFile, "utf8");
		const after = substituteHome(before);
		if (after !== before) {
			writeFileSync(hooksFile, after);
			rewritten++;
		}
	}
	return rewritten;
}
