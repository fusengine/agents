/**
 * Tests for resolveHomeInHooks: install-time `$HOME` resolution in deployed
 * hooks.json. Proves (a) substitution by the resolved HOME and (b) idempotence.
 * Isolated under /tmp/fusengine-test-resolver so the repo SOURCE stays untouched
 * (mirrors the env-file-load.test.ts / env-manager.test.ts fixture convention).
 */
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { resolveHomeInHooks } from "../services/harness-path-resolver";

const HOME = process.env.HOME || process.env.USERPROFILE || "";
const TEST_DIR = "/tmp/fusengine-test-resolver";
const HOOKS_FILE = join(TEST_DIR, "sample-plugin", "hooks", "hooks.json");
const HOOK_CMD = "bun $HOME/.claude/plugins/marketplaces/fusengine-plugins/plugins/node_modules/@fusengine/harness/dist/cli/bin.mjs hook claude-code aipilot";

/** Seed a fresh temp pluginsDir holding one plugin with a `$HOME` hooks.json. */
beforeEach(() => {
	rmSync(TEST_DIR, { recursive: true, force: true });
	mkdirSync(join(TEST_DIR, "sample-plugin", "hooks"), { recursive: true });
	const cfg = { hooks: { PreToolUse: [{ hooks: [{ type: "command", command: HOOK_CMD }] }] } };
	writeFileSync(HOOKS_FILE, JSON.stringify(cfg, null, 2));
});

afterEach(() => rmSync(TEST_DIR, { recursive: true, force: true }));

describe("resolveHomeInHooks", () => {
	test("substitutes $HOME with the resolved absolute home path", async () => {
		const rewritten = await resolveHomeInHooks(TEST_DIR);

		expect(rewritten).toBe(1);
		const out = readFileSync(HOOKS_FILE, "utf8");
		expect(out).not.toContain("$HOME");
		expect(out).toContain(`bun ${HOME}/.claude/plugins/marketplaces`);
	});

	test("also resolves the `${HOME}` brace form", async () => {
		writeFileSync(HOOKS_FILE, JSON.stringify({ cmd: "x ${HOME}/y" }));

		await resolveHomeInHooks(TEST_DIR);

		const out = readFileSync(HOOKS_FILE, "utf8");
		expect(out).toContain(`x ${HOME}/y`);
		expect(out).not.toContain("${HOME}");
	});

	test("is idempotent: a second pass rewrites nothing", async () => {
		expect(await resolveHomeInHooks(TEST_DIR)).toBe(1);
		expect(await resolveHomeInHooks(TEST_DIR)).toBe(0);
		expect(readFileSync(HOOKS_FILE, "utf8")).not.toContain("$HOME");
	});
});
