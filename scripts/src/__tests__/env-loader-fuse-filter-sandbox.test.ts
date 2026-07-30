/**
 * E2E sandbox test for the shell env loaders in scripts/env-shell/: every one
 * of them must export the API keys from ~/.claude/.env while SKIPPING FUSE_*.
 *
 * FUSE_* are per-harness (FUSE_HARNESS_REFS names ONE harness' rules tree) and
 * the harness never overwrites a key already in process.env, so a leaked
 * export silently makes another agent read Claude's rules instead of its own.
 *
 * Real HOME is never touched: each case runs against a mkdtemp() sandbox.
 * See env-file-writer-sandbox.test.ts for the ~/.claude/.env writer coverage —
 * the writer must KEEP writing FUSE_* there; only the EXPORT is filtered.
 */
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
	ENV_SHELL_DIR,
	EXPECTED,
	emittedPosixBlock,
	PROBE,
	runProbe,
	seedSandboxEnv,
} from "./helpers/shell-loader-probe";

const FISH_INSTALL_CLI = `${import.meta.dir}/fixtures/fish-install-cli.ts`;

let tmpHome: string;

beforeEach(() => {
	tmpHome = mkdtempSync(join(tmpdir(), "fusengine-env-loader-sandbox-"));
	seedSandboxEnv(tmpHome);
});

afterEach(() => {
	rmSync(tmpHome, { recursive: true, force: true });
});

describe("shell loaders: FUSE_* filtered, API keys and quoting preserved", () => {
	test.each([
		["bash", ["bash", "--noprofile", "--norc", "-c"], "claude-env.bash"],
		["zsh", ["zsh", "-f", "-c"], "claude-env.zsh"],
		["sh (POSIX)", ["sh", "-c"], "claude-env.bash"],
	])("%s loader skips FUSE_* and keeps every other key verbatim", async (_n, argv, file) => {
		const loader = join(ENV_SHELL_DIR, file);
		const got = await runProbe([...argv, `. "${loader}"\n${PROBE}`], tmpHome);
		expect(got).toEqual(EXPECTED);
	});

	test("the block install-env.sh appends to an rc file filters FUSE_* too", async () => {
		const rcFile = join(tmpHome, "fake_rc.sh");
		writeFileSync(rcFile, emittedPosixBlock());
		const got = await runProbe(["bash", "--noprofile", "--norc", "-c", `. "${rcFile}"\n${PROBE}`], tmpHome);
		expect(got).toEqual(EXPECTED);
	});

	test("the BASH_ENV shim filters FUSE_* through the channel bash actually uses", async () => {
		const shim = join(tmpHome, ".claude", "bash-env-loader.sh");
		writeFileSync(shim, readFileSync(join(ENV_SHELL_DIR, "bash-env-loader.sh"), "utf8"));
		const got = await runProbe(["bash", "-c", PROBE], tmpHome, { BASH_ENV: shim });
		expect(got).toEqual(EXPECTED);
	});

	test("the BASH_ENV shim is sourced, so it must never call exit", () => {
		const shim = readFileSync(join(ENV_SHELL_DIR, "bash-env-loader.sh"), "utf8");
		expect(shim).not.toMatch(/^\s*exit\b/m);
	});

	test.skipIf(!Bun.which("fish"))("fish loader filters FUSE_* and points BASH_ENV at the shim", async () => {
		const cfg = join(ENV_SHELL_DIR, "claude-env.fish");
		// PROBE goes through a file, never inline: it contains single quotes,
		// which would close fish's own quoting and turn `<absent>` into a redirect.
		const probeFile = join(tmpHome, "probe.sh");
		writeFileSync(probeFile, PROBE);
		// BASH_ENV is cleared first so the child bash reports what FISH exported,
		// not what the shim would re-add on its own.
		const got = await runProbe(
			["fish", "--no-config", "-c", `source "${cfg}"; set -e BASH_ENV; exec bash --noprofile --norc "${probeFile}"`],
			tmpHome,
		);
		expect(got).toEqual(EXPECTED);

		const bashEnv = await runProbe(
			["fish", "--no-config", "-c", `source "${cfg}"; echo BASH_ENV=$BASH_ENV`],
			tmpHome,
		);
		expect(bashEnv.BASH_ENV).toBe(join(tmpHome, ".claude", "bash-env-loader.sh"));
	});
});

describe("installFishConfig installs the shim its BASH_ENV points at", () => {
	test("both the fish conf.d snippet and ~/.claude/bash-env-loader.sh land in HOME", async () => {
		const proc = Bun.spawn([process.execPath, FISH_INSTALL_CLI], {
			env: { ...process.env, HOME: tmpHome, USERPROFILE: tmpHome },
			stdout: "pipe",
			stderr: "pipe",
		});
		const exitCode = await proc.exited;
		if (exitCode !== 0) {
			throw new Error(`fish-install-cli exited ${exitCode}: ${await new Response(proc.stderr).text()}`);
		}

		expect(existsSync(join(tmpHome, ".config", "fish", "conf.d", "claude-env.fish"))).toBe(true);
		expect(existsSync(join(tmpHome, ".claude", "bash-env-loader.sh"))).toBe(true);
	});
});
