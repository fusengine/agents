/**
 * E2E sandbox test for the installer's ~/.claude/.env writer, exercising the
 * REAL `upsertEnvVar` export (no mocks) against a temp HOME.
 *
 * `ENV_FILE` in env-file.ts is a module-level const resolved from
 * process.env.HOME at import time, so it cannot be redirected by mutating
 * process.env.HOME in-process after other modules may have already
 * imported it. Each assertion therefore spawns the real writer in a fresh
 * subprocess with HOME pointed at the sandbox — see fixtures/env-writer-cli.ts.
 * The real ~/.claude is never touched. See settings-env-purge-hooks-sandbox.test.ts
 * for the companion settings.json (purge + hooks) coverage.
 */
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { saveSettings } from "../services/settings-manager";

const FIXTURE = `${import.meta.dir}/fixtures/env-writer-cli.ts`;

let tmpHome: string;
let settingsPath: string;
let envFilePath: string;

beforeEach(() => {
	tmpHome = mkdtempSync(join(tmpdir(), "fusengine-env-writer-sandbox-"));
	settingsPath = join(tmpHome, ".claude", "settings.json");
	envFilePath = join(tmpHome, ".claude", ".env");
});

afterEach(() => {
	rmSync(tmpHome, { recursive: true, force: true });
});

/** Run the real upsertEnvVar writer in a subprocess whose HOME is the sandbox. */
async function writeEnvVarsInSandbox(pairs: [string, string][]): Promise<void> {
	const proc = Bun.spawn([process.execPath, FIXTURE, JSON.stringify(pairs)], {
		env: { ...process.env, HOME: tmpHome, USERPROFILE: tmpHome },
		stdout: "pipe",
		stderr: "pipe",
	});
	const exitCode = await proc.exited;
	if (exitCode !== 0) {
		const stderr = await new Response(proc.stderr).text();
		throw new Error(`env-writer-cli exited ${exitCode}: ${stderr}`);
	}
}

describe("installer sandbox: FUSE_* routed to ~/.claude/.env (real code, temp HOME)", () => {
	test("upsertEnvVar writes FUSE_* to <tmpHome>/.claude/.env, never to settings.json", async () => {
		await saveSettings(settingsPath, {});
		await writeEnvVarsInSandbox([
			["FUSE_SOLID_MAX_LINES", "90"],
			["FUSE_ENFORCE_TTL_SEC", "300"],
			["FUSE_HARNESS_REFS", "solid-generic"],
		]);

		const envContent = readFileSync(envFilePath, "utf8");
		expect(envContent).toContain('export FUSE_SOLID_MAX_LINES="90"');
		expect(envContent).toContain('export FUSE_ENFORCE_TTL_SEC="300"');
		expect(envContent).toContain('export FUSE_HARNESS_REFS="solid-generic"');

		const settingsContent = readFileSync(settingsPath, "utf8");
		expect(settingsContent).not.toContain("FUSE_SOLID_MAX_LINES");
		expect(settingsContent).not.toContain("FUSE_ENFORCE_TTL_SEC");
		expect(settingsContent).not.toContain("FUSE_HARNESS_REFS");
	});

	test("CLAUDE_CODE_* never lands in .env", async () => {
		await writeEnvVarsInSandbox([["FUSE_SOLID_MAX_LINES", "77"]]);
		const envContent = readFileSync(envFilePath, "utf8");
		expect(envContent).not.toContain("CLAUDE_CODE");
	});

	test("idempotence: re-running the env writer with identical values does not duplicate lines", async () => {
		const pairs: [string, string][] = [["FUSE_HARNESS_REFS", "solid-generic"]];
		await writeEnvVarsInSandbox(pairs);
		await writeEnvVarsInSandbox(pairs);

		const envContent = readFileSync(envFilePath, "utf8");
		const occurrences = envContent.split('export FUSE_HARNESS_REFS="solid-generic"').length - 1;
		expect(occurrences).toBe(1);
	});
});
