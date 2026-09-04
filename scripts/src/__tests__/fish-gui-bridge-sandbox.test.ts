/**
 * E2E sandbox test for the OPT-IN macOS GUI bridge of the fish loader
 * (scripts/env-shell/claude-env.fish): FUSE_GUI_ENV=1 in ~/.claude/.env
 * pushes every NON-FUSE key into the launchd session via `launchctl setenv`.
 *
 * Nothing here touches the developer's real launchd session: `launchctl` is
 * shadowed by a stub at the head of PATH that only logs its arguments, and the
 * `/Applications/Claude.app` probe is redirected to a sandbox dir through the
 * FUSE_GUI_APP override the loader honours. Real HOME is never touched.
 *
 * Non-regression: with the gate absent the loader must behave exactly as
 * before (zero launchctl call), and the FUSE_* export filter must hold in
 * both cases.
 */
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { ENV_SHELL_DIR, runProbe } from "./helpers/shell-loader-probe";

const FISH_LOADER = join(ENV_SHELL_DIR, "claude-env.fish");
const PROBE_KEYS = ["FOO_KEY", "FUSE_PRD", "FUSE_GUI_ENV"] as const;

/** POSIX snippet printing `KEY=value`, or `KEY=<absent>` when unset. */
const PROBE = PROBE_KEYS.map(
	(k) => `if [ -n "\${${k}+x}" ]; then printf '%s=%s\\n' ${k} "$${k}"; else printf '%s=<absent>\\n' ${k}; fi`,
).join("\n");

/** launchctl stub: append its argv (one line per call) to $LAUNCHCTL_LOG. */
const LAUNCHCTL_STUB = `#!/bin/sh
printf '%s\\n' "$*" >> "$LAUNCHCTL_LOG"
`;

let tmpHome: string;
let stubDir: string;
let logFile: string;
let fakeApp: string;

beforeEach(() => {
	tmpHome = mkdtempSync(join(tmpdir(), "fusengine-fish-gui-bridge-"));
	mkdirSync(join(tmpHome, ".claude"), { recursive: true });
	stubDir = join(tmpHome, "stub-bin");
	mkdirSync(stubDir);
	writeFileSync(join(stubDir, "launchctl"), LAUNCHCTL_STUB);
	chmodSync(join(stubDir, "launchctl"), 0o755);
	logFile = join(tmpHome, "launchctl.log");
	fakeApp = join(tmpHome, "Claude.app");
	mkdirSync(fakeApp);
});

afterEach(() => {
	rmSync(tmpHome, { recursive: true, force: true });
});

/** Source the fish loader in the sandbox and report the probed exports. */
async function sourceFish(envBody: string, extraEnv: Record<string, string> = {}) {
	writeFileSync(join(tmpHome, ".claude", ".env"), envBody);
	const probeFile = join(tmpHome, "probe.sh");
	writeFileSync(probeFile, PROBE);
	return runProbe(
		["fish", "--no-config", "-c", `source "${FISH_LOADER}"; exec bash --noprofile --norc "${probeFile}"`],
		tmpHome,
		{
			PATH: `${stubDir}:${process.env.PATH ?? ""}`,
			LAUNCHCTL_LOG: logFile,
			FUSE_GUI_APP: fakeApp,
			...extraEnv,
		},
	);
}

/** Lines the launchctl stub logged, `[]` when it was never invoked. */
function launchctlCalls(): string[] {
	if (!existsSync(logFile)) return [];
	return readFileSync(logFile, "utf8").split("\n").filter(Boolean);
}

const BASE_ENV = `export FOO_KEY="abc"
export FUSE_PRD="1"
`;

describe.skipIf(!Bun.which("fish"))("fish loader: opt-in GUI bridge (FUSE_GUI_ENV)", () => {
	test("case A — gate absent: launchctl is never called, exports unchanged", async () => {
		const got = await sourceFish(BASE_ENV);
		expect(launchctlCalls()).toEqual([]);
		expect(got).toEqual({ FOO_KEY: "abc", FUSE_PRD: "<absent>", FUSE_GUI_ENV: "<absent>" });
	});

	test("case B — FUSE_GUI_ENV=1: bridges non-FUSE keys only, never exports FUSE_*", async () => {
		const got = await sourceFish(`${BASE_ENV}export FUSE_GUI_ENV="1"\n`);
		const calls = launchctlCalls();
		expect(calls).toContain("setenv FOO_KEY abc");
		expect(calls.filter((l) => /\bFUSE_/.test(l))).toEqual([]);
		expect(got).toEqual({ FOO_KEY: "abc", FUSE_PRD: "<absent>", FUSE_GUI_ENV: "<absent>" });
	});

	test("gate set to anything but exactly 1 stays off", async () => {
		await sourceFish(`${BASE_ENV}FUSE_GUI_ENV=0\n`);
		expect(launchctlCalls()).toEqual([]);
		await sourceFish(`${BASE_ENV}FUSE_GUI_ENV=true\n`);
		expect(launchctlCalls()).toEqual([]);
	});

	test("gate on but the GUI app is missing: launchctl is never called", async () => {
		await sourceFish(`${BASE_ENV}FUSE_GUI_ENV=1\n`, { FUSE_GUI_APP: join(tmpHome, "Nope.app") });
		expect(launchctlCalls()).toEqual([]);
	});
});
