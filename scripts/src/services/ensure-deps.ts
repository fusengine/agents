/**
 * Self-heal: reinstall missing node_modules for the loader's managed dirs.
 * Built-ins only (zero third-party import) — must survive running before
 * node_modules exists at all, since it is what repairs it.
 * @description SRP: orchestrate check → single-flight lock → fail-open install.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import type { DepsTarget, InstallFn } from "../interfaces/ensure-deps";
import { runBunInstall } from "../utils/bun-install-runner";
import { tryAcquireLock } from "../utils/single-flight-lock";

const INSTALL_TIMEOUT_MS = 60_000;

/**
 * Ensure every managed target's node_modules marker exists, reinstalling
 * in-place (single-flight, fail-open) when missing. Never throws and never
 * blocks a caller longer than `INSTALL_TIMEOUT_MS` per target — a skipped or
 * failed install just leaves the marker missing for the next invocation.
 *
 * @param targets - Directories to check/install, each with its presence marker
 * @param install - Installer to invoke (defaults to real `bun install`; tests inject a fake)
 */
export async function ensureDeps(
	targets: DepsTarget[],
	install: InstallFn = runBunInstall,
): Promise<void> {
	for (const target of targets) {
		if (existsSync(target.marker)) continue;
		await healOne(target, install);
	}
}

/** Single-flight-locked repair of one target; a lost race or a bare dir is a no-op. */
async function healOne(target: DepsTarget, install: InstallFn): Promise<void> {
	const release = tryAcquireLock(target.dir);
	if (!release) return; // another process is already installing — skip, fail-open

	try {
		if (existsSync(target.marker)) return; // installed while we waited for the lock
		if (!existsSync(join(target.dir, "package.json"))) return; // nothing to install
		await install(target.dir, INSTALL_TIMEOUT_MS);
	} catch (error) {
		console.error(`[ensure-deps] install failed for ${target.label}:`, error);
	} finally {
		release();
	}
}
