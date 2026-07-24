/**
 * E2E sandbox test for the installer's ~/.claude/.env writer/reader, exercising
 * the REAL exports (no mocks) against a temp HOME. `ENV_FILE` is a module-level
 * const resolved at import time, so each assertion spawns the real code in a
 * subprocess with HOME pointed at the sandbox — see fixtures/env-writer-cli.ts.
 * Real ~/.claude is never touched. See settings-env-purge-hooks-sandbox.test.ts
 * for the companion settings.json coverage.
 */
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
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

/**
 * Run upsert/remove ops (real upsertEnvVar/removeEnvVar) in a sandbox
 * subprocess, optionally returning the real loadEnvFile() result.
 */
async function runOpsInSandbox(
	ops: ([string, string] | [string])[],
	loadAfter = false,
): Promise<Record<string, string> | undefined> {
	const args = [process.execPath, FIXTURE, JSON.stringify(ops)];
	if (loadAfter) args.push("--load");
	const proc = Bun.spawn(args, {
		env: { ...process.env, HOME: tmpHome, USERPROFILE: tmpHome },
		stdout: "pipe",
		stderr: "pipe",
	});
	const [stdout, exitCode] = await Promise.all([new Response(proc.stdout).text(), proc.exited]);
	if (exitCode !== 0) {
		const stderr = await new Response(proc.stderr).text();
		throw new Error(`env-writer-cli exited ${exitCode}: ${stderr}`);
	}
	return loadAfter ? (JSON.parse(stdout) as Record<string, string>) : undefined;
}

/** Seed the sandbox .env file with raw content before invoking the real writer/reader. */
function seedEnvFile(content: string): void {
	mkdirSync(dirname(envFilePath), { recursive: true });
	writeFileSync(envFilePath, content);
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

describe("saveEnvFile: preserves existing file content (line-preserving writer)", () => {
	test("upsertEnvVar keeps comments, blank lines, and non-export lines verbatim", async () => {
		const seed =
			"# my personal comment - do not remove\n" +
			"STRIPE_KEY=sk_live_handpasted_no_export\n" +
			"\n" +
			'export FUSE_SOLID_MAX_LINES="90"\n' +
			"EMPTY_VAL=";
		seedEnvFile(seed);

		await runOpsInSandbox([["FUSE_NEW", "42"]]);

		const envContent = readFileSync(envFilePath, "utf8");
		expect(envContent).toBe(`${seed}\nexport FUSE_NEW="42"\n`);
	});

	test("removeEnvVar drops only the target key's line, rest of file intact", async () => {
		const seed = 'export KEEPME="1"\nexport K="v"\n# trailing comment';
		seedEnvFile(seed);

		await runOpsInSandbox([["K"]]);

		const envContent = readFileSync(envFilePath, "utf8");
		expect(envContent).toBe('export KEEPME="1"\n# trailing comment\n');
		expect(envContent).not.toContain("export K=");
	});

	test("loadEnvFile parses a mixed-format file correctly (reader-only check, no ops run — loadEnvFile's regex/logic is untouched by this fix, see saveEnvFile diff)", async () => {
		const seed = [
			"# comment",
			'export A="1"',
			"export_thing=y",
			"B=2",
			'export C="3" # trailing comment',
			"export D='single'",
			"",
			"export E=",
		].join("\n");
		seedEnvFile(seed);

		const loaded = await runOpsInSandbox([], true);

		// Frozen expected value, captured from loadEnvFile's untouched regex/logic.
		expect(loaded).toEqual({ A: "1", C: "3", D: "single", E: "" });
	});

	test("repeated upserts never accumulate a trailing blank line", async () => {
		await runOpsInSandbox([["FUSE_HARNESS_REFS", "solid-generic"]]);
		await runOpsInSandbox([["FUSE_HARNESS_REFS", "solid-generic"]]);
		await runOpsInSandbox([["FUSE_HARNESS_REFS", "solid-generic"]]);

		const envContent = readFileSync(envFilePath, "utf8");
		expect(envContent).toBe('export FUSE_HARNESS_REFS="solid-generic"\n');
	});

	test("a seeded __proto__ line is dropped cleanly on upsert, not corrupted (Object.hasOwn guard)", async () => {
		const seed = 'export __proto__="topsecret"\nexport A="1"\n';
		seedEnvFile(seed);

		await runOpsInSandbox([["FUSE_X", "1"]]);

		const envContent = readFileSync(envFilePath, "utf8");
		expect(envContent).toBe('export A="1"\nexport FUSE_X="1"\n');
		expect(envContent).not.toContain("[object Object]");
		expect(envContent).not.toContain("topsecret");
	});

	test('removeEnvVar("__proto__") drops the seeded line (matches Object.entries-only semantics)', async () => {
		seedEnvFile('export __proto__="topsecret"\n');

		await runOpsInSandbox([["__proto__"]]);

		const envContent = readFileSync(envFilePath, "utf8");
		expect(envContent).not.toContain("topsecret");
		expect(envContent).not.toContain("__proto__");
	});

	test("upsert into an empty or newline-only existing file never leaves a leading blank line", async () => {
		seedEnvFile("");
		await runOpsInSandbox([["FUSE_X", "1"]]);
		expect(readFileSync(envFilePath, "utf8")).toBe('export FUSE_X="1"\n');

		seedEnvFile("\n");
		await runOpsInSandbox([["FUSE_Y", "2"]]);
		expect(readFileSync(envFilePath, "utf8")).toBe('export FUSE_Y="2"\n');
	});
});
