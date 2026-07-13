/**
 * Tests for executeHook (shell-free: no bash, Windows-compatible).
 * Commands run a deterministic .mjs fixture via `bun <fixture> <mode>`.
 */
import { describe, expect, test } from "bun:test";
import type { ExecutableHook } from "../interfaces/hooks";
import { executeHook } from "../services/hook-executor";
import { FIXTURE_PATH, fixtureHook } from "./helpers/hook-fixture";

describe("executeHook", () => {
	test("captures stdout and success on exit 0", async () => {
		const result = await executeHook(fixtureHook("stdout"), "{}");
		expect(result.success).toBe(true);
		expect(result.stdout).toContain("hello-world");
		expect(result.exitCode).toBe(0);
		expect(result.blocked).toBe(false);
	});

	test("captures stderr and blocked status on exit 2", async () => {
		const result = await executeHook(fixtureHook("block"), "{}");
		expect(result.blocked).toBe(true);
		expect(result.exitCode).toBe(2);
		expect(result.stderr).toContain("blocked reason");
	});

	test("non-zero exit without `|| true` is failure but not blocked", async () => {
		const result = await executeHook(fixtureHook("fail"), "{}");
		expect(result.success).toBe(false);
		expect(result.exitCode).toBe(3);
		expect(result.blocked).toBe(false);
	});

	test("`|| true` forces success even when the process exits non-zero", async () => {
		const h: ExecutableHook = {
			command: `bun ${FIXTURE_PATH} fail || true`,
			isAsync: false,
			pluginName: "test",
		};
		const result = await executeHook(h, "{}");
		expect(result.success).toBe(true);
		expect(result.exitCode).toBe(0);
		expect(result.blocked).toBe(false);
		// stderr is still captured (printed before `|| true` swallows the exit code).
		expect(result.stderr).toContain("boom");
	});

	test("`|| true` also neutralises exit 2 (never blocked, matching bash)", async () => {
		const h: ExecutableHook = {
			command: `bun ${FIXTURE_PATH} block || true`,
			isAsync: false,
			pluginName: "test",
		};
		const result = await executeHook(h, "{}");
		expect(result.blocked).toBe(false);
		expect(result.exitCode).toBe(0);
	});

	test("transmits stdin to the process", async () => {
		const result = await executeHook(fixtureHook("stdin"), "PAYLOAD-123");
		expect(result.stdout).toContain("STDIN:PAYLOAD-123");
	});

	test("missing executable is a non-blocking failure (ENOENT)", async () => {
		const h: ExecutableHook = {
			command: "nonexistent-command-xyz",
			isAsync: false,
			pluginName: "test",
		};
		const result = await executeHook(h, "{}");
		expect(result.blocked).toBe(false);
		expect(result.success).toBe(false);
	});

	test("async hook returns success immediately", async () => {
		const result = await executeHook(fixtureHook("stdout", "", true), "{}");
		expect(result.success).toBe(true);
		expect(result.exitCode).toBe(0);
	});
});
