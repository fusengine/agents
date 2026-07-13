/**
 * Self-heal deps interfaces.
 * @description SRP: types for the ensure-deps self-heal feature only.
 */

/** One node_modules-backed directory the self-heal loop can reinstall. */
export interface DepsTarget {
	/** Absolute directory containing the package.json to `bun install`. */
	dir: string;
	/** Absolute path whose existence proves deps are already installed. */
	marker: string;
	/** Human label used in fail-open error logs. */
	label: string;
}

/** Injectable installer signature — lets tests fake `bun install` (no network). */
export type InstallFn = (dir: string, timeoutMs: number) => Promise<void>;
