/**
 * Fail-open `bun install` runner — built-ins/Bun-global only (no `import "bun"`,
 * no node_modules import), so it works even when node_modules is entirely gone.
 */
import type { InstallFn } from "../interfaces/ensure-deps";

/**
 * Run `bun install --silent` in `cwd`, hard-killing it after `timeoutMs`.
 * Never throws on timeout/non-zero exit: a failed or slow install just leaves
 * the caller's presence marker missing, and the next hook invocation retries.
 *
 * @param cwd - Directory holding the package.json to install
 * @param timeoutMs - Hard kill timeout in milliseconds
 */
export const runBunInstall: InstallFn = async (cwd, timeoutMs) => {
	const proc = Bun.spawn([process.execPath, "install", "--silent"], {
		cwd,
		stdout: "ignore",
		stderr: "ignore",
		timeout: timeoutMs,
		killSignal: "SIGKILL",
	});
	await proc.exited;
};
